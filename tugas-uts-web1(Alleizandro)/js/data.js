/* ==========================================================
   data.js — data dummy (pengganti server/database)
   Semua data disimpan dalam variabel konstanta berformat Array JSON.
   ========================================================== */

// Data pengguna untuk login
const dataPengguna = [
  { id: 1, nama: "Rani Wulandari", email: "rani@tehbuku.id", password: "teh12345", role: "Pelanggan" },
  { id: 2, nama: "Admin Toko", email: "admin@tehbuku.id", password: "admin123", role: "Admin" },
  { id: 3, nama: "Mahasiswa UT", email: "mahasiswa@ut.ac.id", password: "ut2026", role: "Pelanggan" }
];

// Data katalog / stok buku
const dataKatalogBuku = [
  { kodeBarang: "BK-001", namaBarang: "Pemrograman Web Dasar",            jenis: "Teknologi", edisi: "3", stok: 24, harga: 85000,  cover: "img/buku1.png" },
  { kodeBarang: "BK-002", namaBarang: "Algoritma di Ladang Kata",         jenis: "Teknologi", edisi: "2", stok: 18, harga: 92000,  cover: "img/buku2.png" },
  { kodeBarang: "BK-003", namaBarang: "Basis Data Itu Mudah",             jenis: "Teknologi", edisi: "4", stok: 31, harga: 78000,  cover: "img/buku3.png" },
  { kodeBarang: "BK-004", namaBarang: "Jaringan Komputer Nusantara",      jenis: "Teknologi", edisi: "1", stok: 9,  harga: 99000,  cover: "img/buku4.png" },
  { kodeBarang: "BK-005", namaBarang: "Desain Antarmuka Hangat",          jenis: "Desain",    edisi: "2", stok: 15, harga: 110000, cover: "img/buku5.png" },
  { kodeBarang: "BK-006", namaBarang: "Kecerdasan Buatan untuk Pemula",   jenis: "Teknologi", edisi: "1", stok: 22, harga: 125000, cover: "img/buku6.png" },
  { kodeBarang: "BK-007", namaBarang: "Sistem Informasi Desa",            jenis: "Sosial",    edisi: "2", stok: 12, harga: 68000,  cover: "img/buku7.png" },
  { kodeBarang: "BK-008", namaBarang: "Etika Profesi Teknologi",          jenis: "Sosial",    edisi: "1", stok: 27, harga: 59000,  cover: "img/buku8.png" },
  { kodeBarang: "BK-009", namaBarang: "Statistika Secangkir Teh",         jenis: "Sains",     edisi: "3", stok: 5,  harga: 72000,  cover: "img/buku9.png" },
  { kodeBarang: "BK-010", namaBarang: "Pengantar Rekayasa Perangkat Lunak", jenis: "Teknologi", edisi: "5", stok: 20, harga: 135000, cover: "img/buku10.png" }
];

// Daftar ekspedisi dan metode pembayaran (dipakai di halaman checkout)
const dataEkspedisi = [
  { kode: "JNE",  nama: "JNE Reguler",     ongkir: 15000, estimasi: "2-3 hari" },
  { kode: "JNT",  nama: "J&T Express",     ongkir: 14000, estimasi: "2-4 hari" },
  { kode: "POS",  nama: "Pos Indonesia",   ongkir: 12000, estimasi: "3-5 hari" },
  { kode: "SICEPAT", nama: "SiCepat Halu", ongkir: 17000, estimasi: "1-2 hari" }
];

const dataPembayaran = ["Transfer Bank", "QRIS", "Kartu Kredit", "COD (Bayar di Tempat)"];

// Tahapan status pengiriman (dipakai untuk progress bar)
const tahapPengiriman = ["Pesanan Dibuat", "Dikemas", "Diserahkan ke Kurir", "Dalam Perjalanan", "Diterima"];

// Data tracking pengiriman (contoh nomor Delivery Order)
const dataTracking = [
  {
    nomorDO: "DO2026001",
    namaPemesan: "Rani Wulandari",
    ekspedisi: "JNE Reguler",
    tanggalKirim: "2026-10-28",
    jenisPaket: "Reguler",
    totalPembayaran: 178000,
    tahap: 4,
    perjalanan: [
      { waktu: "2026-10-28 09:10", keterangan: "Pesanan dibuat dan pembayaran diterima" },
      { waktu: "2026-10-28 13:45", keterangan: "Pesanan sedang dikemas di gudang Bandung" },
      { waktu: "2026-10-29 08:20", keterangan: "Paket diserahkan ke kurir JNE" },
      { waktu: "2026-10-30 17:05", keterangan: "Paket tiba di hub Jakarta" },
      { waktu: "2026-11-01 10:30", keterangan: "Paket diterima oleh yang bersangkutan" }
    ]
  },
  {
    nomorDO: "DO2026002",
    namaPemesan: "Mahasiswa UT",
    ekspedisi: "J&T Express",
    tanggalKirim: "2026-11-01",
    jenisPaket: "Ekspres",
    totalPembayaran: 249000,
    tahap: 3,
    perjalanan: [
      { waktu: "2026-11-01 08:00", keterangan: "Pesanan dibuat dan pembayaran diterima" },
      { waktu: "2026-11-01 14:30", keterangan: "Pesanan sedang dikemas di gudang Bandung" },
      { waktu: "2026-11-02 09:15", keterangan: "Paket diserahkan ke kurir J&T" },
      { waktu: "2026-11-03 06:40", keterangan: "Paket dalam perjalanan menuju kota tujuan" }
    ]
  },
  {
    nomorDO: "DO2026003",
    namaPemesan: "Budi Santoso",
    ekspedisi: "Pos Indonesia",
    tanggalKirim: "2026-11-02",
    jenisPaket: "Reguler",
    totalPembayaran: 139000,
    tahap: 1,
    perjalanan: [
      { waktu: "2026-11-02 10:20", keterangan: "Pesanan dibuat dan pembayaran diterima" },
      { waktu: "2026-11-02 15:00", keterangan: "Pesanan sedang dikemas di gudang Bandung" }
    ]
  }
];

// Riwayat transaksi awal (digabung dengan pesanan baru dari halaman checkout)
const dataRiwayatAwal = [
  { nomorDO: "DO2026001", tanggal: "2026-10-28", pemesan: "Rani Wulandari",
    item: [{ nama: "Pemrograman Web Dasar", qty: 1, harga: 85000 }, { nama: "Basis Data Itu Mudah", qty: 1, harga: 78000 }],
    ongkir: 15000, total: 178000, pembayaran: "Transfer Bank", status: "Selesai" },
  { nomorDO: "DO2026002", tanggal: "2026-11-01", pemesan: "Mahasiswa UT",
    item: [{ nama: "Kecerdasan Buatan untuk Pemula", qty: 1, harga: 125000 }, { nama: "Desain Antarmuka Hangat", qty: 1, harga: 110000 }],
    ongkir: 14000, total: 249000, pembayaran: "QRIS", status: "Dikirim" },
  { nomorDO: "DO2026003", tanggal: "2026-11-02", pemesan: "Budi Santoso",
    item: [{ nama: "Etika Profesi Teknologi", qty: 1, harga: 59000 }, { nama: "Sistem Informasi Desa", qty: 1, harga: 68000 }],
    ongkir: 12000, total: 139000, pembayaran: "COD (Bayar di Tempat)", status: "Diproses" }
];
