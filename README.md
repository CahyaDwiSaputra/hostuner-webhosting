# 🚀 Hostuner Webhosting Platform

Platform penjualan Web Hosting, Registrasi Domain, dan Cloud VPS modern dengan desain presisi berbasis Figma dan integrasi gerbang pembayaran resmi **Billing.hostuner.com** (WHMCS).

---

## 🌟 Fitur Utama

- **Landing Page Modern**: Desain presisi sesuai UI/UX Figma dengan palet warna Electric Blue & Slate Dark, tipografi bersih Plus Jakarta Sans, dan anti-slop copy.
- **Pengecekan Domain Real-Time**: Fitur instan untuk memeriksa ketersediaan nama domain lokal dan internasional (`.com`, `.id`, `.co.id`, `.web.id`, `.org`, `.us`, dll.).
- **Katalog Paket Hosting Resmi**:
  - **Hosting Mini** (`PID 40`): Rp 50.000/tahun (~Rp 4.167/bulan), 60 MB SSD, CloudLinux + Varnish.
  - **Hosting Pro** (`PID 4`): Rp 30.000/bulan (Rp 300.000/tahun), 600 MB SSD, Unmetered Bandwidth, **Gratis Domain .COM**.
  - **Hosting Enterprise** (`PID 5`): Rp 50.000/bulan (Rp 500.000/tahun), 1.2 GB SSD, Unmetered Bandwidth, **Gratis Domain Pilihan**.
- **Wizard Checkout 4-Langkah**:
  1. Konfigurasi Paket & Durasi (Bulanan / Tahunan).
  2. Registrasi / Transfer Domain & Addon Privasi.
  3. Perhitungan Siklus Tagihan, Diskon Kupon, dan PPN.
  4. Pengalihan Pembayaran Otomatis ke **Billing.hostuner.com**.
- **Integrasi Subdomain Pembayaran WHMCS**:
  - Parameter URL pemesanan langsung terhubung ke produk WHMCS Hostuner:
    ```text
    https://billing.hostuner.com/cart.php?a=add&pid={pid}&billingcycle={billingcycle}&domain=register&query={domain}&invoice={invoice}&amount={amount}
    ```
- **Panel Administrator (CMS Lengkap)**:
  - Kustomisasi Tampilan & Tema (Nama web, teks logo, kontak, headline hero banner, warna tema).
  - Manajemen Konten Card Hosting & VPS (Edit nama paket, kuota disk, RAM, CPU, harga, dan WHMCS PID).
  - Manajemen Review & Testimoni Pelanggan (Tambah, edit ulasan, rating 1-5 bintang, foto profil, sembunyikan/tampilkan ulasan).
  - Konfigurasi URL Subdomain Pembayaran tanpa perlu rebuild aplikasi.
- **Portal Klien (Client Area)**: Kelola layanan aktif, akses cPanel, manajemen DNS domain, faktur tagihan (invoices), dan tiket bantuan teknis.

---

## 🛠️ Tech Stack & Arsitektur

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite, Lucide Icons.
- **Backend**: Express.js, TypeScript, PostgreSQL Client (`pg`), Helmet, Morgan, CORS.
- **Database**: PostgreSQL 16 (`buana_hosting_db`).
- **Containerization**: Docker & Docker Compose.

---

## 🚀 Panduan Menjalankan Sistem

### 1. Prasyarat
- Node.js v18+ & npm
- PostgreSQL database aktif

### 2. Konfigurasi Backend
```bash
cd backend
cp .env.example .env
npm install
npm run build
npm start
```
*Backend berjalan di: `http://localhost:5000`*

### 3. Konfigurasi Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend berjalan di: `http://localhost:3000`*

---

## 🔐 Kredensial Akses Demo
- **Administrator CMS**: `admin@hostuner.com` (Password bebas untuk demo / klik tombol ungu *Admin Panel*)
- **Pelanggan Demo**: `cahya@gmail.com`

---

## 📄 Lisensi & Hak Cipta
© 2026 **Hostuner Webhosting**. Seluruh hak cipta dilindungi undang-undang.
