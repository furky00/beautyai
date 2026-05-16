'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WeeklyRoutine, DayRoutine, RoutineItem } from '@/types'

// ── Intensity config ─────────────────────────────────────────────
const INTENSITY = {
  hafif: {
    gradient: 'from-emerald-400 to-teal-500',
    border: 'border-emerald-100',
    bg: 'bg-emerald-50/40',
    dots: 1,
    label: 'Hafif',
  },
  orta: {
    gradient: 'from-amber-400 to-orange-400',
    border: 'border-amber-100',
    bg: 'bg-amber-50/40',
    dots: 2,
    label: 'Orta',
  },
  yogun: {
    gradient: 'from-rose-400 to-pink-500',
    border: 'border-rose-100',
    bg: 'bg-rose-50/40',
    dots: 3,
    label: 'Yoğun',
  },
}

const FOCUS_LABEL: Record<string, string> = {
  cilt: '🌸 Cilt',
  sac: '💇‍♀️ Saç',
  sac_derisi: '🔍 Saç Derisi',
  genel: '✨ Genel',
}

// ── Intensity dots ───────────────────────────────────────────────
function IntensityDots({ level }: { level: string }) {
  const cfg = INTENSITY[level as keyof typeof INTENSITY] ?? INTENSITY.orta
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className={cn(
            'w-2 h-2 rounded-full',
            i <= cfg.dots ? 'bg-white' : 'bg-white/25',
          )}
        />
      ))}
      <span className="text-white/70 text-[10px] ml-1 font-medium">{cfg.label}</span>
    </div>
  )
}

// ── Single routine step row ──────────────────────────────────────
function StepRow({
  item,
  index,
  side,
}: {
  item: RoutineItem
  index: number
  side: 'morning' | 'evening'
}) {
  const [open, setOpen] = useState(false)
  const numBg =
    side === 'morning'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-indigo-100 text-indigo-700'
  const rowBg = side === 'morning' ? 'bg-amber-50/60' : 'bg-indigo-50/60'

  return (
    <div className={cn('rounded-xl p-3', rowBg)}>
      <div className="flex items-start gap-2.5">
        <div
          className={cn(
            'w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5',
            numBg,
          )}
        >
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <div>
              <span className="text-sm font-medium text-gray-800">
                {item.icon} {item.step}
              </span>
              <p className="text-xs text-gray-500 mt-0.5">{item.product_type}</p>
            </div>
            {item.duration && (
              <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5">
                {item.duration}
              </span>
            )}
          </div>
          {item.why && (
            <>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-0.5 mt-1.5 text-[10px] text-rose-400 hover:text-rose-600 transition-colors"
              >
                {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                Neden?
              </button>
              {open && (
                <p className="mt-1.5 text-xs text-gray-600 bg-white/80 rounded-lg px-2.5 py-2 italic leading-relaxed">
                  {item.why}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Day card ─────────────────────────────────────────────────────
function DayCard({ day }: { day: DayRoutine }) {
  const cfg = INTENSITY[day.intensity as keyof typeof INTENSITY] ?? INTENSITY.orta
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [collapsed, setCollapsed] = useState(false)

  const checkedCount = Object.values(checked).filter(Boolean).length
  const total = day.checklist?.length ?? 0
  const pct = total ? Math.round((checkedCount / total) * 100) : 0

  return (
    <div
      className={cn(
        'border rounded-2xl overflow-hidden flex flex-col h-full',
        cfg.border,
        cfg.bg,
      )}
    >
      {/* ── Header ── */}
      <button
        className={cn(
          'bg-gradient-to-br text-left p-4 w-full',
          cfg.gradient,
        )}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="text-white/65 text-[10px] font-semibold uppercase tracking-widest">
              {day.day}
            </p>
            <h3 className="text-white font-semibold text-sm leading-snug mt-0.5">
              {day.theme_icon} {day.theme}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <IntensityDots level={day.intensity} />
            {collapsed ? (
              <ChevronDown className="w-3.5 h-3.5 text-white/60" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-white/60" />
            )}
          </div>
        </div>

        {/* Focus tags */}
        {day.focus?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {day.focus.map(f => (
              <span
                key={f}
                className="text-white/85 bg-white/20 text-[10px] px-2 py-0.5 rounded-full"
              >
                {FOCUS_LABEL[f] ?? f}
              </span>
            ))}
          </div>
        )}

        {/* Progress bar */}
        {total > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-white/60 mb-1">
              <span>Günlük kontrol</span>
              <span>{checkedCount}/{total}</span>
            </div>
            <div className="h-1 bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
      </button>

      {/* ── Body ── */}
      {!collapsed && (
        <div className="p-4 flex-1 space-y-4">
          {/* Why this day */}
          {day.why && (
            <p className="text-xs text-gray-500 italic leading-relaxed border-l-2 border-rose-200 pl-2.5 py-0.5">
              {day.why}
            </p>
          )}

          {/* Morning */}
          {day.morning?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-amber-600 mb-2">🌅 Sabah Rutini</p>
              <div className="space-y-2">
                {day.morning.map((item, i) => (
                  <StepRow key={i} item={item} index={i} side="morning" />
                ))}
              </div>
            </div>
          )}

          {/* Hair routine */}
          {day.hair_routine && (
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-3.5">
              <p className="text-xs font-semibold text-violet-700 mb-1.5">
                {day.hair_routine.icon} {day.hair_routine.treatment}
              </p>
              <p className="text-xs text-violet-600 mb-2 leading-relaxed">
                {day.hair_routine.why}
              </p>
              <div className="flex flex-wrap gap-1 mb-2">
                {day.hair_routine.product_types?.map((p, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full"
                  >
                    {p}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-violet-400 font-medium">
                ⏱️ {day.hair_routine.duration}
              </p>
            </div>
          )}

          {/* Evening */}
          {day.evening?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-indigo-600 mb-2">🌙 Akşam Rutini</p>
              <div className="space-y-2">
                {day.evening.map((item, i) => (
                  <StepRow key={i} item={item} index={i} side="evening" />
                ))}
              </div>
            </div>
          )}

          {/* Checklist */}
          {day.checklist?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">✅ Günlük Kontrol</p>
              <div className="space-y-1.5">
                {day.checklist.map(item => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() =>
                      setChecked(prev => ({ ...prev, [item.id]: !prev[item.id] }))
                    }
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                        checked[item.id]
                          ? 'border-rose-400 bg-rose-400'
                          : 'border-gray-300 group-hover:border-rose-300',
                      )}
                    >
                      {checked[item.id] && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span
                      className={cn(
                        'text-xs transition-colors',
                        checked[item.id]
                          ? 'text-gray-400 line-through'
                          : 'text-gray-600 group-hover:text-gray-800',
                      )}
                    >
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Pro tip */}
          {day.tip && (
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-rose-500 mb-0.5 uppercase tracking-wide">
                💡 Pro İpucu
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">{day.tip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Public component ─────────────────────────────────────────────
export function WeeklyRoutineTable({ routine }: { routine: WeeklyRoutine }) {
  const days: DayRoutine[] = [
    routine.monday,
    routine.tuesday,
    routine.wednesday,
    routine.thursday,
    routine.friday,
    routine.saturday,
    routine.sunday,
  ]

  return (
    <>
      {/* Desktop: 7 cols */}
      <div className="hidden xl:grid grid-cols-7 gap-3 items-start">
        {days.map(d => (
          <DayCard key={d.day} day={d} />
        ))}
      </div>

      {/* Tablet: 3-4 cols */}
      <div className="hidden md:grid xl:hidden grid-cols-3 lg:grid-cols-4 gap-4 items-start">
        {days.map(d => (
          <DayCard key={d.day} day={d} />
        ))}
      </div>

      {/* Mobile: accordion list */}
      <div className="md:hidden space-y-3">
        {days.map(d => (
          <DayCard key={d.day} day={d} />
        ))}
      </div>
    </>
  )
}
