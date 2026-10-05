/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { IndicesView } from './components/IndicesView';
import { MarketDataView } from './components/MarketDataView';
import { SecuritiesView } from './components/SecuritiesView';
import { DerivativesView } from './components/DerivativesView';
import { MoreView } from './components/MoreView';
import { ConstituentsModal } from './components/ConstituentsModal';
import { SecurityQuoteModal } from './components/SecurityQuoteModal';
import { FactsheetModal } from './components/FactsheetModal';
import { RulebookModal } from './components/RulebookModal';
import { FilterBottomSheet } from './components/FilterBottomSheet';
import { MenuDrawer } from './components/MenuDrawer';
import { ProfileDrawer } from './components/ProfileDrawer';
import { SGXIndex, SecurityStock, DerivativeContract } from './types';
import { SGX_INDICES } from './data/sgxData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('indices');
  const [language, setLanguage] = useState<'EN' | '中文'>('EN');
  const [bookmarkedIndices, setBookmarkedIndices] = useState<string[]>(['sti']);

  // Modals & drawers state
  const [selectedConstituentIndex, setSelectedConstituentIndex] = useState<SGXIndex | null>(null);
  const [selectedSecurity, setSelectedSecurity] = useState<SecurityStock | null>(null);
  const [isFactsheetOpen, setIsFactsheetOpen] = useState<boolean>(false);
  const [isRulebookOpen, setIsRulebookOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Filter state in BottomSheet
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'weight' | 'change' | 'value' | 'return'>('weight');

  const toggleBookmark = (id: string) => {
    setBookmarkedIndices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'EN' ? '中文' : 'EN'));
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans relative selection:bg-[#b8f649] selection:text-[#131f00]">
      {/* Fixed Institutional Header */}
      <Header
        activeTab={activeTab}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenSearch={() => {
          setActiveTab('indices');
          const input = document.getElementById('index-search-input');
          if (input) input.focus();
        }}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area (padded for fixed header and bottom nav) */}
      <main className="flex-1 w-full max-w-lg mx-auto pt-[92px] pb-20">
        {activeTab === 'indices' && (
          <IndicesView
            language={language}
            onSelectIndex={(index) => setSelectedConstituentIndex(index)}
            onOpenFactsheet={() => setIsFactsheetOpen(true)}
            onOpenRulebook={() => setIsRulebookOpen(true)}
            onOpenFilter={() => setIsFilterOpen(true)}
            bookmarkedIndices={bookmarkedIndices}
            onToggleBookmark={toggleBookmark}
          />
        )}

        {activeTab === 'market-data' && (
          <MarketDataView
            language={language}
            onSelectSecurity={(sec) => setSelectedSecurity(sec)}
          />
        )}

        {activeTab === 'securities' && (
          <SecuritiesView
            language={language}
            onSelectSecurity={(sec) => setSelectedSecurity(sec)}
          />
        )}

        {activeTab === 'derivatives' && (
          <DerivativesView
            language={language}
            onSelectDerivative={(_contract) => {
              // Can show contract details or toast
            }}
          />
        )}

        {activeTab === 'more-services' && (
          <MoreView
            language={language}
            onToggleLanguage={handleToggleLanguage}
            bookmarkedIndices={bookmarkedIndices}
            onSelectIndex={(idx) => {
              setActiveTab('indices');
              setSelectedConstituentIndex(idx);
            }}
            onOpenFactsheet={() => setIsFactsheetOpen(true)}
            onOpenRulebook={() => setIsRulebookOpen(true)}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
      />

      {/* Interactive Overlays & Modals */}
      <ConstituentsModal
        index={selectedConstituentIndex}
        onClose={() => setSelectedConstituentIndex(null)}
        language={language}
      />

      <SecurityQuoteModal
        stock={selectedSecurity}
        onClose={() => setSelectedSecurity(null)}
        language={language}
      />

      {isFactsheetOpen && (
        <FactsheetModal
          onClose={() => setIsFactsheetOpen(false)}
          language={language}
        />
      )}

      {isRulebookOpen && (
        <RulebookModal
          onClose={() => setIsRulebookOpen(false)}
          language={language}
        />
      )}

      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCategory={filterCategory}
        onSelectCategory={(cat) => setFilterCategory(cat)}
        sortBy={sortBy}
        onSelectSortBy={(sort) => setSortBy(sort)}
        language={language}
      />

      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        language={language}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenFactsheet={() => setIsFactsheetOpen(true)}
        onOpenRulebook={() => setIsRulebookOpen(true)}
      />

      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        language={language}
      />
    </div>
  );
}
