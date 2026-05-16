'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import {
  HAIR_TYPES, HAIR_CONDITIONS, SCALP_CONDITIONS,
  SKIN_TYPES, SKIN_PROBLEMS
} from '@/lib/utils'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

type FormData = {
  age: string
  hair_type: string
  hair_condition: string[]
  scalp_condition: string[]
  skin_type: string
  skin_problems: string[]
  uses_hair_dye: boolean
  hair_wash_frequency: string
  has_skin_routine: boolean
}

const initialForm: FormData = {
  age: '',
  hair_type: '',
  hair_condition: [],
  scalp_condition: [],
  skin_type: '',
  skin_problems: [],
  uses_hair_dye: false,
  hair_wash_frequency: '3',
  has_skin_routine: false,
}

function CheckItem({
  label, checked, onChange
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all',
        checked
          ? 'border-rose-300 bg-rose-50 text-rose-700 font-medium'
          : 'border-gray-100 bg-white text-gray-600 hover:border-rose-200 hover:bg-rose-50/50'
      )}
    >
      <div className={cn(
        'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
        checked ? 'border-rose-400 bg-rose-400' : 'border-gray-300'
      )}>
        {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>
      {label}
    </button>
  )
}

function RadioItem({
  label, selected, onClick
}: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-5 py-3 rounded-xl text-sm border transition-all font-medium',
        selected
          ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-soft'
          : 'border-gray-100 bg-white text-gray-600 hover:border-rose-200'
      )}
    >
      {label}
    </button>
  )
}

const STEPS = [
  { title: 'Saç Bilgileri', desc: 'Saçınız hakkında bilgi verin' },
  { title: 'Cilt Bilgileri', desc: 'Cilt tipinizi belirleyin' },
  { title: 'Bakım Alışkanlıkları', desc: 'Mevcut rutininiz' },
]

export default function AnalysisStartPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(initialForm)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  function toggleArray(arr: string[], val: string): string[] {
    return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]
  }

  function canNext() {
    if (step === 0) return form.age && form.hair_type && form.scalp_condition.length > 0
    if (step === 1) return form.skin_type
    return true
  }

  /** Supabase hata nesnesi veya JS Error'dan okunabilir mesaj çıkarır */
  function extractErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message
    if (typeof err === 'object' && err !== null) {
      const e = err as Record<string, unknown>
      // Supabase PostgrestError: { message, code, details, hint }
      if (typeof e.message === 'string') return e.message
    }
    return 'Bilinmeyen hata'
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      // ── 1. Oturum kontrolü ──────────────────────────────────────────────
      const { data: { user }, error: sessionError } = await supabase.auth.getUser()
      if (sessionError) {
        console.error('[baslat] Oturum hatası:', sessionError)
        throw new Error('Oturum doğrulanamadı. Lütfen tekrar giriş yapın.')
      }
      if (!user) throw new Error('Oturum bulunamadı. Lütfen giriş yapın.')

      console.log('[baslat] Kullanıcı:', user.id)

      // ── 2. Profil upsert ─────────────────────────────────────────────────
      const profileData = {
        user_id: user.id,
        age: parseInt(form.age),
        hair_type: form.hair_type,
        hair_condition: form.hair_condition,
        scalp_condition: form.scalp_condition,
        skin_type: form.skin_type,
        skin_problems: form.skin_problems,
        uses_hair_dye: form.uses_hair_dye,
        hair_wash_frequency: parseInt(form.hair_wash_frequency),
        has_skin_routine: form.has_skin_routine,
      }

      console.log('[baslat] Profil kaydediliyor:', profileData)

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'user_id' })
        .select('id')
        .single()

      if (profileError) {
        console.error('[baslat] Profil upsert hatası:', {
          message: profileError.message,
          code: profileError.code,
          details: profileError.details,
          hint: profileError.hint,
        })
        throw profileError
      }

      console.log('[baslat] Profil kaydedildi, id:', profile.id)

      // ── 3. Analiz kaydı oluştur ──────────────────────────────────────────
      const { data: analysis, error: analysisError } = await supabase
        .from('analyses')
        .insert({ user_id: user.id, profile_id: profile.id, status: 'pending' })
        .select('id')
        .single()

      if (analysisError) {
        console.error('[baslat] Analiz insert hatası:', {
          message: analysisError.message,
          code: analysisError.code,
          details: analysisError.details,
          hint: analysisError.hint,
        })
        throw analysisError
      }

      console.log('[baslat] Analiz oluşturuldu, id:', analysis.id)

      toast.success('Profil kaydedildi! Şimdi fotoğraflarınızı yükleyin.')
      router.push(`/analiz/fotograf?id=${analysis.id}`)
    } catch (err: unknown) {
      const message = extractErrorMessage(err)
      console.error('[baslat] handleSubmit genel hata:', err)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                i < step ? 'rose-gold-bg text-white' :
                i === step ? 'bg-rose-100 text-rose-600 ring-2 ring-rose-300' :
                'bg-gray-100 text-gray-400'
              )}>
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  'flex-1 h-0.5 rounded transition-all',
                  i < step ? 'bg-rose-300' : 'bg-gray-100'
                )} />
              )}
            </div>
          ))}
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-800">{STEPS[step].title}</h2>
        <p className="text-gray-500 text-sm mt-1">{STEPS[step].desc}</p>
      </div>

      <div className="premium-card p-8">
        {/* Step 0: Hair info */}
        {step === 0 && (
          <div className="space-y-6 animate-slide-up">
            <Input
              label="Yaşınız *"
              type="number"
              value={form.age}
              onChange={e => setForm({ ...form, age: e.target.value })}
              placeholder="25"
              min="13"
              max="90"
            />

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-3">Saç Tipiniz *</label>
              <div className="flex flex-wrap gap-3">
                {HAIR_TYPES.map(({ value, label }) => (
                  <RadioItem
                    key={value}
                    label={label}
                    selected={form.hair_type === value}
                    onClick={() => setForm({ ...form, hair_type: value })}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-3">
                Saç Durumunuz <span className="text-gray-400">(birden fazla seçebilirsiniz)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {HAIR_CONDITIONS.map(({ value, label }) => (
                  <CheckItem
                    key={value}
                    label={label}
                    checked={form.hair_condition.includes(value)}
                    onChange={() => setForm({ ...form, hair_condition: toggleArray(form.hair_condition, value) })}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-3">Saç Derisi Durumunuz *</label>
              <div className="flex flex-wrap gap-2">
                {SCALP_CONDITIONS.map(({ value, label }) => (
                  <CheckItem
                    key={value}
                    label={label}
                    checked={form.scalp_condition.includes(value)}
                    onChange={() => setForm({ ...form, scalp_condition: toggleArray(form.scalp_condition, value) })}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Skin info */}
        {step === 1 && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-3">Cilt Tipiniz *</label>
              <div className="flex flex-wrap gap-3">
                {SKIN_TYPES.map(({ value, label }) => (
                  <RadioItem
                    key={value}
                    label={label}
                    selected={form.skin_type === value}
                    onClick={() => setForm({ ...form, skin_type: value })}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-3">
                Cilt Sorunlarınız <span className="text-gray-400">(varsa işaretleyin)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SKIN_PROBLEMS.map(({ value, label }) => (
                  <CheckItem
                    key={value}
                    label={label}
                    checked={form.skin_problems.includes(value)}
                    onChange={() => setForm({ ...form, skin_problems: toggleArray(form.skin_problems, value) })}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Habits */}
        {step === 2 && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-3">Saç Boyası Kullanıyor musunuz?</label>
              <div className="flex gap-3">
                {[{ v: true, l: 'Evet, kullanıyorum' }, { v: false, l: 'Hayır, kullanmıyorum' }].map(({ v, l }) => (
                  <RadioItem
                    key={String(v)}
                    label={l}
                    selected={form.uses_hair_dye === v}
                    onClick={() => setForm({ ...form, uses_hair_dye: v })}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-3">
                Saçınızı kaç günde bir yıkıyorsunuz?
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { v: '1', l: 'Her gün' },
                  { v: '2', l: '2 günde bir' },
                  { v: '3', l: '3 günde bir' },
                  { v: '4', l: '4 günde bir' },
                  { v: '7', l: 'Haftada bir' },
                ].map(({ v, l }) => (
                  <RadioItem
                    key={v}
                    label={l}
                    selected={form.hair_wash_frequency === v}
                    onClick={() => setForm({ ...form, hair_wash_frequency: v })}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-3">Cilt Bakım Rutininiz Var mı?</label>
              <div className="flex gap-3">
                {[{ v: true, l: 'Evet, düzenli bakım yapıyorum' }, { v: false, l: 'Hayır, henüz yok' }].map(({ v, l }) => (
                  <RadioItem
                    key={String(v)}
                    label={l}
                    selected={form.has_skin_routine === v}
                    onClick={() => setForm({ ...form, has_skin_routine: v })}
                  />
                ))}
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
              <p className="text-xs text-rose-700 leading-relaxed">
                ✨ Harika! Bilgileriniz kaydedildikten sonra sizi fotoğraf yükleme adımına yönlendireceğiz.
                AI analiziniz için saç, saç dibi ve yüz fotoğraflarınızı yüklemeniz istenecek.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-pink-100">
          <Button
            variant="secondary"
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Geri
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Devam Et
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              loading={loading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Fotoğraf Yüklemeye Geç
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
