'use client'

import {
  AlertTriangle, CheckCircle2, ChevronRight,
  Sparkles, Heart, Shield, TrendingUp,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type {
  AnalysisResult, RoutineStep, ProductCategory,
  BeautyScore, ScoreItem, PriorityConcern,
} from '@/types'

// ── Score SVG gauge ──────────────────────────────────────────────
function ScoreGauge({
  score,
  label,
  size = 72,
}: {
  score: number
  label: string
  size?: number
}) {
  const r = (size / 2) * 0.75
  const circ = 2 * Math.PI * r
  const filled = Math.min(score / 10, 1) * circ
  const color =
    score >= 7.5 ? '#22c55e'
    : score >= 6 ? '#f59e0b'
    : score >= 4 ? '#fb923c'
    : '#ef4444'

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={size * 0.08}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={size * 0.08}
            strokeDasharray={`${filled} ${circ}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-white leading-none" style={{ fontSize: size * 0.26, color }}>
            {score.toFixed(1)}
          </span>
          <span className="text-white/40 leading-none" style={{ fontSize: size * 0.13 }}>
            /10
          </span>
        </div>
      </div>
      <span className="text-xs text-white/60 font-medium">{label}</span>
    </div>
  )
}

// ── Score breakdown mini bars ────────────────────────────────────
function BreakdownBar({ item }: { item: ScoreItem }) {
  const pct = (item.score / 10) * 100
  const color =
    item.score >= 7 ? 'bg-green-400'
    : item.score >= 5 ? 'bg-amber-400'
    : 'bg-red-400'

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm w-5 flex-shrink-0">{item.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-xs mb-0.5">
          <span className="text-white/70 truncate">{item.name}</span>
          <span className="text-white/50 flex-shrink-0 ml-1">{item.score}/10</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div className={cn('h-full rounded-full', color)} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  )
}

// ── Urgency badge ────────────────────────────────────────────────
function UrgencyBadge({ urgency }: { urgency: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    yuksek: { label: '🔴 Yüksek', cls: 'bg-red-100 text-red-700' },
    orta:   { label: '🟡 Orta',   cls: 'bg-amber-100 text-amber-700' },
    dusuk:  { label: '🟢 Düşük',  cls: 'bg-green-100 text-green-700' },
  }
  const u = map[urgency] ?? map.orta
  return (
    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', u.cls)}>
      {u.label}
    </span>
  )
}

// ── Damage level bar ─────────────────────────────────────────────
function DamageBar({ level }: { level: string }) {
  const map: Record<string, { label: string; color: string; pct: string }> = {
    dusuk:  { label: 'Düşük',  color: 'bg-green-400', pct: 'w-1/3' },
    orta:   { label: 'Orta',   color: 'bg-amber-400', pct: 'w-2/3' },
    yuksek: { label: 'Yüksek', color: 'bg-red-400',   pct: 'w-full' },
  }
  const d = map[level] ?? map.orta
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', d.color, d.pct)} />
      </div>
      <span className="text-sm font-medium text-gray-600 whitespace-nowrap">{d.label}</span>
    </div>
  )
}

// ── Routine step ─────────────────────────────────────────────────
function RoutineStepRow({ step }: { step: RoutineStep }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/50">
      <div className="w-6 h-6 rounded-full rose-gold-bg text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
        {step.order}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800">{step.step}</p>
        <p className="text-xs text-gray-500 mt-0.5">{step.product_type}</p>
        {step.notes && (
          <p className="text-xs text-rose-600 mt-1 italic leading-relaxed">{step.notes}</p>
        )}
        {step.duration && (
          <p className="text-xs text-gray-400 mt-0.5">⏱ {step.duration}</p>
        )}
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────
export function AnalysisResultView({ result }: { result: AnalysisResult }) {
  const { hair_analysis, scalp_analysis, skin_analysis, recommendations } = result

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ═══════════════════════════════════════════════════════════
          1. AI BEAUTY REPORT HEADER
      ═══════════════════════════════════════════════════════════ */}
      {result.beauty_report && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-rose-950 to-gray-900 p-8 text-white">
          {/* Decorative blurs */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              <span className="text-xs font-semibold text-rose-300 tracking-widest uppercase">
                AI Beauty Report
              </span>
            </div>

            {/* Headline + tagline */}
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-2 leading-tight">
              {result.beauty_report.headline}
            </h2>
            <p className="text-white/60 text-sm mb-7 max-w-lg">
              {result.beauty_report.tagline}
            </p>

            {/* Scores + strengths */}
            <div className="flex flex-col sm:flex-row gap-8 mb-7">
              {result.hair_score && (
                <div className="text-center">
                  <ScoreGauge
                    score={result.hair_score.overall}
                    label={result.hair_score.label}
                    size={80}
                  />
                  <p className="text-xs text-white/50 mt-1">Saç Skoru</p>
                </div>
              )}
              {result.skin_score && (
                <div className="text-center">
                  <ScoreGauge
                    score={result.skin_score.overall}
                    label={result.skin_score.label}
                    size={80}
                  />
                  <p className="text-xs text-white/50 mt-1">Cilt Skoru</p>
                </div>
              )}

              {/* Score breakdowns */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {result.hair_score?.breakdown?.map((b, i) => (
                  <BreakdownBar key={`h${i}`} item={b} />
                ))}
                {result.skin_score?.breakdown?.map((b, i) => (
                  <BreakdownBar key={`s${i}`} item={b} />
                ))}
              </div>
            </div>

            {/* Key findings */}
            <div className="border-t border-white/10 pt-5">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-3 font-semibold">
                Temel Bulgular
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {result.beauty_report.key_findings.map((f, i) => (
                  <div key={i} className="bg-white/8 border border-white/10 rounded-xl p-3">
                    <p className="text-xs text-white/75 leading-relaxed">{f}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths + improvements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5 pt-5 border-t border-white/10">
              {result.beauty_report.strengths?.length > 0 && (
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-2 font-semibold">
                    ✨ Güçlü Yönler
                  </p>
                  <ul className="space-y-1.5">
                    {result.beauty_report.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                        <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.beauty_report.improvement_areas?.length > 0 && (
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-2 font-semibold">
                    🎯 Geliştirme Alanları
                  </p>
                  <ul className="space-y-1.5">
                    {result.beauty_report.improvement_areas.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                        <ChevronRight className="w-3.5 h-3.5 text-rose-300 mt-0.5 flex-shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          2. PRIORITY CONCERNS
      ═══════════════════════════════════════════════════════════ */}
      {result.priority_concerns?.length > 0 && (
        <div>
          <h3 className="font-serif text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-rose-400" />
            Öncelikli Odak Noktaları
          </h3>
          <div className="space-y-3">
            {result.priority_concerns.map((concern, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-start gap-4 p-4 rounded-2xl border',
                  concern.urgency === 'yuksek'
                    ? 'bg-red-50 border-red-100'
                    : concern.urgency === 'orta'
                    ? 'bg-amber-50 border-amber-100'
                    : 'bg-green-50 border-green-100',
                )}
              >
                <span className="text-2xl flex-shrink-0">{concern.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800 text-sm">{concern.concern}</span>
                    <UrgencyBadge urgency={concern.urgency} />
                  </div>
                  <p className="text-xs text-gray-500 mb-1.5 leading-relaxed">{concern.why}</p>
                  <p className="text-xs font-medium text-gray-700">
                    → {concern.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          3. DERMATOLOG UYARISI
      ═══════════════════════════════════════════════════════════ */}
      {result.dermatologist_referral && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
          <Shield className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800 mb-2">
              ⚕️ Dermatoloğa Danışmanızı Öneririz
            </h4>
            <ul className="space-y-1.5">
              {result.dermatologist_reasons.map((r, i) => (
                <li key={i} className="text-sm text-amber-700 flex items-start gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Genel uyarılar */}
      {result.warnings?.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
          <h4 className="font-semibold text-rose-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Dikkat Edilmesi Gerekenler
          </h4>
          <ul className="space-y-2">
            {result.warnings.map((w, i) => (
              <li key={i} className="text-sm text-rose-600 flex items-start gap-2">
                <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          4. DETAYLI ANALİZ KARTLARI
      ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Hair */}
        <Card>
          <CardHeader>
            <CardTitle>💇‍♀️ Saç Analizi</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Saç Tipi</span>
              <Badge variant="rose">{hair_analysis.hair_type}</Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">İplik Kalınlığı</span>
              <span className="font-medium text-gray-700">{hair_analysis.hair_type_detail}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Nem Seviyesi</span>
              <span className="font-medium text-gray-700">{hair_analysis.moisture_level}</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1.5">Hasar Seviyesi</p>
              <DamageBar level={hair_analysis.damage_level} />
            </div>
            <div className="pt-2 border-t border-pink-50">
              <p className="text-xs text-gray-600 leading-relaxed">{hair_analysis.summary}</p>
            </div>
          </div>
        </Card>

        {/* Scalp */}
        <Card>
          <CardHeader>
            <CardTitle>🔍 Saç Derisi</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Tip</span>
              <Badge variant="pink">{scalp_analysis.scalp_type}</Badge>
            </div>
            {scalp_analysis.condition?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Mevcut Durum</p>
                <div className="flex flex-wrap gap-1">
                  {scalp_analysis.condition.map((c, i) => (
                    <Badge key={i} variant="gray" className="text-xs">{c}</Badge>
                  ))}
                </div>
              </div>
            )}
            {scalp_analysis.concerns?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Endişeler</p>
                <div className="flex flex-wrap gap-1">
                  {scalp_analysis.concerns.map((c, i) => (
                    <Badge key={i} variant="yellow" className="text-xs">{c}</Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="pt-2 border-t border-pink-50">
              <p className="text-xs text-gray-600 leading-relaxed">{scalp_analysis.summary}</p>
            </div>
          </div>
        </Card>

        {/* Skin */}
        <Card>
          <CardHeader>
            <CardTitle>🌸 Cilt Analizi</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Cilt Tipi</span>
              <Badge variant="purple">{skin_analysis.skin_type}</Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Nem Seviyesi</span>
              <span className="font-medium text-gray-700">{skin_analysis.hydration_level}</span>
            </div>
            {skin_analysis.visible_concerns?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Görünen Endişeler</p>
                <div className="flex flex-wrap gap-1">
                  {skin_analysis.visible_concerns.map((c, i) => (
                    <Badge key={i} variant="yellow" className="text-xs">{c}</Badge>
                  ))}
                </div>
              </div>
            )}
            {skin_analysis.age_related_notes && (
              <p className="text-xs text-gray-500 italic">{skin_analysis.age_related_notes}</p>
            )}
            <div className="pt-2 border-t border-pink-50">
              <p className="text-xs text-gray-600 leading-relaxed">{skin_analysis.summary}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          5. BAKİM ÖNERİLERİ
      ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              Saç Bakım Önerileri
            </CardTitle>
          </CardHeader>
          <ul className="space-y-2">
            {recommendations.hair_care.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-rose-300 flex-shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              Cilt Bakım Önerileri
            </CardTitle>
          </CardHeader>
          <ul className="space-y-2">
            {recommendations.skin_care.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-rose-300 flex-shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          6. ZAMANLAMA
      ═══════════════════════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle>📅 Bakım Zamanlaması</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Saç Yıkama', value: recommendations.wash_frequency, icon: '💧' },
            { label: 'Saç Kesimi', value: recommendations.haircut_frequency, icon: '✂️' },
            ...(recommendations.dye_renewal_frequency
              ? [{ label: 'Boya Yenileme', value: recommendations.dye_renewal_frequency, icon: '🎨' }]
              : []),
          ].map(({ label, value, icon }) => (
            <div key={label} className="text-center p-4 bg-rose-50 rounded-2xl">
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className="text-sm font-semibold text-rose-700 leading-snug">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════
          7. SABAH / AKŞAM CİLT RUTİNİ
      ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>🌅 Sabah Cilt Rutini</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {recommendations.morning_skin_routine.map((s, i) => (
              <RoutineStepRow key={i} step={s} />
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>🌙 Akşam Cilt Rutini</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {recommendations.evening_skin_routine.map((s, i) => (
              <RoutineStepRow key={i} step={s} />
            ))}
          </div>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          8. ÜRÜN KATEGORİLERİ
      ═══════════════════════════════════════════════════════════ */}
      {recommendations.product_categories?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🛍️ Ürün Kategorisi Önerileri</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.product_categories.map((cat, i) => (
              <div key={i} className="p-4 bg-pink-50 rounded-2xl border border-pink-100">
                <div className="mb-2">
                  <Badge variant="rose">{cat.category}</Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2 leading-relaxed">{cat.reason}</p>
                <div className="flex flex-wrap gap-1">
                  {cat.examples.map((ex, j) => (
                    <span
                      key={j}
                      className="text-xs bg-white px-2.5 py-0.5 rounded-full text-gray-500 border border-pink-100"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
