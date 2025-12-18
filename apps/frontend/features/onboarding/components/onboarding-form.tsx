"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "./step-indicator";
import { PTNSelector } from "./ptn-selector";
import { ScoreSlider } from "./score-slider";
import { DatePicker } from "./date-picker";
import { StudyHoursInput } from "./study-hours-input";
import { ONBOARDING_STEPS, DEFAULT_FORM_DATA } from "../mock/mock-data";
import type { OnboardingFormData, OnboardingValidationErrors } from "../types";
import { SCORE_MIN, SCORE_MAX, STUDY_HOURS_MIN, STUDY_HOURS_MAX } from "../types";

interface OnboardingFormProps {
  onSubmit: (data: OnboardingFormData) => Promise<void>;
  isSubmitting?: boolean;
  serverErrors?: OnboardingValidationErrors;
}

export function OnboardingForm({
  onSubmit,
  isSubmitting = false,
  serverErrors,
}: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<OnboardingValidationErrors>({});

  const validateStep1 = (): boolean => {
    const newErrors: OnboardingValidationErrors = {};

    if (!formData.targetPtn) {
      newErrors.targetPtn = "Pilih universitas tujuan";
    }

    if (formData.targetScore < SCORE_MIN || formData.targetScore > SCORE_MAX) {
      newErrors.targetScore = `Skor harus antara ${SCORE_MIN} dan ${SCORE_MAX}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: OnboardingValidationErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.examDate) {
      newErrors.examDate = "Pilih tanggal ujian";
    } else if (formData.examDate <= today) {
      newErrors.examDate = "Tanggal ujian harus di masa depan";
    }

    if (
      formData.studyHoursPerWeek < STUDY_HOURS_MIN ||
      formData.studyHoursPerWeek > STUDY_HOURS_MAX
    ) {
      newErrors.studyHoursPerWeek = `Jam belajar harus antara ${STUDY_HOURS_MIN} dan ${STUDY_HOURS_MAX}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (validateStep2()) {
      await onSubmit(formData);
    }
  };

  const currentStepData = ONBOARDING_STEPS[currentStep - 1];
  const combinedErrors = { ...errors, ...serverErrors };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <StepIndicator steps={ONBOARDING_STEPS} currentStep={currentStep} />
        <CardTitle className="mt-4">{currentStepData.title}</CardTitle>
        <CardDescription>{currentStepData.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentStep === 1 && (
          <>
            <PTNSelector
              value={formData.targetPtn}
              onChange={(value) => setFormData({ ...formData, targetPtn: value })}
              error={combinedErrors.targetPtn}
            />
            <ScoreSlider
              value={formData.targetScore}
              onChange={(value) => setFormData({ ...formData, targetScore: value })}
              error={combinedErrors.targetScore}
            />
          </>
        )}

        {currentStep === 2 && (
          <>
            <DatePicker
              value={formData.examDate}
              onChange={(date) => setFormData({ ...formData, examDate: date! })}
              error={combinedErrors.examDate}
            />
            <StudyHoursInput
              value={formData.studyHoursPerWeek}
              onChange={(value) => setFormData({ ...formData, studyHoursPerWeek: value })}
              error={combinedErrors.studyHoursPerWeek}
            />
          </>
        )}

        <div className="flex gap-3 pt-4">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex-1"
            >
              Kembali
            </Button>
          )}
          {currentStep < ONBOARDING_STEPS.length ? (
            <Button onClick={handleNext} className="flex-1">
              Lanjut
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Menyimpan..." : "Mulai Belajar"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
