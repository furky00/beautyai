'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, CheckCircle2, Camera, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface PhotoUploadProps {
  onFileSelect: (file: File) => void
  currentFile?: File | null
  onClear: () => void
  accept?: string[]
  maxSizeMB?: number
}

export function PhotoUpload({
  onFileSelect,
  currentFile,
  onClear,
  accept = ['image/jpeg', 'image/png', 'image/webp'],
  maxSizeMB = 10,
}: PhotoUploadProps) {
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null)
      const file = acceptedFiles[0]
      if (!file) return

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Dosya boyutu ${maxSizeMB}MB'dan küçük olmalıdır`)
        return
      }

      const reader = new FileReader()
      reader.onload = e => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)

      onFileSelect(file)
    },
    [maxSizeMB, onFileSelect],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
  })

  function handleClear() {
    setPreview(null)
    setError(null)
    onClear()
  }

  if (preview && currentFile) {
    return (
      <div className="relative rounded-2xl overflow-hidden border-2 border-rose-200 group">
        <img src={preview} alt="Yüklenen fotoğraf" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
          <div className="flex items-center gap-2 text-white text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            {currentFile.name}
          </div>
          <button
            onClick={handleClear}
            className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Yüklendi
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
          isDragActive
            ? 'border-rose-400 bg-rose-50'
            : 'border-pink-200 bg-pink-50/30 hover:border-rose-300 hover:bg-rose-50/50',
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {isDragActive ? (
            <Upload className="w-10 h-10 text-rose-400 animate-bounce" />
          ) : (
            <Camera className="w-10 h-10 text-rose-300" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-700">
              {isDragActive ? 'Fotoğrafı bırakın' : 'Fotoğrafı sürükleyin veya tıklayın'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG veya WebP · Maks. {maxSizeMB}MB
            </p>
          </div>
          <div className="btn-secondary text-xs py-2 px-4 mt-1">
            Fotoğraf Seç
          </div>
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-500 text-xs">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}
    </div>
  )
}
