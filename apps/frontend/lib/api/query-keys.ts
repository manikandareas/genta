/**
 * Centralized query key constants for React Query
 *
 * Using a factory pattern for type-safe, consistent query keys
 * that support proper cache invalidation and prefetching.
 */

export const queryKeys = {
  // User queries
  user: {
    all: ["user"] as const,
    me: () => [...queryKeys.user.all, "me"] as const,
    profile: (userId: string) => [...queryKeys.user.all, "profile", userId] as const,
  },

  // Readiness queries
  readiness: {
    all: ["readiness"] as const,
    overview: () => [...queryKeys.readiness.all, "overview"] as const,
    section: (section: string) => [...queryKeys.readiness.all, "section", section] as const,
  },

  // Session queries
  session: {
    all: ["session"] as const,
    detail: (sessionId: string) => [...queryKeys.session.all, "detail", sessionId] as const,
    list: () => [...queryKeys.session.all, "list"] as const,
  },

  // Question queries
  question: {
    all: ["question"] as const,
    next: (section: string) => [...queryKeys.question.all, "next", section] as const,
    detail: (questionId: string) => [...queryKeys.question.all, "detail", questionId] as const,
  },

  // Attempt queries
  attempt: {
    all: ["attempt"] as const,
    detail: (attemptId: string) => [...queryKeys.attempt.all, "detail", attemptId] as const,
    bySession: (sessionId: string) => [...queryKeys.attempt.all, "session", sessionId] as const,
  },

  // Analytics queries
  analytics: {
    all: ["analytics"] as const,
    progress: (days: number) => [...queryKeys.analytics.all, "progress", days] as const,
    heatmap: () => [...queryKeys.analytics.all, "heatmap"] as const,
  },

  // Job queries (for polling feedback generation)
  job: {
    all: ["job"] as const,
    status: (jobId: string) => [...queryKeys.job.all, "status", jobId] as const,
  },
} as const;

/**
 * Type helper to extract query key types
 */
export type QueryKeys = typeof queryKeys;
