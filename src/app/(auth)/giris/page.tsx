'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Sparkles, Mail, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('Hoş geldiniz! 🌸')
      router.push('/profil')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Giriş başarısız'
      if (msg.includes('Invalid login credentials')) {
        toast.error('E-posta veya şifre hatalı')
      } else {
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen soft-pink-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full rose-gold-bg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-semibold text-2xl text-gray-800">GlowMind</span>
          </Link>
          <h1 className="mt-6 font-serif text-2xl font-bold text-gray-800">Tekrar Hoş Geldiniz</h1>
          <p className="text-gray-500 text-sm mt-2">Hesabınıza giriş yapın</p>
        </div>

        <div className="premium-card p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <Input
                label="E-posta Adresi"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                required
              />
              <Mail className="absolute right-4 top-10 w-4 h-4 text-gray-300" />
            </div>

            <div className="relative">
              <Input
                label="Şifre"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-10 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link href="/sifre-sifirla" className="text-xs text-rose-500 hover:text-rose-700">
                Şifremi unuttum
              </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              <Lock className="w-4 h-4" />
              Giriş Yap
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-pink-100 text-center">
            <p className="text-sm text-gray-500">
              Hesabınız yok mu?{' '}
              <Link href="/kayit" className="text-rose-500 font-medium hover:text-rose-700">
                Ücretsiz Kayıt Ol
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Giriş yaparak{' '}
          <Link href="/gizlilik" className="text-rose-400 hover:underline">Gizlilik Politikamızı</Link>{' '}
          ve{' '}
          <Link href="/kullanim" className="text-rose-400 hover:underline">Kullanım Koşullarımızı</Link>{' '}
          kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  )
}
