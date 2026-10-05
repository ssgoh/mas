import React, { useState } from 'react';

interface HeaderProps {
  activeTab: string;
  language: 'EN' | '中文';
  onToggleLanguage: () => void;
  onOpenSearch: () => void;
  onOpenMenu: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  language,
  onToggleLanguage,
  onOpenSearch,
  onOpenMenu,
  onOpenProfile,
}) => {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'indices':
        return language === 'EN' ? 'Indices' : '指数';
      case 'market-data':
        return language === 'EN' ? 'Market Data' : '市场数据';
      case 'securities':
        return language === 'EN' ? 'Securities' : '证券证券';
      case 'derivatives':
        return language === 'EN' ? 'Derivatives' : '衍生品';
      case 'more-services':
        return language === 'EN' ? 'More Services' : '更多服务';
      default:
        return 'Indices';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#002244]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,34,68,0.18)]">
      {/* Top Brand Bar */}
      <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: SGX Logo & Market Status */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            alt="SGX Logo"
            className="h-8 w-auto object-contain flex-shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1WGbq4DSz51G3kMB7CgzrJEBFN3s4Hg1O-ElozaC9dyHGSc0orvNeKjkECcoUunDOIoltVoYCGPp5eD2T-OEsH0O0nO6Le--d00EzhdLfo81tMnGy7UUHnOo95ziuI-miF2FKVa94-upVONv_X2EFAaaoV5NwDgkGZs8k2fA7sJPbSlGb8ERMebZuFBMj2rJmUSKOd3dfwCv8Bvn7NndxaWD0toI9JIoI_4ocOP1biOKACFxBE2efUkmgWN"
            onError={(e) => {
              // Graceful fallback if external asset is blocked
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-white tracking-tight leading-none">SGX</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#708ab2] px-1.5 py-0.5 bg-[#000b1d]/50 rounded text-center leading-none">
                {language === 'EN' ? 'Portal' : '门户'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b8f649] animate-pulse flex-shrink-0"></span>
              <span className="text-[11px] font-mono-numbers text-[#b8f649] truncate font-medium">
                {language === 'EN' ? 'Market Open • SGT 16:30' : '开盘中 • 新加坡 16:30'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onOpenSearch}
            aria-label="Search"
            className="w-10 h-10 flex items-center justify-center rounded-lg text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
          
          <button
            onClick={onToggleLanguage}
            className="h-9 px-2 flex items-center justify-center text-[11px] font-bold text-white hover:bg-white/10 rounded-lg tracking-wider transition-colors active:scale-95"
            title="Toggle Language"
          >
            {language === 'EN' ? 'EN | 中文' : '中文 | EN'}
          </button>

          <button
            onClick={onOpenProfile}
            aria-label="User Account"
            className="w-8 h-8 rounded-full bg-[#000b1d] hover:bg-[#001c3a] flex items-center justify-center flex-shrink-0 shadow-[0_1px_4px_rgba(0,0,0,0.2)] text-white transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>

          <button
            onClick={onOpenMenu}
            aria-label="Menu"
            className="w-10 h-10 flex items-center justify-center rounded-lg text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
        </div>
      </div>

      {/* Sub-bar showing Section & Real-Time Datafeed */}
      <div className="h-7 px-4 bg-[#001830] flex items-center justify-between border-t border-white/5 max-w-7xl mx-auto">
        <span className="text-[13px] text-white font-semibold tracking-normal flex items-center gap-1.5">
          <span className="w-1 h-3 bg-[#b8f649] rounded-full"></span>
          {getTabTitle(activeTab)}
        </span>
        <span className="text-[10px] font-bold text-[#708ab2] uppercase tracking-wider font-mono-numbers">
          {language === 'EN' ? 'Real-Time Datafeed' : '实时行情传输'}
        </span>
      </div>
    </header>
  );
};
