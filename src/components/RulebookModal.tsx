import React from 'react';

interface RulebookModalProps {
  onClose: () => void;
  language: 'EN' | '中文';
}

export const RulebookModal: React.FC<RulebookModalProps> = ({ onClose, language }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-4 bg-[#002244] text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#b8f649] text-[#131f00] rounded">
              SGX Index Governance
            </span>
            <h3 className="text-[16px] font-bold text-white mt-1">
              {language === 'EN' ? 'iEdge Index Ground Rules 2026' : 'iEdge 指数编制基本准则 2026'}
            </h3>
            <span className="text-[11px] font-mono-numbers text-[#708ab2]">
              Official Calculation & Float Adjustment Standard
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Rulebook Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 text-[#43474e] text-[13px] leading-relaxed">
          <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#e2e8f0]">
            <h4 className="text-[12px] font-bold uppercase text-[#002244] mb-1">
              1. Index Objective & Dissemination
            </h4>
            <p>
              The iEdge Index Suite provides transparent, rules-based benchmarks representing core Singapore asset classes, S-REITs, thematic megatrends (Robotics & AI, Green Energy), and fixed income. Price indices are disseminated in real-time every 15 seconds.
            </p>
          </div>

          <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#e2e8f0]">
            <h4 className="text-[12px] font-bold uppercase text-[#002244] mb-1">
              2. Free Float Market Capitalisation Formula
            </h4>
            <div className="bg-white p-2.5 rounded-lg border border-[#e2e8f0] font-mono-numbers text-[12px] text-[#002244] my-1">
              Index Level = (Current Aggregate Adjusted Market Cap / Divisor)
            </div>
            <p className="text-[12px]">
              Adjusted Market Cap = Σ (Share Price × Total Shares × Free Float Factor × Capping Factor).
            </p>
          </div>

          <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#e2e8f0]">
            <h4 className="text-[12px] font-bold uppercase text-[#002244] mb-1">
              3. Minimum Liquidity & Turnover Velocity
            </h4>
            <p className="text-[12px]">
              Constituents must exhibit a median daily trading volume turnover of at least 0.05% of free-float adjusted shares across 8 out of the past 12 review months to remain eligible.
            </p>
          </div>

          <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#e2e8f0]">
            <h4 className="text-[12px] font-bold uppercase text-[#002244] mb-1">
              4. Corporate Actions & Dividends
            </h4>
            <p className="text-[12px]">
              Ordinary cash dividends do not trigger divisor adjustments in Price Return indices. Total Return (Gross and Net) indices reinvest ordinary cash dividends at ex-date.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#eff4ff] border-t border-[#e2e8f0] flex items-center justify-between">
          <span className="text-[11px] font-mono-numbers text-[#74777f]">Ref: SGX-IEDGE-RULES-REV26</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#002244] text-white text-[11px] font-bold uppercase tracking-wider active:scale-95"
          >
            {language === 'EN' ? 'Acknowledge & Close' : '确认并关闭'}
          </button>
        </div>
      </div>
    </div>
  );
};
