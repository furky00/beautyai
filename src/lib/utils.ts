import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
  })
}

export const HAIR_TYPES = [
  { value: 'duz', label: 'Düz' },
  { value: 'dalgali', label: 'Dalgalı' },
  { value: 'kivircik', label: 'Kıvırcık' },
]

export const HAIR_CONDITIONS = [
  { value: 'kuru', label: 'Kuru' },
  { value: 'yagli', label: 'Yağlı' },
  { value: 'yipranmis', label: 'Yıpranmış' },
  { value: 'boyali', label: 'Boyalı' },
  { value: 'dokulum', label: 'Dökülme var' },
  { value: 'elektrik', label: 'Elektriklenme' },
  { value: 'ince', label: 'İnce/Cansız' },
]

export const SCALP_CONDITIONS = [
  { value: 'yagli', label: 'Yağlı' },
  { value: 'kuru', label: 'Kuru' },
  { value: 'kepekli', label: 'Kepekli' },
  { value: 'hassas', label: 'Hassas' },
  { value: 'kasinma', label: 'Kaşıntı' },
  { value: 'normal', label: 'Normal' },
]

export const SKIN_TYPES = [
  { value: 'kuru', label: 'Kuru' },
  { value: 'yagli', label: 'Yağlı' },
  { value: 'karma', label: 'Karma' },
  { value: 'hassas', label: 'Hassas' },
]

export const SKIN_PROBLEMS = [
  { value: 'akne', label: 'Akne/Sivilce' },
  { value: 'leke', label: 'Leke' },
  { value: 'kizariklik', label: 'Kızarıklık' },
  { value: 'gozetek', label: 'Geniş Gözenek' },
  { value: 'kuruluk', label: 'Kuruluk/Pullanma' },
  { value: 'halkalar', label: 'Göz Altı Halkası' },
  { value: 'sarkma', label: 'Sarkma/Elastikiyet Kaybı' },
]

export const REMINDER_TYPES = {
  sac_yikama: { label: 'Saç Yıkama', icon: '💧', color: 'blue' },
  sac_maskesi: { label: 'Saç Maskesi', icon: '✨', color: 'purple' },
  boya_yenileme: { label: 'Boya Yenileme', icon: '🎨', color: 'pink' },
  sac_kestirme: { label: 'Saç Kestirme', icon: '✂️', color: 'green' },
  cilt_bakimi: { label: 'Cilt Bakımı', icon: '🌸', color: 'rose' },
}
