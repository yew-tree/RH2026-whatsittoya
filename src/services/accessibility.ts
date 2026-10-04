export interface AccessibilitySettings {
  textSize: 'standard' | 'large' | 'xl';
  highContrast: boolean;
  roomySpacing: boolean;
  reducedMotion: boolean;
}

export const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  textSize: 'standard', // "standard" is already larger than the browser default (18px root)
  highContrast: false,
  roomySpacing: false,
  reducedMotion: false,
};

const STORAGE_KEY = 'whatsittoya.accessibility.v1';

export function loadAccessibility(): AccessibilitySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_ACCESSIBILITY, ...JSON.parse(raw) };
  } catch {
    // storage unavailable (private mode, etc.). Use defaults.
  }
  return DEFAULT_ACCESSIBILITY;
}

export function saveAccessibility(settings: AccessibilitySettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

/** Applies settings as data attributes on <html>; index.css reacts to them. */
export function applyAccessibility(settings: AccessibilitySettings): void {
  const root = document.documentElement;
  root.dataset.text = settings.textSize;
  root.dataset.contrast = settings.highContrast ? 'high' : 'normal';
  root.dataset.spacing = settings.roomySpacing ? 'roomy' : 'normal';
  root.dataset.motion = settings.reducedMotion ? 'reduced' : 'normal';
}
