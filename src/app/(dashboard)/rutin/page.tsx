import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { WeeklyRoutineTable } from '@/components/routine/WeeklyTable'
import type { AnalysisResult } from '@/types'
import { formatDate } from '@/lib/utils'

// ── Score badge (server-rendered) ───────────────────────────────
function ScorePill({
  score,
  label,
  title,
}: {
  score: number
  label: string
  title: string
}) {
  const color =
    score >= 7.5 ? 'text-green-600 bg-green-50 border-green-200'
    : score >= 6 ? 'text-amber-600 bg-amber-50 border-amber-200'
    : 'text-red-600 bg-red-50 border-red-200'

  return (
    <div className={`premium-card p-4 text-center border ${color}`}>
      <p className="text-xs text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold">{score.toFixed(1)}</p>
      <p className="text-xs font-medium mt-0.5">{label}</p>
    </div>
  )
}

export default async function RoutinePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  const { data: analysis } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!analysis?.result) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <div className="text-6xl mb-6">📋</div>
        <h2 className="font-serif text-2xl font-bold text-gray-800 mb-3">Henüz Rutin Yok</h2>
        <p className="text-gray-500 mb-6">
          Haftalık bakım rutininizi görmek için önce bir analiz yapmanız gerekiyor.
        </p>
        <Link href="/analiz/baslat" className="btn-primary inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Analiz Başlat
        </Link>
      </div>
    )
  }

  const result = analysis.result as AnalysisResult

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-800">Haftalık Bakım Rutinim</h1>
          <p className="text-gray-500 text-sm mt-1">
            Son analiz: {formatDate(analysis.created_at)}
          </p>
          {result.beauty_report && (
            <p className="text-rose-500 text-sm font-medium mt-1">
              {result.beauty_report.headline}
            </p>
          )}
        </div>
        <Link href="/analiz/baslat" className="btn-secondary inline-flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4" />
          Yeni Analiz
        </Link>
      </div>

      {/* Score + summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {result.hair_score && (
          <ScorePill
            score={result.hair_score.overall}
            label={result.hair_score.label}
            title="💇‍♀️ Saç Skoru"
          />
        )}
        {result.skin_score && (
          <ScorePill
            score={result.skin_score.overall}
            label={result.skin_score.label}
            title="🌸 Cilt Skoru"
          />
        )}
        <div className="premium-card p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">💧 Yıkama</p>
          <p className="text-sm font-semibold text-gray-800 leading-snug">
            {result.recommendations.wash_frequency}
          </p>
        </div>
        <div className="premium-card p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">📊 Hasar</p>
          <p className="text-sm font-semibold text-gray-800 capitalize">
            {result.hair_analysis.damage_level}
          </p>
        </div>
      </div>

      {/* Weekly table */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-gray-800 mb-5">
          7 Günlük Kişisel Bakım Planım
        </h2>
        <WeeklyRoutineTable routine={result.weekly_routine} />
      </div>

      {/* Daily skin routines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="premium-card p-6">
          <h3 className="font-serif text-lg font-semibold text-gray-800 mb-4">
            🌅 Sabah Cilt Rutini
          </h3>
          <ol className="space-y-3">
            {result.recommendations.morning_skin_routine.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full rose-gold-bg text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {step.order}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{step.step}</p>
                  <p className="text-xs text-gray-500">{step.product_type}</p>
                  {step.notes && (
                    <p className="text-xs text-rose-500 italic mt-0.5">{step.notes}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="premium-card p-6">
          <h3 className="font-serif text-lg font-semibold text-gray-800 mb-4">
            🌙 Akşam Cilt Rutini
          </h3>
          <ol className="space-y-3">
            {result.recommendations.evening_skin_routine.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-400 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {step.order}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{step.step}</p>
                  <p className="text-xs text-gray-500">{step.product_type}</p>
                  {step.notes && (
                    <p className="text-xs text-purple-500 italic mt-0.5">{step.notes}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
