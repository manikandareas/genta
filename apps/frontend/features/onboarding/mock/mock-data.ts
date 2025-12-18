// Onboarding Mock Data

import type { OnboardingStep, PTNOption, OnboardingFormData } from "../types";

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: "Target Kampus",
    description: "Pilih universitas dan skor target kamu",
  },
  {
    id: 2,
    title: "Jadwal Belajar",
    description: "Tentukan tanggal ujian dan waktu belajar",
  },
];

export const PTN_OPTIONS: PTNOption[] = [
  { value: "ui", label: "Universitas Indonesia", location: "Depok" },
  { value: "ugm", label: "Universitas Gadjah Mada", location: "Yogyakarta" },
  { value: "itb", label: "Institut Teknologi Bandung", location: "Bandung" },
  { value: "ipb", label: "Institut Pertanian Bogor", location: "Bogor" },
  { value: "its", label: "Institut Teknologi Sepuluh Nopember", location: "Surabaya" },
  { value: "unair", label: "Universitas Airlangga", location: "Surabaya" },
  { value: "undip", label: "Universitas Diponegoro", location: "Semarang" },
  { value: "unpad", label: "Universitas Padjadjaran", location: "Bandung" },
  { value: "uns", label: "Universitas Sebelas Maret", location: "Surakarta" },
  { value: "unhas", label: "Universitas Hasanuddin", location: "Makassar" },
  { value: "unand", label: "Universitas Andalas", location: "Padang" },
  { value: "usu", label: "Universitas Sumatera Utara", location: "Medan" },
  { value: "ub", label: "Universitas Brawijaya", location: "Malang" },
  { value: "unej", label: "Universitas Jember", location: "Jember" },
  { value: "unsri", label: "Universitas Sriwijaya", location: "Palembang" },
];

export const DEFAULT_FORM_DATA: OnboardingFormData = {
  targetPtn: "",
  targetScore: 650,
  examDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
  studyHoursPerWeek: 10,
};

export const MOCK_COMPLETED_ONBOARDING: OnboardingFormData = {
  targetPtn: "ui",
  targetScore: 700,
  examDate: new Date("2025-06-15"),
  studyHoursPerWeek: 15,
};
