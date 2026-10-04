import { useCallback, useRef, useState } from 'react';
import { OverallAnalysisResult } from '../types/analyzer';
import { parseRawEmailHeadersAndBody, runFullHeuristicAnalysis } from '../services/heuristicAnalyzer';
import { assessMessage, ShieldAssessment, ShieldInput } from '../services/shieldSignals';

const AI_TIMEOUT_MS = 12000;
const MAX_CHARS = 20000;
const MIN_CHARS = 8;

export interface CheckResult {
  input: ShieldInput;
  analysis: OverallAnalysisResult;
  assessment: ShieldAssessment;
  /** Which engine produced the analysis, and why, in plain words. */
  engine: 'ai' | 'local';
  engineNote: string;
}

/** Ask the server (which may use Gemini). Falls back to the in-browser checks on any problem. */
async function analyze(input: ShieldInput): Promise<{ analysis: OverallAnalysisResult; engine: 'ai' | 'local'; note: string }> {
  const local = () => runFullHeuristicAnalysis(input.sender, input.replyTo || undefined, input.subject, input.body);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  try {
    const response = await fetch('/api/analyze-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Server returned ${response.status}`);
    const data = (await response.json()) as OverallAnalysisResult;
    if (!data || typeof data.riskScore !== 'number' || !data.information || !data.sender || !data.tone) {
      throw new Error('Unexpected response');
    }
    if (data.source === 'ai_and_heuristic') {
      return { analysis: data, engine: 'ai', note: 'Checked with built-in checks and the AI helper.' };
    }
    return { analysis: data, engine: 'local', note: 'Checked with built-in checks (the AI helper is not turned on).' };
  } catch (err: any) {
    const slow = err?.name === 'AbortError';
    return {
      analysis: local(),
      engine: 'local',
      note: slow
        ? 'The AI helper was taking too long, so we used the built-in checks instead.'
        : 'The AI helper could not be reached, so we used the built-in checks that work without internet.',
    };
  } finally {
    clearTimeout(timer);
  }
}

export function useMessageChecker() {
  const [text, setTextState] = useState('');
  const [sender, setSender] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const runId = useRef(0);

  const setText = useCallback((value: string) => {
    setTextState(value);
    setError(null);
  }, []);

  const run = useCallback(
    async (override?: { text: string; sender?: string; replyTo?: string }) => {
      const raw = (override?.text ?? text).slice(0, MAX_CHARS);
      const senderField = override ? override.sender ?? '' : sender;
      const replyToField = override ? override.replyTo ?? '' : replyTo;
      if (raw.trim().length < MIN_CHARS) {
        setError('Please paste the message you want us to look at. A few words is enough to start.');
        return;
      }
      const id = ++runId.current;
      setError(null);
      setLoading(true);
      setResult(null);
      try {
        const parsed = parseRawEmailHeadersAndBody(raw);
        const input: ShieldInput = {
          sender: senderField.trim() || parsed.sender || '',
          replyTo: replyToField.trim() || parsed.replyTo || '',
          subject: parsed.subject === 'No Subject' ? '' : parsed.subject || '',
          body: parsed.body || raw,
        };
        const { analysis, engine, note } = await analyze(input);
        if (id !== runId.current) return; // a newer run replaced this one
        const assessment = assessMessage(input, analysis);
        setResult({ input, analysis, assessment, engine, engineNote: note });
      } catch (e) {
        if (id !== runId.current) return;
        console.error('Check failed', e);
        setError('Something went wrong while checking that message. Nothing was sent anywhere. Please try again.');
      } finally {
        if (id === runId.current) setLoading(false);
      }
    },
    [text, sender, replyTo]
  );

  const loadExample = useCallback(
    (raw: string) => {
      setTextState(raw);
      setSender('');
      setReplyTo('');
      void run({ text: raw });
    },
    [run]
  );

  const clear = useCallback(() => {
    runId.current++;
    setTextState('');
    setSender('');
    setReplyTo('');
    setError(null);
    setResult(null);
    setLoading(false);
  }, []);

  return { text, setText, sender, setSender, replyTo, setReplyTo, loading, error, result, run, loadExample, clear };
}

export type MessageChecker = ReturnType<typeof useMessageChecker>;
