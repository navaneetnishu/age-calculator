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

export function calculateAge(birthDate: Date, targetDate: Date = new Date()): AgeResult {
  const birth = new Date(birthDate);
  const target = new Date(targetDate);
  
  // Ensure we're working with dates, not times
  birth.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  
  // Calculate total difference in milliseconds
  const totalDiff = target.getTime() - birth.getTime();
  const totalDays = Math.floor(totalDiff / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(totalDiff / (1000 * 60 * 60));
  const totalMinutes = Math.floor(totalDiff / (1000 * 60));
  
  // Calculate years
  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();
  
  // Adjust for negative months or days
  if (days < 0) {
    const lastMonth = new Date(target.getFullYear(), target.getMonth() - 1, birth.getDate());
    if (lastMonth > target) {
      lastMonth.setMonth(lastMonth.getMonth() - 1);
    }
    days = Math.floor((target.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24));
    months--;
  }
  
  if (months < 0) {
    months += 12;
    years--;
  }
  
  // Calculate hours and minutes from the current time
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  return {
    years,
    months,
    days,
    hours,
    minutes,
    totalDays,
    totalHours,
    totalMinutes,
  };
}

export function formatAge(age: AgeResult): string {
  const parts: string[] = [];
  
  if (age.years > 0) {
    parts.push(`${age.years} year${age.years !== 1 ? 's' : ''}`);
  }
  if (age.months > 0) {
    parts.push(`${age.months} month${age.months !== 1 ? 's' : ''}`);
  }
  if (age.days > 0) {
    parts.push(`${age.days} day${age.days !== 1 ? 's' : ''}`);
  }
  
  return parts.join(', ') || 'Less than a day';
}

export function isValidDate(date: string): boolean {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}
