import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen soft-pink-bg py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="premium-card p-8 sm:p-12">
            <h1 className="font-serif text-3xl font-bold text-gray-800 mb-2">Gizlilik Politikası</h1>
            <p className="text-sm text-gray-400 mb-8">Son güncelleme: Mayıs 2026</p>

            <div className="prose prose-sm max-w-none text-gray-600 space-y-8">
              <section>
                <h2 className="font-serif text-xl font-semibold text-gray-800 mb-3">1. Toplanan Veriler</h2>
                <p className="leading-relaxed">
                  GlowMind olarak hizmetlerimizi sunmak için aşağıdaki verileri topluyoruz:
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-1.5">
                  <li><strong>Hesap bilgileri:</strong> Ad, soyad, e-posta adresi</li>
                  <li><strong>Profil bilgileri:</strong> Yaş, saç tipi, cilt tipi ve ilgili bilgiler</li>
                  <li><strong>Fotoğraflar:</strong> Saç, saç dibi ve yüz fotoğrafları (analiz amacıyla)</li>
                  <li><strong>Kullanım verileri:</strong> Platform içi işlemler ve tercihler</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl font-semibold text-gray-800 mb-3">2. Fotoğraflarınızın Kullanımı</h2>
                <p className="leading-relaxed">
                  Yüklediğiniz fotoğraflar <strong>yalnızca</strong> kişisel bakım analiziniz için kullanılır.
                  Fotoğraflarınız:
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-1.5">
                  <li>Üçüncü şahıslarla paylaşılmaz</li>
                  <li>Reklam veya pazarlama amaçlı kullanılmaz</li>
                  <li>Şifreli depolama sistemlerinde saklanır</li>
                  <li>Yalnızca sizin hesabınızdan erişilebilir</li>
                  <li>İstediğiniz zaman silebilirsiniz</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl font-semibold text-gray-800 mb-3">3. Yapay Zeka (AI) Kullanımı</h2>
                <p className="leading-relaxed">
                  Fotoğraflarınız, OpenAI GPT-4o Vision API tarafından analiz edilmektedir.
                  Analiz sürecinde verileriniz güvenli API bağlantısı üzerinden iletilir.
                  AI analizi tamamlandıktan sonra geçici veriler silinir; sonuçlar yalnızca sizin hesabınızda saklanır.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl font-semibold text-gray-800 mb-3">4. KVKK Kapsamında Haklarınız</h2>
                <p className="leading-relaxed">
                  6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aşağıdaki haklara sahipsiniz:
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-1.5">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme hakkı</li>
                  <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme hakkı</li>
                  <li>Kişisel verilerinizin düzeltilmesini isteme hakkı</li>
                  <li>Kişisel verilerinizin silinmesini isteme hakkı</li>
                  <li>İşlenen verilerin üçüncü kişilere aktarılmasına itiraz etme hakkı</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl font-semibold text-gray-800 mb-3">5. Veri Güvenliği</h2>
                <p className="leading-relaxed">
                  Verilerinizin güvenliği için endüstri standardı önlemler alınmaktadır:
                  SSL/TLS şifrelemesi, güvenli depolama, erişim kontrolü ve düzenli güvenlik denetimleri.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl font-semibold text-gray-800 mb-3">6. Tıbbi Uyarı</h2>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-amber-700">
                    GlowMind bir güzellik ve bakım danışmanlığı platformudur.
                    Verilen öneriler tıbbi teşhis veya tedavi yerine geçmez.
                    Ciddi saç veya cilt sorunları için lütfen bir dermatoloğa başvurun.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="font-serif text-xl font-semibold text-gray-800 mb-3">7. İletişim</h2>
                <p className="leading-relaxed">
                  Gizlilik politikamızla ilgili sorularınız için:
                  <a href="mailto:privacy@glowmind.tr" className="text-rose-500 hover:underline ml-1">
                    privacy@glowmind.tr
                  </a>
                </p>
              </section>
            </div>

            <div className="mt-8 pt-8 border-t border-pink-100">
              <Link href="/" className="text-sm text-rose-500 hover:text-rose-700">
                ← Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
