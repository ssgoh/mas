import React from 'react';
import { SGXIndex } from '../types';

interface ConstituentsModalProps {
  index: SGXIndex | null;
  onClose: () => void;
  language: 'EN' | '中文';
}

export const ConstituentsModal: React.FC<ConstituentsModalProps> = ({
  index,
  onClose,
  language,
}) => {
  if (!index) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-4 bg-[#002244] text-white flex items-center justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#b8f649] text-[#131f00] rounded">
                {index.ticker}
              </span>
              <span className="text-[11px] font-mono-numbers text-[#708ab2]">
                {index.constituentsCount} {language === 'EN' ? 'Constituents' : '只成分股'}
              </span>
            </div>
            <h3 className="text-[16px] font-bold text-white mt-1 leading-tight">{index.name}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Index Summary Bar */}
        <div className="px-4 py-2.5 bg-[#eff4ff] flex items-center justify-between border-b border-[#e2e8f0]">
          <div>
            <span className="text-[10px] font-bold text-[#74777f] uppercase block">
              {language === 'EN' ? 'Index Level' : '点位水平'}
            </span>
            <span className="text-[15px] font-mono-numbers font-bold text-[#0b1c30]">
              {index.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-[#74777f] uppercase block">
              {language === 'EN' ? 'Weighting Scheme' : '加权方式'}
            </span>
            <span className="text-[12px] font-semibold text-[#002244]">
              {language === 'EN' ? 'Free Float Market Cap (Max 15%)' : '自由流通市值加权 (上限15%)'}
            </span>
          </div>
        </div>

        {/* Constituents List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-[#f1f5f9]">
          <div className="py-1 flex items-center text-[10px] font-bold text-[#74777f] uppercase tracking-wider">
            <span className="w-6/12">{language === 'EN' ? 'Company / Sector' : '成分股 / 行业'}</span>
            <span className="w-3/12 text-right">{language === 'EN' ? 'Weight' : '权重'}</span>
            <span className="w-3/12 text-right">{language === 'EN' ? 'Price / Chg' : '最新价 / 涨跌'}</span>
          </div>

          {index.constituents && index.constituents.length > 0 ? (
            index.constituents.map((item) => (
              <div key={item.ticker} className="py-2.5 flex items-center justify-between">
                <div className="w-6/12 pr-2">
                  <div className="text-[13px] font-bold text-[#0b1c30] truncate">{item.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-mono-numbers text-[#74777f]">
                    <span className="font-semibold text-[#002244]">{item.ticker}</span>
                    <span className="w-1 h-1 rounded-full bg-[#74777f]"></span>
                    <span>{item.sector}</span>
                  </div>
                </div>

                <div className="w-3/12 text-right">
                  <span className="text-[13px] font-mono-numbers font-bold text-[#002244] block">
                    {item.weight.toFixed(1)}%
                  </span>
                  <div className="w-full bg-[#e5eeff] h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-[#002244] h-full rounded-full"
                      style={{ width: `${Math.min(100, item.weight * 4)}%` }}
                    />
                  </div>
                </div>

                <div className="w-3/12 text-right">
                  <span className="text-[13px] font-mono-numbers font-bold text-[#0b1c30] block">
                    ${item.price.toFixed(2)}
                  </span>
                  <span
                    className={`text-[11px] font-mono-numbers font-semibold ${
                      item.changePct >= 0 ? 'text-[#476800]' : 'text-[#ba1a1a]'
                    }`}
                  >
                    {item.changePct >= 0 ? '+' : ''}{item.changePct.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-[#74777f] text-[13px]">
              {language === 'EN' ? 'Top blue-chips list available in official factsheet.' : '成分股明细可在事实清单中查阅。'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#eff4ff] border-t border-[#e2e8f0] flex items-center justify-between">
          <span className="text-[11px] font-mono-numbers text-[#74777f]">
            {language === 'EN' ? 'Rebalanced Semi-Annually (Mar & Sep)' : '每年3月及9月进行定期再平衡'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#002244] text-white text-[11px] font-bold uppercase tracking-wider active:scale-95"
          >
            {language === 'EN' ? 'Done' : '完成'}
          </button>
        </div>
      </div>
    </div>
  );
};
