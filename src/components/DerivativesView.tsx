import React, { useState } from 'react';
import { SGX_DERIVATIVES } from '../data/sgxData';
import { DerivativeContract } from '../types';

interface DerivativesViewProps {
  language: 'EN' | '中文';
  onSelectDerivative: (contract: DerivativeContract) => void;
}

export const DerivativesView: React.FC<DerivativesViewProps> = ({
  language,
  onSelectDerivative,
}) => {
  const [assetClassFilter, setAssetClassFilter] = useState<string>('All');

  const filteredContracts = SGX_DERIVATIVES.filter((d) => {
    if (assetClassFilter === 'All') return true;
    return d.assetClass === assetClassFilter;
  });

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Sub-header */}
      <section className="bg-[#eff4ff] px-4 py-2 flex flex-col gap-1 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-1.5 text-[#43474e] text-[10px] font-bold uppercase tracking-wider">
          <span>{language === 'EN' ? 'Home' : '首页'}</span>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-[#002244] font-bold">{language === 'EN' ? 'Derivatives Market' : '衍生品期货'}</span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#b8f649] text-[#131f00]">
            <span className="w-2 h-2 rounded-full bg-[#476800] animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-wider font-bold">
              {language === 'EN' ? 'SGX DERIVATIVES: T+1 SESSION' : 'SGX 衍生品：T+1 交易段'}
            </span>
          </div>
          <span className="text-[11px] font-mono-numbers text-[#43474e]">
            {language === 'EN' ? 'T+1 Active' : '夜盘进行中'}
          </span>
        </div>
      </section>

      {/* Hero Highlight Banner */}
      <div className="px-4 pt-3">
        <div className="bg-[#002244] rounded-2xl p-4 text-white shadow-sm flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#b8f649]">
              {language === 'EN' ? 'Flagship Risk Management' : '泛亚旗舰风险对冲'}
            </span>
            <span className="text-[11px] font-mono-numbers text-[#708ab2]">Global Liquidity</span>
          </div>
          <h2 className="text-[18px] font-bold text-white tracking-tight mt-0.5">
            {language === 'EN' ? 'SGX Multi-Asset Derivatives' : '新交所多元资产衍生品生态'}
          </h2>
          <p className="text-[12px] text-[#708ab2] leading-snug">
            {language === 'EN'
              ? 'Pioneering international risk management for China A50, Nikkei 225, GIFT Nifty, Seaborne Iron Ore, and Asian FX.'
              : '涵盖富时中国A50、日经225、GIFT Nifty、铁矿石海运基准及外汇期货。'}
          </p>
        </div>
      </div>

      {/* Asset Class Filter Pills */}
      <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {['All', 'Equity Index', 'Commodity', 'FX'].map((cat) => (
          <button
            key={cat}
            onClick={() => setAssetClassFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${
              assetClassFilter === cat
                ? 'bg-[#002244] text-white shadow-sm'
                : 'bg-[#e5eeff] text-[#43474e] hover:bg-[#dce9ff]'
            }`}
          >
            {cat === 'All' ? (language === 'EN' ? 'All Contracts' : '全部合约') : cat}
          </button>
        ))}
      </div>

      {/* Contracts Table */}
      <section className="px-4 py-1">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] overflow-hidden">
          <div className="px-3.5 py-2 bg-[#e5eeff]/50 flex items-center text-[#74777f] text-[10px] font-bold uppercase tracking-wider border-b border-[#e2e8f0]">
            <div className="w-6/12">{language === 'EN' ? 'Contract / Month' : '合约名称 / 月份'}</div>
            <div className="w-3/12 text-right">{language === 'EN' ? 'Last Price' : '最新价'}</div>
            <div className="w-3/12 text-right">{language === 'EN' ? 'Chg / OI' : '涨跌 / 持仓'}</div>
          </div>

          <div className="flex flex-col divide-y divide-[#f1f5f9]">
            {filteredContracts.map((contract, idx) => (
              <div
                key={contract.code}
                onClick={() => onSelectDerivative(contract)}
                className={`px-3.5 py-3 flex items-center justify-between hover:bg-[#eff4ff] cursor-pointer transition-colors ${
                  idx % 2 === 1 ? 'bg-[#f8f9ff]/60' : 'bg-white'
                }`}
              >
                <div className="w-6/12 min-w-0 pr-2">
                  <div className="text-[13px] font-bold text-[#0b1c30] truncate">{contract.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-mono-numbers text-[#74777f]">
                    <span className="font-semibold text-[#002244]">{contract.code}</span>
                    <span className="w-1 h-1 rounded-full bg-[#74777f]"></span>
                    <span>{contract.contractMonth}</span>
                  </div>
                </div>

                <div className="w-3/12 text-right">
                  <div className="text-[13px] font-mono-numbers font-bold text-[#0b1c30]">
                    {contract.lastPrice.toLocaleString(undefined, {
                      minimumFractionDigits: contract.lastPrice < 10 ? 4 : 0,
                    })}
                  </div>
                  <div className="text-[10px] font-mono-numbers text-[#74777f]">
                    Vol: {contract.volume.toLocaleString()}
                  </div>
                </div>

                <div className="w-3/12 text-right">
                  <div
                    className={`inline-block text-[11px] font-mono-numbers font-bold px-1.5 py-0.5 rounded ${
                      contract.changePct >= 0 ? 'bg-[#b8f649] text-[#131f00]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    {contract.changePct >= 0 ? '+' : ''}{contract.changePct.toFixed(2)}%
                  </div>
                  <div className="text-[10px] font-mono-numbers text-[#74777f] mt-0.5">
                    OI: {contract.openInterest.toLocaleString()}
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
