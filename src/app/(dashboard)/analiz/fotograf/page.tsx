'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, ChevronRight, Lightbulb, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PhotoUpload } from '@/components/analysis/PhotoUpload'
import { createClient } from '@/lib/supabase/client'
import { fileToBase64, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const PHOTO_STEPS = [
  {
    step: 1,
    key: 'hair',
    title: 'Saç Fotoğrafı',
    emoji: '💇‍♀️',
    description: 'Saçınızın genel görünümünü yansıtan bir fotoğraf yükleyin.',
    instructions: [
      'Saçınızı doğal haline getirin (şekillendirme yapmayın)',
      'İyi aydınlatılmış bir ortamda çekin',
      'Saçınızın tamamı görünür olsun',
      'Mümkünse beyaz veya düz renkli bir arkaplan tercih edin',
    ],
    tips: 'Sabah yeni kalktınızda değil, normal gün içinde çekin. Flaş kullanmadan doğal ışıkta çekmeniz daha iyi sonuç verir.',
  },
  {
    step: 2,
    key: 'scalp',
    title: 'Saç Dibi Fotoğrafı',
    emoji: '🔍',
    description: 'Saç diplerinizi ve saç derinizi gösteren yakın çekim bir fotoğraf yükleyin.',
    instructions: [
      'Saçınızı ortadan ikiye ayırın',
      'Saç diplerini açıkça gösteren bir açıdan çekin',
      'Mümkünse güçlü bir ışık kaynağı kullanın',
      'Net ve odaklanmış bir fotoğraf olsun',
    ],
    tips: 'Bir arkadaşınızdan yardım alarak çektirebilirsiniz. Tepeden yani yukarıdan aşağıya doğru çekilen fotoğraflar en iyi sonucu verir.',
  },
  {
    step: 3,
    key: 'face',
    title: 'Yüz Fotoğrafı',
    emoji: '🌸',
    description: 'Cilt analiziniz için makyajsız, net bir yüz fotoğrafı yükleyin.',
    instructions: [
      'Makyajsız ve temiz yüzle çekin',
      'Saçınızı arkaya toplayın',
      'Doğal ışıkta (pencere önü ideal) çekin',
      'Düz bir ifadeyle, yüzünüzün tamamı görünür şekilde çekin',
    ],
    tips: 'Güneş kremi veya nemlendirici uyguladıysanız bekleyin. Mümkünse sabah yüzünüzü yıkadıktan 30 dakika sonra çekin.',
  },
]

export default function PhotoUploadPage() {
  const searchParams = useSearchParams()
  const analysisId = searchParams.get('id')
  const [currentStep, setCurrentStep] = useState(0)
  const [files, setFiles] = useState<{ hair?: File; scalp?: File; face?: File }>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const currentPhotoStep = PHOTO_STEPS[currentStep]
  const currentKey = currentPhotoStep.key as 'hair' | 'scalp' | 'face'
  const currentFile = files[currentKey]

  async function uploadPhoto(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('user-photos')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('user-photos')
      .getPublicUrl(path)

    return publicUrl
  }

  async function handleNext() {
    if (!currentFile && currentStep < 2) {
      toast.error('Lütfen önce bir fotoğraf yükleyin')
      return
    }

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
      return
    }

    // Final step: upload and analyze
    if (!files.hair && !files.scalp && !files.face) {
      toast.error('En az bir fotoğraf yüklemeniz gerekiyor')
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !analysisId) throw new Error('Oturum hatası')

      const updates: Record<string, string> = {}

      for (const [key, file] of Object.entries(files)) {
        if (file) {
          const path = `${user.id}/${analysisId}/${key}.jpg`
          const url = await uploadPhoto(file as File, path)
          updates[`${key}_photo_url`] = url
        }
      }

      await supabase
        .from('analyses')
        .update({ ...updates, status: 'processing' })
        .eq('id', analysisId)

      // Trigger AI analysis
      const formData = new FormData()
      formData.append('analysisId', analysisId)
      if (files.hair) formData.append('hair', files.hair)
      if (files.scalp) formData.append('scalp', files.scalp)
      if (files.face) formData.append('face', files.face)

      const response = await fetch('/api/analiz', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'AI analizi başarısız')
      }

      toast.success('Analiziniz tamamlandı! 🎉')
      router.push(`/analiz/sonuc?id=${analysisId}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Bir hata oluştu')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {PHOTO_STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all flex-shrink-0',
              i < currentStep && files[PHOTO_STEPS[i].key as keyof typeof files]
                ? 'rose-gold-bg text-white'
                : i === currentStep
                ? 'bg-rose-100 text-rose-600 ring-2 ring-rose-300'
                : 'bg-gray-100 text-gray-400'
            )}>
              {i < currentStep && files[PHOTO_STEPS[i].key as keyof typeof files]
                ? <CheckCircle2 className="w-4 h-4" />
                : s.emoji}
            </div>
            {i < PHOTO_STEPS.length - 1 && (
              <div className={cn(
                'flex-1 h-0.5 rounded transition-all',
                i < currentStep ? 'bg-rose-300' : 'bg-gray-100'
              )} />
            )}
          </div>
        ))}
      </div>

      <div className="premium-card p-8">
        {/* Step header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-rose-400 uppercase tracking-wide">
              Adım {currentPhotoStep.step}/3
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-800 mb-2">
            {currentPhotoStep.title}
          </h2>
          <p className="text-gray-500 text-sm">{currentPhotoStep.description}</p>
        </div>

        {/* Instructions */}
        <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 mb-6">
          <h4 className="text-sm font-medium text-rose-700 mb-3">📸 Nasıl Çekmelisiniz?</h4>
          <ul className="space-y-2">
            {currentPhotoStep.instructions.map((inst, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-rose-600">
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {inst}
              </li>
            ))}
          </ul>
        </div>

        {/* Photo upload */}
        <PhotoUpload
          onFileSelect={file => setFiles({ ...files, [currentKey]: file })}
          currentFile={currentFile || null}
          onClear={() => setFiles({ ...files, [currentKey]: undefined })}
        />

        {/* Tip */}
        <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
          <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">{currentPhotoStep.tips}</p>
        </div>

        {/* Privacy note */}
        <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-300" />
          <p>Fotoğraflarınız şifreli olarak saklanır, yalnızca AI analizi için kullanılır ve sizden başkası göremez.</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-pink-100">
          <Button
            variant="secondary"
            onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : router.back()}
            disabled={loading}
          >
            Geri
          </Button>

          <Button
            onClick={handleNext}
            loading={loading}
            disabled={!currentFile && currentStep < 2}
          >
            {currentStep < 2 ? 'Sonraki Fotoğraf' : 'Analizi Başlat ✨'}
          </Button>
        </div>

        {currentStep === 2 && !currentFile && (
          <p className="text-center text-xs text-gray-400 mt-3">
            Yüz fotoğrafı opsiyoneldir. Mevcut fotoğraflarla devam edebilirsiniz.
          </p>
        )}
      </div>
    </div>
  )
}
