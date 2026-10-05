import React, { useState, useMemo } from 'react';
import { SGXIndex, Timeframe } from '../types';
import { SGX_INDICES } from '../data/sgxData';

interface IndicesViewProps {
  language: 'EN' | '中文';
  onSelectIndex: (index: SGXIndex) => void;
  onOpenFactsheet: () => void;
  onOpenRulebook: () => void;
  onOpenFilter: () => void;
  bookmarkedIndices: string[];
  onToggleBookmark: (indexId: string) => void;
}

export const IndicesView: React.FC<IndicesViewProps> = ({
  language,
  onSelectIndex,
  onOpenFactsheet,
  onOpenRulebook,
  onOpenFilter,
  bookmarkedIndices,
  onToggleBookmark,
}) => {
  // Hero Index (defaults to STI)
  const [heroIndexId, setHeroIndexId] = useState<string>('sti');
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1D');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'weight' | 'change' | 'value' | 'return'>('weight');
  const [showAllIndices, setShowAllIndices] = useState<boolean>(false);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [subscribedToast, setSubscribedToast] = useState<boolean>(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ time: string; value: number } | null>(null);

  // Retrieve current hero index
  const heroIndex = useMemo(() => {
    return SGX_INDICES.find((i) => i.id === heroIndexId) || SGX_INDICES[0];
  }, [heroIndexId]);

  // Current timeframe chart points
  const currentChartPoints = useMemo(() => {
    return heroIndex.chartData[selectedTimeframe] || heroIndex.chartData['1D'];
  }, [heroIndex, selectedTimeframe]);

  // Generate smooth SVG curve path and area path
  const svgPaths = useMemo(() => {
    const pts = currentChartPoints;
    if (!pts || pts.length < 2) return { line: '', area: '', lastX: 340, lastY: 15 };
    const values = pts.map((p) => p.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    const width = 340;
    const height = 70;
    const padding = 10;
    const usableHeight = height - padding * 2;

    const coords = pts.map((pt, idx) => {
      const x = (idx / (pts.length - 1)) * width;
      const normalized = (pt.value - minVal) / range;
      const y = height - padding - normalized * usableHeight;
      return { x, y };
    });

    // Generate smooth cubic bezier SVG string
    let linePath = `M ${coords[0].x.toFixed(1)},${coords[0].y.toFixed(1)}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2 < coords.length ? i + 2 : coords.length - 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      linePath += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }

    const lastCoord = coords[coords.length - 1];
    const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

    return {
      line: linePath,
      area: areaPath,
      lastX: lastCoord.x,
      lastY: lastCoord.y,
    };
  }, [currentChartPoints]);

  // Categories list
  const categories = [
    { id: 'all', label: language === 'EN' ? 'All Indices' : '全部指数' },
    { id: 'sti', label: language === 'EN' ? 'STI Family' : '海峡时报指数系列' },
    { id: 'iedge', label: language === 'EN' ? 'iEdge Suite' : 'iEdge 旗舰系列' },
    { id: 'sector', label: language === 'EN' ? 'Sectors & REITs' : '行业与房产信托' },
    { id: 'thematic', label: language === 'EN' ? 'Thematic & ESG' : '主题与ESG' },
    { id: 'bonds', label: language === 'EN' ? 'Fixed Income' : '固定收益债券' },
  ];

  // Filtered and sorted indices for directory table
  const filteredIndices = useMemo(() => {
    let result = SGX_INDICES.filter((index) => {
      // Category filter
      if (selectedCategory !== 'all' && !index.categories.includes(selectedCategory)) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          index.name.toLowerCase().includes(q) ||
          index.ticker.toLowerCase().includes(q) ||
          index.subTitle.toLowerCase().includes(q)
        );
      }
      return true;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'change') return Math.abs(b.changePct) - Math.abs(a.changePct);
      if (sortBy === 'value') return b.value - a.value;
      if (sortBy === 'return') return b.oneYearRet - a.oneYearRet;
      return 0; // default market weight ordering in raw array
    });

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  const displayedIndices = showAllIndices ? filteredIndices : filteredIndices.slice(0, 8);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@') && newsletterEmail.includes('.')) {
      setSubscribedToast(true);
      setTimeout(() => setSubscribedToast(false), 4500);
      setNewsletterEmail('');
    }
  };

  const isHeroBookmarked = bookmarkedIndices.includes(heroIndex.id);

  // Range and high/low based on timeframe
  const timeframeStats = useMemo(() => {
    const pts = currentChartPoints;
    const vals = pts.map((p) => p.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const start = pts[0]?.value || heroIndex.value;
    const current = pts[pts.length - 1]?.value || heroIndex.value;
    const diff = current - start;
    const diffPct = (diff / start) * 100;
    return { min, max, diff, diffPct };
  }, [currentChartPoints, heroIndex.value]);

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Sub-header & Real-time Status Strip */}
      <section className="bg-[#eff4ff] px-4 py-2 flex flex-col gap-1 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-1.5 text-[#43474e] text-[10px] font-bold uppercase tracking-wider">
          <span>{language === 'EN' ? 'Home' : '首页'}</span>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span>{language === 'EN' ? 'Market Data' : '市场数据'}</span>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-[#002244] font-bold">{language === 'EN' ? 'Indices' : '指数'}</span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#b8f649] text-[#131f00]">
            <span className="w-2 h-2 rounded-full bg-[#476800] animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-wider font-bold">
              {language === 'EN' ? 'SGX EQUITIES: OPEN' : '新加坡证券：开盘中'}
            </span>
          </div>
          <span className="text-[11px] font-mono-numbers text-[#43474e] font-medium">
            05 Oct 2026 16:30 SGT
          </span>
        </div>

        <div className="flex items-center justify-between text-[10px] font-bold text-[#74777f] uppercase tracking-wider mt-0.5">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">schedule</span>
            <span>{language === 'EN' ? 'Delayed by 15 mins • Indicative pricing' : '延时15分钟 • 指示性报价'}</span>
          </div>
          <span className="text-[#002244] font-mono-numbers">SESSION: CONT</span>
        </div>
      </section>

      {/* Interactive Search & Filter Bar */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-white rounded-xl px-3 py-2.5 shadow-sm border border-[#e2e8f0] focus-within:border-[#002244] transition-colors">
            <span className="material-symbols-outlined text-[#74777f] text-[18px] mr-2">search</span>
            <input
              id="index-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'EN' ? 'Search indices (e.g. STI, iEdge, REIT)...' : '搜索指数 (如 STI, iEdge, 房托)...'}
              className="w-full bg-transparent text-[13px] text-[#0b1c30] placeholder:text-[#74777f] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear Search"
                className="text-[#74777f] hover:text-[#0b1c30] p-0.5"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
          <button
            onClick={onOpenFilter}
            aria-label="Filter Indices"
            className="h-10 px-3 bg-[#e5eeff] hover:bg-[#dce9ff] text-[#002244] rounded-xl flex items-center justify-center gap-1 text-[11px] uppercase font-bold active:scale-95 transition-all shadow-sm flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>{language === 'EN' ? 'Filter' : '筛选'}</span>
          </button>
        </div>
      </div>

      {/* Benchmark Hero Showcase */}
      <section className="px-4 py-2">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0] flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#002244] text-white font-bold">
                  {heroIndex.isBenchmark ? (language === 'EN' ? 'Benchmark' : '主要基准') : (language === 'EN' ? 'SGX Index' : 'SGX 指数')}
                </span>
                <span className="text-[12px] font-mono-numbers text-[#74777f] font-semibold">
                  {heroIndex.ticker}
                </span>
              </div>
              <h2 className="text-[20px] leading-tight text-[#0b1c30] font-bold mt-1 tracking-tight">
                {heroIndex.name}
              </h2>
              <p className="text-[12px] text-[#43474e] mt-0.5">{heroIndex.subTitle}</p>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onToggleBookmark(heroIndex.id)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                  isHeroBookmarked
                    ? 'bg-[#b8f649] text-[#131f00]'
                    : 'bg-[#eff4ff] text-[#002244] hover:bg-[#dce9ff]'
                }`}
                title={isHeroBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: isHeroBookmarked ? "'FILL' 1" : "'FILL' 0" }}
                >
                  star
                </span>
              </button>
            </div>
          </div>

          {/* Current Index Price & Movement */}
          <div className="flex items-baseline justify-between mt-1">
            <div className="flex flex-col">
              <span className="text-[30px] font-bold text-[#0b1c30] tracking-tight font-mono-numbers leading-none">
                {hoveredPoint ? hoveredPoint.value.toLocaleString(undefined, { minimumFractionDigits: 2 }) : heroIndex.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] font-mono-numbers text-[#74777f] mt-1">
                {hoveredPoint ? `Time: ${hoveredPoint.time}` : 'SGD Index Points'}
              </span>
            </div>

            <div
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-mono-numbers text-[13px] font-bold ${
                heroIndex.change >= 0
                  ? 'bg-[#b8f649] text-[#131f00]'
                  : 'bg-[#ffdad6] text-[#ba1a1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {heroIndex.change >= 0 ? 'arrow_drop_up' : 'arrow_drop_down'}
              </span>
              <span>
                {heroIndex.change >= 0 ? '+' : ''}
                {heroIndex.change.toFixed(2)} ({heroIndex.changePct >= 0 ? '+' : ''}
                {heroIndex.changePct.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Intraday Micro Chart (Inline SVG with Dynamic Timeframe rendering) */}
          <div className="w-full mt-2">
            <div className="flex items-center justify-between mb-1 text-[11px] font-mono-numbers text-[#74777f]">
              <span>
                {selectedTimeframe === '1D'
                  ? `Day Range: ${heroIndex.dayLow.toFixed(2)} - ${heroIndex.dayHigh.toFixed(2)}`
                  : `Range: ${timeframeStats.min.toFixed(2)} - ${timeframeStats.max.toFixed(2)}`}
              </span>
              <span className="text-[#476800] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#476800] animate-ping" />
                {selectedTimeframe === '1D' ? 'Live Intraday' : selectedTimeframe}
              </span>
            </div>

            <div className="w-full h-24 relative overflow-hidden rounded-lg bg-[#eff4ff]/60 p-1 flex items-end select-none">
              <svg
                className="w-full h-20 overflow-visible cursor-crosshair"
                preserveAspectRatio="none"
                viewBox="0 0 340 70"
                onMouseLeave={() => setHoveredPoint(null)}
                onTouchEnd={() => setHoveredPoint(null)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const xRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  const idx = Math.round(xRatio * (currentChartPoints.length - 1));
                  if (currentChartPoints[idx]) {
                    setHoveredPoint(currentChartPoints[idx]);
                  }
                }}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  if (!touch) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const xRatio = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
                  const idx = Math.round(xRatio * (currentChartPoints.length - 1));
                  if (currentChartPoints[idx]) {
                    setHoveredPoint(currentChartPoints[idx]);
                  }
                }}
              >
                <defs>
                  <linearGradient id="stiGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#476800" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#476800" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={svgPaths.area} fill="url(#stiGradient)" />
                <path
                  d={svgPaths.line}
                  fill="none"
                  stroke="#476800"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
                <circle
                  className="animate-ping"
                  cx={svgPaths.lastX}
                  cy={svgPaths.lastY}
                  fill="#476800"
                  r="3.5"
                  style={{ transformOrigin: `${svgPaths.lastX}px ${svgPaths.lastY}px` }}
                />
                <circle cx={svgPaths.lastX} cy={svgPaths.lastY} fill="#476800" r="3.5" />
              </svg>
            </div>

            {/* Timeframe Pills */}
            <div className="flex items-center justify-between gap-1 mt-2.5">
              {(['1D', '5D', '1M', 'YTD', '1Y', 'MAX'] as Timeframe[]).map((tf) => {
                const isActive = selectedTimeframe === tf;
                return (
                  <button
                    key={tf}
                    onClick={() => {
                      setSelectedTimeframe(tf);
                      setHoveredPoint(null);
                    }}
                    className={`flex-1 py-1 rounded text-[11px] font-mono-numbers text-center font-bold transition-all active:scale-95 ${
                      isActive
                        ? 'bg-[#002244] text-white shadow-sm'
                        : 'bg-[#e5eeff] hover:bg-[#dce9ff] text-[#43474e]'
                    }`}
                  >
                    {tf}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 mt-1 border-t border-[#f1f5f9]">
            <div className="bg-[#eff4ff] rounded-lg p-2.5">
              <div className="text-[10px] uppercase font-bold text-[#74777f] tracking-wider">
                {language === 'EN' ? 'Day High / Low' : '最高 / 最低'}
              </div>
              <div className="text-[12px] font-mono-numbers font-semibold text-[#0b1c30] mt-0.5">
                {heroIndex.dayHigh.toFixed(2)} / {heroIndex.dayLow.toFixed(2)}
              </div>
            </div>

            <div className="bg-[#eff4ff] rounded-lg p-2.5">
              <div className="text-[10px] uppercase font-bold text-[#74777f] tracking-wider">
                {language === 'EN' ? 'Prev Close' : '前收盘价'}
              </div>
              <div className="text-[12px] font-mono-numbers font-semibold text-[#0b1c30] mt-0.5">
                {heroIndex.prevClose.toFixed(2)}
              </div>
            </div>

            <div className="bg-[#eff4ff] rounded-lg p-2.5">
              <div className="text-[10px] uppercase font-bold text-[#74777f] tracking-wider">
                {language === 'EN' ? 'Total Value (SGD)' : '成交总额 (SGD)'}
              </div>
              <div className="text-[12px] font-mono-numbers font-semibold text-[#0b1c30] mt-0.5">
                {heroIndex.totalValueSGD}
              </div>
            </div>

            <button
              onClick={() => onSelectIndex(heroIndex)}
              className="bg-[#eff4ff] hover:bg-[#dce9ff] rounded-lg p-2.5 text-left transition-colors group"
            >
              <div className="text-[10px] uppercase font-bold text-[#74777f] tracking-wider flex items-center justify-between">
                <span>{language === 'EN' ? 'Constituents' : '成分股'}</span>
                <span className="material-symbols-outlined text-[13px] text-[#002244] group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </div>
              <div className="text-[12px] font-semibold text-[#002244] mt-0.5 underline">
                {heroIndex.constituentsType}
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Filter & Category Tabs (Horizontal Scrollable) */}
      <section className="py-1">
        <div className="flex items-center gap-1.5 overflow-x-auto px-4 scrollbar-none py-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-[#002244] text-white shadow-sm'
                    : 'bg-[#e5eeff] text-[#43474e] hover:bg-[#dce9ff]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Key Indices Quick Cards Carousel */}
      <section className="py-2">
        <div className="px-4 flex items-center justify-between mb-2">
          <h3 className="text-[14px] font-bold text-[#0b1c30]">
            {language === 'EN' ? 'Featured Sub-Indices' : '精选细分指数'}
          </h3>
          <span className="text-[10px] font-bold text-[#74777f] uppercase tracking-wider">
            {language === 'EN' ? 'Swipe for more' : '滑动查看更多'}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
          {SGX_INDICES.filter((idx) => idx.id !== 'sti').map((sub) => {
            const isSelected = heroIndex.id === sub.id;
            return (
              <div
                key={sub.id}
                onClick={() => setHeroIndexId(sub.id)}
                className={`min-w-[175px] max-w-[175px] flex-shrink-0 bg-white rounded-xl p-3 shadow-sm border transition-all cursor-pointer active:scale-98 flex flex-col justify-between ${
                  isSelected ? 'border-[#002244] ring-2 ring-[#002244]/20' : 'border-[#e2e8f0] hover:border-[#708ab2]'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold text-[#74777f] uppercase tracking-wider truncate block">
                    {sub.name}
                  </span>
                  <div className="text-[16px] font-mono-numbers font-bold text-[#0b1c30] mt-1">
                    {sub.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono-numbers px-1.5 py-0.5 rounded font-bold ${
                      sub.changePct >= 0
                        ? 'bg-[#b8f649] text-[#131f00]'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    {sub.changePct >= 0 ? '+' : ''}
                    {sub.changePct.toFixed(2)}%
                  </span>
                  <span className="text-[11px] font-mono-numbers text-[#74777f]">
                    {sub.change >= 0 ? '+' : ''}
                    {sub.change.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comprehensive Indices Data Table / List View */}
      <section className="px-4 py-2">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] overflow-hidden">
          {/* Table Header & Sort Controls */}
          <div className="bg-[#eff4ff] px-3.5 py-2.5 flex items-center justify-between border-b border-[#e2e8f0]">
            <span className="text-[14px] font-bold text-[#0b1c30]">
              {language === 'EN' ? 'Indices Directory' : '指数全景目录'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-[#74777f] uppercase tracking-wider">
                {language === 'EN' ? 'Sorted by' : '排序'}
              </span>
              <select
                aria-label="Sort indices"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[11px] font-bold uppercase text-[#002244] border-none focus:outline-none cursor-pointer"
              >
                <option value="weight">{language === 'EN' ? 'Market Weight' : '市值权重'}</option>
                <option value="change">{language === 'EN' ? '% Change' : '涨跌幅'}</option>
                <option value="value">{language === 'EN' ? 'Index Level' : '点位'}</option>
                <option value="return">{language === 'EN' ? '1Y Return' : '1年回报'}</option>
              </select>
            </div>
          </div>

          {/* Column Labels */}
          <div className="px-3.5 py-2 bg-[#e5eeff]/50 flex items-center text-[#74777f] text-[10px] font-bold uppercase tracking-wider border-b border-[#e2e8f0]">
            <div className="w-7/12 flex items-center gap-1 cursor-pointer">
              <span>{language === 'EN' ? 'Index / Constituents' : '指数 / 成分'}</span>
              <span className="material-symbols-outlined text-[12px]">unfold_more</span>
            </div>
            <div className="w-3/12 text-right">{language === 'EN' ? 'Last / Chg' : '最新 / 涨跌'}</div>
            <div className="w-2/12 text-right">{language === 'EN' ? '1Y Ret' : '1年'}</div>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col divide-y divide-[#f1f5f9]">
            {displayedIndices.length === 0 ? (
              <div className="py-8 text-center text-[#74777f] text-[13px]">
                {language === 'EN' ? 'No indices found matching your query.' : '没有找到匹配的指数'}
              </div>
            ) : (
              displayedIndices.map((row, idx) => {
                const isSelected = heroIndex.id === row.id;
                return (
                  <div
                    key={row.id}
                    onClick={() => {
                      setHeroIndexId(row.id);
                      onSelectIndex(row);
                    }}
                    className={`px-3.5 py-3 flex items-center hover:bg-[#eff4ff] transition-colors cursor-pointer ${
                      idx % 2 === 1 ? 'bg-[#f8f9ff]/60' : 'bg-white'
                    } ${isSelected ? 'bg-[#eff4ff]/90' : ''}`}
                  >
                    <div className="w-7/12 min-w-0 pr-2">
                      <div className="text-[13px] font-bold text-[#0b1c30] truncate flex items-center gap-1">
                        <span>{row.name}</span>
                        {row.isBenchmark && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#002244]" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-mono-numbers text-[#74777f] font-medium">
                          {row.ticker}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[#74777f]"></span>
                        <span className="text-[10px] text-[#43474e] font-semibold">
                          {row.constituentsCount} Const.
                        </span>
                      </div>
                    </div>

                    <div className="w-3/12 text-right">
                      <div className="text-[13px] font-mono-numbers font-bold text-[#0b1c30]">
                        {row.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div
                        className={`text-[11px] font-mono-numbers font-semibold ${
                          row.changePct >= 0 ? 'text-[#476800]' : 'text-[#ba1a1a]'
                        }`}
                      >
                        {row.changePct >= 0 ? '+' : ''}
                        {row.changePct.toFixed(2)}%
                      </div>
                    </div>

                    <div className="w-2/12 text-right">
                      <span
                        className={`text-[11px] font-mono-numbers font-bold ${
                          row.oneYearRet >= 0 ? 'text-[#476800]' : 'text-[#ba1a1a]'
                        }`}
                      >
                        {row.oneYearRet >= 0 ? '+' : ''}
                        {row.oneYearRet.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination / View All Toggle */}
          <div className="p-3 bg-[#eff4ff] flex items-center justify-between border-t border-[#e2e8f0]">
            <span className="text-[11px] font-mono-numbers text-[#74777f]">
              {language === 'EN'
                ? `Showing ${displayedIndices.length} of ${filteredIndices.length} Indices`
                : `显示 ${displayedIndices.length} / ${filteredIndices.length} 条指数`}
            </span>
            <button
              onClick={() => setShowAllIndices(!showAllIndices)}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#dce9ff] text-[#002244] text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 shadow-sm active:scale-95"
            >
              <span>{showAllIndices ? (language === 'EN' ? 'Collapse' : '收起') : (language === 'EN' ? 'View All SGX Indices' : '查看全部指数')}</span>
              <span className="material-symbols-outlined text-[14px]">
                {showAllIndices ? 'expand_less' : 'arrow_forward'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Market Insights & Exchange Announcements */}
      <section className="px-4 py-2 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-[#0b1c30]">
            {language === 'EN' ? 'Exchange Intelligence' : '交易所研报与公告'}
          </h3>
          <span
            onClick={onOpenFactsheet}
            className="text-[10px] font-bold text-[#002244] uppercase tracking-wider cursor-pointer hover:underline"
          >
            {language === 'EN' ? 'Archive' : '历史存档'}
          </span>
        </div>

        {/* Announcement Card 1: STI Quarterly Review */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0] flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#002244] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">assignment</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-[#002244] uppercase tracking-wider">
                {language === 'EN' ? 'Quarterly Review' : '季度审议'}
              </span>
              <span className="text-[11px] font-mono-numbers text-[#74777f]">• 2d ago</span>
            </div>
            <h4 className="text-[14px] font-bold text-[#0b1c30] mt-0.5 truncate">
              {language === 'EN' ? 'STI Quarterly Review Updates' : '海峡时报指数季度审核结果'}
            </h4>
            <p className="text-[12px] text-[#43474e] line-clamp-2 mt-1 leading-snug">
              {language === 'EN'
                ? 'Rebalancing results announced for STI and FTSE ST Index Series, effective next month. Reserve list updated.'
                : 'STI及富时海峡时报指数系列公布再平衡审核结果，下月生效。备选名单已同步更新。'}
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={onOpenFactsheet}
                className="text-[#002244] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 hover:underline active:scale-95"
              >
                <span>{language === 'EN' ? 'Download Factsheet' : '查看事实清单'}</span>
                <span className="material-symbols-outlined text-[14px]">download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Announcement Card 2: Ground Rules */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0] flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#b8f649] text-[#131f00] flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-[#476800] uppercase tracking-wider">
              {language === 'EN' ? 'Methodology & Guides' : '编制方法与准则'}
            </span>
            <h4 className="text-[14px] font-bold text-[#0b1c30] mt-0.5 truncate">
              {language === 'EN' ? 'iEdge Index Ground Rules 2026' : 'iEdge 指数编制基本规则 2026'}
            </h4>
            <p className="text-[12px] text-[#43474e] line-clamp-2 mt-1 leading-snug">
              {language === 'EN'
                ? 'Comprehensive calculation methodology, float-adjustment rules, and rebalancing schedule.'
                : '详细计算公式、自由流通量调整规则以及半年度权重再平衡时间表。'}
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={onOpenRulebook}
                className="text-[#002244] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 hover:underline active:scale-95"
              >
                <span>{language === 'EN' ? 'View Rulebook (PDF)' : '阅读规则手册 (PDF)'}</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </button>
            </div>
          </div>
        </div>

        {/* Exchange Newsletter Subscription Banner */}
        <div className="bg-[#002244] rounded-2xl p-4 shadow-sm text-white flex flex-col gap-2 mt-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#b8f649] text-[20px]">mark_email_read</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#b8f649]">
              {language === 'EN' ? 'Official Distribution' : '官方发布通道'}
            </span>
          </div>
          <h3 className="text-[18px] font-bold text-white tracking-tight leading-tight">
            {language === 'EN' ? 'Subscribe to SGX Indices eNewsletter' : '订阅新加坡交易所指数电子简报'}
          </h3>
          <p className="text-[12px] text-[#708ab2] leading-snug">
            {language === 'EN'
              ? 'Receive institutional monthly performance commentaries, index constituent changes, and market research straight to your terminal.'
              : '获取机构级月度回报点评、成分股调整公告以及交易所资深量化分析报告。'}
          </p>

          <form onSubmit={handleSubscribe} className="flex items-center gap-2 mt-2">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder={language === 'EN' ? 'Enter corporate email...' : '输入机构邮箱...'}
              className="flex-1 bg-[#000b1d] text-white placeholder:text-[#74777f] rounded-lg px-3 py-2 text-[12px] focus:outline-none border border-white/10 focus:border-[#b8f649]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#b8f649] text-[#131f00] rounded-lg text-[11px] font-bold uppercase tracking-wider active:scale-95 transition-transform flex-shrink-0"
            >
              {language === 'EN' ? 'Subscribe' : '订阅'}
            </button>
          </form>

          {subscribedToast && (
            <div className="p-2.5 mt-1 bg-[#476800]/40 border border-[#b8f649]/40 rounded-lg text-[#b8f649] text-[11px] flex items-center gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>{language === 'EN' ? 'Subscription confirmed! Welcome to SGX Index Intelligence.' : '订阅成功！欢迎使用新交所指数资讯'}</span>
            </div>
          )}
        </div>
      </section>

      {/* Institutional Regulatory Footnotes & Disclaimer */}
      <footer className="px-4 pt-4 pb-6 flex flex-col gap-2 text-[#74777f] text-[10px] font-bold uppercase tracking-wider">
        <div className="flex items-start gap-1.5">
          <span className="material-symbols-outlined text-[14px] flex-shrink-0 mt-0.5">info</span>
          <p className="leading-relaxed normal-case font-normal text-[11px] text-[#43474e]">
            {language === 'EN'
              ? 'Market data delayed by at least 15 minutes unless otherwise stated. Real-time intraday feeds require licensed subscriber credentials under SGX Data Licensing Agreement.'
              : '除特别注明外，所有行情数据均至少延时15分钟。实时行情传输需在SGX数据授权协议下持有有效订阅凭据。'}
          </p>
        </div>
        <div className="leading-relaxed normal-case font-normal text-[10px] text-[#74777f] mt-1">
          "FTSE®" is a trade mark of the London Stock Exchange Group companies and is used by FTSE International Limited under license. "Straits Times Index" and "STI" are trade marks of Singapore Press Holdings.
        </div>
        <div className="pt-2 flex items-center justify-between text-[#43474e] text-[11px] font-mono-numbers">
          <span>© 2026 Singapore Exchange Limited</span>
          <span>v4.18.2 • Singapore</span>
        </div>
      </footer>
    </div>
  );
};
