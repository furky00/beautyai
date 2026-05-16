'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [consent, setConsent] = useState(false)
  const [photoConsent, setPhotoConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!consent || !photoConsent) {
      toast.error('Lütfen tüm onay kutularını işaretleyin')
      return
    }
    if (password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      setSuccess(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kayıt başarısız'
      if (msg.includes('already registered')) {
        toast.error('Bu e-posta zaten kayıtlı')
      } else {
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen soft-pink-bg flex items-center justify-center p-4">
        <div className="premium-card p-10 max-w-md w-full text-center animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-800 mb-3">E-postanızı Kontrol Edin</h2>
          <p className="text-gray-500 mb-6">
            <strong>{email}</strong> adresine doğrulama bağlantısı gönderdik.
            Hesabınızı onaylamak için e-postanızdaki bağlantıya tıklayın.
          </p>
          <Button onClick={() => router.push('/giris')} variant="secondary">
            Giriş Sayfasına Dön
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen soft-pink-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-full rose-gold-bg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-semibold text-2xl text-gray-800">GlowMind</span>
          </Link>
          <h1 className="mt-6 font-serif text-2xl font-bold text-gray-800">Hesap Oluştur</h1>
          <p className="text-gray-500 text-sm mt-2">Ücretsiz kaydol, bakım yolculuğuna başla</p>
        </div>

        <div className="premium-card p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            <Input
              label="Ad Soyad"
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Adınız Soyadınız"
              required
            />

            <Input
              label="E-posta Adresi"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
            />

            <div className="relative">
              <Input
                label="Şifre"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="En az 6 karakter"
                required
                hint="En az 6 karakter kullanın"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-10 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Consent checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  className="mt-0.5 accent-rose-500 w-4 h-4 rounded"
                />
                <span className="text-xs text-gray-600 leading-relaxed">
                  <Link href="/gizlilik" className="text-rose-500 hover:underline">Gizlilik Politikası</Link>,{' '}
                  <Link href="/kvkk" className="text-rose-500 hover:underline">KVKK Aydınlatma Metni</Link> ve{' '}
                  <Link href="/kullanim" className="text-rose-500 hover:underline">Kullanım Koşullarını</Link>{' '}
                  okudum ve kabul ediyorum. *
                </span>
              </label>

              <label className="flex gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={photoConsent}
                  onChange={e => setPhotoConsent(e.target.checked)}
                  className="mt-0.5 accent-rose-500 w-4 h-4 rounded"
                />
                <span className="text-xs text-gray-600 leading-relaxed">
                  Yüklediğim fotoğrafların yalnızca AI analizi amacıyla kullanılacağını,
                  üçüncü kişilerle paylaşılmayacağını ve istediğim zaman silebileceğimi anlıyorum. *
                </span>
              </label>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={!consent || !photoConsent}
              className="w-full"
            >
              Hesap Oluştur
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-pink-100 text-center">
            <p className="text-sm text-gray-500">
              Zaten hesabınız var mı?{' '}
              <Link href="/giris" className="text-rose-500 font-medium hover:text-rose-700">
                Giriş Yapın
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
