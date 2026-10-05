import React, { useState } from 'react';

interface FactsheetModalProps {
  onClose: () => void;
  language: 'EN' | '中文';
}

export const FactsheetModal: React.FC<FactsheetModalProps> = ({ onClose, language }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-4 bg-[#002244] text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#b8f649] text-[#131f00] rounded">
              {language === 'EN' ? 'SGX & FTSE Russell' : '新交所与富时罗素'}
            </span>
            <h3 className="text-[16px] font-bold text-white mt-1">
              {language === 'EN' ? 'STI Quarterly Review Updates' : '海峡时报指数季度审核结果公告'}
            </h3>
            <span className="text-[11px] font-mono-numbers text-[#708ab2]">
              Effective Date: November 2026 Rebalance
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

        {/* Factsheet Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 text-[#43474e] text-[13px] leading-relaxed">
          <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#e2e8f0]">
            <h4 className="text-[12px] font-bold uppercase text-[#002244] mb-1">
              {language === 'EN' ? 'Executive Summary' : '审核执行纪要'}
            </h4>
            <p>
              {language === 'EN'
                ? 'FTSE Russell, Singapore Exchange (SGX Group), and SPH Media have announced no changes to the Straits Times Index (STI) constituents following the latest quarterly review. All 30 blue-chips have met liquidity and float requirements.'
                : '富时罗素、新加坡交易所（SGX集团）及新加坡报业控股完成海峡时报指数（STI）最新季度审核，成分股维持不变。全部30只蓝筹股均符合严格的自由流通量及流动性准则。'}
            </p>
          </div>

          <div>
            <h4 className="text-[13px] font-bold text-[#0b1c30] mb-1">
              {language === 'EN' ? 'STI Reserve List (Top 5 Non-Constituents)' : '海峡时报指数备选储备名单 (前5名)'}
            </h4>
            <div className="bg-[#f8f9ff] rounded-xl border border-[#e2e8f0] divide-y divide-[#f1f5f9]">
              {[
                { rank: '1', name: 'Seatrium Ltd', ticker: 'S51', sector: 'Industrials' },
                { rank: '2', name: 'Keppel DC REIT', ticker: 'AJBU', sector: 'Real Estate' },
                { rank: '3', name: 'Suntec Real Estate Investment Trust', ticker: 'T82U', sector: 'Real Estate' },
                { rank: '4', name: 'OUE Real Estate Investment Trust', ticker: 'O5RU', sector: 'Real Estate' },
                { rank: '5', name: 'Frasers Centrepoint Trust', ticker: 'J69U', sector: 'Real Estate' },
              ].map((res) => (
                <div key={res.rank} className="p-2.5 flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#e5eeff] text-[#002244] font-bold text-[10px] flex items-center justify-center font-mono-numbers">
                      {res.rank}
                    </span>
                    <span className="font-semibold text-[#0b1c30]">{res.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono-numbers text-[#74777f]">
                    <span>{res.ticker}</span>
                    <span>•</span>
                    <span>{res.sector}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#e2e8f0]">
            <h4 className="text-[12px] font-bold uppercase text-[#002244] mb-1">
              {language === 'EN' ? 'Capping & Float Capping Rules' : '权重上限机制'}
            </h4>
            <p className="text-[12px]">
              {language === 'EN'
                ? 'No individual stock weight may exceed 15% at quarterly review date to ensure broad representation across banking, telecommunications, and real estate.'
                : '单只成分股市值权重上限设为15%，以防止权重过度集中，确保大盘代表性。'}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-[#eff4ff] border-t border-[#e2e8f0] flex items-center justify-between">
          {downloaded ? (
            <span className="text-[11px] font-bold text-[#476800] flex items-center gap-1 font-mono-numbers">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              {language === 'EN' ? 'Factsheet PDF Saved' : '已下载审核报告'}
            </span>
          ) : (
            <span className="text-[11px] font-mono-numbers text-[#74777f]">Document ID: SGX-STI-2026Q3</span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-[#b8f649] text-[#131f00] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-transform"
            >
              <span>{language === 'EN' ? 'Download PDF' : '下载 PDF'}</span>
              <span className="material-symbols-outlined text-[15px]">download</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#002244] text-white text-[11px] font-bold uppercase tracking-wider active:scale-95"
            >
              {language === 'EN' ? 'Close' : '关闭'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
