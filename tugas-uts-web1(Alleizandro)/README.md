# Warung Buku Pucuk Teh — Tugas UTS Pemrograman Web 1

Aplikasi web front-end pemesanan buku. Tema **Otentik**: hijau daun teh dan coklat kayu.
Data bersumber dari `js/data.js` (tanpa server/database); data tambahan disimpan di `localStorage`.

## Cara menjalankan
Buka `index.html` di browser (klik dua kali). Tidak perlu instalasi.

## Akun demo
| Email | Password |
|---|---|
| rani@tehbuku.id | teh12345 |
| mahasiswa@ut.ac.id | ut2026 |

Nomor DO untuk tracking: `DO2026001`, `DO2026002`, `DO2026003` (dan nomor DO dari pesanan baru).

## Struktur folder
```
tugas-uts-web1/
|-- index.html      (halaman login + modal Lupa Password & Daftar)
|-- dashboard.html  (greeting waktu lokal + 4 menu navigasi)
|-- stok.html       (katalog dari dataKatalogBuku + tambah baris stok via DOM)
|-- checkout.html   (pesanan tambah/ubah/hapus + data pemesan & pembayaran)
|-- tracking.html   (cari Nomor DO, progress bar status pengiriman)
|-- history.html    (history transaksi + modal detail)
|-- css/style.css
|-- js/script.js    (logika semua halaman, dipilih via data-halaman)
|-- js/data.js      (data dummy dalam Array JSON)
|-- assets/logo.png
|-- img/buku1.png ... buku10.png
```

## Pemetaan ke kriteria penilaian
- **HTML semantik**: `header`, `nav`, `main`, `section`, `aside`, `footer`, `table` dengan `caption`/`th scope`, `label` untuk setiap input.
- **CSS**: satu file eksternal dengan variabel warna tema, responsif (breakpoint 800px).
- **JavaScript DOM**: render tabel dinamis (`createElement`), tambah/hapus baris stok, ubah jumlah pesanan, progress bar tracking, greeting waktu lokal.
- **Validasi & alert**: pesan error per field, modal alert kustom, toast notifikasi.
- **Modularitas**: data (`data.js`), logika (`script.js`), tampilan (`style.css`) dipisah.
- **Kreativitas**: tema teh & kayu, logo dan sampul buku buatan sendiri, pencarian/filter, riwayat perjalanan paket.
