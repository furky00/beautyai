# GlowMind – AI Destekli Saç & Cilt Bakım Danışmanı

Kadınlara özel, kişisel saç ve cilt bakım analizi sunan modern web uygulaması.

## Özellikler

- **Kullanıcı Kaydı / Girişi** – Supabase Auth ile güvenli kimlik doğrulama
- **Kişisel Profil** – Saç tipi, cilt tipi ve bakım alışkanlıkları formu
- **3 Adımlı Fotoğraf Yükleme** – Saç → Saç dibi → Yüz fotoğrafı
- **Claude Vision AI Analizi** – Fotoğraf + profil verisiyle kişisel analiz
- **Haftalık Rutin Tablosu** – 7 günlük görsel bakım planı
- **Bakım Takvimi** – Tekrarlayan hatırlatmalar
- **Geçmiş Analizler** – Tüm analiz geçmişini görüntüleme
- **KVKK Uyumlu** – Fotoğraf onayı, veri silme, gizlilik politikası

## Teknoloji

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Veritabanı / Auth:** Supabase
- **AI:** OpenAI Vision API (gpt-4o / gpt-4o-mini)
- **Dosya Depolama:** Supabase Storage (şifreli, özel bucket)

## Kurulum

### 1. Node.js'i Kurun
https://nodejs.org adresinden LTS sürümünü indirin ve kurun.

### 2. Bağımlılıkları Yükleyin
```bash
cd beauty-ai
npm install
```

### 3. Supabase Projesi Oluşturun
- https://supabase.com adresinden ücretsiz proje açın
- `src/lib/supabase/schema.sql` dosyasındaki SQL'i çalıştırın
- Storage > Buckets'tan `user-photos` adında **private** bucket oluşturun
- Storage policies ekleyin (schema.sql'deki yorum satırlarına bakın)

### 4. OpenAI API Key Alın
- https://platform.openai.com/api-keys adresinden API key oluşturun

### 5. Ortam Değişkenlerini Ayarlayın
```bash
cp .env.local.example .env.local
```
`.env.local` dosyasını düzenleyerek kendi değerlerinizi girin.

### 6. Uygulamayı Başlatın
```bash
npm run dev
```

http://localhost:3000 adresinde açılır.

## Proje Yapısı

```
src/
├── app/
│   ├── page.tsx                    # Ana sayfa (landing)
│   ├── (auth)/
│   │   ├── giris/page.tsx          # Giriş sayfası
│   │   └── kayit/page.tsx          # Kayıt sayfası
│   ├── (dashboard)/
│   │   ├── profil/page.tsx         # Profil sayfası
│   │   ├── profil/duzenle/page.tsx # Profil düzenleme
│   │   ├── analiz/baslat/page.tsx  # Bilgi formu (3 adım)
│   │   ├── analiz/fotograf/page.tsx # Fotoğraf yükleme (3 adım)
│   │   ├── analiz/sonuc/page.tsx   # AI analiz sonucu
│   │   ├── rutin/page.tsx          # Haftalık rutin tablosu
│   │   ├── takvim/page.tsx         # Bakım takvimi
│   │   └── gecmis/page.tsx         # Geçmiş analizler
│   ├── api/analiz/route.ts         # AI analiz API endpoint
│   └── gizlilik/page.tsx           # Gizlilik politikası
├── components/
│   ├── ui/                         # Button, Input, Card, Badge
│   ├── layout/                     # Navbar, Footer
│   ├── analysis/                   # PhotoUpload, AnalysisResult
│   └── routine/                    # WeeklyTable
├── lib/
│   ├── supabase/                   # client.ts, server.ts, schema.sql
│   ├── ai/analyze.ts               # Claude Vision API entegrasyonu
│   └── utils.ts                    # Yardımcı fonksiyonlar
└── types/index.ts                  # TypeScript tip tanımlamaları
```

## Renk Paleti

| Renk | Kullanım | Hex |
|------|----------|-----|
| Rose Gold | Ana renk, butonlar | `#b76e79` |
| Soft Pink | Arkaplan gradyanı | `#fce7f3` |
| Cream | Kart arkaplanı | `#fdf6e3` |
| White | Ana arkaplan | `#fffaf9` |
| Blush | İkincil öğeler | `#fda4af` |

## Güvenlik

- Row Level Security (RLS) ile kullanıcı verisi izolasyonu
- Supabase Auth ile JWT tabanlı oturum yönetimi
- Private storage bucket ile fotoğraf gizliliği
- Kullanıcı onayı zorunlu kayıt akışı
- KVKK uyumlu gizlilik ve aydınlatma metinleri

## AI Analizi Hakkında

Uygulama tıbbi teşhis **koymaz**. Cilt hastalığı, ciddi dökülme, enfeksiyon veya
tahriş durumlarında dermatoloğa yönlendirme yapar. Öneriler yalnızca genel bakım
tavsiyeleri niteliğindedir.
