"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import {
  SessionHeader,
  QuestionCard,
  AnswerOptions,
  SubmitButton,
  ResultDisplay,
  FeedbackPanel,
  SessionSummary,
} from "@/features/practice/components";
import {
  useSession,
  useNextQuestion,
  useAttempt,
  useFeedbackRating,
  useJobStatus,
} from "@/features/practice/hooks";
import type { Section, Answer, Feedback, SessionSummaryData } from "@/features/practice/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default function PracticeSessionPage({ params }: PageProps) {
  const { sessionId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const section = (searchParams.get("section") as Section) || "PU";

  // Hooks
  const { endSession, isEnding, getSession } = useSession();
  const {
    question,
    isLoading: isLoadingQuestion,
    fetchNextQuestion,
    clearQuestion,
  } = useNextQuestion();
  const {
    attempt,
    correctAnswer,
    questionExplanation,
    feedback: attemptFeedback,
    isSubmitting,
    submitAttempt,
    getAttemptDetail,
    clearAttempt,
  } = useAttempt();
  const { isRating, rateFeedback } = useFeedbackRating();
  const { status: jobStatus, feedback: jobFeedback, startPolling, stopPolling } = useJobStatus();

  // Local state
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [localFeedback, setLocalFeedback] = useState<Feedback | null>(null);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<SessionSummaryData | null>(null);

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);

  // Combine feedback from attempt detail and job polling
  const feedback = localFeedback || attemptFeedback || jobFeedback;

  // Initialize session and fetch first question
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const init = async () => {
      await getSession(sessionId);
      await fetchNextQuestion(section);
      setQuestionStartTime(Date.now());
    };
    init();
  }, [sessionId, section, getSession, fetchNextQuestion]);

  // Timer effect
  useEffect(() => {
    if (sessionEnded) return;

    timerRef.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionEnded]);

  // Handle job feedback completion
  useEffect(() => {
    if (jobStatus === "completed" && jobFeedback) {
      setLocalFeedback(jobFeedback);
    }
  }, [jobStatus, jobFeedback]);

  const handleAnswerSelect = (answer: Answer) => {
    if (!showResult) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || !question) return;

    const timeSpent = Math.max(
      1,
      Math.min(600, Math.floor((Date.now() - questionStartTime) / 1000)),
    );

    const result = await submitAttempt({
      questionId: question.id,
      selectedAnswer,
      timeSpentSeconds: timeSpent,
      sessionId,
    });

    if (result) {
      setShowResult(true);
      setQuestionsAttempted((prev) => prev + 1);
      if (result.isCorrect) {
        setQuestionsCorrect((prev) => prev + 1);
      }

      // Get attempt detail to get correct answer and explanation
      await getAttemptDetail(result.id);

      // Start polling for feedback if job is pending
      if (result.job && result.job.status === "processing") {
        startPolling(result.job.jobId);
      }
    }
  };

  const handleNext = async () => {
    // Reset state for next question
    setSelectedAnswer(null);
    setShowResult(false);
    setLocalFeedback(null);
    clearAttempt();
    clearQuestion();
    stopPolling();

    // Fetch next question
    await fetchNextQuestion(section);
    setQuestionStartTime(Date.now());
  };

  const handleEndSession = useCallback(async () => {
    setShowEndDialog(false);
    const endedSession = await endSession(sessionId);
    if (endedSession) {
      setSessionEnded(true);
      setSessionSummary({
        sessionId: endedSession.id,
        section: endedSession.section,
        totalQuestions: endedSession.questionsAttempted,
        correctAnswers: endedSession.questionsCorrect,
        accuracy: endedSession.accuracyInSession ?? 0,
        durationMinutes: endedSession.durationMinutes ?? Math.floor(timeElapsed / 60),
        thetaChange: null, // Would need to calculate from attempts
      });
    }
  }, [endSession, sessionId, timeElapsed]);

  const handleRateFeedback = async (isHelpful: boolean) => {
    if (!attempt) return;
    const success = await rateFeedback(attempt.id, isHelpful);
    if (success && feedback) {
      setLocalFeedback({ ...feedback, isHelpful });
    }
  };

  const handlePracticeAgain = () => {
    router.push("/practice");
  };

  // Show session summary if ended
  if (sessionEnded && sessionSummary) {
    return <SessionSummary summary={sessionSummary} onPracticeAgain={handlePracticeAgain} />;
  }

  // Loading state
  if (isLoadingQuestion && !question) {
    return (
      <div className="min-h-screen bg-background">
        <SessionHeader
          section={section}
          questionsAttempted={questionsAttempted}
          timeElapsed={timeElapsed}
          onEndSession={() => setShowEndDialog(true)}
          isEnding={isEnding}
        />
        <div className="mx-auto max-w-4xl space-y-4 p-4">
          <Card>
            <CardContent className="space-y-4 py-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </CardContent>
          </Card>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SessionHeader
        section={section}
        questionsAttempted={questionsAttempted}
        timeElapsed={timeElapsed}
        onEndSession={() => setShowEndDialog(true)}
        isEnding={isEnding}
      />

      <div className="mx-auto max-w-4xl space-y-4 p-4">
        {question ? (
          <>
            <QuestionCard question={question} questionNumber={questionsAttempted + 1} />

            <AnswerOptions
              options={question.options}
              selectedAnswer={selectedAnswer}
              correctAnswer={correctAnswer}
              showResult={showResult}
              onSelect={handleAnswerSelect}
              disabled={isSubmitting}
            />

            {showResult && attempt && (
              <ResultDisplay isCorrect={attempt.isCorrect} thetaChange={attempt.thetaChange} />
            )}

            {showResult && (
              <FeedbackPanel
                feedback={feedback}
                questionExplanation={questionExplanation}
                isLoading={jobStatus === "polling"}
                onRate={handleRateFeedback}
                isRating={isRating}
              />
            )}

            <div className="flex justify-end pt-4">
              <SubmitButton
                onSubmit={handleSubmit}
                onNext={handleNext}
                onFinish={handleEndSession}
                isSubmitting={isSubmitting}
                showResult={showResult}
                hasSelectedAnswer={selectedAnswer !== null}
                questionsAttempted={questionsAttempted}
                maxQuestions={20}
              />
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Tidak ada soal tersedia untuk subtes ini.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* End Session Dialog */}
      <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Akhiri Sesi?</AlertDialogTitle>
            <AlertDialogDescription>
              Kamu sudah menjawab {questionsAttempted} soal dengan {questionsCorrect} jawaban benar.
              Apakah kamu yakin ingin mengakhiri sesi latihan ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Lanjutkan Latihan</AlertDialogCancel>
            <AlertDialogAction onClick={handleEndSession}>Akhiri Sesi</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
