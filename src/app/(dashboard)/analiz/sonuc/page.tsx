import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, BarChart2, Download } from 'lucide-react'
import { AnalysisResultView } from '@/components/analysis/AnalysisResult'
import { WeeklyRoutineTable } from '@/components/routine/WeeklyTable'
import { formatDate } from '@/lib/utils'
import type { AnalysisResult } from '@/types'

export default async function ResultPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  const analysisId = searchParams.id
  if (!analysisId) redirect('/profil')

  const { data: analysis } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', analysisId)
    .eq('user_id', user.id)
    .single()

  if (!analysis) redirect('/profil')

  if (analysis.status === 'processing') {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-6 animate-pulse">
          <span className="text-2xl">✨</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-800 mb-3">Analiz Hazırlanıyor</h2>
        <p className="text-gray-500 mb-6">
          Yapay zeka fotoğraflarınızı değerlendiriyor. Bu işlem birkaç saniye sürebilir.
          Sayfayı yenileyebilirsiniz.
        </p>
        <Link href={`/analiz/sonuc?id=${analysisId}`}
          className="btn-secondary inline-flex items-center gap-2">
          Sayfayı Yenile
        </Link>
      </div>
    )
  }

  if (analysis.status === 'failed' || !analysis.result) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">❌</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-800 mb-3">Analiz Başarısız</h2>
        <p className="text-gray-500 mb-6">Bir sorun oluştu. Lütfen tekrar deneyin.</p>
        <Link href="/analiz/baslat" className="btn-primary inline-flex items-center gap-2">
          Tekrar Dene
        </Link>
      </div>
    )
  }

  const result = analysis.result as AnalysisResult

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <Link href="/profil" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-3">
            <ArrowLeft className="w-4 h-4" />
            Profile Dön
          </Link>
          <h1 className="font-serif text-3xl font-bold text-gray-800">Analiz Sonuçlarınız</h1>
          <p className="text-gray-500 text-sm mt-1">{formatDate(analysis.created_at)}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/rutin" className="btn-secondary inline-flex items-center gap-2 text-sm">
            <BarChart2 className="w-4 h-4" />
            Haftalık Rutin
          </Link>
          <Link href="/takvim" className="btn-primary inline-flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            Takvim Kur
          </Link>
        </div>
      </div>

      {/* Analysis results */}
      <AnalysisResultView result={result} />

      {/* Weekly routine */}
      <div className="mt-8">
        <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">
          📋 Haftalık Bakım Rutininiz
        </h2>
        <WeeklyRoutineTable routine={result.weekly_routine} />
      </div>

      {/* Actions */}
      <div className="mt-8 premium-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-medium text-gray-800">Hatırlatmaları Kur</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Saç ve cilt bakım hatırlatmalarını takviminize ekleyin
          </p>
        </div>
        <Link href={`/takvim?analysisId=${analysisId}`} className="btn-primary whitespace-nowrap">
          <Calendar className="w-4 h-4" />
          Takvim Ayarla
        </Link>
      </div>
    </div>
  )
}
