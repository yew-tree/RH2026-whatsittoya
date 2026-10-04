import React, { useEffect, useRef, useState } from 'react';
import { Accessibility as AccessibilityIcon } from 'lucide-react';
import { AccessibilitySettings, DEFAULT_ACCESSIBILITY } from '../services/accessibility';

interface AccessibilityMenuProps {
  settings: AccessibilitySettings;
  onChange: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
}

const TEXT_SIZES: Array<{ id: AccessibilitySettings['textSize']; label: string }> = [
  { id: 'standard', label: 'Standard' },
  { id: 'large', label: 'Large' },
  { id: 'xl', label: 'Extra large' },
];

/** A single, always-findable button in the header that opens a small settings panel. */
export const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({ settings, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const set = (patch: Partial<AccessibilitySettings>) => onChange((prev) => ({ ...prev, ...patch }));
  const changed = JSON.stringify(settings) !== JSON.stringify(DEFAULT_ACCESSIBILITY);

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        className="btn btn-secondary w-full sm:w-auto"
        aria-expanded={open}
        aria-controls="accessibility-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <AccessibilityIcon size={20} aria-hidden="true" />
        <span>Accessibility</span>
        {changed && <span className="sr-only"> (custom settings on)</span>}
      </button>

      {open && (
        <div
          id="accessibility-panel"
          role="group"
          aria-label="Display and accessibility settings"
          className="surface wity-fade-in absolute left-0 top-full z-40 mt-2 w-[min(23rem,calc(100vw-2rem))] sm:left-auto sm:right-0 p-5 shadow-lg"
        >
          <h2 className="t-section mb-4">Display settings</h2>

          <fieldset className="mb-5">
            <legend className="t-label">Text size</legend>
            <div className="grid grid-cols-3 gap-2">
              {TEXT_SIZES.map((s) => (
                <label key={s.id} className="block">
                  <input
                    type="radio"
                    name="text-size"
                    checked={settings.textSize === s.id}
                    onChange={() => set({ textSize: s.id })}
                    className="peer sr-only"
                  />
                  <span className="btn btn-secondary w-full cursor-pointer px-2 text-center text-[0.95rem] peer-checked:border-brand peer-checked:bg-brand peer-checked:text-on-brand peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus">
                    {s.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-4">
            {(
              [
                ['highContrast', 'High contrast', 'Black text on white with stronger borders.'],
                ['roomySpacing', 'Increased spacing', 'More space between letters and lines.'],
                ['reducedMotion', 'Reduce motion', 'Turns off animations and fades.'],
              ] as const
            ).map(([key, label, hint]) => (
              <label key={key} className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={(e) => set({ [key]: e.target.checked } as Partial<AccessibilitySettings>)}
                  className="mt-1 h-5 w-5 flex-shrink-0 accent-[var(--color-brand)]"
                />
                <span>
                  <span className="block font-semibold leading-snug">{label}</span>
                  <span className="t-small block">{hint}</span>
                </span>
              </label>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-line pt-4" style={{ borderTopWidth: 'var(--bw)' }}>
            <button type="button" className="btn-link" onClick={() => onChange(DEFAULT_ACCESSIBILITY)} disabled={!changed}>
              Reset to defaults
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setOpen(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
