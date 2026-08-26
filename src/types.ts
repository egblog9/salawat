export interface SheikhReciter {
  id: string;
  name: string;
  title: string;
  country: string;
  avatar: string;
  description: string;
}

export interface SheikhAudioTrack {
  id: string;
  sheikhId: string;
  sheikhName: string;
  title: string;
  arabicText: string;
  audioUrl: string;
  duration: string;
  category: "ibrahimiyyah" | "prophetic" | "friday" | "dua" | "healing";
  categoryLabel: string;
  isFeatured?: boolean;
}

export interface SalawatItem {
  id: string;
  title: string;
  category: "ibrahimiyyah" | "short" | "hadith" | "relief" | "friday" | "healing";
  categoryLabel: string;
  arabicText: string;
  meaning: string;
  virtue: string;
  hadithSource?: string;
  recommendedCount: number;
  sheikhTrackId?: string;
}

export interface SiteStats {
  visitorsCount: number;
  totalTasbeehat: number;
  lastUpdated?: string;
}

export interface ReminderCard {
  title: string;
  salawatText: string;
  virtue: string;
  shareText: string;
  tags: string[];
}

