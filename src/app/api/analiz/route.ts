import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { analyzeBeauty } from '@/lib/ai/analyze'
import { fileToBase64 } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const formData = await request.formData()
    const analysisId = formData.get('analysisId') as string

    if (!analysisId) {
      return NextResponse.json({ error: 'Analiz ID gerekli' }, { status: 400 })
    }

    // Get analysis record
    const { data: analysis, error: analysisError } = await supabase
      .from('analyses')
      .select('*, user_profiles(*)')
      .eq('id', analysisId)
      .eq('user_id', user.id)
      .single()

    if (analysisError || !analysis) {
      return NextResponse.json({ error: 'Analiz bulunamadı' }, { status: 404 })
    }

    // Extract photos from form data
    const hairFile = formData.get('hair') as File | null
    const scalpFile = formData.get('scalp') as File | null
    const faceFile = formData.get('face') as File | null

    let hairBase64: string | undefined
    let scalpBase64: string | undefined
    let faceBase64: string | undefined

    if (hairFile && hairFile.size > 0) {
      const buffer = await hairFile.arrayBuffer()
      hairBase64 = Buffer.from(buffer).toString('base64')
    }
    if (scalpFile && scalpFile.size > 0) {
      const buffer = await scalpFile.arrayBuffer()
      scalpBase64 = Buffer.from(buffer).toString('base64')
    }
    if (faceFile && faceFile.size > 0) {
      const buffer = await faceFile.arrayBuffer()
      faceBase64 = Buffer.from(buffer).toString('base64')
    }

    // Run AI analysis
    const result = await analyzeBeauty({
      profile: analysis.user_profiles,
      hairPhotoBase64: hairBase64,
      scalpPhotoBase64: scalpBase64,
      facePhotoBase64: faceBase64,
    })

    // Update analysis with result
    const { error: updateError } = await supabase
      .from('analyses')
      .update({
        result,
        status: 'completed',
      })
      .eq('id', analysisId)
      .eq('user_id', user.id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ success: true, result })
  } catch (error: unknown) {
    console.error('Analiz hatası:', error)

    const message = error instanceof Error ? error.message : 'Analiz sırasında bir hata oluştu'

    // Update status to failed
    try {
      const supabase = createRouteHandlerClient({ cookies })
      const formData = await (request as any).clone().formData()
      const analysisId = formData.get('analysisId') as string
      if (analysisId) {
        await supabase
          .from('analyses')
          .update({ status: 'failed' })
          .eq('id', analysisId)
      }
    } catch {}

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
