package model

import (
	"time"

	"github.com/google/uuid"
)

type BaseWithId struct {
	ID uuid.UUID `json:"id" db:"id"`
}

type BaseWithCreatedAt struct {
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
}

type BaseWithUpdatedAt struct {
	UpdatedAt time.Time `json:"updatedAt" db:"updated_at"`
}

type Base struct {
	BaseWithId
	BaseWithCreatedAt
	BaseWithUpdatedAt
}

type PaginatedResponse[T any] struct {
	Data       []T `json:"data"`
	Page       int `json:"page"`
	Limit      int `json:"limit"`
	Total      int `json:"total"`
	TotalPages int `json:"totalPages"`
}

// Section represents UTBK subtest codes
type Section string

const (
	SectionPU  Section = "PU"  // Penalaran Umum
	SectionPPU Section = "PPU" // Pengetahuan & Pemahaman Umum
	SectionPBM Section = "PBM" // Pemahaman Bacaan & Menulis
	SectionPK  Section = "PK"  // Pengetahuan Kuantitatif
	SectionLBI Section = "LBI" // Literasi Bahasa Indonesia
	SectionLBE Section = "LBE" // Literasi Bahasa Inggris
	SectionPM  Section = "PM"  // Penalaran Matematika
)

// ValidSections contains all valid section codes
var ValidSections = []Section{
	SectionPU, SectionPPU, SectionPBM, SectionPK,
	SectionLBI, SectionLBE, SectionPM,
}

// IsValidSection checks if a section code is valid
func IsValidSection(s string) bool {
	for _, valid := range ValidSections {
		if string(valid) == s {
			return true
		}
	}
	return false
}
