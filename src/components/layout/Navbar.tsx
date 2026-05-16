'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Sparkles, User, LogOut, History, Calendar, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface NavbarProps {
  user?: { email?: string; full_name?: string } | null
}

export function Navbar({ user }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const navLinks = user
    ? [
        { href: '/analiz/baslat', label: 'Analiz Başlat', icon: Sparkles },
        { href: '/rutin', label: 'Rutinim', icon: BarChart2 },
        { href: '/takvim', label: 'Takvim', icon: Calendar },
        { href: '/gecmis', label: 'Geçmişim', icon: History },
      ]
    : []

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success('Çıkış yapıldı')
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-pink-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full rose-gold-bg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif font-semibold text-xl text-gray-800 group-hover:text-rose-600 transition-colors">
              GlowMind
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50',
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profil"
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === '/profil'
                      ? 'bg-rose-50 text-rose-600'
                      : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50',
                  )}
                >
                  <User className="w-4 h-4" />
                  Profilim
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Çıkış
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/giris"
                  className="px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="btn-primary !py-2 !px-4 !text-sm"
                >
                  Ücretsiz Başla
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-rose-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-fade-in">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50',
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/profil" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-rose-50">
                  <User className="w-4 h-4" /> Profilim
                </Link>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50">
                  <LogOut className="w-4 h-4" /> Çıkış Yap
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/giris" onClick={() => setMenuOpen(false)}
                  className="text-center px-4 py-3 rounded-lg text-sm font-medium border border-rose-200 text-rose-600">
                  Giriş Yap
                </Link>
                <Link href="/kayit" onClick={() => setMenuOpen(false)}
                  className="btn-primary text-center !py-3">
                  Ücretsiz Başla
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
