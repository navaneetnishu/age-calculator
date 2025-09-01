import { calculateAge, formatAge, isValidDate } from './ageCalculator';

// Test the age calculation utility
describe('Age Calculator Utility', () => {
  test('should calculate age correctly', () => {
    const birthDate = new Date('1990-01-01');
    const targetDate = new Date('2024-01-01');
    const result = calculateAge(birthDate, targetDate);
    
    expect(result.years).toBe(34);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
  });

  test('should format age correctly', () => {
    const age = {
      years: 25,
      months: 6,
      days: 15,
      hours: 12,
      minutes: 30,
      totalDays: 9325,
      totalHours: 223800,
      totalMinutes: 13428000,
    };
    
    expect(formatAge(age)).toBe('25 years, 6 months, 15 days');
  });

  test('should validate date correctly', () => {
    expect(isValidDate('2024-01-01')).toBe(true);
    expect(isValidDate('invalid-date')).toBe(false);
  });
});
