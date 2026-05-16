import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, User, Clock, ArrowRight, Edit, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

export default async function ProfilePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: analyses } = await supabase
    .from('analyses')
    .select('id, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-800">
            Merhaba, {profile?.full_name || user.email?.split('@')[0]} 🌸
          </h1>
          <p className="text-gray-500 mt-1">Bakım yolculuğuna hoş geldiniz</p>
        </div>
        <Link href="/analiz/baslat" className="btn-primary inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Yeni Analiz
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile info */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full rose-gold-bg flex items-center justify-center text-white text-2xl font-bold">
                {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{profile?.full_name || 'Kullanıcı'}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            {profile ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-pink-50">
                  <span className="text-gray-500">Yaş</span>
                  <span className="font-medium">{profile.age}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-pink-50">
                  <span className="text-gray-500">Saç Tipi</span>
                  <Badge variant="rose">{profile.hair_type}</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-pink-50">
                  <span className="text-gray-500">Cilt Tipi</span>
                  <Badge variant="pink">{profile.skin_type}</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-pink-50">
                  <span className="text-gray-500">Saç Yıkama</span>
                  <span className="font-medium">{profile.hair_wash_frequency} günde bir</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500">Saç Boyası</span>
                  <Badge variant={profile.uses_hair_dye ? 'purple' : 'gray'}>
                    {profile.uses_hair_dye ? 'Kullanıyor' : 'Kullanmıyor'}
                  </Badge>
                </div>
                <Link href="/profil/duzenle" className="btn-secondary w-full mt-4 text-center text-sm flex items-center justify-center gap-2">
                  <Edit className="w-3.5 h-3.5" />
                  Profili Düzenle
                </Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <User className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-4">Profiliniz henüz oluşturulmadı</p>
                <Link href="/analiz/baslat" className="btn-primary text-sm">
                  Profil Oluştur & Analiz Başlat
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Recent analyses */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-lg font-semibold text-gray-800">Son Analizler</h3>
              <Link href="/gecmis" className="text-sm text-rose-500 hover:text-rose-700 flex items-center gap-1">
                Tümü <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {analyses && analyses.length > 0 ? (
              <div className="space-y-3">
                {analyses.map(analysis => (
                  <div key={analysis.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-rose-50/50 border border-rose-100 hover:bg-rose-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        analysis.status === 'completed' ? 'bg-green-400' :
                        analysis.status === 'processing' ? 'bg-amber-400' : 'bg-gray-300'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Analiz #{analysis.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatDate(analysis.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={analysis.status === 'completed' ? 'green' : 'yellow'}>
                        {analysis.status === 'completed' ? 'Tamamlandı' :
                         analysis.status === 'processing' ? 'İşleniyor' : 'Bekliyor'}
                      </Badge>
                      {analysis.status === 'completed' && (
                        <Link href={`/analiz/sonuc?id=${analysis.id}`}
                          className="text-xs text-rose-500 hover:text-rose-700 font-medium">
                          Görüntüle
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Sparkles className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Henüz analiz yapılmadı</p>
                <Link href="/analiz/baslat" className="btn-primary inline-flex items-center gap-2">
                  İlk Analizini Başlat
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </Card>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {[
              { href: '/rutin', icon: '📋', title: 'Haftalık Rutinim', desc: 'Bakım planını görüntüle' },
              { href: '/takvim', icon: '📅', title: 'Bakım Takvimim', desc: 'Hatırlatmalarını yönet' },
            ].map(({ href, icon, title, desc }) => (
              <Link key={href} href={href}>
                <Card hover className="h-full">
                  <div className="text-3xl mb-3">{icon}</div>
                  <h4 className="font-medium text-gray-800 text-sm">{title}</h4>
                  <p className="text-xs text-gray-400 mt-1">{desc}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
