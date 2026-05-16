import Link from 'next/link'
import { Sparkles, Star, Shield, ArrowRight, Camera, Brain, Calendar } from 'lucide-react'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { createServerClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const features = [
    {
      icon: Camera,
      title: 'Fotoğraf Analizi',
      desc: 'Saç, saç dibi ve yüz fotoğraflarınızı yükleyin; AI sizin için analiz etsin.',
      color: 'bg-pink-50 text-pink-500',
    },
    {
      icon: Brain,
      title: 'Kişisel AI Danışmanlığı',
      desc: 'Claude Vision AI ile size özel bakım önerileri ve ürün kategorisi tavsiyeleri alın.',
      color: 'bg-rose-50 text-rose-500',
    },
    {
      icon: Calendar,
      title: 'Bakım Takvimi',
      desc: 'Haftalık rutin tablosu ve aylık bakım takvimi ile bakımınızı hiç atlama.',
      color: 'bg-fuchsia-50 text-fuchsia-500',
    },
  ]

  const steps = [
    { n: '01', title: 'Profilini Oluştur', desc: 'Saç tipini, cilt durumunu ve bakım alışkanlıklarını anlat.' },
    { n: '02', title: 'Fotoğraf Yükle', desc: 'Saç, saç dibi ve yüz fotoğraflarını adım adım yükle.' },
    { n: '03', title: 'AI Analizi Al', desc: 'Yapay zeka fotoğraflarını ve profilini birlikte değerlendirir.' },
    { n: '04', title: 'Rutinini Uygula', desc: 'Kişisel haftalık rutin ve takvimle bakımına başla.' },
  ]

  const testimonials = [
    { name: 'Elif K.', text: 'Saçımın neden yıprandığını yıllarca anlayamıyordum. GlowMind bana hem nedeni hem de çözümü gösterdi.', rating: 5 },
    { name: 'Selin A.', text: 'Cilt tipimi yanlış biliyor, yanlış ürünler kullanıyordum. Analiz sonrası rutinim tamamen değişti.', rating: 5 },
    { name: 'Zeynep T.', text: 'Haftalık rutin tablosu hayatımı kolaylaştırdı. Artık ne zaman ne yapacağımı biliyorum.', rating: 5 },
  ]

  return (
    <>
      <Navbar user={user} />
      <main>
        {/* Hero */}
        <section className="soft-pink-bg py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30"
            style={{background: 'radial-gradient(circle at 70% 50%, #fda4af 0%, transparent 50%)'}}>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/80 border border-pink-200 rounded-full px-4 py-2 mb-8 text-sm text-rose-600 font-medium shadow-soft">
                <Sparkles className="w-4 h-4" />
                AI Destekli Güzellik Danışmanı
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Saçın ve Cildin İçin
                <span className="gradient-text block mt-1">Kişisel Danışmanın</span>
              </h1>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                Fotoğraflarını yükle, profilini oluştur. Yapay zeka seni analiz etsin ve sana özel
                haftalık bakım rutini ile aylık takvimini hazırlasın.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={user ? '/analiz/baslat' : '/kayit'}
                  className="btn-primary flex items-center gap-2 text-base">
                  Ücretsiz Analiz Başlat
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#nasil-calisir"
                  className="btn-secondary text-base">
                  Nasıl Çalışır?
                </Link>
              </div>
              <p className="mt-6 text-xs text-gray-400">
                Kredi kartı gerekmez · Ücretsiz başla · 3 dakikada analiz
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Neden GlowMind?
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Genel tavsiyeler değil, <strong>sana özel</strong> analiz ve bakım planı.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="premium-card p-8 text-center hover:shadow-glow transition-all hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mx-auto mb-5`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif font-semibold text-lg text-gray-800 mb-3">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="nasil-calisir" className="py-20 soft-pink-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Nasıl Çalışır?
              </h2>
              <p className="text-gray-500">4 adımda kişisel bakım planına sahip ol.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map(({ n, title, desc }, i) => (
                <div key={n} className="relative">
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-rose-200 to-transparent z-0" />
                  )}
                  <div className="premium-card p-6 relative z-10">
                    <div className="w-10 h-10 rounded-full rose-gold-bg text-white font-bold text-sm flex items-center justify-center mb-4">
                      {n}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-10 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
              <Shield className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 mb-1">Önemli Bilgilendirme</h4>
                <p className="text-sm text-amber-700 leading-relaxed">
                  GlowMind bir güzellik danışmanlığı platformudur ve tıbbi teşhis veya tedavi sunmaz.
                  Cilt hastalığı, ciddi saç dökülmesi, enfeksiyon veya tahriş belirtisi görülmesi durumunda
                  bir dermatoloğa danışmanızı öneririz. Fotoğraflarınız yalnızca analiz amacıyla kullanılır
                  ve gizli tutulur.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 soft-pink-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Kullanıcılarımız Ne Diyor?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map(({ name, text, rating }) => (
                <div key={name} className="premium-card p-6">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">&ldquo;{text}&rdquo;</p>
                  <p className="text-sm font-medium text-rose-600">{name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="rose-gold-bg rounded-3xl p-10 text-white">
              <Sparkles className="w-10 h-10 mx-auto mb-4 opacity-80" />
              <h2 className="font-serif text-3xl font-bold mb-4">
                Bakım Yolculuğuna Başla
              </h2>
              <p className="mb-8 opacity-90 leading-relaxed">
                Ücretsiz kaydol, fotoğraflarını yükle ve yapay zeka destekli
                kişisel bakım planını dakikalar içinde al.
              </p>
              <Link
                href={user ? '/analiz/baslat' : '/kayit'}
                className="inline-flex items-center gap-2 bg-white text-rose-600 font-semibold px-8 py-4 rounded-xl hover:bg-rose-50 transition-colors shadow-lg"
              >
                Hemen Başla
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
