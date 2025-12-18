// Practice Mock Data
import type { Question, Session, Attempt, Feedback, Section } from "../types";

// Mock questions for each section
export const mockQuestions: Record<Section, Question[]> = {
  PU: [
    {
      id: "q-pu-001",
      section: "PU",
      subType: "Silogisme",
      text: "Semua mahasiswa adalah pelajar. Semua pelajar memiliki buku. Kesimpulan yang tepat adalah...",
      options: [
        "Semua mahasiswa memiliki buku",
        "Beberapa mahasiswa memiliki buku",
        "Tidak ada mahasiswa yang memiliki buku",
        "Semua yang memiliki buku adalah mahasiswa",
        "Beberapa pelajar adalah mahasiswa",
      ],
      difficultyIrt: 0.5,
      discrimination: 1.2,
      attemptCount: 150,
      correctRate: 0.72,
      avgTimeSeconds: 45,
    },
    {
      id: "q-pu-002",
      section: "PU",
      subType: "Analogi",
      text: "Dokter : Pasien = Guru : ...",
      options: ["Sekolah", "Murid", "Buku", "Kelas", "Pendidikan"],
      difficultyIrt: 0.3,
      discrimination: 1.0,
      attemptCount: 200,
      correctRate: 0.85,
      avgTimeSeconds: 30,
    },
  ],
  PPU: [
    {
      id: "q-ppu-001",
      section: "PPU",
      subType: "Pemahaman Bacaan",
      text: "Berdasarkan teks di atas, apa ide pokok paragraf pertama?",
      options: [
        "Pentingnya pendidikan",
        "Perkembangan teknologi",
        "Dampak globalisasi",
        "Peran pemerintah",
        "Kesejahteraan masyarakat",
      ],
      difficultyIrt: 0.6,
      discrimination: 1.1,
      attemptCount: 120,
      correctRate: 0.68,
      avgTimeSeconds: 60,
    },
  ],
  PBM: [
    {
      id: "q-pbm-001",
      section: "PBM",
      subType: "Kalimat Efektif",
      text: "Kalimat yang paling efektif adalah...",
      options: [
        "Para siswa-siswa sedang belajar di kelas",
        "Siswa sedang belajar di kelas",
        "Para siswa sedang belajar di dalam kelas",
        "Siswa-siswa sedang belajar di kelas",
        "Para siswa belajar di dalam kelas",
      ],
      difficultyIrt: 0.4,
      discrimination: 1.3,
      attemptCount: 180,
      correctRate: 0.75,
      avgTimeSeconds: 40,
    },
  ],
  PK: [
    {
      id: "q-pk-001",
      section: "PK",
      subType: "Aritmatika",
      text: "Jika x + 5 = 12, maka nilai x adalah...",
      options: ["5", "6", "7", "8", "9"],
      difficultyIrt: 0.2,
      discrimination: 0.9,
      attemptCount: 250,
      correctRate: 0.92,
      avgTimeSeconds: 25,
    },
    {
      id: "q-pk-002",
      section: "PK",
      subType: "Persentase",
      text: "20% dari 150 adalah...",
      options: ["25", "30", "35", "40", "45"],
      difficultyIrt: 0.3,
      discrimination: 1.0,
      attemptCount: 220,
      correctRate: 0.88,
      avgTimeSeconds: 30,
    },
  ],
  LBI: [
    {
      id: "q-lbi-001",
      section: "LBI",
      subType: "Ejaan",
      text: "Penulisan yang benar adalah...",
      options: [
        "Mereka pergi ke pasar",
        "Mereka pergi kepasar",
        "Mereka pergi ke-pasar",
        "Mereka pergi dipasar",
        "Mereka pergi di pasar",
      ],
      difficultyIrt: 0.35,
      discrimination: 1.1,
      attemptCount: 190,
      correctRate: 0.78,
      avgTimeSeconds: 35,
    },
  ],
  LBE: [
    {
      id: "q-lbe-001",
      section: "LBE",
      subType: "Grammar",
      text: "Choose the correct sentence:",
      options: [
        "She don't like coffee",
        "She doesn't likes coffee",
        "She doesn't like coffee",
        "She not like coffee",
        "She no like coffee",
      ],
      difficultyIrt: 0.4,
      discrimination: 1.2,
      attemptCount: 160,
      correctRate: 0.82,
      avgTimeSeconds: 28,
    },
  ],
  PM: [
    {
      id: "q-pm-001",
      section: "PM",
      subType: "Aljabar",
      text: "Jika 2x - 3 = 7, maka nilai x adalah...",
      options: ["3", "4", "5", "6", "7"],
      difficultyIrt: 0.45,
      discrimination: 1.15,
      attemptCount: 175,
      correctRate: 0.76,
      avgTimeSeconds: 50,
    },
  ],
};

// Mock session data
export const mockSession: Session = {
  id: "session-001",
  startedAt: new Date().toISOString(),
  endedAt: null,
  durationMinutes: null,
  questionsAttempted: 0,
  questionsCorrect: 0,
  accuracyInSession: null,
  section: "PU",
};

// Mock completed session
export const mockCompletedSession: Session = {
  id: "session-002",
  startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  endedAt: new Date().toISOString(),
  durationMinutes: 30,
  questionsAttempted: 15,
  questionsCorrect: 12,
  accuracyInSession: 0.8,
  section: "PU",
};

// Mock attempt (correct answer)
export const mockCorrectAttempt: Attempt = {
  id: "attempt-001",
  questionId: "q-pu-001",
  selectedAnswer: "A",
  isCorrect: true,
  timeSpentSeconds: 45,
  thetaBefore: 0.5,
  thetaAfter: 0.55,
  thetaChange: 0.05,
  feedbackGenerated: true,
  sessionId: "session-001",
  createdAt: new Date().toISOString(),
  job: null,
};

// Mock attempt (incorrect answer)
export const mockIncorrectAttempt: Attempt = {
  id: "attempt-002",
  questionId: "q-pu-002",
  selectedAnswer: "C",
  isCorrect: false,
  timeSpentSeconds: 30,
  thetaBefore: 0.55,
  thetaAfter: 0.52,
  thetaChange: -0.03,
  feedbackGenerated: true,
  sessionId: "session-001",
  createdAt: new Date().toISOString(),
  job: null,
};

// Mock attempt with pending feedback
export const mockAttemptWithPendingFeedback: Attempt = {
  id: "attempt-003",
  questionId: "q-pk-001",
  selectedAnswer: "C",
  isCorrect: true,
  timeSpentSeconds: 25,
  thetaBefore: 0.52,
  thetaAfter: 0.57,
  thetaChange: 0.05,
  feedbackGenerated: false,
  sessionId: "session-001",
  createdAt: new Date().toISOString(),
  job: {
    jobId: "job-001",
    status: "processing",
    estimatedCompletionSeconds: 5,
    checkStatusUrl: "/api/v1/jobs/job-001/check",
  },
};

// Mock feedback
export const mockFeedback: Feedback = {
  id: "feedback-001",
  feedbackText:
    "Jawaban yang benar adalah A. Berdasarkan silogisme, jika semua mahasiswa adalah pelajar dan semua pelajar memiliki buku, maka dapat disimpulkan bahwa semua mahasiswa memiliki buku. Ini adalah contoh silogisme transitif yang valid.",
  modelUsed: "gpt-4",
  generationTimeMs: 1500,
  isHelpful: null,
};

// Mock feedback (rated helpful)
export const mockHelpfulFeedback: Feedback = {
  ...mockFeedback,
  id: "feedback-002",
  isHelpful: true,
};

// Helper to get a random question for a section
export function getRandomQuestion(section: Section): Question {
  const questions = mockQuestions[section];
  return questions[Math.floor(Math.random() * questions.length)];
}

// Helper to get all questions for a section
export function getQuestionsForSection(section: Section): Question[] {
  return mockQuestions[section];
}
