import React from "react";
import { X, Heart, Users, Flame, Award, Calendar, Share2 } from "lucide-react";
import { SiteStats } from "../types";

interface StatsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCount: number;
  siteStats: SiteStats;
  streakDays?: number;
  onOpenShareModal?: () => void;
}

export const StatsHistoryModal: React.FC<StatsHistoryModalProps> = ({
  isOpen,
  onClose,
  userCount,
  siteStats,
  streakDays = 7,
  onOpenShareModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#F8F8F5] rounded-t-[34px] sm:rounded-[34px] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h3 className="text-lg font-bold font-tajawal text-stone-800">
              إحصائياتك وأورادك
            </h3>
            <p className="text-xs text-stone-500 font-amiri">
              سجل الصلوات والتسبيحات اليومية
            </p>
          </div>

          <div className="w-9" />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Top Big Stat Card */}
          <div className="bg-gradient-to-br from-[#2F5241] to-[#1E372B] text-white p-5 rounded-[28px] text-center shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-xs font-bold text-emerald-200 font-tajawal mb-1">
                مجموع صلواتك على الحبيب ﷺ
              </span>
              <span className="text-5xl font-black font-tajawal tracking-tight">
                {(userCount ?? 0).toLocaleString()}
              </span>
              <span className="text-xs text-stone-300 mt-2 font-amiri">
                «مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا»
              </span>
            </div>
          </div>

          {/* Grid of 2 Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-xs text-stone-500 font-tajawal">التتابع اليومي المستمر</span>
              <span className="text-xl font-bold font-tajawal text-stone-800 mt-0.5">
                {streakDays} أيام
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs text-stone-500 font-tajawal">صلوات المسلمين معاً</span>
              <span className="text-xl font-bold font-tajawal text-stone-800 mt-0.5">
                {(siteStats?.totalTasbeehat ?? 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Share Streak Banner */}
          {onOpenShareModal && (
            <button
              onClick={onOpenShareModal}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#2F5241] hover:bg-[#254334] text-white font-bold text-xs font-tajawal flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة بطاقة إنجازك كصدقة جارية</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
