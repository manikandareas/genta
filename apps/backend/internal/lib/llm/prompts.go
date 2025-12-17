package llm

import (
	"fmt"
	"strings"
)

// Language represents supported feedback languages
type Language string

const (
	LangIndonesian Language = "id"
	LangEnglish    Language = "en"
)

// FeedbackPromptData contains data for generating feedback
type FeedbackPromptData struct {
	QuestionText   string
	Options        []string
	CorrectAnswer  string
	SelectedAnswer string
	IsCorrect      bool
	Explanation    string
	Section        string
	SubType        string
	Language       Language
}

// SystemPromptFeedback returns the system prompt for feedback generation
func SystemPromptFeedback(lang Language) string {
	if lang == LangEnglish {
		return `You are an expert UTBK (Indonesian university entrance exam) tutor. 
Your role is to provide helpful, encouraging feedback to students after they answer practice questions.

Guidelines:
- Be encouraging and supportive, even for incorrect answers
- Explain WHY the correct answer is correct
- If the student got it wrong, explain their mistake without being harsh
- Keep feedback concise but informative (2-4 sentences)
- Use clear, simple language appropriate for high school students
- Include a brief tip or strategy when relevant

Respond in English.`
	}

	return `Kamu adalah tutor UTBK yang ahli dan berpengalaman.
Tugasmu adalah memberikan feedback yang membantu dan menyemangati siswa setelah mereka menjawab soal latihan.

Panduan:
- Bersikap menyemangati dan suportif, bahkan untuk jawaban yang salah
- Jelaskan MENGAPA jawaban yang benar itu benar
- Jika siswa salah, jelaskan kesalahannya tanpa menyalahkan
- Buat feedback singkat tapi informatif (2-4 kalimat)
- Gunakan bahasa yang jelas dan mudah dipahami siswa SMA
- Sertakan tips atau strategi singkat jika relevan

Jawab dalam Bahasa Indonesia.`
}

// BuildFeedbackPrompt builds the user prompt for feedback generation
func BuildFeedbackPrompt(data FeedbackPromptData) string {
	optionLabels := []string{"A", "B", "C", "D", "E"}
	var optionsText strings.Builder

	for i, opt := range data.Options {
		if i < len(optionLabels) {
			optionsText.WriteString(fmt.Sprintf("%s. %s\n", optionLabels[i], opt))
		}
	}

	correctnessText := "SALAH"
	if data.IsCorrect {
		correctnessText = "BENAR"
	}

	if data.Language == LangEnglish {
		correctnessText = "INCORRECT"
		if data.IsCorrect {
			correctnessText = "CORRECT"
		}
	}

	var prompt strings.Builder

	if data.Language == LangEnglish {
		prompt.WriteString(fmt.Sprintf("Section: %s", data.Section))
		if data.SubType != "" {
			prompt.WriteString(fmt.Sprintf(" (%s)", data.SubType))
		}
		prompt.WriteString("\n\n")
		prompt.WriteString(fmt.Sprintf("Question:\n%s\n\n", data.QuestionText))
		prompt.WriteString(fmt.Sprintf("Options:\n%s\n", optionsText.String()))
		prompt.WriteString(fmt.Sprintf("Correct Answer: %s\n", data.CorrectAnswer))
		prompt.WriteString(fmt.Sprintf("Student's Answer: %s (%s)\n", data.SelectedAnswer, correctnessText))

		if data.Explanation != "" {
			prompt.WriteString(fmt.Sprintf("\nReference Explanation: %s\n", data.Explanation))
		}

		prompt.WriteString("\nProvide brief, helpful feedback for the student.")
	} else {
		prompt.WriteString(fmt.Sprintf("Subtes: %s", data.Section))
		if data.SubType != "" {
			prompt.WriteString(fmt.Sprintf(" (%s)", data.SubType))
		}
		prompt.WriteString("\n\n")
		prompt.WriteString(fmt.Sprintf("Soal:\n%s\n\n", data.QuestionText))
		prompt.WriteString(fmt.Sprintf("Pilihan:\n%s\n", optionsText.String()))
		prompt.WriteString(fmt.Sprintf("Jawaban Benar: %s\n", data.CorrectAnswer))
		prompt.WriteString(fmt.Sprintf("Jawaban Siswa: %s (%s)\n", data.SelectedAnswer, correctnessText))

		if data.Explanation != "" {
			prompt.WriteString(fmt.Sprintf("\nPenjelasan Referensi: %s\n", data.Explanation))
		}

		prompt.WriteString("\nBerikan feedback singkat dan membantu untuk siswa.")
	}

	return prompt.String()
}

// PromptVersion returns the current version of the prompt template
func PromptVersion() string {
	return "v1.0.0"
}
