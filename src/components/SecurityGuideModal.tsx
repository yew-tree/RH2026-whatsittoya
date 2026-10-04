import React from 'react';

interface SecurityGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLargeText: boolean;
}

export const SecurityGuideModal: React.FC<SecurityGuideModalProps> = ({
  isOpen,
  onClose,
  isLargeText,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/60 backdrop-blur-xs">
      <div className="bg-[#F8F7F4] border-2 border-[#1A1A1A] rounded-[4px] w-full max-w-2xl max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1A1A1A]/10 bg-white">
          <div>
            <span className="font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-[#1A1A1A]/60 font-bold block mb-1">
              Field Manual
            </span>
            <h3 className="font-serif-editorial text-2xl font-bold tracking-tight text-[#1A1A1A]">
              How Email Tricks Work & How to Stay Safe
            </h3>
          </div>
          <button
            onClick={onClose}
            className="font-mono-editorial text-xs uppercase px-2.5 py-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] cursor-pointer"
          >
            [Close]
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#1A1A1A]/80 leading-relaxed text-sm">
          {/* Section 1: The Rush */}
          <div className="bg-white border-l-4 border-l-[#C62828] border border-[#1A1A1A]/10 p-5 rounded-[2px] space-y-2">
            <span className="font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-[#C62828] font-bold block">
              Rule 01 • The Fake Emergency
            </span>
            <h4 className="font-serif-editorial text-xl font-bold text-[#1A1A1A]">
              Why scammers create short timers
            </h4>
            <p>
              Scammers know that if you have time to pause, sit down, and ask a friend or family member, you will spot the deception right away. That is why they introduce artificial 12-hour ultimatums. Remember: <strong>Real organizations never issue sudden closures over email.</strong>
            </p>
          </div>

          {/* Section 2: The Links */}
          <div className="bg-white border-l-4 border-l-[#EF6C00] border border-[#1A1A1A]/10 p-5 rounded-[2px] space-y-2">
            <span className="font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-[#EF6C00] font-bold block">
              Rule 02 • Deceptive Buttons
            </span>
            <h4 className="font-serif-editorial text-xl font-bold text-[#1A1A1A]">
              The anchor text trick
            </h4>
            <p>
              A button can visually read "www.paypal.com", but the actual link target directs to an unverified third-party server. Always avoid logging in via email links; type the domain directly in your browser.
            </p>
          </div>

          {/* Section 3: The Sender */}
          <div className="bg-white border-l-4 border-l-[#2A5B52] border border-[#1A1A1A]/10 p-5 rounded-[2px] space-y-2">
            <span className="font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-[#2A5B52] font-bold block">
              Rule 03 • Address Mismatch
            </span>
            <h4 className="font-serif-editorial text-xl font-bold text-[#1A1A1A]">
              Free webmail impersonation
            </h4>
            <p>
              Anyone can enter "Apple Support" as their display name. Look at the actual email domain: genuine corporate mail will originate exclusively from official servers (e.g. <code>@apple.com</code>), never from free services like <code>@gmail.com</code>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1A1A1A]/10 bg-white text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold uppercase tracking-[0.06em] rounded-[2px] cursor-pointer hover:bg-[#2A5B52]"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
