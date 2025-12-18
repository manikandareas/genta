// Analytics Mock Data
import type { ProgressResponse } from "@genta/zod";

// Generate dates for the last N days
function generateDates(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
}

// Generate mock accuracy trend data
function generateAccuracyTrend(days: number) {
  const dates = generateDates(days);
  return dates.map((date, index) => ({
    date,
    accuracy: Math.min(100, 55 + Math.random() * 30 + index * 0.5),
    attempts: Math.floor(5 + Math.random() * 15),
  }));
}

// Mock section breakdown data for all 7 subtests
export const mockSectionBreakdown = [
  {
    section: "PU",
    section_name: "Penalaran Umum",
    attempts: 145,
    correct: 98,
    accuracy: 67.6,
    avg_time_seconds: 45,
  },
  {
    section: "PPU",
    section_name: "Pengetahuan & Pemahaman Umum",
    attempts: 132,
    correct: 85,
    accuracy: 64.4,
    avg_time_seconds: 52,
  },
  {
    section: "PBM",
    section_name: "Pemahaman Bacaan & Menulis",
    attempts: 118,
    correct: 82,
    accuracy: 69.5,
    avg_time_seconds: 68,
  },
  {
    section: "PK",
    section_name: "Pengetahuan Kuantitatif",
    attempts: 156,
    correct: 112,
    accuracy: 71.8,
    avg_time_seconds: 58,
  },
  {
    section: "LBI",
    section_name: "Literasi Bahasa Indonesia",
    attempts: 98,
    correct: 72,
    accuracy: 73.5,
    avg_time_seconds: 42,
  },
  {
    section: "LBE",
    section_name: "Literasi Bahasa Inggris",
    attempts: 87,
    correct: 58,
    accuracy: 66.7,
    avg_time_seconds: 55,
  },
  {
    section: "PM",
    section_name: "Penalaran Matematika",
    attempts: 124,
    correct: 89,
    accuracy: 71.8,
    avg_time_seconds: 72,
  },
];

// Mock progress data for different time ranges
export function getMockProgressData(days: number = 7): ProgressResponse {
  const totalAttempts = mockSectionBreakdown.reduce((sum, s) => sum + s.attempts, 0);
  const totalCorrect = mockSectionBreakdown.reduce((sum, s) => sum + s.correct, 0);

  return {
    period_days: days,
    total_questions_attempted: totalAttempts,
    total_correct: totalCorrect,
    average_accuracy: (totalCorrect / totalAttempts) * 100,
    accuracy_trend: generateAccuracyTrend(days),
    section_breakdown: mockSectionBreakdown,
    improvement_this_week: 4.2,
  };
}

// Pre-generated mock data for common time ranges
export const mockProgressData7Days = getMockProgressData(7);
export const mockProgressData30Days = getMockProgressData(30);
export const mockProgressData90Days = getMockProgressData(90);
