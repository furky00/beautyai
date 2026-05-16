-- ============================================================
-- GlowMind – Supabase SQL Şeması
-- Supabase Dashboard > SQL Editor'a kopyalayıp çalıştırın.
-- Defalarca çalıştırılabilir (idempotent).
-- ============================================================

-- ── 1. TABLOLAR ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_profiles (
  id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID        REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name           TEXT,
  age                 INTEGER     CHECK (age >= 13 AND age <= 120),
  hair_type           TEXT        CHECK (hair_type IN ('duz', 'dalgali', 'kivircik')),
  hair_condition      TEXT[]      DEFAULT '{}',
  scalp_condition     TEXT[]      DEFAULT '{}',
  skin_type           TEXT        CHECK (skin_type IN ('kuru', 'yagli', 'karma', 'hassas')),
  skin_problems       TEXT[]      DEFAULT '{}',
  uses_hair_dye       BOOLEAN     DEFAULT false,
  hair_wash_frequency INTEGER     DEFAULT 3,
  has_skin_routine    BOOLEAN     DEFAULT false,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analyses (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profile_id      UUID        REFERENCES user_profiles(id) ON DELETE SET NULL,
  hair_photo_url  TEXT,
  scalp_photo_url TEXT,
  face_photo_url  TEXT,
  status          TEXT        DEFAULT 'pending'
                              CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'retrying')),
  result          JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS calendar_reminders (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  analysis_id    UUID        REFERENCES analyses(id) ON DELETE SET NULL,
  type           TEXT        CHECK (type IN ('sac_yikama','sac_maskesi','boya_yenileme','sac_kestirme','cilt_bakimi')),
  title          TEXT        NOT NULL,
  scheduled_date DATE        NOT NULL,
  scheduled_time TIME        NOT NULL,
  recurring      BOOLEAN     DEFAULT false,
  recurring_days INTEGER,
  is_active      BOOLEAN     DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. UPDATED_AT TRİGGERİ ───────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_profiles_updated_at ON user_profiles;
CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── 3. ROW LEVEL SECURITY (RLS) ──────────────────────────────

ALTER TABLE user_profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses           ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_reminders ENABLE ROW LEVEL SECURITY;

-- user_profiles politikaları
DROP POLICY IF EXISTS "Users can view own profile"   ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON user_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- analyses politikaları
DROP POLICY IF EXISTS "Users can view own analyses"   ON analyses;
DROP POLICY IF EXISTS "Users can insert own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can delete own analyses" ON analyses;

CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON analyses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON analyses FOR DELETE
  USING (auth.uid() = user_id);

-- calendar_reminders politikaları
DROP POLICY IF EXISTS "Users can manage own reminders" ON calendar_reminders;

CREATE POLICY "Users can manage own reminders"
  ON calendar_reminders FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 4. STORAGE BUCKET ────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-photos',
  'user-photos',
  false,
  10485760,   -- 10 MB
  ARRAY['image/jpeg','image/png','image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public             = false,
  file_size_limit    = 10485760,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp'];

-- ── 5. STORAGE POLİTİKALARI ──────────────────────────────────
-- Kullanıcı yalnızca kendi klasörüne (user-photos/{user_id}/*) erişebilir.

DROP POLICY IF EXISTS "Users can upload own photos"  ON storage.objects;
DROP POLICY IF EXISTS "Users can view own photos"    ON storage.objects;
DROP POLICY IF EXISTS "Users can update own photos"  ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own photos"  ON storage.objects;

CREATE POLICY "Users can upload own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'user-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'user-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'user-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── 6. DOĞRULAMA SORGUSU ─────────────────────────────────────
-- Çalıştırdıktan sonra aşağıdaki satırı çalıştırarak tabloları kontrol edin:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('user_profiles', 'analyses', 'calendar_reminders');
-- → 3 satır görünmeli.
