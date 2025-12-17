package analytics

import "time"

// DailyAccuracy represents accuracy data for a single day
type DailyAccuracy struct {
	Date     time.Time `json:"date" db:"date"`
	Accuracy float64   `json:"accuracy" db:"accuracy"`
	Attempts int       `json:"attempts" db:"attempts"`
}

// SectionBreakdown represents accuracy breakdown for a specific section
type SectionBreakdown struct {
	Section        string  `json:"section" db:"section"`
	SectionName    string  `json:"section_name"`
	Attempts       int     `json:"attempts" db:"attempts"`
	Correct        int     `json:"correct" db:"correct"`
	Accuracy       float64 `json:"accuracy" db:"accuracy"`
	AvgTimeSeconds float64 `json:"avg_time_seconds" db:"avg_time_seconds"`
}

// ProgressAnalytics represents the aggregated progress data
type ProgressAnalytics struct {
	PeriodDays              int                `json:"period_days"`
	TotalQuestionsAttempted int                `json:"total_questions_attempted"`
	TotalCorrect            int                `json:"total_correct"`
	AverageAccuracy         float64            `json:"average_accuracy"`
	AccuracyTrend           []DailyAccuracy    `json:"accuracy_trend"`
	SectionBreakdown        []SectionBreakdown `json:"section_breakdown"`
	ImprovementThisWeek     float64            `json:"improvement_this_week"`
}

// SectionNameMap maps section codes to full names
var SectionNameMap = map[string]string{
	"PU":  "Penalaran Umum",
	"PPU": "Pengetahuan dan Pemahaman Umum",
	"PBM": "Pemahaman Bacaan dan Menulis",
	"PK":  "Pengetahuan Kuantitatif",
	"LBI": "Literasi Bahasa Indonesia",
	"LBE": "Literasi Bahasa Inggris",
	"PM":  "Penalaran Matematika",
}

// GetSectionName returns the full name for a section code
func GetSectionName(code string) string {
	if name, ok := SectionNameMap[code]; ok {
		return name
	}
	return code
}
