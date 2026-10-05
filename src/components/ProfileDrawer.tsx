import React from 'react';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'EN' | '中文';
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 flex flex-col gap-4 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#002244] text-white flex items-center justify-center font-bold">
              SG
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#0b1c30]">iamssgoh@gmail.com</h3>
              <span className="text-[11px] text-[#476800] font-bold uppercase tracking-wider">
                {language === 'EN' ? 'Institutional Terminal Pass' : '机构终端授权'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#002244]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Credentials details */}
        <div className="flex flex-col gap-2 text-[12px]">
          <div className="bg-[#eff4ff] p-2.5 rounded-xl flex items-center justify-between font-mono-numbers">
            <span className="text-[#74777f]">{language === 'EN' ? 'Datafeed Tier' : '数据权限'}</span>
            <span className="font-bold text-[#002244]">Level 2 Real-Time Streaming</span>
          </div>
          <div className="bg-[#eff4ff] p-2.5 rounded-xl flex items-center justify-between font-mono-numbers">
            <span className="text-[#74777f]">{language === 'EN' ? 'Exchange Member' : '会员机构'}</span>
            <span className="font-bold text-[#002244]">Singapore Direct Market (DMA)</span>
          </div>
          <div className="bg-[#eff4ff] p-2.5 rounded-xl flex items-center justify-between font-mono-numbers">
            <span className="text-[#74777f]">{language === 'EN' ? 'Session Token' : '会话令牌'}</span>
            <span className="font-bold text-[#476800]">SGX-AUTH-ACTIVE</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#002244] text-white rounded-xl text-[12px] font-bold uppercase tracking-wider active:scale-98 transition-transform"
        >
          {language === 'EN' ? 'Close Account Info' : '关闭账户面板'}
        </button>
      </div>
    </div>
  );
};
