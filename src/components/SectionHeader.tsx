import React from "react";
import { APP_SECTIONS, AppSection } from "../config/navigation";
import { Menu } from "lucide-react";

interface SectionHeaderProps {
  activeTab: string;
  badge?: string;
  extraActions?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  activeTab,
  badge,
  extraActions,
}) => {
  const section: AppSection | undefined = APP_SECTIONS.find((s) => s.id === activeTab);

  if (!section) return null;

  return (
    <div className="bg-stone-900/70 border border-stone-800/80 rounded-3xl p-4 sm:p-5 shadow-sm backdrop-blur flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-emerald-600/30 flex items-center justify-center text-2xl text-amber-300 shadow-inner flex-shrink-0">
          {section.icon === "menu" ? (
            <Menu className="w-6 h-6 stroke-[2.2]" />
          ) : (
            section.icon
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold font-tajawal text-stone-100">
              {section.label}
            </h2>
            {(badge || section.badge) && (
              <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {badge || section.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-400 mt-0.5 font-tajawal">
            {section.description}
          </p>
        </div>
      </div>

      {extraActions && (
        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800/60 w-full sm:w-auto justify-end">
          {extraActions}
        </div>
      )}
    </div>
  );
};
