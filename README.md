# Optimasi Alokasi Anggaran Pengelolaan Sampah Kota Padang
Sistem Pendukung Keputusan berbasis Linear Programming (Metode Two-Phase Simplex)

## Deskripsi
Aplikasi web ini merupakan Sistem Pendukung Keputusan (SPK) untuk mengoptimalkan alokasi anggaran pengelolaan sampah di Kota Padang. Sistem dibangun menggunakan React + Vite + TypeScript dan menerapkan pendekatan Riset Operasi, khususnya Linear Programming dengan **Metode Two-Phase Simplex**, untuk menentukan alokasi anggaran optimal pada berbagai sektor pengelolaan sampah dengan efisiensi maksimum.

Aplikasi ini mendukung multi-sektor pengelolaan sampah, visualisasi hasil secara real-time, serta penjelasan langkah iterasi metode Two-Phase melalui tabel simplex Phase I dan Phase II.

🔗 **Demo Aplikasi:** [https://optimazepengelolaansampah.lovable.app](https://optimazepengelolaansampah.lovable.app)

## Team Members

| Nama | NPM | Role | GitHub |
|------|-----|------|--------|
| Alan Kalla | 220511076| Frontend & Algorithm Integration & Logic Implementation  | [https://github.com/AlanKalla976](https://github.com/AlanKalla976) |
| Rizky Pratama | 220511030 |  UI/UX & Visualization  | [https://github.com/rizkypratama12345](https://github.com/rizkypratama12345) |

## Tech Stack
* React
* Vite
* TypeScript
* CSS
* Linear Programming (Two-Phase Simplex Method)

## Installation

### Prerequisites
* Node.js (v18+)
* npm / yarn

### Setup
```bash
git clone https://github.com/Kelompok-4-Riset-Operasi-TI22D/optimazepengelolaansampah
cd optimazepengelolaansampah
npm install
```

## Usage

### Development
```bash
npm run dev
```

Akses melalui:
```
http://localhost:5173
```

### Build Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Features
* Input data anggaran dan sektor pengelolaan sampah
* Validasi kelayakan solusi (feasible / infeasible)
* **Metode Two-Phase Simplex**:
  - **Phase I**: Mencari solusi basis layak awal (Basic Feasible Solution)
  - **Phase II**: Optimasi fungsi tujuan asli
* Tabel iterasi simplex untuk kedua fase
* Visualisasi grafik alokasi anggaran per sektor
* Visualisasi efektivitas pengelolaan sampah
* Upload dataset (CSV / Excel)
* Export hasil optimasi (PDF / Excel)
* Responsive & user-friendly UI

## Model Matematis

### Fungsi Tujuan
**Maksimasi efektivitas pengelolaan:**
```
Max Z = Σ(eᵢ × xᵢ)
```

**Atau minimasi biaya:**
```
Min Z = Σ(cᵢ × xᵢ)
```

**Keterangan:**
* `eᵢ` = tingkat efektivitas sektor i (ton sampah terkelola per miliar rupiah)
* `cᵢ` = biaya operasional sektor i
* `xᵢ` = alokasi anggaran untuk sektor i (dalam miliar rupiah)

### Kendala

**1. Kendala Anggaran Total:**
```
Σxᵢ ≤ B
```
dimana `B` = total anggaran tersedia

**2. Kendala Minimum Alokasi:**
```
xᵢ ≥ Mᵢ
```
dimana `Mᵢ` = anggaran minimum untuk sektor i

**3. Kendala Target Pengelolaan:**
```
Σ(kᵢ × xᵢ) ≥ T
```
dimana:
* `kᵢ` = kapasitas pengelolaan sektor i (ton/miliar rupiah)
* `T` = target minimum sampah terkelola (ton)

**4. Kendala Non-negatif:**
```
xᵢ ≥ 0, ∀i
```

### Metode Two-Phase Simplex

**Phase I:**
Tujuan: Meminimasi jumlah variabel artifisial untuk mencari solusi basis layak awal.
```
Min w = Σ Aᵢ
```

dimana `Aᵢ` = variabel artifisial

**Phase II:**
Setelah solusi basis layak ditemukan (w = 0), optimasi fungsi tujuan asli menggunakan tabel simplex hasil Phase I.

## Sektor Pengelolaan Sampah

Aplikasi mencakup sektor-sektor utama pengelolaan sampah Kota Padang:

1. **Pengumpulan & Pengangkutan**
   - Armada truk sampah
   - TPS (Tempat Penampungan Sementara)
   
2. **Pengolahan (TPA/TPST)**
   - Landfill management
   - Waste-to-energy
   
3. **Daur Ulang**
   - Bank sampah
   - Industri daur ulang
   
4. **Edukasi & Sosialisasi**
   - Program 3R (Reduce, Reuse, Recycle)
   - Kampanye kesadaran masyarakat

## Dataset

Dataset mencakup:
* Nama sektor pengelolaan
* Alokasi anggaran minimum (Rp)
* Kapasitas pengelolaan (ton/miliar rupiah)
* Tingkat efektivitas sektor
* Biaya operasional per unit
* Total anggaran tersedia

Dataset dapat diinput manual atau diunggah melalui file **CSV / Excel**.

### Format Dataset (CSV)
```csv
Sektor,Anggaran_Min_Miliar,Kapasitas_Ton,Efektivitas,Biaya_Unit
Pengumpulan & Pengangkutan,15,500,0.85,2.5
Pengolahan TPA,25,800,0.90,3.2
Daur Ulang,10,300,0.75,1.8
Edukasi & Sosialisasi,5,100,0.60,1.2
```

## Results

Sistem menghasilkan:
* **Status solusi** (Feasible / Tidak Feasible)
* **Hasil Phase I**: Validasi kelayakan solusi basis awal
* **Hasil Phase II**: Solusi optimal
* **Alokasi anggaran optimal** per sektor (dalam miliar rupiah)
* **Total efektivitas pengelolaan** atau **total biaya minimum**
* **Persentase alokasi** per sektor
* **Visualisasi**:
  - Grafik distribusi anggaran
  - Perbandingan anggaran minimum vs alokasi optimal
  - Tingkat efektivitas per sektor
* **Tabel iterasi simplex** lengkap (Phase I & Phase II)
* **Shadow price** dan **sensitivity analysis**

## Roadmap

- [x] Implementasi algoritma Two-Phase Simplex
- [x] Input manual data sektor
- [x] Visualisasi hasil optimasi
- [ ] Upload file CSV/Excel
- [ ] Sensitivity analysis dashboard
- [ ] Simulasi skenario multi-tahun
- [ ] Integrasi data real-time Dinas Lingkungan Hidup Kota Padang

## Contributing

Kontribusi untuk pengembangan proyek ini terbuka untuk anggota kelompok. Silakan buat branch baru untuk fitur atau perbaikan:
```bash
git checkout -b feature/nama-fitur
git commit -m "Menambahkan fitur X"
git push origin feature/nama-fitur
```

## License

Project ini dibuat untuk keperluan akademik mata kuliah **Riset Operasi** Program Studi Teknik Informatika.

## Acknowledgement

Terima kasih kepada:
* Dosen pengampu mata kuliah Riset Operasi
* Dinas Lingkungan Hidup Kota Padang (sebagai sumber inspirasi data)
* Referensi literatur Linear Programming dan Two-Phase Simplex Method
* Komunitas open-source yang menyediakan library dan tools pendukung

---

**© 2026 Kelompok 4 - Riset Operasi TI 22D**
