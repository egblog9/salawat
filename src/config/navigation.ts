import React from "react";
import {
  CircleDot,
  Volume2,
  Radio,
  BookOpen,
  Share2,
} from "lucide-react";

export interface AppSection {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  badge?: string;
  category: "worship" | "audio" | "knowledge" | "propagation";
}

export const APP_SECTIONS: AppSection[] = [
  {
    id: "tasbeeh",
    label: "المسبحة والصيغ النبوية",
    shortLabel: "المسبحة",
    description: "السبحة الإلكترونية التفاعلية، عداد الأوراد، وصيغ الصلاة على النبي المأثورة",
    icon: "CircleDot",
    category: "worship",
  },
  {
    id: "reminder",
    label: "التذكير الصوتي والإشعارات",
    shortLabel: "التذكير",
    description: "تذكير صوتي دوري بصوت الشيوخ وإشعارات النظام في الخلفية",
    icon: "Volume2",
    badge: "صوت الشيوخ",
    category: "audio",
  },
  {
    id: "sheikhs",
    label: "تلاوات الشيوخ والقراء",
    shortLabel: "التلاوات",
    description: "استوديو الاستماع إلى تسجيلات كبار القراء وأئمة الحرم المكي الشريف",
    icon: "Radio",
    category: "audio",
  },
  {
    id: "virtues",
    label: "فضائل وأحاديث صحيحة",
    shortLabel: "الفضائل",
    description: "أحاديث نبوية شريفة مسندة في فضل الصلاة على الحبيب ﷺ مع الفوائد",
    icon: "BookOpen",
    category: "knowledge",
  },
  {
    id: "more",
    label: "المزيد",
    shortLabel: "المزيد",
    description: "المشاركة كصدقة جارية، بطاقات التذكير، وتثبيت التطبيق والمميزات القادمة",
    icon: "Menu",
    category: "propagation",
  },
];
