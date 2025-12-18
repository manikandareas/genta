// Readiness Mock Data
import type { SectionDetailResponse } from "@genta/zod";
import type { Section } from "../types";

// Generate accuracy trend for the last 30 days
function generateAccuracyTrend(baseAccuracy: number): SectionDetailResponse["accuracy_trend"] {
  const trend: NonNullable<SectionDetailResponse["accuracy_trend"]> = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Add some variance to the accuracy
    const variance = (Math.random() - 0.5) * 20;
    const accuracy = Math.max(0, Math.min(100, baseAccuracy + variance - (29 - i) * 0.3));

    trend.push({
      date: date.toISOString().split("T")[0],
      accuracy: Math.round(accuracy * 10) / 10,
      attempts: Math.floor(Math.random() * 15) + 5,
    });
  }

  return trend;
}

// Mock section detail data
export const mockSectionDetails: Record<Section, SectionDetailResponse> = {
  PU: {
    section: "PU",
    overall_accuracy: 72.5,
    recent_accuracy: 78.3,
    readiness_percentage: 68,
    current_theta: 0.45,
    target_theta: 1.2,
    predicted_score_low: 620,
    predicted_score_high: 680,
    days_to_ready: 21,
    ready_by_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    total_attempts: 245,
    total_correct: 178,
    improvement_rate_per_week: 2.3,
    avg_time_seconds: 85,
    last_practiced: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    subtype_breakdown: [
      {
        sub_type: "Analogi",
        total_attempts: 65,
        correct_count: 52,
        accuracy: 80.0,
        is_weak_area: false,
      },
      {
        sub_type: "Silogisme",
        total_attempts: 58,
        correct_count: 41,
        accuracy: 70.7,
        is_weak_area: false,
      },
      {
        sub_type: "Penalaran Analitis",
        total_attempts: 72,
        correct_count: 48,
        accuracy: 66.7,
        is_weak_area: true,
      },
      {
        sub_type: "Penalaran Logis",
        total_attempts: 50,
        correct_count: 37,
        accuracy: 74.0,
        is_weak_area: false,
      },
    ],
    accuracy_trend: generateAccuracyTrend(72.5),
    next_steps: {
      is_ready: false,
      message: "Focus on Penalaran Analitis to improve your overall score",
      estimated_completion_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      suggested_daily_practice: 15,
    },
  },
  PPU: {
    section: "PPU",
    overall_accuracy: 65.2,
    recent_accuracy: 70.1,
    readiness_percentage: 58,
    current_theta: 0.25,
    target_theta: 1.2,
    predicted_score_low: 580,
    predicted_score_high: 640,
    days_to_ready: 35,
    ready_by_date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    total_attempts: 189,
    total_correct: 123,
    improvement_rate_per_week: 1.8,
    avg_time_seconds: 92,
    last_practiced: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    subtype_breakdown: [
      {
        sub_type: "Pemahaman Wacana",
        total_attempts: 55,
        correct_count: 38,
        accuracy: 69.1,
        is_weak_area: false,
      },
      {
        sub_type: "Kosakata",
        total_attempts: 48,
        correct_count: 35,
        accuracy: 72.9,
        is_weak_area: false,
      },
      {
        sub_type: "Pengetahuan Umum",
        total_attempts: 86,
        correct_count: 50,
        accuracy: 58.1,
        is_weak_area: true,
      },
    ],
    accuracy_trend: generateAccuracyTrend(65.2),
    next_steps: {
      is_ready: false,
      message: "Strengthen your Pengetahuan Umum knowledge",
      estimated_completion_date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
      suggested_daily_practice: 20,
    },
  },
  PBM: {
    section: "PBM",
    overall_accuracy: 78.9,
    recent_accuracy: 82.5,
    readiness_percentage: 76,
    current_theta: 0.85,
    target_theta: 1.2,
    predicted_score_low: 660,
    predicted_score_high: 720,
    days_to_ready: 12,
    ready_by_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    total_attempts: 312,
    total_correct: 246,
    improvement_rate_per_week: 3.1,
    avg_time_seconds: 78,
    last_practiced: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    subtype_breakdown: [
      {
        sub_type: "Pemahaman Bacaan",
        total_attempts: 120,
        correct_count: 98,
        accuracy: 81.7,
        is_weak_area: false,
      },
      {
        sub_type: "Menulis",
        total_attempts: 95,
        correct_count: 78,
        accuracy: 82.1,
        is_weak_area: false,
      },
      {
        sub_type: "Tata Bahasa",
        total_attempts: 97,
        correct_count: 70,
        accuracy: 72.2,
        is_weak_area: true,
      },
    ],
    accuracy_trend: generateAccuracyTrend(78.9),
    next_steps: {
      is_ready: true,
      message: "Great progress! You're almost ready for this section",
      estimated_completion_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      suggested_daily_practice: 10,
    },
  },
  PK: {
    section: "PK",
    overall_accuracy: 70.3,
    recent_accuracy: 74.8,
    readiness_percentage: 62,
    current_theta: 0.35,
    target_theta: 1.2,
    predicted_score_low: 600,
    predicted_score_high: 660,
    days_to_ready: 28,
    ready_by_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    total_attempts: 267,
    total_correct: 188,
    improvement_rate_per_week: 2.0,
    avg_time_seconds: 95,
    last_practiced: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    subtype_breakdown: [
      {
        sub_type: "Aritmatika",
        total_attempts: 85,
        correct_count: 68,
        accuracy: 80.0,
        is_weak_area: false,
      },
      {
        sub_type: "Aljabar",
        total_attempts: 72,
        correct_count: 48,
        accuracy: 66.7,
        is_weak_area: true,
      },
      {
        sub_type: "Geometri",
        total_attempts: 65,
        correct_count: 42,
        accuracy: 64.6,
        is_weak_area: true,
      },
      {
        sub_type: "Statistika",
        total_attempts: 45,
        correct_count: 30,
        accuracy: 66.7,
        is_weak_area: true,
      },
    ],
    accuracy_trend: generateAccuracyTrend(70.3),
    next_steps: {
      is_ready: false,
      message: "Focus on Aljabar and Geometri to boost your score",
      estimated_completion_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      suggested_daily_practice: 18,
    },
  },
  LBI: {
    section: "LBI",
    overall_accuracy: 82.1,
    recent_accuracy: 85.6,
    readiness_percentage: 80,
    current_theta: 1.05,
    target_theta: 1.2,
    predicted_score_low: 680,
    predicted_score_high: 740,
    days_to_ready: 7,
    ready_by_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    total_attempts: 198,
    total_correct: 163,
    improvement_rate_per_week: 2.8,
    avg_time_seconds: 72,
    last_practiced: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    subtype_breakdown: [
      {
        sub_type: "Pemahaman Teks",
        total_attempts: 78,
        correct_count: 68,
        accuracy: 87.2,
        is_weak_area: false,
      },
      {
        sub_type: "Kaidah Bahasa",
        total_attempts: 65,
        correct_count: 52,
        accuracy: 80.0,
        is_weak_area: false,
      },
      {
        sub_type: "Penulisan",
        total_attempts: 55,
        correct_count: 43,
        accuracy: 78.2,
        is_weak_area: false,
      },
    ],
    accuracy_trend: generateAccuracyTrend(82.1),
    next_steps: {
      is_ready: true,
      message: "Excellent! You're ready for this section. Keep practicing to maintain your level",
      estimated_completion_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      suggested_daily_practice: 8,
    },
  },
  LBE: {
    section: "LBE",
    overall_accuracy: 68.4,
    recent_accuracy: 72.9,
    readiness_percentage: 55,
    current_theta: 0.15,
    target_theta: 1.2,
    predicted_score_low: 560,
    predicted_score_high: 620,
    days_to_ready: 42,
    ready_by_date: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString(),
    total_attempts: 156,
    total_correct: 107,
    improvement_rate_per_week: 1.5,
    avg_time_seconds: 88,
    last_practiced: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    subtype_breakdown: [
      {
        sub_type: "Reading Comprehension",
        total_attempts: 62,
        correct_count: 45,
        accuracy: 72.6,
        is_weak_area: false,
      },
      {
        sub_type: "Grammar",
        total_attempts: 48,
        correct_count: 30,
        accuracy: 62.5,
        is_weak_area: true,
      },
      {
        sub_type: "Vocabulary",
        total_attempts: 46,
        correct_count: 32,
        accuracy: 69.6,
        is_weak_area: false,
      },
    ],
    accuracy_trend: generateAccuracyTrend(68.4),
    next_steps: {
      is_ready: false,
      message: "Work on Grammar fundamentals to improve your English literacy",
      estimated_completion_date: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString(),
      suggested_daily_practice: 22,
    },
  },
  PM: {
    section: "PM",
    overall_accuracy: 75.6,
    recent_accuracy: 79.2,
    readiness_percentage: 70,
    current_theta: 0.65,
    target_theta: 1.2,
    predicted_score_low: 640,
    predicted_score_high: 700,
    days_to_ready: 18,
    ready_by_date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    total_attempts: 234,
    total_correct: 177,
    improvement_rate_per_week: 2.5,
    avg_time_seconds: 102,
    last_practiced: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    subtype_breakdown: [
      {
        sub_type: "Logika Matematika",
        total_attempts: 78,
        correct_count: 62,
        accuracy: 79.5,
        is_weak_area: false,
      },
      {
        sub_type: "Pola Bilangan",
        total_attempts: 65,
        correct_count: 52,
        accuracy: 80.0,
        is_weak_area: false,
      },
      {
        sub_type: "Persamaan",
        total_attempts: 52,
        correct_count: 35,
        accuracy: 67.3,
        is_weak_area: true,
      },
      {
        sub_type: "Peluang",
        total_attempts: 39,
        correct_count: 28,
        accuracy: 71.8,
        is_weak_area: false,
      },
    ],
    accuracy_trend: generateAccuracyTrend(75.6),
    next_steps: {
      is_ready: false,
      message: "Practice more Persamaan problems to reach your target",
      estimated_completion_date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
      suggested_daily_practice: 12,
    },
  },
};

// Helper to get mock data for a section
export function getMockSectionDetail(section: Section): SectionDetailResponse {
  return mockSectionDetails[section];
}
