import React from 'react';
import { OverallAnalysisResult } from '../types/analyzer';
import { HeartHandshake, CheckCircle2, Globe, ExternalLink, ShieldCheck, PhoneCall, Trash2 } from 'lucide-react';

interface ActionGuidanceCardProps {
  result: OverallAnalysisResult;
  isLargeText: boolean;
}

export const ActionGuidanceCard: React.FC<ActionGuidanceCardProps> = ({ result, isLargeText }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm mb-8 space-y-6 transition-all">
      {/* Friendly Header */}
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400 flex items-center justify-center">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <div>
          <h3 className={`${isLargeText ? 'text-lg' : 'text-base'} font-bold text-slate-900 dark:text-white flex items-center gap-2`}>
            <span>What Should I Do Right Now? (Simple 1-2-3 Guide)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Calm, easy steps to keep yourself and your family completely safe
          </p>
        </div>
      </div>

      {/* Recommended Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {result.recommendedActions.map((action, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 flex items-start space-x-3.5"
          >
            <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 flex-shrink-0 mt-0.5 font-bold text-xs">
              Step {idx + 1}
            </div>
            <div>
              <h4 className={`${isLargeText ? 'text-sm font-extrabold' : 'text-xs font-bold'} text-slate-900 dark:text-slate-100`}>
                {action.action}
              </h4>
              <p className={`${isLargeText ? 'text-xs' : 'text-[11px]'} text-slate-600 dark:text-slate-400 mt-1 leading-relaxed`}>
                {action.reason}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Safe Official Verification Box */}
      {result.safeOfficialChannels && (
        <div className="bg-gradient-to-r from-teal-50 via-slate-50 to-indigo-50 dark:from-teal-950/30 dark:via-slate-950 dark:to-indigo-950/30 border border-teal-200 dark:border-teal-900 rounded-2xl p-5 space-y-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h4 className={`${isLargeText ? 'text-base font-extrabold' : 'text-sm font-bold'} text-slate-900 dark:text-slate-100`}>
              How to safely check with {result.safeOfficialChannels.brand} (Without using email links):
            </h4>
          </div>

          <p className={`${isLargeText ? 'text-sm' : 'text-xs'} text-slate-700 dark:text-slate-300 leading-relaxed font-sans`}>
            {result.safeOfficialChannels.safetyNote}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500 font-semibold">Real Website:</span>
              <a
                href={result.safeOfficialChannels.authenticUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 dark:text-teal-300 font-bold underline flex items-center gap-1"
              >
                <span>{result.safeOfficialChannels.authenticUrl}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500 font-semibold">Real Support Contact:</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold">
                {result.safeOfficialChannels.authenticContact}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
