'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Trash2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import {
  HAIR_TYPES, HAIR_CONDITIONS, SCALP_CONDITIONS,
  SKIN_TYPES, SKIN_PROBLEMS, cn
} from '@/lib/utils'
import toast from 'react-hot-toast'

function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all',
        checked ? 'border-rose-300 bg-rose-50 text-rose-700 font-medium' : 'border-gray-100 bg-white text-gray-600 hover:border-rose-200'
      )}>
      <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
        checked ? 'border-rose-400 bg-rose-400' : 'border-gray-300')}>
        {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>
      {label}
    </button>
  )
}

export default function EditProfilePage() {
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [form, setForm] = useState({
    age: '',
    hair_type: '',
    hair_condition: [] as string[],
    scalp_condition: [] as string[],
    skin_type: '',
    skin_problems: [] as string[],
    uses_hair_dye: false,
    hair_wash_frequency: '3',
    has_skin_routine: false,
  })
  const router = useRouter()
  const supabase = createClient()

  function toggle(arr: string[], val: string): string[] {
    return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]
  }

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('user_profiles').select('*').eq('user_id', user.id).single()
      if (data) {
        setForm({
          age: String(data.age || ''),
          hair_type: data.hair_type || '',
          hair_condition: data.hair_condition || [],
          scalp_condition: data.scalp_condition || [],
          skin_type: data.skin_type || '',
          skin_problems: data.skin_problems || [],
          uses_hair_dye: data.uses_hair_dye || false,
          hair_wash_frequency: String(data.hair_wash_frequency || 3),
          has_skin_routine: data.has_skin_routine || false,
        })
      }
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Oturum bulunamadı')

      const { error } = await supabase.from('user_profiles').upsert({
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
      }, { onConflict: 'user_id' })

      if (error) throw error
      toast.success('Profil güncellendi!')
      router.push('/profil')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Güncelleme başarısız')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteAccount() {
    if (!deleteConfirm) {
      setDeleteConfirm(true)
      return
    }
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      // Delete all photos from storage
      await supabase.storage.from('user-photos').list(user.id).then(async ({ data }) => {
        if (data) {
          const paths = data.map(f => `${user.id}/${f.name}`)
          await supabase.storage.from('user-photos').remove(paths)
        }
      })
      await supabase.auth.signOut()
      toast.success('Hesabınız silindi')
      router.push('/')
    } catch {
      toast.error('Hesap silinirken hata oluştu')
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/profil" className="p-2 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-serif text-2xl font-bold text-gray-800">Profili Düzenle</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="premium-card p-6 space-y-6">
          <Input label="Yaşınız" type="number" value={form.age}
            onChange={e => setForm({ ...form, age: e.target.value })} placeholder="25" min="13" max="90" />

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-3">Saç Tipi</label>
            <div className="flex flex-wrap gap-3">
              {HAIR_TYPES.map(({ value, label }) => (
                <button key={value} type="button" onClick={() => setForm({ ...form, hair_type: value })}
                  className={cn('px-5 py-2.5 rounded-xl text-sm border transition-all font-medium',
                    form.hair_type === value ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-gray-100 text-gray-600 hover:border-rose-200')}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-3">Saç Durumu</label>
            <div className="flex flex-wrap gap-2">
              {HAIR_CONDITIONS.map(({ value, label }) => (
                <CheckItem key={value} label={label} checked={form.hair_condition.includes(value)}
                  onChange={() => setForm({ ...form, hair_condition: toggle(form.hair_condition, value) })} />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-3">Saç Derisi Durumu</label>
            <div className="flex flex-wrap gap-2">
              {SCALP_CONDITIONS.map(({ value, label }) => (
                <CheckItem key={value} label={label} checked={form.scalp_condition.includes(value)}
                  onChange={() => setForm({ ...form, scalp_condition: toggle(form.scalp_condition, value) })} />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-3">Cilt Tipi</label>
            <div className="flex flex-wrap gap-3">
              {SKIN_TYPES.map(({ value, label }) => (
                <button key={value} type="button" onClick={() => setForm({ ...form, skin_type: value })}
                  className={cn('px-5 py-2.5 rounded-xl text-sm border transition-all font-medium',
                    form.skin_type === value ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-gray-100 text-gray-600 hover:border-rose-200')}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-3">Cilt Sorunları</label>
            <div className="flex flex-wrap gap-2">
              {SKIN_PROBLEMS.map(({ value, label }) => (
                <CheckItem key={value} label={label} checked={form.skin_problems.includes(value)}
                  onChange={() => setForm({ ...form, skin_problems: toggle(form.skin_problems, value) })} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-pink-100">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-3">Saç Boyası</label>
              <div className="flex gap-2">
                {[{ v: true, l: 'Evet' }, { v: false, l: 'Hayır' }].map(({ v, l }) => (
                  <button key={String(v)} type="button" onClick={() => setForm({ ...form, uses_hair_dye: v })}
                    className={cn('flex-1 py-2.5 rounded-xl text-sm border transition-all',
                      form.uses_hair_dye === v ? 'border-rose-400 bg-rose-50 text-rose-700 font-medium' : 'border-gray-100 text-gray-600')}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-3">Cilt Rutini</label>
              <div className="flex gap-2">
                {[{ v: true, l: 'Var' }, { v: false, l: 'Yok' }].map(({ v, l }) => (
                  <button key={String(v)} type="button" onClick={() => setForm({ ...form, has_skin_routine: v })}
                    className={cn('flex-1 py-2.5 rounded-xl text-sm border transition-all',
                      form.has_skin_routine === v ? 'border-rose-400 bg-rose-50 text-rose-700 font-medium' : 'border-gray-100 text-gray-600')}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" loading={loading} className="w-full" icon={<Save className="w-4 h-4" />}>
          Değişiklikleri Kaydet
        </Button>
      </form>

      {/* Danger zone */}
      <div className="premium-card p-6 mt-8 border-red-100">
        <h3 className="font-medium text-red-700 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Tehlikeli Bölge
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Hesabınızı ve tüm verilerinizi (fotoğraflar dahil) kalıcı olarak silin.
          Bu işlem geri alınamaz.
        </p>
        {deleteConfirm && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-3 text-xs text-red-700">
            Bu işlem tüm fotoğraflarınızı ve analizlerinizi kalıcı olarak siler.
            Emin misiniz? Tekrar tıklayarak onaylayın.
          </div>
        )}
        <button onClick={handleDeleteAccount}
          className={cn(
            'flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all',
            deleteConfirm ? 'bg-red-500 text-white hover:bg-red-600' : 'border border-red-200 text-red-500 hover:bg-red-50'
          )}>
          <Trash2 className="w-4 h-4" />
          {deleteConfirm ? 'Evet, Hesabımı Sil' : 'Hesabımı Sil'}
        </button>
      </div>
    </div>
  )
}
