// ── Auth & Profile ──────────────────────────────────────────────
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  age: number
  hair_type: 'duz' | 'dalgali' | 'kivircik'
  hair_condition: string[]
  scalp_condition: string[]
  skin_type: 'kuru' | 'yagli' | 'karma' | 'hassas'
  skin_problems: string[]
  uses_hair_dye: boolean
  hair_wash_frequency: number
  has_skin_routine: boolean
  created_at: string
  updated_at: string
}

export interface Analysis {
  id: string
  user_id: string
  profile_id: string
  hair_photo_url?: string
  scalp_photo_url?: string
  face_photo_url?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: AnalysisResult
  created_at: string
}

// ── Beauty Report (top-level summary) ───────────────────────────
export interface BeautyReport {
  headline: string          // "Boyalı Kıvırcık Saç + Yağlı Karma Cilt"
  tagline: string           // Motive edici 1 cümle
  key_findings: string[]    // 3-4 önemli bulgu
  strengths: string[]       // Güçlü yönler
  improvement_areas: string[]
}

export interface BeautyScore {
  overall: number           // 1-10, 1 ondalık (ör: 7.2)
  label: string             // "İyi" | "Orta" | "Dikkat Gerekiyor"
  breakdown: ScoreItem[]
}

export interface ScoreItem {
  name: string              // "Nem Seviyesi"
  score: number             // 1-10
  icon: string              // emoji
}

export interface PriorityConcern {
  area: string              // "sac" | "cilt" | "sac_derisi"
  concern: string           // "Boyalı saç yoğun nem ihtiyacı içinde"
  urgency: 'dusuk' | 'orta' | 'yuksek'
  solution: string          // Kısa çözüm önerisi
  why: string               // Neden önemli
  icon: string              // emoji
}

// ── Hair & Skin Analysis ─────────────────────────────────────────
export interface HairAnalysis {
  hair_type: string
  hair_type_detail: string
  damage_level: 'dusuk' | 'orta' | 'yuksek'
  moisture_level: string
  overall_health: string
  summary: string
}

export interface ScalpAnalysis {
  scalp_type: string
  condition: string[]
  concerns: string[]
  summary: string
}

export interface SkinAnalysis {
  skin_type: string
  hydration_level: string
  visible_concerns: string[]
  age_related_notes: string
  summary: string
}

// ── Recommendations ──────────────────────────────────────────────
export interface Recommendations {
  hair_care: string[]
  scalp_care: string[]
  skin_care: string[]
  product_categories: ProductCategory[]
  wash_frequency: string
  haircut_frequency: string
  dye_renewal_frequency?: string
  morning_skin_routine: RoutineStep[]
  evening_skin_routine: RoutineStep[]
}

export interface ProductCategory {
  category: string
  reason: string
  examples: string[]
}

export interface RoutineStep {
  order: number
  step: string
  product_type: string
  duration?: string
  notes?: string
}

// ── Weekly Routine (new rich format) ────────────────────────────
export interface RoutineItem {
  step: string              // "Micellar su ile makyaj temizleme"
  product_type: string      // "Micellar su / iki aşamalı temizleme"
  duration?: string         // "2-3 dk"
  icon: string              // emoji
  why?: string              // "Güneş kremi kalıntılarını..."
}

export interface HairDayRoutine {
  treatment: string         // "Protein Maskesi Uygulaması"
  product_types: string[]   // ["protein maskesi", "renk koruyucu"]
  duration: string          // "20-30 dk"
  icon: string              // emoji
  why: string               // neden önemli
}

export interface ChecklistItem {
  id: string
  label: string
}

export interface DayRoutine {
  day: string               // "Pazartesi"
  theme: string             // "Haftalık Detoks & Sıfırlama"
  theme_icon: string        // "🌿"
  intensity: 'hafif' | 'orta' | 'yogun'
  focus: string[]           // ["cilt", "sac_derisi"]
  morning: RoutineItem[]
  evening: RoutineItem[]
  hair_routine?: HairDayRoutine
  why: string               // Bu günün temasının neden önemli olduğu
  checklist: ChecklistItem[]
  tip?: string              // Pro ipucu
}

export interface WeeklyRoutine {
  monday: DayRoutine
  tuesday: DayRoutine
  wednesday: DayRoutine
  thursday: DayRoutine
  friday: DayRoutine
  saturday: DayRoutine
  sunday: DayRoutine
}

// ── Top-level Analysis Result ────────────────────────────────────
export interface AnalysisResult {
  beauty_report: BeautyReport
  hair_score: BeautyScore
  skin_score: BeautyScore
  priority_concerns: PriorityConcern[]
  hair_analysis: HairAnalysis
  scalp_analysis: ScalpAnalysis
  skin_analysis: SkinAnalysis
  recommendations: Recommendations
  weekly_routine: WeeklyRoutine
  warnings: string[]
  dermatologist_referral: boolean
  dermatologist_reasons: string[]
}

// ── Calendar ─────────────────────────────────────────────────────
export interface CalendarReminder {
  id: string
  user_id: string
  analysis_id: string
  type: 'sac_yikama' | 'sac_maskesi' | 'boya_yenileme' | 'sac_kestirme' | 'cilt_bakimi'
  title: string
  scheduled_date: string
  scheduled_time: string
  recurring: boolean
  recurring_days?: number
  is_active: boolean
  created_at: string
}
