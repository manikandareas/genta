import type { DashboardData, HeatmapEntry } from "../types";

function generateMockHeatmap(): HeatmapEntry[] {
  const heatmap: HeatmapEntry[] = [];
  const startDate = new Date("2025-01-01");
  const endDate = new Date("2025-12-31");

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    const isWeekday = dayOfWeek !== 0 && dayOfWeek !== 6;
    const random = Math.random();

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    let count = 0;

    if (isWeekday && random > 0.3) {
      if (random > 0.9) {
        level = 4;
        count = Math.floor(Math.random() * 10) + 16;
      } else if (random > 0.7) {
        level = 3;
        count = Math.floor(Math.random() * 9) + 6;
      } else if (random > 0.5) {
        level = 2;
        count = Math.floor(Math.random() * 5) + 1;
      } else {
        level = 1;
        count = Math.floor(Math.random() * 5) + 1;
      }
    }

    heatmap.push({
      date: currentDate.toISOString().split("T")[0],
      count,
      level,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return heatmap;
}

export const mockDashboardData: DashboardData = {
  user: {
    full_name: "Budi Santoso",
    avatar_url: null,
  },
  notifications: {
    unread_count: 3,
  },
  welcome: {
    full_name: "Budi",
    daily_completed: 12,
    daily_goal: 20,
    streak_days: 15,
  },
  countdown: {
    days_remaining: 45,
    exam_date: "2025-05-12",
    target_ptn: "UI",
    target_score: 680,
  },
  readiness: {
    tps: {
      overall_percentage: 78,
      subtests: {
        PU: {
          percentage: 80,
          predicted_score_low: 680,
          predicted_score_high: 720,
          days_to_ready: null,
        },
        PPU: {
          percentage: 75,
          predicted_score_low: 640,
          predicted_score_high: 680,
          days_to_ready: 12,
        },
        PBM: {
          percentage: 78,
          predicted_score_low: 660,
          predicted_score_high: 700,
          days_to_ready: 8,
        },
        PK: {
          percentage: 79,
          predicted_score_low: 670,
          predicted_score_high: 710,
          days_to_ready: 5,
        },
      },
    },
    literasi: {
      overall_percentage: 65,
      subtests: {
        LBI: {
          percentage: 70,
          predicted_score_low: 620,
          predicted_score_high: 660,
          days_to_ready: 15,
        },
        LBE: {
          percentage: 60,
          predicted_score_low: 580,
          predicted_score_high: 620,
          days_to_ready: 25,
        },
        PM: {
          percentage: 65,
          predicted_score_low: 600,
          predicted_score_high: 640,
          days_to_ready: 20,
        },
      },
    },
    overall: {
      percentage: 72,
      predicted_score: 655,
      target_score: 680,
      gap: -25,
    },
  },
  activity: {
    heatmap: generateMockHeatmap(),
    exam_date: "2025-05-12",
    stats: {
      total_sessions: 156,
      total_questions: 1872,
      avg_per_day: 12,
      active_days: 45,
      overall_accuracy: 72,
      accuracy_change: 5.2,
    },
    selected_year: 2025,
  },
};
