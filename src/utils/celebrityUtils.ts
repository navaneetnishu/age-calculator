import { Celebrity, CelebrityProfile, CelebrityCategory } from '@/types/celebrity';
import { calculateAge } from '@/utils/ageCalculator';
import { celebrities, categoryLabels, categoryIcons } from '@/data/celebrities';

export function getCelebrityProfile(celebrity: Celebrity): CelebrityProfile {
  const birthDate = new Date(celebrity.birthDate);
  const today = new Date();
  const age = calculateAge(birthDate, today);
  
  // Calculate next birthday
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isBirthdayToday = today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate();
  
  return {
    celebrity,
    age,
    nextBirthday: nextBirthday.toISOString().split('T')[0],
    daysUntilBirthday,
    isBirthdayToday,
  };
}

export function getAllCelebrityProfiles(): CelebrityProfile[] {
  return celebrities.map(getCelebrityProfile);
}

export function getCelebritiesByCategory(category: CelebrityCategory): CelebrityProfile[] {
  return celebrities
    .filter(celebrity => celebrity.category === category)
    .map(getCelebrityProfile);
}

export function getCelebritiesBySearch(query: string): CelebrityProfile[] {
  const lowercaseQuery = query.toLowerCase();
  return celebrities
    .filter(celebrity => 
      celebrity.name.toLowerCase().includes(lowercaseQuery) ||
      celebrity.profession.toLowerCase().includes(lowercaseQuery) ||
      celebrity.nationality.toLowerCase().includes(lowercaseQuery) ||
      celebrity.bio.toLowerCase().includes(lowercaseQuery)
    )
    .map(getCelebrityProfile);
}

export function getBirthdayCelebrities(): CelebrityProfile[] {
  const today = new Date();
  return celebrities
    .filter(celebrity => {
      const birthDate = new Date(celebrity.birthDate);
      return today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate();
    })
    .map(getCelebrityProfile);
}

export function getUpcomingBirthdays(days: number = 30): CelebrityProfile[] {
  const today = new Date();
  const upcoming = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  
  return celebrities
    .filter(celebrity => {
      const birthDate = new Date(celebrity.birthDate);
      const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      
      if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
      }
      
      return nextBirthday <= upcoming;
    })
    .map(getCelebrityProfile)
    .sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday);
}

export function getCelebrityById(id: string): CelebrityProfile | null {
  const celebrity = celebrities.find(c => c.id === id);
  return celebrity ? getCelebrityProfile(celebrity) : null;
}

export function getCategories(): { value: string; label: string; icon: string; count: number }[] {
  const categoryCounts = celebrities.reduce((acc, celebrity) => {
    acc[celebrity.category] = (acc[celebrity.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.keys(categoryLabels).map(category => ({
    value: category,
    label: categoryLabels[category],
    icon: categoryIcons[category],
    count: categoryCounts[category] || 0,
  })).sort((a, b) => b.count - a.count);
}

export function getRandomCelebrities(count: number = 5): CelebrityProfile[] {
  const shuffled = [...celebrities].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(getCelebrityProfile);
}

export function getOldestCelebrities(count: number = 5): CelebrityProfile[] {
  return getAllCelebrityProfiles()
    .sort((a, b) => b.age.years - a.age.years)
    .slice(0, count);
}

export function getYoungestCelebrities(count: number = 5): CelebrityProfile[] {
  return getAllCelebrityProfiles()
    .sort((a, b) => a.age.years - b.age.years)
    .slice(0, count);
}
