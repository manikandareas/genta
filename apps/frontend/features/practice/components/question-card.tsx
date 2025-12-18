"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Question } from "../types";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
}

export function QuestionCard({ question, questionNumber }: QuestionCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Soal {questionNumber}</CardTitle>
          {question.subType && (
            <Badge variant="outline" className="text-xs">
              {question.subType}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: question.text }}
        />
      </CardContent>
    </Card>
  );
}
