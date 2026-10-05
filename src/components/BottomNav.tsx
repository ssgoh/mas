import React from 'react';

interface BottomNavProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  language: 'EN' | '中文';
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab, language }) => {
  const tabs = [
    {
      id: 'market-data',
      label: language === 'EN' ? 'Market Data' : '市场大盘',
      icon: 'monitoring',
    },
    {
      id: 'indices',
      label: language === 'EN' ? 'Indices' : '基准指数',
      icon: 'analytics',
    },
    {
      id: 'securities',
      label: language === 'EN' ? 'Securities' : '证券股票',
      icon: 'query_stats',
    },
    {
      id: 'derivatives',
      label: language === 'EN' ? 'Derivatives' : '衍生期约',
      icon: 'candlestick_chart',
    },
    {
      id: 'more-services',
      label: language === 'EN' ? 'More' : '更多服务',
      icon: 'grid_view',
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-white/95 backdrop-blur-xl border-t border-[#e2e8f0] shadow-[0_-2px_12px_rgba(0,34,68,0.06)]">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center w-16 h-14 transition-all active:scale-95 ${
                isActive
                  ? 'text-[#002244] font-semibold'
                  : 'text-[#43474e] hover:text-[#002244]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] transition-transform ${
                  isActive ? 'scale-110 font-bold' : ''
                }`}
              >
                {tab.icon}
              </span>
              <span className="text-[10px] font-bold mt-1 text-center whitespace-nowrap tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-5 h-0.5 bg-[#476800] rounded-full animate-fade-in" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
