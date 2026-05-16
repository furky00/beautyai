import Link from 'next/link'
import { Sparkles, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white border-t border-pink-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full rose-gold-bg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif font-semibold text-xl text-gray-800">GlowMind</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Yapay zeka destekli kişisel saç ve cilt bakım danışmanınız. Size özel analiz ve bakım rutini ile
              en iyi halini keşfet.
            </p>
            <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
              <span>Sevgiyle yapıldı</span>
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
              <span>GlowMind ekibi</span>
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium text-gray-700 mb-4 text-sm">Platform</h4>
            <ul className="space-y-2">
              {[
                { href: '/analiz/baslat', label: 'Analiz Başlat' },
                { href: '/rutin', label: 'Haftalık Rutin' },
                { href: '/takvim', label: 'Bakım Takvimi' },
                { href: '/gecmis', label: 'Geçmiş Analizler' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-rose-500 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-4 text-sm">Yasal</h4>
            <ul className="space-y-2">
              {[
                { href: '/gizlilik', label: 'Gizlilik Politikası' },
                { href: '/kvkk', label: 'KVKK Aydınlatma' },
                { href: '/kullanim', label: 'Kullanım Koşulları' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-rose-500 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-pink-50 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} GlowMind. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-gray-400 text-center">
            ⚕️ GlowMind tıbbi teşhis veya tedavi sunmaz. Sağlık sorunlarınız için lütfen bir dermatoloğa danışın.
          </p>
        </div>
      </div>
    </footer>
  )
}
