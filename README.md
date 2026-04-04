# sisi-frame-be (SisiFrame Backend)

## Deskripsi Proyek

 ini merupakan layanan backend berbasis API yang dibangun menggunakan framework Next.js. Sistem ini dirancang untuk mengelola konten artikel yang terintegrasi dengan data dari MyAnimeList (MAL) dan menggunakan Supabase sebagai sistem manajemen basis data dan autentikasi. Proyek ini menangani berbagai operasi seperti pengambilan data anime/manga, manajemen artikel, serta proses autentikasi OAuth2 dengan MyAnimeList.

## Tech Stack

* **Framework**: Next.js 16.1.6 (App Router)

* **Bahasa Pemrograman**: TypeScript

* **Database & Auth**: Supabase (@supabase/ssr, @supabase/js)


* **Runtime**: Edge Runtime (untuk endpoint tertentu)

* **Integrasi Pihak Ketiga**: MyAnimeList API v2

## Struktur Direktori

Berikut adalah gambaran utama direktori:

```text
├── src/
│   ├── app/
│   │   ├── api/                # Endpoint API (Artikel, MAL Auth, dll)
│   │   │   ├── artikel/        # Handler untuk manajemen artikel
│   │   │   └── mal/            # Handler untuk login & callback MyAnimeList
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── server/                 # Logika bisnis sisi server
│   │   ├── http/               # Utilitas CORS, opsi, dan respons
│   │   ├── mal/                # Fetcher data dari MyAnimeList
│   │   ├── supabase/           # Konfigurasi Admin SDK dan dokumentasi query
│   │   ├── services/           # Layanan tambahan (seperti update source)
│   │   └── utils/              # Helper functions (PKCE, token, mapper)
│   └── types/                  # Definisi tipe data TypeScript
├── public/                     # Aset statis (SVG, favicon)
├── .env.example                # Contoh konfigurasi environment
├── package.json                # Daftar dependensi dan script
└── tsconfig.json               # Konfigurasi TypeScript
```

## Fitur Utama

1. Manajemen Artikel:

* **GET /api/artikel**: Mengambil daftar artikel dengan filter status (active, deleted, all), tipe sumber (anime/manga), dan pencarian teks.

* **POST /api/artikel**: Membuat atau memperbarui artikel dengan validasi user dan integrasi otomatis data dari MyAnimeList.

2. Integrasi MyAnimeList:

* **MAL Login**: Proses login menggunakan protokol OAuth2 dengan metode PKCE (Code Challenge & Verifier).

* **Data Fetching**: Mengambil detail data dari MAL untuk dipetakan ke dalam konten artikel.

3. Keamanan & Middleware:

* Implementasi CORS untuk keamanan akses API.

* Validasi token pengguna untuk akses endpoint yang diproteksi.

## Setup Environment

Buat file .env di direktori root dan isi berdasarkan referensi dari .env.example:

```text
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# MyAnimeList API Configuration
MAL_CLIENT_ID=your_mal_client_id
MAL_CLIENT_SECRET=your_mal_client_secret
MAL_REDIRECT_URI=your_mal_callback_url
MAL_BASE_URL=https://api.myanimelist.net/v2

# App Configuration
BASE_URL=http://localhost:3000
NEXT_PUBLIC_FRONTEND_URL=your_frontend_url
NODE_ENV=development
```

## Instalasi

1. Clone repositori ini.

2. Masuk ke direktori proyek:

```text
cd be-ore-no-frame
```

3. Instal dependensi menggunakan npm:

```text
npm install
```

## Cara Menjalankan

1. Mode Pengembangan:

```text
npm run dev
```

Buka http://localhost:3000 di browser Anda.

2. Build untuk Produksi:

```text
npm run build
npm start
```

3. Linting:

```text
npm run lint
```