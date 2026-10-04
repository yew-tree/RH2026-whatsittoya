import React, { useState } from 'react';
import { VERIFIED_BRAND_REGISTRY } from '../services/heuristicAnalyzer';

interface WebsiteLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLargeText: boolean;
}

export const WebsiteLookupModal: React.FC<WebsiteLookupModalProps> = ({
  isOpen,
  onClose,
  isLargeText,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [verificationVerdict, setVerificationVerdict] = useState<string | null>(null);

  if (!isOpen) return null;

  const brands = Object.values(VERIFIED_BRAND_REGISTRY).filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.officialDomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTestEmail = () => {
    if (!testEmail.trim()) return;
    let cleaned = testEmail.toLowerCase().trim();
    // Strip brackets or quotes
    cleaned = cleaned.replace(/[<>"']/g, '').trim();
    // If input is a URL like https://www.paypal.com/..., strip protocol and path
    cleaned = cleaned.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
    // Strip leading www.
    cleaned = cleaned.replace(/^www\./, '');
    // If email format, extract domain after @
    const atIdx = cleaned.indexOf('@');
    const domain = atIdx !== -1 ? cleaned.slice(atIdx + 1).trim() : cleaned;

    let matchedBrand = null;
    for (const b of Object.values(VERIFIED_BRAND_REGISTRY)) {
      if (
        b.allowedDomains.some((d) => domain === d || domain.endsWith('.' + d) || d.endsWith('.' + domain)) ||
        b.officialDomain === domain ||
        domain.endsWith('.' + b.officialDomain) ||
        b.verifiedContactEmails.some((e) => e.toLowerCase() === cleaned)
      ) {
        matchedBrand = b;
        break;
      }
    }

    if (matchedBrand) {
      setVerificationVerdict(
        `✅ MATCH CONFIRMED: "${cleaned}" matches the verified corporate domain (@${matchedBrand.officialDomain}) for ${matchedBrand.name}. Official website: ${matchedBrand.officialWebsite}`
      );
    } else {
      setVerificationVerdict(
        `⚠️ CAUTION: "${domain}" is NOT in the curated registry of major consumer services. Verify independently before replying or entering passwords.`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/60 backdrop-blur-xs">
      <div className="bg-[#F8F7F4] border-2 border-[#1A1A1A] rounded-[4px] w-full max-w-2xl max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1A1A1A]/10 bg-white">
          <div>
            <span className="font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-[#1A1A1A]/60 font-bold block mb-1">
              Reference Registry
            </span>
            <h3 className="font-serif-editorial text-2xl font-bold tracking-tight text-[#1A1A1A]">
              Corporate Website & Domain Directory
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
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Domain Verifier */}
          <div className="bg-white p-5 rounded-[2px] border border-[#1A1A1A]/10">
            <span className="font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-[#1A1A1A] font-bold block mb-2">
              Domain Verification Tool
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Type an address, like: service@paypal.com"
                className="flex-1 px-3 py-2 bg-[#FAFAFA] border border-[#1A1A1A]/10 rounded-[2px] text-xs font-mono-editorial text-[#1A1A1A] focus:outline-1 focus:outline-[#1A1A1A]"
              />
              <button
                onClick={handleTestEmail}
                className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-semibold uppercase tracking-[0.06em] rounded-[2px] cursor-pointer hover:bg-[#2A5B52]"
              >
                Verify
              </button>
            </div>
            {verificationVerdict && (
              <div
                className={`mt-3 p-3 rounded-[2px] text-xs font-mono-editorial leading-relaxed ${
                  verificationVerdict.startsWith('✅')
                    ? 'bg-[#F5FBF6] text-[#2E7D32] border border-[#2E7D32]/30'
                    : 'bg-[#FFF9F9] text-[#C62828] border border-[#C62828]/30'
                }`}
              >
                {verificationVerdict}
              </div>
            )}
          </div>

          {/* Search bar */}
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search companies: PayPal, Apple, Google, Microsoft, Chase..."
              className="w-full px-3 py-2.5 bg-white border border-[#1A1A1A]/10 rounded-[2px] text-xs sm:text-sm text-[#1A1A1A] focus:outline-1 focus:outline-[#1A1A1A] mb-4"
            />

            <div className="space-y-3">
              {brands.map((brand, idx) => (
                <div key={idx} className="bg-white border border-[#1A1A1A]/10 p-4 rounded-[2px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-[#1A1A1A]">{brand.name}</span>
                    <a
                      href={brand.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono-editorial text-xs text-[#2A5B52] underline font-bold"
                    >
                      {brand.officialWebsite} ↗
                    </a>
                  </div>
                  <div className="font-mono-editorial text-xs text-[#1A1A1A]/60 mt-1">
                    AUTHORIZED DOMAINS: {brand.allowedDomains.map((d) => `@${d}`).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1A1A1A]/10 bg-white text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold uppercase tracking-[0.06em] rounded-[2px] cursor-pointer hover:bg-[#2A5B52]"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
