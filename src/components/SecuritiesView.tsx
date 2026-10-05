import React, { useState, useMemo } from 'react';
import { SGX_SECURITIES } from '../data/sgxData';
import { SecurityStock } from '../types';

interface SecuritiesViewProps {
  language: 'EN' | '中文';
  onSelectSecurity: (sec: SecurityStock) => void;
}

export const SecuritiesView: React.FC<SecuritiesViewProps> = ({
  language,
  onSelectSecurity,
}) => {
  const [search, setSearch] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'turnover' | 'change' | 'price' | 'cap'>('turnover');

  const filteredSecurities = useMemo(() => {
    return SGX_SECURITIES.filter((item) => {
      if (typeFilter !== 'All' && item.type !== typeFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        return (
          item.name.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.sector.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'change') return Math.abs(b.changePct) - Math.abs(a.changePct);
      if (sortBy === 'price') return b.lastPrice - a.lastPrice;
      if (sortBy === 'cap') return parseFloat(b.marketCapSGD) - parseFloat(a.marketCapSGD);
      return parseFloat(b.turnoverSGD) - parseFloat(a.turnoverSGD);
    });
  }, [search, typeFilter, sortBy]);

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Sub-header */}
      <section className="bg-[#eff4ff] px-4 py-2 flex flex-col gap-1 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-1.5 text-[#43474e] text-[10px] font-bold uppercase tracking-wider">
          <span>{language === 'EN' ? 'Home' : '首页'}</span>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-[#002244] font-bold">{language === 'EN' ? 'Securities Directory' : '证券股票报价'}</span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#b8f649] text-[#131f00]">
            <span className="w-2 h-2 rounded-full bg-[#476800] animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-wider font-bold">
              {language === 'EN' ? 'SGX MAINBOARD & CATALIST' : '新加坡主板与凯利板'}
            </span>
          </div>
          <span className="text-[11px] font-mono-numbers text-[#43474e]">
            {filteredSecurities.length} {language === 'EN' ? 'Listed' : '只标的'}
          </span>
        </div>
      </section>

      {/* Search & Type filter pills */}
      <div className="px-4 pt-3 flex flex-col gap-2">
        <div className="flex items-center bg-white rounded-xl px-3 py-2.5 shadow-sm border border-[#e2e8f0]">
          <span className="material-symbols-outlined text-[#74777f] text-[18px] mr-2">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'EN' ? 'Search stock (e.g. DBS, Singtel, CICT)...' : '搜索股票 (如 DBS, 星展, 新电信)...'}
            className="w-full bg-transparent text-[13px] text-[#0b1c30] placeholder:text-[#74777f] focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-[#74777f] hover:text-[#0b1c30]">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none py-1">
          <div className="flex items-center gap-1.5">
            {['All', 'Equity', 'REIT', 'ETF'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  typeFilter === t
                    ? 'bg-[#002244] text-white shadow-sm'
                    : 'bg-[#e5eeff] text-[#43474e] hover:bg-[#dce9ff]'
                }`}
              >
                {t === 'All' ? (language === 'EN' ? 'All Securities' : '全部') : t}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-[11px] font-bold uppercase text-[#002244] border-none focus:outline-none cursor-pointer flex-shrink-0"
          >
            <option value="turnover">{language === 'EN' ? 'Turnover' : '成交额'}</option>
            <option value="change">{language === 'EN' ? '% Change' : '涨跌幅'}</option>
            <option value="price">{language === 'EN' ? 'Price' : '股价'}</option>
            <option value="cap">{language === 'EN' ? 'Market Cap' : '市值'}</option>
          </select>
        </div>
      </div>

      {/* Securities Table */}
      <section className="px-4 py-2">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] overflow-hidden">
          <div className="px-3.5 py-2 bg-[#e5eeff]/50 flex items-center text-[#74777f] text-[10px] font-bold uppercase tracking-wider border-b border-[#e2e8f0]">
            <div className="w-6/12">{language === 'EN' ? 'Company / Code' : '公司 / 代码'}</div>
            <div className="w-3/12 text-right">{language === 'EN' ? 'Last (SGD)' : '最新价'}</div>
            <div className="w-3/12 text-right">{language === 'EN' ? 'Chg / %Chg' : '涨跌 / 幅度'}</div>
          </div>

          <div className="flex flex-col divide-y divide-[#f1f5f9]">
            {filteredSecurities.map((stock, idx) => (
              <div
                key={stock.code}
                onClick={() => onSelectSecurity(stock)}
                className={`px-3.5 py-3 flex items-center justify-between hover:bg-[#eff4ff] cursor-pointer transition-colors ${
                  idx % 2 === 1 ? 'bg-[#f8f9ff]/60' : 'bg-white'
                }`}
              >
                <div className="w-6/12 min-w-0 pr-2">
                  <div className="text-[13px] font-bold text-[#0b1c30] truncate">{stock.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-mono-numbers text-[#74777f]">
                    <span className="font-semibold text-[#002244]">{stock.code}</span>
                    <span className="w-1 h-1 rounded-full bg-[#74777f]"></span>
                    <span className="text-[10px] uppercase px-1 py-0.2 bg-[#eff4ff] rounded text-[#43474e] font-sans">
                      {stock.type}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#74777f]"></span>
                    <span>{stock.sector}</span>
                  </div>
                </div>

                <div className="w-3/12 text-right">
                  <div className="text-[13px] font-mono-numbers font-bold text-[#0b1c30]">
                    {stock.lastPrice.toFixed(stock.lastPrice < 1 ? 3 : 2)}
                  </div>
                  <div className="text-[10px] font-mono-numbers text-[#74777f]">
                    Vol: {stock.volume}
                  </div>
                </div>

                <div className="w-3/12 text-right">
                  <div
                    className={`inline-block text-[11px] font-mono-numbers font-bold px-1.5 py-0.5 rounded ${
                      stock.changePct >= 0 ? 'bg-[#b8f649] text-[#131f00]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    {stock.changePct >= 0 ? '+' : ''}{stock.changePct.toFixed(2)}%
                  </div>
                  <div
                    className={`text-[10px] font-mono-numbers mt-0.5 ${
                      stock.change >= 0 ? 'text-[#476800]' : 'text-[#ba1a1a]'
                    }`}
                  >
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(stock.lastPrice < 1 ? 3 : 2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
