import React, { useState } from 'react';
import { MARKET_BREADTH, SGX_SECURITIES } from '../data/sgxData';
import { SecurityStock } from '../types';

interface MarketDataViewProps {
  language: 'EN' | '中文';
  onSelectSecurity: (sec: SecurityStock) => void;
}

export const MarketDataView: React.FC<MarketDataViewProps> = ({
  language,
  onSelectSecurity,
}) => {
  const [activeTab, setActiveTab] = useState<'actives' | 'gainers' | 'losers'>('actives');

  const totalBreadth = MARKET_BREADTH.advancers + MARKET_BREADTH.unchanged + MARKET_BREADTH.decliners;
  const advPct = ((MARKET_BREADTH.advancers / totalBreadth) * 100).toFixed(1);
  const unchPct = ((MARKET_BREADTH.unchanged / totalBreadth) * 100).toFixed(1);
  const decPct = ((MARKET_BREADTH.decliners / totalBreadth) * 100).toFixed(1);

  const topActives = [...SGX_SECURITIES].sort((a, b) => parseFloat(b.turnoverSGD) - parseFloat(a.turnoverSGD));
  const topGainers = [...SGX_SECURITIES].sort((a, b) => b.changePct - a.changePct);
  const topLosers = [...SGX_SECURITIES].sort((a, b) => a.changePct - b.changePct);

  const currentList = activeTab === 'actives' ? topActives : activeTab === 'gainers' ? topGainers : topLosers;

  const sectors = [
    { name: language === 'EN' ? 'Financial Services' : '金融服务', change: 0.86, turnover: '485M', positive: true },
    { name: language === 'EN' ? 'Industrials' : '工业科技', change: 1.42, turnover: '320M', positive: true },
    { name: language === 'EN' ? 'Real Estate / REITs' : '房地产与REITs', change: -0.24, turnover: '290M', positive: false },
    { name: language === 'EN' ? 'Telecommunications' : '通信电信', change: 0.93, turnover: '115M', positive: true },
    { name: language === 'EN' ? 'Technology' : '半导体科技', change: 2.15, turnover: '142M', positive: true },
    { name: language === 'EN' ? 'Consumer Staples' : '必需消费品', change: -0.45, turnover: '68M', positive: false },
  ];

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Sub-header & Real-time Status */}
      <section className="bg-[#eff4ff] px-4 py-2 flex flex-col gap-1 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-1.5 text-[#43474e] text-[10px] font-bold uppercase tracking-wider">
          <span>{language === 'EN' ? 'Home' : '首页'}</span>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-[#002244] font-bold">{language === 'EN' ? 'Market Overview' : '大盘综述'}</span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#b8f649] text-[#131f00]">
            <span className="w-2 h-2 rounded-full bg-[#476800] animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-wider font-bold">
              {language === 'EN' ? 'SGX MAINBOARD: OPEN' : '新加坡主板：开盘中'}
            </span>
          </div>
          <span className="text-[11px] font-mono-numbers text-[#43474e] font-medium">
            {MARKET_BREADTH.lastUpdate}
          </span>
        </div>
      </section>

      {/* Market Breadth & Turnover Card */}
      <div className="px-4 py-3 flex flex-col gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0]">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#0b1c30]">
              {language === 'EN' ? 'Market Breadth & Liquidity' : '大盘广度与流动性'}
            </h3>
            <span className="text-[11px] font-mono-numbers text-[#74777f]">
              {MARKET_BREADTH.advancers} Up / {MARKET_BREADTH.decliners} Down
            </span>
          </div>

          {/* Advancers / Unchanged / Decliners Bar */}
          <div className="mt-2.5 flex h-3 w-full rounded-full overflow-hidden">
            <div style={{ width: `${advPct}%` }} className="bg-[#476800] transition-all" title={`Advancers: ${MARKET_BREADTH.advancers}`} />
            <div style={{ width: `${unchPct}%` }} className="bg-[#c4c6cf] transition-all" title={`Unchanged: ${MARKET_BREADTH.unchanged}`} />
            <div style={{ width: `${decPct}%` }} className="bg-[#ba1a1a] transition-all" title={`Decliners: ${MARKET_BREADTH.decliners}`} />
          </div>

          <div className="flex items-center justify-between mt-2 text-[11px] font-mono-numbers">
            <span className="text-[#476800] font-bold">▲ {MARKET_BREADTH.advancers} ({advPct}%)</span>
            <span className="text-[#74777f]">● {MARKET_BREADTH.unchanged}</span>
            <span className="text-[#ba1a1a] font-bold">▼ {MARKET_BREADTH.decliners} ({decPct}%)</span>
          </div>

          {/* Quick Turnover stats */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#f1f5f9]">
            <div className="bg-[#eff4ff] rounded-xl p-2.5">
              <span className="text-[10px] font-bold text-[#74777f] uppercase tracking-wider block">
                {language === 'EN' ? 'Total Turnover' : '全市场成交额'}
              </span>
              <span className="text-[16px] font-bold text-[#002244] font-mono-numbers mt-0.5 block">
                SGD 1.48B
              </span>
              <span className="text-[10px] text-[#476800] font-semibold mt-0.5 block font-mono-numbers">
                +12.4% vs 20D Avg
              </span>
            </div>

            <div className="bg-[#eff4ff] rounded-xl p-2.5">
              <span className="text-[10px] font-bold text-[#74777f] uppercase tracking-wider block">
                {language === 'EN' ? 'Total Volume' : '成交股数'}
              </span>
              <span className="text-[16px] font-bold text-[#002244] font-mono-numbers mt-0.5 block">
                1.15B Shares
              </span>
              <span className="text-[10px] text-[#74777f] mt-0.5 block font-mono-numbers">
                38,420 Trades
              </span>
            </div>
          </div>
        </div>

        {/* Sector Performance Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[14px] font-bold text-[#0b1c30]">
              {language === 'EN' ? 'Sector Performance' : '行业板块表现'}
            </h3>
            <span className="text-[10px] font-bold text-[#74777f] uppercase tracking-wider">
              {language === 'EN' ? '% Change & Turnover' : '涨跌幅与成交额'}
            </span>
          </div>

          <div className="flex flex-col divide-y divide-[#f1f5f9]">
            {sectors.map((sec, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[13px] font-bold text-[#0b1c30]">{sec.name}</span>
                  <span className="text-[11px] font-mono-numbers text-[#74777f] ml-2">SGD {sec.turnover}</span>
                </div>
                <div
                  className={`text-[12px] font-mono-numbers font-bold px-2 py-0.5 rounded ${
                    sec.positive ? 'bg-[#b8f649] text-[#131f00]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                  }`}
                >
                  {sec.positive ? '+' : ''}{sec.change.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Market Movers (Actives, Gainers, Losers) */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] overflow-hidden">
          <div className="p-1 bg-[#eff4ff] flex gap-1 border-b border-[#e2e8f0]">
            <button
              onClick={() => setActiveTab('actives')}
              className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                activeTab === 'actives' ? 'bg-[#002244] text-white shadow-sm' : 'text-[#43474e] hover:bg-[#dce9ff]'
              }`}
            >
              {language === 'EN' ? 'Top Actives' : '成交额榜'}
            </button>
            <button
              onClick={() => setActiveTab('gainers')}
              className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                activeTab === 'gainers' ? 'bg-[#002244] text-white shadow-sm' : 'text-[#43474e] hover:bg-[#dce9ff]'
              }`}
            >
              {language === 'EN' ? 'Top Gainers' : '涨幅榜'}
            </button>
            <button
              onClick={() => setActiveTab('losers')}
              className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                activeTab === 'losers' ? 'bg-[#002244] text-white shadow-sm' : 'text-[#43474e] hover:bg-[#dce9ff]'
              }`}
            >
              {language === 'EN' ? 'Top Losers' : '跌幅榜'}
            </button>
          </div>

          {/* Table Header */}
          <div className="px-3.5 py-2 bg-[#e5eeff]/50 flex items-center text-[#74777f] text-[10px] font-bold uppercase tracking-wider border-b border-[#e2e8f0]">
            <div className="w-6/12">{language === 'EN' ? 'Security / Code' : '证券 / 代码'}</div>
            <div className="w-3/12 text-right">{language === 'EN' ? 'Price (SGD)' : '现价'}</div>
            <div className="w-3/12 text-right">{language === 'EN' ? 'Change' : '涨跌'}</div>
          </div>

          <div className="flex flex-col divide-y divide-[#f1f5f9]">
            {currentList.slice(0, 7).map((item, idx) => (
              <div
                key={item.code}
                onClick={() => onSelectSecurity(item)}
                className="px-3.5 py-3 flex items-center justify-between hover:bg-[#eff4ff] cursor-pointer transition-colors"
              >
                <div className="w-6/12 min-w-0 pr-2">
                  <div className="text-[13px] font-bold text-[#0b1c30] truncate">{item.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-mono-numbers text-[#74777f]">
                    <span>{item.code}</span>
                    <span className="w-1 h-1 rounded-full bg-[#74777f]"></span>
                    <span>SGD {item.turnoverSGD}</span>
                  </div>
                </div>

                <div className="w-3/12 text-right">
                  <span className="text-[13px] font-mono-numbers font-bold text-[#0b1c30]">
                    {item.lastPrice.toFixed(2)}
                  </span>
                </div>

                <div className="w-3/12 text-right">
                  <span
                    className={`inline-block text-[11px] font-mono-numbers font-bold px-1.5 py-0.5 rounded ${
                      item.changePct >= 0 ? 'bg-[#b8f649] text-[#131f00]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    {item.changePct >= 0 ? '+' : ''}{item.changePct.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
