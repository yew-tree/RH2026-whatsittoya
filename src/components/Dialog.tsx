import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface DialogProps {
  labelledBy: string;
  describedBy?: string;
  onClose: () => void;
  tone?: 'danger' | 'warn' | 'plain';
  children: React.ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal: moves focus inside, keeps Tab within the dialog, closes on Escape,
 * and returns focus to whatever opened it.
 */
export const Dialog: React.FC<DialogProps> = ({ labelledBy, describedBy, onClose, tone = 'plain', children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const node = ref.current;
    const auto = node?.querySelector<HTMLElement>('[data-autofocus]');
    (auto || node?.querySelector<HTMLElement>(FOCUSABLE))?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !node) return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      previous?.focus?.();
    };
  }, []);

  const border = tone === 'danger' ? 'border-danger' : tone === 'warn' ? 'border-warn' : 'border-brand';

  // Rendered in a portal so no transformed ancestor can break position: fixed.
  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          className={`wity-fade-in w-full max-w-2xl rounded-3xl border-4 bg-card p-6 shadow-2xl sm:p-8 ${border}`}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
