import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Sparkles, Clock, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

export default async function HistoryPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  const { data: analyses } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-800">Geçmiş Analizler</h1>
          <p className="text-gray-500 text-sm mt-1">
            {analyses?.length || 0} analiz bulunuyor
          </p>
        </div>
        <Link href="/analiz/baslat" className="btn-primary inline-flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4" />
          Yeni Analiz
        </Link>
      </div>

      {!analyses || analyses.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="font-serif text-xl font-semibold text-gray-700 mb-2">Henüz Analiz Yok</h3>
          <p className="text-gray-500 mb-6 text-sm">İlk analizini yaparak bakım yolculuğuna başla.</p>
          <Link href="/analiz/baslat" className="btn-primary inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            İlk Analizimi Başlat
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {analyses.map(analysis => (
            <div key={analysis.id} className="premium-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-800">
                      Analiz #{analysis.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <Badge
                      variant={
                        analysis.status === 'completed' ? 'green' :
                        analysis.status === 'processing' ? 'yellow' :
                        analysis.status === 'failed' ? 'rose' : 'gray'
                      }
                    >
                      {analysis.status === 'completed' ? 'Tamamlandı' :
                       analysis.status === 'processing' ? 'İşleniyor' :
                       analysis.status === 'failed' ? 'Başarısız' : 'Bekliyor'}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-400 flex items-center gap-1.5 mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(analysis.created_at)}
                  </p>

                  {analysis.result && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-rose-50 text-rose-600 px-3 py-1 rounded-full border border-rose-100">
                        💇‍♀️ {(analysis.result as any).hair_analysis?.hair_type}
                      </span>
                      <span className="text-xs bg-pink-50 text-pink-600 px-3 py-1 rounded-full border border-pink-100">
                        🌸 {(analysis.result as any).skin_analysis?.skin_type} cilt
                      </span>
                      {(analysis.result as any).dermatologist_referral && (
                        <span className="text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-100">
                          ⚕️ Dermatolog Önerisi
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {analysis.status === 'completed' && (
                  <Link
                    href={`/analiz/sonuc?id=${analysis.id}`}
                    className="flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-700 font-medium whitespace-nowrap"
                  >
                    Görüntüle
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {/* Photos preview */}
              {(analysis.hair_photo_url || analysis.scalp_photo_url || analysis.face_photo_url) && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-pink-50">
                  {analysis.hair_photo_url && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-pink-100">
                      <img src={analysis.hair_photo_url} alt="Saç" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {analysis.scalp_photo_url && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-pink-100">
                      <img src={analysis.scalp_photo_url} alt="Saç dibi" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {analysis.face_photo_url && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-pink-100">
                      <img src={analysis.face_photo_url} alt="Yüz" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
