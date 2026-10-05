import React from 'react';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'EN' | '中文';
  onNavigateTab: (tabId: string) => void;
  onOpenFactsheet: () => void;
  onOpenRulebook: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  language,
  onNavigateTab,
  onOpenFactsheet,
  onOpenRulebook,
}) => {
  if (!isOpen) return null;

  const links = [
    { id: 'indices', label: language === 'EN' ? 'SGX Benchmark Indices' : '基准指数专区', icon: 'analytics' },
    { id: 'market-data', label: language === 'EN' ? 'Market Overview & Breadth' : '大盘广度与资金', icon: 'monitoring' },
    { id: 'securities', label: language === 'EN' ? 'Securities & Equities' : '股票与证券目录', icon: 'query_stats' },
    { id: 'derivatives', label: language === 'EN' ? 'Derivatives & Futures' : '衍生品与期货期权', icon: 'candlestick_chart' },
    { id: 'more-services', label: language === 'EN' ? 'Corporate Actions & Calendar' : '公司行动与除权息', icon: 'calendar_month' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col p-4 animate-slide-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-[#002244]">SGX Portal</span>
            <span className="text-[10px] uppercase font-bold text-[#476800] bg-[#b8f649] px-1.5 py-0.5 rounded">
              v4.18
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#002244]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
          <span className="text-[10px] uppercase font-bold text-[#74777f] px-2 tracking-wider">
            {language === 'EN' ? 'Navigation' : '导航入口'}
          </span>
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigateTab(link.id);
                onClose();
              }}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#eff4ff] text-[#0b1c30] text-[13px] font-semibold text-left transition-colors"
            >
              <span className="material-symbols-outlined text-[#002244] text-[20px]">{link.icon}</span>
              <span>{link.label}</span>
            </button>
          ))}

          <span className="text-[10px] uppercase font-bold text-[#74777f] px-2 tracking-wider mt-4">
            {language === 'EN' ? 'Institutional Intelligence' : '机构报告'}
          </span>
          <button
            onClick={() => {
              onOpenFactsheet();
              onClose();
            }}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#eff4ff] text-[#0b1c30] text-[13px] font-medium text-left transition-colors"
          >
            <span className="material-symbols-outlined text-[#002244] text-[20px]">assignment</span>
            <span>{language === 'EN' ? 'STI Quarterly Factsheet' : 'STI 季度事实清单'}</span>
          </button>
          <button
            onClick={() => {
              onOpenRulebook();
              onClose();
            }}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#eff4ff] text-[#0b1c30] text-[13px] font-medium text-left transition-colors"
          >
            <span className="material-symbols-outlined text-[#002244] text-[20px]">menu_book</span>
            <span>{language === 'EN' ? 'iEdge Ground Rules 2026' : 'iEdge 规则手册'}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#e2e8f0] text-[11px] text-[#74777f]">
          <p>© 2026 Singapore Exchange Limited</p>
          <p className="text-[10px] mt-0.5">Singapore Financial Market Infrastructure</p>
        </div>
      </div>
    </div>
  );
};
