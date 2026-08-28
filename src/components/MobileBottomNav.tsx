import React from "react";
import { APP_SECTIONS } from "../config/navigation";
import { Menu } from "lucide-react";

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <nav
      aria-label="التنقل الرئيسي للهاتف"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-xl border-t border-emerald-900/40 shadow-2xl safe-area-inset-bottom"
    >
      <div className="flex items-center justify-around px-1 py-1.5 max-w-lg mx-auto">
        {APP_SECTIONS.map((section) => {
          const isActive = activeTab === section.id;
          return (
            <button
              key={section.id}
              id={`mobile-nav-${section.id}`}
              onClick={() => {
                setActiveTab(section.id);
                // Smooth scroll to top on tab switch
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 cursor-pointer relative min-h-[50px] ${
                isActive
                  ? "text-amber-300 font-bold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              {/* Active Indicator Glow / Pill */}
              {isActive && (
                <span className="absolute inset-x-2 inset-y-1 bg-emerald-900/50 border border-emerald-500/40 rounded-xl -z-10 animate-in fade-in zoom-in-95 duration-150" />
              )}

              <span className="text-lg leading-none mb-1 select-none flex items-center justify-center h-5">
                {section.icon === "menu" ? (
                  <Menu className="w-5 h-5 stroke-[2.2]" />
                ) : (
                  section.icon
                )}
              </span>
              <span className="text-[11px] font-tajawal tracking-tight whitespace-nowrap leading-none">
                {section.shortLabel}
              </span>

              {/* Optional tiny notification dot for special sections */}
              {section.badge && !isActive && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
