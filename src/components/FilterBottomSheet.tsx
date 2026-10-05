import React from 'react';

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  sortBy: string;
  onSelectSortBy: (sort: 'weight' | 'change' | 'value' | 'return') => void;
  language: 'EN' | '中文';
}

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSelectSortBy,
  language,
}) => {
  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: language === 'EN' ? 'All SGX Indices' : '全部指数' },
    { id: 'sti', label: language === 'EN' ? 'STI Family (Blue Chips)' : '海峡时报指数系列' },
    { id: 'iedge', label: language === 'EN' ? 'iEdge Suite' : 'iEdge 旗舰系列' },
    { id: 'sector', label: language === 'EN' ? 'S-REITs & Sectors' : '房地产信托与行业' },
    { id: 'thematic', label: language === 'EN' ? 'Thematic, AI & ESG' : '主题科技与ESG' },
    { id: 'bonds', label: language === 'EN' ? 'Fixed Income & Bonds' : '固定收益债券' },
  ];

  const sortOptions: { id: 'weight' | 'change' | 'value' | 'return'; label: string }[] = [
    { id: 'weight', label: language === 'EN' ? 'Market Weight (Default)' : '市值权重 (默认)' },
    { id: 'change', label: language === 'EN' ? 'Daily Price Movement (% Change)' : '日涨跌幅绝对值' },
    { id: 'value', label: language === 'EN' ? 'Index Points (Highest First)' : '指数点位由高至低' },
    { id: 'return', label: language === 'EN' ? '1-Year Return (% Performance)' : '1年综合回报率' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-t-3xl shadow-2xl p-5 flex flex-col gap-4 animate-slide-up">
        {/* Grab Handle */}
        <div className="w-10 h-1.5 bg-[#c4c6cf] rounded-full mx-auto" />

        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-[#0b1c30]">
            {language === 'EN' ? 'Filter & Sort Indices' : '筛选与排序指数'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] flex items-center justify-center text-[#002244]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Categories */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#74777f] block mb-2">
            {language === 'EN' ? 'Index Classification' : '指数类别'}
          </span>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectCategory(c.id)}
                className={`p-2.5 rounded-xl text-[12px] font-semibold text-left transition-all ${
                  selectedCategory === c.id
                    ? 'bg-[#002244] text-white shadow-sm'
                    : 'bg-[#eff4ff] text-[#43474e] hover:bg-[#dce9ff]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort criteria */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#74777f] block mb-2">
            {language === 'EN' ? 'Ordering Criteria' : '排序维度'}
          </span>
          <div className="flex flex-col gap-1.5">
            {sortOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onSelectSortBy(opt.id)}
                className={`p-2.5 rounded-xl text-[12px] font-medium text-left flex items-center justify-between transition-all ${
                  sortBy === opt.id
                    ? 'bg-[#b8f649] text-[#131f00] font-bold'
                    : 'bg-[#f8f9ff] text-[#43474e] hover:bg-[#eff4ff]'
                }`}
              >
                <span>{opt.label}</span>
                {sortBy === opt.id && (
                  <span className="material-symbols-outlined text-[18px]">check</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#002244] text-white rounded-xl text-[12px] font-bold uppercase tracking-wider shadow-sm active:scale-98 transition-transform mt-2"
        >
          {language === 'EN' ? 'Apply Filter Criteria' : '应用筛选条件'}
        </button>
      </div>
    </div>
  );
};
