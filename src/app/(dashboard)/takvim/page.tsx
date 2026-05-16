'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Bell, Clock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { REMINDER_TYPES, cn } from '@/lib/utils'
import type { CalendarReminder } from '@/types'
import toast from 'react-hot-toast'

const REMINDER_TYPE_OPTIONS = Object.entries(REMINDER_TYPES).map(([value, data]) => ({
  value,
  ...data,
}))

export default function CalendarPage() {
  const [reminders, setReminders] = useState<CalendarReminder[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    type: 'sac_yikama',
    title: '',
    scheduled_date: '',
    scheduled_time: '09:00',
    recurring: false,
    recurring_days: 7,
  })
  const supabase = createClient()

  async function loadReminders() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('calendar_reminders')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('scheduled_date', { ascending: true })

    setReminders(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadReminders()
  }, [])

  async function handleAddReminder(e: React.FormEvent) {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const reminderData = {
      user_id: user.id,
      type: form.type,
      title: form.title || REMINDER_TYPES[form.type as keyof typeof REMINDER_TYPES]?.label,
      scheduled_date: form.scheduled_date,
      scheduled_time: form.scheduled_time,
      recurring: form.recurring,
      recurring_days: form.recurring ? form.recurring_days : null,
      is_active: true,
    }

    const { error } = await supabase.from('calendar_reminders').insert(reminderData)
    if (error) {
      toast.error('Hatırlatma eklenemedi')
      return
    }

    toast.success('Hatırlatma eklendi! 🗓️')
    setShowForm(false)
    setForm({ type: 'sac_yikama', title: '', scheduled_date: '', scheduled_time: '09:00', recurring: false, recurring_days: 7 })
    loadReminders()
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from('calendar_reminders')
      .update({ is_active: false })
      .eq('id', id)

    if (!error) {
      setReminders(prev => prev.filter(r => r.id !== id))
      toast.success('Hatırlatma silindi')
    }
  }

  const groupedByDate = reminders.reduce<Record<string, CalendarReminder[]>>((acc, r) => {
    if (!acc[r.scheduled_date]) acc[r.scheduled_date] = []
    acc[r.scheduled_date].push(r)
    return acc
  }, {})

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-800">Bakım Takvimim</h1>
          <p className="text-gray-500 text-sm mt-1">Hatırlatmalarını yönet</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} icon={<Plus className="w-4 h-4" />}>
          Hatırlatma Ekle
        </Button>
      </div>

      {/* Add reminder form */}
      {showForm && (
        <div className="premium-card p-6 mb-6 animate-slide-up">
          <h3 className="font-serif text-lg font-semibold text-gray-800 mb-5">Yeni Hatırlatma</h3>
          <form onSubmit={handleAddReminder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Hatırlatma Türü</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {REMINDER_TYPE_OPTIONS.map(({ value, label, icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm({ ...form, type: value })}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-xl border text-sm transition-all',
                      form.type === value
                        ? 'border-rose-300 bg-rose-50 text-rose-700 font-medium'
                        : 'border-gray-100 hover:border-rose-200 text-gray-600'
                    )}
                  >
                    <span>{icon}</span>
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Başlık <span className="text-gray-400">(opsiyonel)</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder={REMINDER_TYPES[form.type as keyof typeof REMINDER_TYPES]?.label}
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Tarih *</label>
                <input
                  type="date"
                  value={form.scheduled_date}
                  onChange={e => setForm({ ...form, scheduled_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Saat *</label>
                <input
                  type="time"
                  value={form.scheduled_time}
                  onChange={e => setForm({ ...form, scheduled_time: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.recurring}
                  onChange={e => setForm({ ...form, recurring: e.target.checked })}
                  className="accent-rose-500 w-4 h-4"
                />
                <span className="text-sm text-gray-600">Tekrarlayan hatırlatma</span>
              </label>
              {form.recurring && (
                <div className="mt-3 pl-7">
                  <label className="block text-xs text-gray-500 mb-1">Her kaç günde bir?</label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 7, 14, 21, 30].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setForm({ ...form, recurring_days: d })}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs border transition-all',
                          form.recurring_days === d
                            ? 'border-rose-400 bg-rose-50 text-rose-700 font-medium'
                            : 'border-gray-100 text-gray-500 hover:border-rose-200'
                        )}
                      >
                        {d === 1 ? 'Her gün' : d === 7 ? 'Haftada bir' : d === 14 ? '2 haftada bir' : d === 30 ? 'Ayda bir' : `${d} günde bir`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" icon={<CheckCircle2 className="w-4 h-4" />}>Ekle</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>İptal</Button>
            </div>
          </form>
        </div>
      )}

      {/* Reminders list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 rounded-2xl shimmer" />
          ))}
        </div>
      ) : Object.keys(groupedByDate).length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Henüz hatırlatma yok</p>
          <p className="text-sm text-gray-400">Bakım rutininiz için hatırlatmalar ekleyin</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, dayReminders]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                {new Date(date).toLocaleDateString('tr-TR', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </h3>
              <div className="space-y-2">
                {dayReminders.map(reminder => {
                  const typeData = REMINDER_TYPES[reminder.type as keyof typeof REMINDER_TYPES]
                  return (
                    <div key={reminder.id}
                      className="premium-card p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-xl">
                          {typeData?.icon || '📅'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{reminder.title}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {reminder.scheduled_time}
                            {reminder.recurring && (
                              <span className="ml-2 text-rose-400">
                                · Her {reminder.recurring_days} günde bir
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(reminder.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
