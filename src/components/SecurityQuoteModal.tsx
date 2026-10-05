import React, { useState } from 'react';
import { SecurityStock } from '../types';

interface SecurityQuoteModalProps {
  stock: SecurityStock | null;
  onClose: () => void;
  language: 'EN' | '中文';
}

export const SecurityQuoteModal: React.FC<SecurityQuoteModalProps> = ({
  stock,
  onClose,
  language,
}) => {
  const [alertSet, setAlertSet] = useState(false);

  if (!stock) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-4 bg-[#002244] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#b8f649] text-[#131f00] rounded">
                {stock.code}
              </span>
              <span className="text-[11px] font-mono-numbers text-[#708ab2]">{stock.ticker}</span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 bg-white/10 text-white rounded">
                {stock.type}
              </span>
            </div>
            <h3 className="text-[16px] font-bold text-white mt-1 leading-tight">{stock.name}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Price & Change Banner */}
        <div className="px-4 py-3 bg-[#eff4ff] flex items-baseline justify-between border-b border-[#e2e8f0]">
          <div>
            <span className="text-[26px] font-bold font-mono-numbers text-[#0b1c30]">
              SGD {stock.lastPrice.toFixed(stock.lastPrice < 1 ? 3 : 2)}
            </span>
            <span className="text-[11px] text-[#74777f] font-mono-numbers block mt-0.5">
              Turnover: SGD {stock.turnoverSGD} • Vol: {stock.volume}
            </span>
          </div>

          <div
            className={`px-2.5 py-1.5 rounded-lg font-mono-numbers text-[12px] font-bold ${
              stock.changePct >= 0 ? 'bg-[#b8f649] text-[#131f00]' : 'bg-[#ffdad6] text-[#ba1a1a]'
            }`}
          >
            {stock.changePct >= 0 ? '+' : ''}{stock.change.toFixed(stock.lastPrice < 1 ? 3 : 2)} (
            {stock.changePct >= 0 ? '+' : ''}{stock.changePct.toFixed(2)}%)
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {/* Order Book Depth (Level 2) */}
          <div className="bg-[#f8f9ff] rounded-xl p-3 border border-[#e2e8f0]">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#74777f] mb-1.5">
              <span>{language === 'EN' ? 'Best Bid' : '最优买价'}</span>
              <span>{language === 'EN' ? 'Order Book (Level 1)' : '盘口买卖档'}</span>
              <span>{language === 'EN' ? 'Best Ask' : '最优卖价'}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white p-2 rounded-lg border border-[#e2e8f0]">
                <span className="text-[10px] text-[#74777f] block font-mono-numbers">
                  Vol: {stock.bidSize.toLocaleString()}
                </span>
                <span className="text-[15px] font-bold font-mono-numbers text-[#476800]">
                  SGD {stock.bidPrice.toFixed(stock.lastPrice < 1 ? 3 : 2)}
                </span>
                <span className="text-[10px] uppercase font-bold text-[#476800] block mt-0.5">BID</span>
              </div>

              <div className="bg-white p-2 rounded-lg border border-[#e2e8f0]">
                <span className="text-[10px] text-[#74777f] block font-mono-numbers">
                  Vol: {stock.askSize.toLocaleString()}
                </span>
                <span className="text-[15px] font-bold font-mono-numbers text-[#ba1a1a]">
                  SGD {stock.askPrice.toFixed(stock.lastPrice < 1 ? 3 : 2)}
                </span>
                <span className="text-[10px] uppercase font-bold text-[#ba1a1a] block mt-0.5">ASK</span>
              </div>
            </div>
          </div>

          {/* Key Fundamentals Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#eff4ff] p-2.5 rounded-xl">
              <span className="text-[10px] font-bold text-[#74777f] uppercase block">
                {language === 'EN' ? 'Day Range' : '当日振幅'}
              </span>
              <span className="text-[12px] font-mono-numbers font-semibold text-[#0b1c30]">
                {stock.dayLow.toFixed(2)} - {stock.dayHigh.toFixed(2)}
              </span>
            </div>

            <div className="bg-[#eff4ff] p-2.5 rounded-xl">
              <span className="text-[10px] font-bold text-[#74777f] uppercase block">
                {language === 'EN' ? 'Market Capitalisation' : '总市值'}
              </span>
              <span className="text-[12px] font-mono-numbers font-semibold text-[#002244]">
                SGD {stock.marketCapSGD}
              </span>
            </div>

            <div className="bg-[#eff4ff] p-2.5 rounded-xl">
              <span className="text-[10px] font-bold text-[#74777f] uppercase block">
                {language === 'EN' ? 'P/E Ratio' : '市盈率 (P/E)'}
              </span>
              <span className="text-[12px] font-mono-numbers font-semibold text-[#0b1c30]">
                {stock.peRatio ? `${stock.peRatio}x` : 'N/A'}
              </span>
            </div>

            <div className="bg-[#eff4ff] p-2.5 rounded-xl">
              <span className="text-[10px] font-bold text-[#74777f] uppercase block">
                {language === 'EN' ? 'Dividend Yield' : '股息收益率'}
              </span>
              <span className="text-[12px] font-mono-numbers font-semibold text-[#476800]">
                {stock.divYield ? `${stock.divYield}%` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Intraday Sparkline visual */}
          <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#e2e8f0]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#74777f] block mb-1">
              {language === 'EN' ? 'Intraday Movement Pattern' : '今日分时走势'}
            </span>
            <div className="flex items-center gap-1 h-10">
              {stock.sparkline.map((val, idx) => {
                const min = Math.min(...stock.sparkline);
                const max = Math.max(...stock.sparkline);
                const pct = ((val - min) / (max - min || 1)) * 100;
                return (
                  <div key={idx} className="flex-1 bg-[#e5eeff] h-full rounded flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded ${stock.changePct >= 0 ? 'bg-[#476800]' : 'bg-[#ba1a1a]'}`}
                      style={{ height: `${Math.max(15, pct)}%` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="p-3 bg-[#eff4ff] border-t border-[#e2e8f0] flex items-center justify-between">
          <button
            onClick={() => setAlertSet(!alertSet)}
            className={`px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              alertSet ? 'bg-[#b8f649] text-[#131f00]' : 'bg-white border border-[#e2e8f0] text-[#002244]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {alertSet ? 'notifications_active' : 'notifications'}
            </span>
            <span>{alertSet ? (language === 'EN' ? 'Alert Active' : '已设预警') : (language === 'EN' ? 'Set Price Alert' : '价格预警')}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#002244] text-white text-[11px] font-bold uppercase tracking-wider active:scale-95"
          >
            {language === 'EN' ? 'Close Quote' : '关闭行情'}
          </button>
        </div>
      </div>
    </div>
  );
};
