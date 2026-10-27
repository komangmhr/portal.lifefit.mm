# LifeFit MM — Portal bug fix design

Prototype desain perbaikan **34 bug yang masih open** di Portal LifeFit Myanmar `mm.lifefit.mobi` (LF-235, retest 21 Okt 2026), mengacu ke referensi `new-lifefit.vercel.app`.

- Panel kiri berisi daftar bug. Klik satu bug untuk membuka layar perbaikannya. Chip `LF-xxx` di setiap layar menjelaskan apa yang diperbaiki.
- Toggle **Demo data: New account / Has activity** menampilkan empty state vs data nyata (LF-280, 291, 328).
- Status Save, challenge, notifikasi, privacy, dan bahasa disimpan di browser untuk mensimulasikan persistence di server. Gunakan **Reset demo data** untuk mengulang.
- Desain CMS pasangannya ada di repo [`cms.lifefit.mm`](https://github.com/komangmhr/cms.lifefit.mm).

## Deploy ke Vercel

1. Vercel → **Add New → Project** → import `komangmhr/portal.lifefit.mm`.
2. Framework preset: **Other**. Build command: kosong. Output directory: `.`.
3. Deploy. Setiap push ke `main` akan ter-deploy otomatis.

## Bug → layar

| Bug | Owner | Layar | Perbaikan |
|---|---|---|---|
| LF-268 Start Workout tidak ada | Portal | `#/exercise` → `#/session` | CTA Start Workout membuka sesi (set counter, rest timer, konfirmasi keluar) |
| LF-271 User baru tidak ke Onboarding | Portal | `#/login` | Aturan routing: `onboarding_completed=false` → `/onboarding` |
| LF-277 Summary BMI "--", priorities kosong | CMS+Portal | `#/onb-summary` | BMI dihitung dari input, kategori, skala; priorities dari aturan CMS |
| LF-279 Onboarding tidak tersimpan | Portal | `#/onb-summary` | "Save & continue" menyimpan ke profil |
| LF-280 Daily Progress statis | CMS+Portal | `#/home` | Persentase = rata-rata 3 komponen; empty state akun baru |
| LF-285 Filter resep | CMS | `#/cooking` | Filter bekerja + jumlah per chip + empty state |
| LF-286 / LF-317 Filter level & gaya Yoga | CMS | `#/yoga` | Filter Level + Style, featured Morning Flow, empty state |
| LF-287 Filter Mind | CMS | `#/mind` | Filter kategori bekerja |
| LF-291 Statistik Profile statis | Portal | `#/profile` | Statistik dan grafik dari data, 0 untuk akun baru |
| LF-293 Label belum diterjemahkan | CMS+Portal | `#/profile` → Language | Label dari Translations, fallback EN |
| LF-294 Terms/Privacy "1"/"2" | CMS | `#/legal-doc/terms` | Dokumen dengan versi & tanggal efektif dari CMS |
| LF-296 Layout Sign In | Portal | `#/login` | "Sign in or Sign up", +95 default, Create New Account |
| LF-298 Intro onboarding | CMS+Portal | `#/onboarding` | Slide referensi + Next/Skip |
| LF-302 Pilih negara | CMS+Portal | `#/onb-country` | Field Country di Step 1 (sheet negara, tetap 12 step) |
| LF-307 Featured Program | CMS | `#/fitness` | Banner program 8 minggu |
| LF-309 Filter goal | CMS | `#/fitness` | Chip goal + empty state |
| LF-310 Info exercise | CMS | `#/exercise` | Level, sets/reps/rest, target muscles, equipment |
| LF-315 Save recipe | Portal | `#/recipe/24` | State Save bertahan setelah reload |
| LF-319 Daily Challenge | Portal | `#/motivation` | Status Completed bertahan |
| LF-323 Message coach | CMS+Portal | `#/coach-chat` | Layar chat |
| LF-324 Reschedule | CMS+Portal | `#/coach` → Reschedule | Sheet pilih hari & slot (MMT) |
| LF-327 / LF-328 Notifikasi | CMS+Portal | `#/notifications` | Mark all read tersimpan; list per user; empty state |
| LF-329 Private profile | Portal | `#/privacy` | Toggle tersimpan + feedback "Saved" |
| LF-330 Logged-in devices | Portal | `#/devices` | Daftar perangkat, Sign out per perangkat / semua |
| LF-332 Chat with support | CMS+Portal | `#/support-chat` | Live chat |
| LF-333 Download my data | CMS+Portal | `#/legal` | Request → Processing → Ready |
| LF-339 Level di kartu plan | CMS | `#/fitness` | Tag level di kartu |
| LF-342 / LF-343 Kartu resep & typo | CMS | `#/cooking` | Waktu masak + kcal; nama dan bahan diperbaiki |
| LF-349 Makronutrien coach | CMS | `#/coach` | Target kcal/carbs/protein/fat + split |
| LF-351 Menu Legal & Data | Portal | `#/profile` | Row baru di menu Profile |
| LF-352 Edit Profile tanpa konfirmasi | Portal | `#/edit-profile` | Dialog Save / Discard / Cancel |

Sumber: `bugs-portal-mm.md` (retest 2026-10-21). Daftar lengkap ada di `assets/bugs.js`.

## Catatan

- Terjemahan Burmese di prototype adalah draft dan perlu dicek penerjemah MM.
- Gambar diganti placeholder ilustrasi. Pakai aset asli dari CMS saat implementasi.
- Video session dengan coach tetap "coming soon" (di luar scope, sesuai LF-264).
