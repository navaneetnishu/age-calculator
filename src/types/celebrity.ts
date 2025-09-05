export interface Celebrity {
  id: string;
  name: string;
  birthDate: string;
  category: CelebrityCategory;
  profession: string;
  nationality: string;
  bio: string;
  zodiacSign?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
  achievements?: string[];
  isActive: boolean;
}

export type CelebrityCategory = 
  | 'actor'
  | 'actress'
  | 'singer'
  | 'musician'
  | 'sportsman'
  | 'sportswoman'
  | 'internet-celebrity'
  | 'dancer'
  | 'comedian'
  | 'model'
  | 'influencer'
  | 'youtuber'
  | 'streamer'
  | 'politician'
  | 'business'
  | 'entrepreneur'
  | 'scientist'
  | 'writer'
  | 'director'
  | 'producer';

export interface CelebrityProfile {
  celebrity: Celebrity;
  age: AgeResult;
  nextBirthday: string;
  daysUntilBirthday: number;
  isBirthdayToday: boolean;
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
}
