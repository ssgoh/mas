import React from 'react';
import { CORPORATE_ACTIONS, SGX_INDICES } from '../data/sgxData';
import { SGXIndex } from '../types';

interface MoreViewProps {
  language: 'EN' | '中文';
  onToggleLanguage: () => void;
  bookmarkedIndices: string[];
  onSelectIndex: (idx: SGXIndex) => void;
  onOpenFactsheet: () => void;
  onOpenRulebook: () => void;
}

export const MoreView: React.FC<MoreViewProps> = ({
  language,
  onToggleLanguage,
  bookmarkedIndices,
  onSelectIndex,
  onOpenFactsheet,
  onOpenRulebook,
}) => {
  const savedIndices = SGX_INDICES.filter((i) => bookmarkedIndices.includes(i.id));

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Sub-header */}
      <section className="bg-[#eff4ff] px-4 py-2 flex flex-col gap-1 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-1.5 text-[#43474e] text-[10px] font-bold uppercase tracking-wider">
          <span>{language === 'EN' ? 'Home' : '首页'}</span>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-[#002244] font-bold">{language === 'EN' ? 'More Services' : '更多服务与设置'}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[12px] font-bold text-[#002244]">
            {language === 'EN' ? 'SGX Institutional Workspace' : '新加坡交易所机构工作台'}
          </span>
          <span className="text-[11px] font-mono-numbers text-[#74777f]">v4.18.2</span>
        </div>
      </section>

      <div className="px-4 py-3 flex flex-col gap-3">
        {/* Watchlist Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#002244]">star</span>
              <h3 className="text-[14px] font-bold text-[#0b1c30]">
                {language === 'EN' ? 'My Watchlist' : '自选监测'}
              </h3>
            </div>
            <span className="text-[11px] font-mono-numbers text-[#74777f]">
              {savedIndices.length} {language === 'EN' ? 'Saved' : '项已关注'}
            </span>
          </div>

          {savedIndices.length === 0 ? (
            <p className="text-[12px] text-[#74777f] py-2">
              {language === 'EN' ? 'No indices saved yet. Tap the star icon on any index to track it here.' : '暂无自选。点击任意指数卡片上的五角星即可收藏。'}
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-[#f1f5f9]">
              {savedIndices.map((idx) => (
                <div
                  key={idx.id}
                  onClick={() => onSelectIndex(idx)}
                  className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-[#eff4ff] transition-colors"
                >
                  <div>
                    <span className="text-[13px] font-bold text-[#0b1c30]">{idx.name}</span>
                    <span className="text-[11px] font-mono-numbers text-[#74777f] ml-2">{idx.ticker}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[13px] font-mono-numbers font-bold text-[#0b1c30] block">
                      {idx.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`text-[11px] font-mono-numbers font-semibold ${
                        idx.changePct >= 0 ? 'text-[#476800]' : 'text-[#ba1a1a]'
                      }`}
                    >
                      {idx.changePct >= 0 ? '+' : ''}{idx.changePct.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Corporate Actions & Dividend Calendar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#002244]">calendar_month</span>
              <h3 className="text-[14px] font-bold text-[#0b1c30]">
                {language === 'EN' ? 'Upcoming Corporate Actions' : '近期公司行动与分红日历'}
              </h3>
            </div>
            <span className="text-[10px] font-bold text-[#002244] uppercase tracking-wider">
              {language === 'EN' ? 'October 2026' : '2026年10月'}
            </span>
          </div>

          <div className="flex flex-col divide-y divide-[#f1f5f9]">
            {CORPORATE_ACTIONS.map((action) => (
              <div key={action.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-bold text-[#0b1c30] flex items-center gap-1.5">
                    <span>{action.name}</span>
                    <span className="text-[11px] font-mono-numbers text-[#74777f]">({action.ticker})</span>
                  </div>
                  <div className="text-[11px] text-[#43474e] mt-0.5">
                    {action.event} • <span className="font-semibold text-[#476800]">{action.amount}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-mono-numbers font-bold text-[#002244]">
                    Ex: {action.exDate}
                  </div>
                  <div className="text-[10px] font-mono-numbers text-[#74777f]">
                    Pay: {action.payDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trading Hours Guide */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0]">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[20px] text-[#002244]">schedule</span>
            <h3 className="text-[14px] font-bold text-[#0b1c30]">
              {language === 'EN' ? 'Trading Hours & Sessions' : '交易时段指南'}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-numbers">
            <div className="bg-[#eff4ff] p-2 rounded-lg">
              <span className="text-[10px] font-bold text-[#74777f] uppercase font-sans block">Pre-Open Session</span>
              <span className="font-bold text-[#002244]">08:30 - 08:59 SGT</span>
            </div>
            <div className="bg-[#eff4ff] p-2 rounded-lg">
              <span className="text-[10px] font-bold text-[#74777f] uppercase font-sans block">Continuous Trading</span>
              <span className="font-bold text-[#476800]">09:00 - 17:00 SGT</span>
            </div>
            <div className="bg-[#eff4ff] p-2 rounded-lg">
              <span className="text-[10px] font-bold text-[#74777f] uppercase font-sans block">Pre-Close Routine</span>
              <span className="font-bold text-[#002244]">17:00 - 17:05 SGT</span>
            </div>
            <div className="bg-[#eff4ff] p-2 rounded-lg">
              <span className="text-[10px] font-bold text-[#74777f] uppercase font-sans block">Trade-at-Close</span>
              <span className="font-bold text-[#002244]">17:06 - 17:16 SGT</span>
            </div>
          </div>
        </div>

        {/* Institutional Resources & Tools */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0] flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[20px] text-[#002244]">account_balance</span>
            <h3 className="text-[14px] font-bold text-[#0b1c30]">
              {language === 'EN' ? 'Official Documentation' : '官方规章与白皮书'}
            </h3>
          </div>

          <button
            onClick={onOpenFactsheet}
            className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#002244]">description</span>
              <div>
                <span className="text-[13px] font-bold text-[#002244] block">
                  {language === 'EN' ? 'STI Quarterly Review Factsheet' : '海峡时报指数季度审核事实清单'}
                </span>
                <span className="text-[11px] text-[#74777f]">FTSE Russell & SGX Index Governance</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#002244] text-[18px]">chevron_right</span>
          </button>

          <button
            onClick={onOpenRulebook}
            className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#002244]">menu_book</span>
              <div>
                <span className="text-[13px] font-bold text-[#002244] block">
                  {language === 'EN' ? 'iEdge Index Ground Rules 2026' : 'iEdge 指数编制准则 2026'}
                </span>
                <span className="text-[11px] text-[#74777f]">Comprehensive Methodology & Calculation</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#002244] text-[18px]">chevron_right</span>
          </button>

          {/* Language Switch Button */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center justify-between p-3 rounded-xl bg-[#e5eeff] hover:bg-[#dce9ff] text-left transition-colors mt-1"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#002244]">language</span>
              <div>
                <span className="text-[13px] font-bold text-[#002244] block">
                  {language === 'EN' ? 'Display Language: English' : '显示语言：简体中文'}
                </span>
                <span className="text-[11px] text-[#74777f]">
                  {language === 'EN' ? 'Switch to 简体中文' : '切换为 English'}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold uppercase px-2 py-1 bg-white rounded-lg text-[#002244]">
              {language === 'EN' ? '中文' : 'EN'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
