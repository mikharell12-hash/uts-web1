/* ==========================================================
   script.js — logika semua halaman (login, dashboard, stok,
   checkout, tracking, history). Dipilih lewat atribut
   data-halaman pada <body>. Data bersumber dari data.js.
   ========================================================== */
"use strict";

/* ---------------------------------------------------------
   1. UTILITAS UMUM
   --------------------------------------------------------- */
const $ = (id) => document.getElementById(id);

const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

function esc(teks) {
  const d = document.createElement("div");
  d.textContent = String(teks ?? "");
  return d.innerHTML;
}

// localStorage yang aman (bisa saja diblokir browser)
const simpan = {
  baca(kunci, awal) {
    try {
      const v = localStorage.getItem(kunci);
      return v ? JSON.parse(v) : awal;
    } catch (e) { return awal; }
  },
  tulis(kunci, nilai) {
    try { localStorage.setItem(kunci, JSON.stringify(nilai)); } catch (e) { /* abaikan */ }
  }
};

const KUNCI = {
  sesi: "pt_sesi",
  penggunaBaru: "pt_pengguna_baru",
  stokBaru: "pt_stok_baru",
  keranjang: "pt_keranjang",
  riwayatBaru: "pt_riwayat_baru",
  trackingBaru: "pt_tracking_baru"
};

function tanggalHariIni() {
  const t = new Date();
  const p = (x) => String(x).padStart(2, "0");
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`;
}

/* ---------------------------------------------------------
   2. MODAL, ALERT, TOAST
   --------------------------------------------------------- */
function bukaModal(id) {
  const m = $(id);
  if (!m) return;
  m.classList.add("buka");
  const fokus = m.querySelector("input, select, textarea, button");
  if (fokus) setTimeout(() => fokus.focus(), 50);
}

function tutupModal(el) {
  const m = el.classList ? el : $(el);
  if (m) m.classList.remove("buka");
}

function tampilPesan(judul, isi, tipe) {
  const kotak = $("modal-pesan-kotak");
  if (!kotak) { alert(judul + "\n" + isi); return; }
  kotak.classList.toggle("bahaya", tipe === "error");
  $("pesan-judul").textContent = judul;
  $("pesan-isi").textContent = isi;
  bukaModal("modal-pesan");
}

function toast(teks, error) {
  const area = $("toast-area");
  if (!area) return;
  const t = document.createElement("div");
  t.className = "toast" + (error ? " error" : "");
  t.textContent = teks;
  area.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

function pasangModalUmum() {
  document.querySelectorAll("[data-tutup]").forEach((btn) => {
    btn.addEventListener("click", () => tutupModal(btn.closest(".modal-overlay")));
  });
  document.querySelectorAll(".modal-overlay").forEach((ov) => {
    ov.addEventListener("click", (e) => { if (e.target === ov) tutupModal(ov); });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") document.querySelectorAll(".modal-overlay.buka").forEach(tutupModal);
  });
  // pesan error hilang otomatis ketika isian diperbaiki
  const hapusError = (e) => {
    const el = e.target;
    if (el.id && el.classList && el.classList.contains("invalid")) setError(el.id, "");
  };
  document.addEventListener("input", hapusError);
  document.addEventListener("change", hapusError);
}

/* ---------------------------------------------------------
   3. VALIDASI FORM (umpan balik saat error)
   --------------------------------------------------------- */
function setError(idInput, pesan) {
  const input = $(idInput);
  const err = $("err-" + idInput);
  if (input) input.classList.toggle("invalid", Boolean(pesan));
  if (err) err.textContent = pesan || "";
  return !pesan;
}

function bersihkanError(form) {
  form.querySelectorAll("input, select, textarea").forEach((el) => {
    if (el.id) setError(el.id, "");
  });
}

const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const polaHP = /^(\+62|62|0)8[0-9]{8,12}$/;

/* ---------------------------------------------------------
   4. DATA GABUNGAN (data.js + localStorage)
   --------------------------------------------------------- */
function semuaPengguna() {
  return dataPengguna.concat(simpan.baca(KUNCI.penggunaBaru, []));
}

function ambilKatalog() {
  return dataKatalogBuku.concat(simpan.baca(KUNCI.stokBaru, []));
}

function ambilKeranjang() { return simpan.baca(KUNCI.keranjang, []); }
function simpanKeranjang(k) { simpan.tulis(KUNCI.keranjang, k); }

function ambilRiwayat() {
  return dataRiwayatAwal.concat(simpan.baca(KUNCI.riwayatBaru, []));
}

function ambilTracking() {
  return dataTracking.concat(simpan.baca(KUNCI.trackingBaru, []));
}

/* ---------------------------------------------------------
   5. SESI / AUTENTIKASI
   --------------------------------------------------------- */
function penggunaAktif() {
  try { return JSON.parse(sessionStorage.getItem(KUNCI.sesi)); } catch (e) { return null; }
}

function jagaHalaman() {
  const user = penggunaAktif();
  if (!user) { window.location.replace("index.html"); return null; }
  const btn = $("btn-keluar");
  if (btn) btn.addEventListener("click", () => {
    sessionStorage.removeItem(KUNCI.sesi);
    window.location.href = "index.html";
  });
  return user;
}

/* ---------------------------------------------------------
   6. HALAMAN LOGIN (index.html)
   --------------------------------------------------------- */
function initLogin() {
  const form = $("form-login");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    bersihkanError(form);
    const email = $("email").value.trim().toLowerCase();
    const pass = $("password").value;

    let ok = true;
    if (!email) ok = setError("email", "Email wajib diisi.") && ok;
    else if (!polaEmail.test(email)) ok = setError("email", "Format email tidak valid.") && ok;
    if (!pass) ok = setError("password", "Password wajib diisi.") && ok;
    if (!ok) return;

    const user = semuaPengguna().find((u) => u.email.toLowerCase() === email && u.password === pass);
    if (!user) {
      tampilPesan("Login Gagal", "Email/password yang anda masukkan salah.", "error");
      return;
    }
    sessionStorage.setItem(KUNCI.sesi, JSON.stringify({ id: user.id, nama: user.nama, email: user.email, role: user.role }));
    window.location.href = "dashboard.html";
  });

  $("btn-lupa").addEventListener("click", () => bukaModal("modal-lupa"));
  $("btn-daftar").addEventListener("click", () => bukaModal("modal-daftar"));

  // Lupa password (simulasi)
  const formLupa = $("form-lupa");
  formLupa.addEventListener("submit", (e) => {
    e.preventDefault();
    bersihkanError(formLupa);
    const email = $("lupa-email").value.trim().toLowerCase();
    if (!email) return setError("lupa-email", "Email wajib diisi.");
    if (!polaEmail.test(email)) return setError("lupa-email", "Format email tidak valid.");
    if (!semuaPengguna().some((u) => u.email.toLowerCase() === email)) {
      return setError("lupa-email", "Email tidak terdaftar.");
    }
    tutupModal("modal-lupa");
    formLupa.reset();
    tampilPesan("Tautan Terkirim", "Tautan atur ulang password telah dikirim ke " + email + " (simulasi).");
  });

  // Daftar akun baru
  const formDaftar = $("form-daftar");
  formDaftar.addEventListener("submit", (e) => {
    e.preventDefault();
    bersihkanError(formDaftar);
    const nama = $("daftar-nama").value.trim();
    const email = $("daftar-email").value.trim().toLowerCase();
    const p1 = $("daftar-pass").value;
    const p2 = $("daftar-pass2").value;

    let ok = true;
    if (nama.length < 3) ok = setError("daftar-nama", "Nama minimal 3 karakter.") && ok;
    if (!polaEmail.test(email)) ok = setError("daftar-email", "Format email tidak valid.") && ok;
    else if (semuaPengguna().some((u) => u.email.toLowerCase() === email)) ok = setError("daftar-email", "Email sudah terdaftar.") && ok;
    if (p1.length < 6) ok = setError("daftar-pass", "Password minimal 6 karakter.") && ok;
    if (p2 !== p1) ok = setError("daftar-pass2", "Password tidak sama.") && ok;
    if (!ok) return;

    const baru = simpan.baca(KUNCI.penggunaBaru, []);
    baru.push({ id: Date.now(), nama, email, password: p1, role: "Pelanggan" });
    simpan.tulis(KUNCI.penggunaBaru, baru);
    tutupModal("modal-daftar");
    formDaftar.reset();
    $("email").value = email;
    tampilPesan("Pendaftaran Berhasil", "Akun untuk " + nama + " sudah dibuat. Silakan login.");
  });
}

/* ---------------------------------------------------------
   7. DASHBOARD (dashboard.html)
   --------------------------------------------------------- */
function salamWaktu(jam) {
  if (jam < 11) return { teks: "Selamat pagi", ikon: "🌅" };
  if (jam < 15) return { teks: "Selamat siang", ikon: "☀️" };
  if (jam < 18) return { teks: "Selamat sore", ikon: "🌇" };
  return { teks: "Selamat malam", ikon: "🌙" };
}

function initDashboard(user) {
  const tampilkan = () => {
    const sekarang = new Date();
    const s = salamWaktu(sekarang.getHours());
    $("greeting-teks").textContent = `${s.teks}, ${user.nama}!`;
    $("greeting-ikon").textContent = s.ikon;
    $("greeting-waktu").textContent = sekarang.toLocaleString("id-ID", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    }) + " (waktu lokal)";
  };
  tampilkan();
  setInterval(tampilkan, 1000);

  const katalog = ambilKatalog();
  $("stat-judul").textContent = katalog.length;
  $("stat-stok").textContent = katalog.reduce((a, b) => a + Number(b.stok), 0);
  $("stat-keranjang").textContent = ambilKeranjang().reduce((a, b) => a + b.qty, 0);
  $("stat-transaksi").textContent = ambilRiwayat().length;
}

/* ---------------------------------------------------------
   8. INFORMASI STOK / KATALOG (stok.html)
   --------------------------------------------------------- */
function labelStok(stok) {
  if (stok <= 5) return ["badge badge-low", "Menipis"];
  if (stok <= 12) return ["badge badge-warn", "Terbatas"];
  return ["badge badge-ok", "Aman"];
}

function initStok() {
  const tbody = $("isi-stok");
  const dasar = dataKatalogBuku.length;

  // isi opsi filter jenis dari data
  const filter = $("filter-jenis");
  [...new Set(ambilKatalog().map((b) => b.jenis))].forEach((j) => {
    const o = document.createElement("option");
    o.value = j; o.textContent = j;
    filter.appendChild(o);
  });

  function sel(teks, kelas) {
    const td = document.createElement("td");
    td.textContent = teks;
    if (kelas) td.className = kelas;
    return td;
  }

  function render() {
    const kata = $("cari-buku").value.trim().toLowerCase();
    const jenis = filter.value;
    const katalog = ambilKatalog();
    tbody.textContent = "";
    let tampil = 0;

    katalog.forEach((buku, idx) => {
      if (jenis && buku.jenis !== jenis) return;
      if (kata && !(buku.namaBarang.toLowerCase().includes(kata) || buku.kodeBarang.toLowerCase().includes(kata))) return;
      tampil++;

      const tr = document.createElement("tr");

      const tdCover = document.createElement("td");
      const img = document.createElement("img");
      img.className = "cover";
      img.src = buku.cover || "img/buku1.png";
      img.alt = "Sampul " + buku.namaBarang;
      img.loading = "lazy";
      img.onerror = () => { img.onerror = null; img.src = "assets/logo.png"; };
      tdCover.appendChild(img);
      tr.appendChild(tdCover);

      tr.appendChild(sel(buku.kodeBarang, "kode"));
      tr.appendChild(sel(buku.namaBarang));
      tr.appendChild(sel(buku.jenis));
      tr.appendChild(sel(buku.edisi));

      const tdStok = document.createElement("td");
      tdStok.className = "angka";
      tdStok.textContent = buku.stok + " ";
      const [kls, lbl] = labelStok(Number(buku.stok));
      const b = document.createElement("span");
      b.className = kls; b.textContent = lbl;
      tdStok.appendChild(b);
      tr.appendChild(tdStok);

      tr.appendChild(sel(rupiah(buku.harga), "angka"));

      const tdAksi = document.createElement("td");
      tdAksi.className = "aksi";
      const btnPesan = document.createElement("button");
      btnPesan.type = "button";
      btnPesan.className = "btn btn-kecil";
      btnPesan.textContent = "Pesan";
      btnPesan.disabled = Number(buku.stok) <= 0;
      btnPesan.addEventListener("click", () => {
        tambahKeKeranjang(buku.kodeBarang, 1);
      });
      tdAksi.appendChild(btnPesan);

      // hanya baris tambahan (bukan data.js) yang boleh dihapus
      if (idx >= dasar) {
        const btnHapus = document.createElement("button");
        btnHapus.type = "button";
        btnHapus.className = "btn btn-kecil btn-bahaya";
        btnHapus.textContent = "Hapus";
        btnHapus.addEventListener("click", () => {
          const tambahan = simpan.baca(KUNCI.stokBaru, []);
          tambahan.splice(idx - dasar, 1);
          simpan.tulis(KUNCI.stokBaru, tambahan);
          toast("Baris stok dihapus.");
          render();
        });
        tdAksi.appendChild(btnHapus);
      }
      tr.appendChild(tdAksi);
      tbody.appendChild(tr);
    });

    if (tampil === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 8; td.className = "kosong";
      td.textContent = "Tidak ada buku yang cocok.";
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
    $("info-jumlah").textContent = `Menampilkan ${tampil} dari ${katalog.length} judul buku`;
  }

  $("cari-buku").addEventListener("input", render);
  filter.addEventListener("change", render);

  // Tambah baris stok baru lewat DOM
  const form = $("form-stok");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    bersihkanError(form);
    const kode = $("s-kode").value.trim().toUpperCase();
    const nama = $("s-nama").value.trim();
    const jenisBaru = $("s-jenis").value;
    const edisi = $("s-edisi").value;
    const stok = $("s-stok").value;
    const harga = $("s-harga").value;

    let ok = true;
    if (!/^[A-Z]{2}-\d{3}$/.test(kode)) ok = setError("s-kode", "Format kode: BK-011 (2 huruf, strip, 3 angka).") && ok;
    else if (ambilKatalog().some((b) => b.kodeBarang === kode)) ok = setError("s-kode", "Kode barang sudah dipakai.") && ok;
    if (nama.length < 3) ok = setError("s-nama", "Judul minimal 3 karakter.") && ok;
    if (!jenisBaru) ok = setError("s-jenis", "Pilih jenis buku.") && ok;
    if (!(Number(edisi) >= 1) || !Number.isInteger(Number(edisi))) ok = setError("s-edisi", "Edisi minimal 1.") && ok;
    if (stok === "" || Number(stok) < 0 || !Number.isInteger(Number(stok))) ok = setError("s-stok", "Stok harus bilangan bulat ≥ 0.") && ok;
    if (!(Number(harga) >= 1000)) ok = setError("s-harga", "Harga minimal Rp 1.000.") && ok;
    if (!ok) { tampilPesan("Data Belum Valid", "Periksa kembali isian yang ditandai merah.", "error"); return; }

    const tambahan = simpan.baca(KUNCI.stokBaru, []);
    tambahan.push({
      kodeBarang: kode, namaBarang: nama, jenis: jenisBaru, edisi: String(edisi),
      stok: Number(stok), harga: Number(harga), cover: "img/buku" + ((tambahan.length + dasar) % 10 + 1) + ".png"
    });
    simpan.tulis(KUNCI.stokBaru, tambahan);

    if (![...filter.options].some((o) => o.value === jenisBaru)) {
      const o = document.createElement("option");
      o.value = jenisBaru; o.textContent = jenisBaru;
      filter.appendChild(o);
    }
    form.reset();
    toast(`"${nama}" ditambahkan ke tabel stok.`);
    render();
  });

  render();
}

// dipakai halaman stok dan checkout
function tambahKeKeranjang(kode, qty) {
  const buku = ambilKatalog().find((b) => b.kodeBarang === kode);
  if (!buku) return false;
  const keranjang = ambilKeranjang();
  const ada = keranjang.find((k) => k.kode === kode);
  const total = (ada ? ada.qty : 0) + qty;
  if (total > Number(buku.stok)) {
    toast(`Stok "${buku.namaBarang}" hanya ${buku.stok}.`, true);
    return false;
  }
  if (ada) ada.qty = total; else keranjang.push({ kode, qty });
  simpanKeranjang(keranjang);
  toast(`"${buku.namaBarang}" masuk ke pesanan.`);
  return true;
}

/* ---------------------------------------------------------
   9. PEMESANAN (checkout.html)
   --------------------------------------------------------- */
function initCheckout(user) {
  const pilih = $("pilih-buku");
  const tbody = $("isi-keranjang");
  const selEkspedisi = $("c-ekspedisi");
  const selBayar = $("c-bayar");

  // isi dropdown dari data
  ambilKatalog().forEach((b) => {
    const o = document.createElement("option");
    o.value = b.kodeBarang;
    o.textContent = `${b.namaBarang} — ${rupiah(b.harga)} (stok ${b.stok})`;
    pilih.appendChild(o);
  });
  const opsiAwal = (teks) => { const o = document.createElement("option"); o.value = ""; o.textContent = teks; return o; };
  selEkspedisi.appendChild(opsiAwal("Pilih ekspedisi..."));
  dataEkspedisi.forEach((x) => {
    const o = document.createElement("option");
    o.value = x.kode;
    o.textContent = `${x.nama} — ${rupiah(x.ongkir)} (${x.estimasi})`;
    selEkspedisi.appendChild(o);
  });
  selBayar.appendChild(opsiAwal("Pilih metode..."));
  dataPembayaran.forEach((p) => {
    const o = document.createElement("option");
    o.value = p; o.textContent = p;
    selBayar.appendChild(o);
  });

  $("c-nama").value = user.nama;
  $("c-email").value = user.email;

  function hitung() {
    const katalog = ambilKatalog();
    const keranjang = ambilKeranjang();
    const subtotal = keranjang.reduce((a, k) => {
      const b = katalog.find((x) => x.kodeBarang === k.kode);
      return a + (b ? b.harga * k.qty : 0);
    }, 0);
    const eks = dataEkspedisi.find((x) => x.kode === selEkspedisi.value);
    const ongkir = eks && keranjang.length ? eks.ongkir : 0;
    return { subtotal, ongkir, total: subtotal + ongkir, eks, jumlah: keranjang.reduce((a, k) => a + k.qty, 0) };
  }

  function renderRingkasan() {
    const h = hitung();
    $("r-item").textContent = h.jumlah;
    $("r-subtotal").textContent = rupiah(h.subtotal);
    $("r-ongkir").textContent = rupiah(h.ongkir);
    $("r-total").textContent = rupiah(h.total);
    $("r-estimasi").textContent = h.eks ? h.eks.estimasi : "-";
  }

  function renderKeranjang() {
    const katalog = ambilKatalog();
    // buang item yang bukunya sudah tidak ada
    let keranjang = ambilKeranjang().filter((k) => katalog.some((b) => b.kodeBarang === k.kode));
    simpanKeranjang(keranjang);
    tbody.textContent = "";

    if (keranjang.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 5; td.className = "kosong";
      td.textContent = "Belum ada buku dalam pesanan. Pilih buku di atas lalu klik Tambah.";
      tr.appendChild(td); tbody.appendChild(tr);
    }

    keranjang.forEach((item) => {
      const buku = katalog.find((b) => b.kodeBarang === item.kode);
      const tr = document.createElement("tr");

      const tdNama = document.createElement("td");
      tdNama.textContent = buku.namaBarang;
      tr.appendChild(tdNama);

      const tdHarga = document.createElement("td");
      tdHarga.className = "angka"; tdHarga.textContent = rupiah(buku.harga);
      tr.appendChild(tdHarga);

      const tdQty = document.createElement("td");
      const inp = document.createElement("input");
      inp.type = "number"; inp.min = "1"; inp.max = String(buku.stok);
      inp.value = item.qty; inp.className = "qty-input";
      inp.setAttribute("aria-label", "Jumlah " + buku.namaBarang);
      inp.addEventListener("change", () => {
        const q = Number(inp.value);
        if (!Number.isInteger(q) || q < 1) { toast("Jumlah minimal 1.", true); inp.value = item.qty; return; }
        if (q > Number(buku.stok)) { toast(`Stok hanya ${buku.stok}.`, true); inp.value = item.qty; return; }
        const k = ambilKeranjang();
        k.find((x) => x.kode === item.kode).qty = q;
        simpanKeranjang(k);
        renderKeranjang();
      });
      tdQty.appendChild(inp);
      tr.appendChild(tdQty);

      const tdSub = document.createElement("td");
      tdSub.className = "angka"; tdSub.textContent = rupiah(buku.harga * item.qty);
      tr.appendChild(tdSub);

      const tdAksi = document.createElement("td");
      const hapus = document.createElement("button");
      hapus.type = "button"; hapus.className = "btn btn-kecil btn-bahaya"; hapus.textContent = "Hapus";
      hapus.addEventListener("click", () => {
        simpanKeranjang(ambilKeranjang().filter((x) => x.kode !== item.kode));
        toast("Buku dihapus dari pesanan.");
        renderKeranjang();
      });
      tdAksi.appendChild(hapus);
      tr.appendChild(tdAksi);

      tbody.appendChild(tr);
    });
    renderRingkasan();
  }

  $("btn-tambah-pesanan").addEventListener("click", () => {
    const q = Number($("qty-baru").value);
    if (!pilih.value) { toast("Pilih buku terlebih dahulu.", true); return; }
    if (!Number.isInteger(q) || q < 1) { toast("Jumlah minimal 1.", true); return; }
    if (tambahKeKeranjang(pilih.value, q)) renderKeranjang();
  });

  $("btn-kosongkan").addEventListener("click", () => {
    if (ambilKeranjang().length === 0) { toast("Pesanan sudah kosong."); return; }
    simpanKeranjang([]);
    toast("Pesanan dikosongkan.");
    renderKeranjang();
  });

  selEkspedisi.addEventListener("change", renderRingkasan);

  // Submit pesanan
  const form = $("form-checkout");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    bersihkanError(form);
    const nama = $("c-nama").value.trim();
    const hp = $("c-hp").value.trim().replace(/[\s-]/g, "");
    const email = $("c-email").value.trim();
    const alamat = $("c-alamat").value.trim();

    let ok = true;
    if (nama.length < 3) ok = setError("c-nama", "Nama minimal 3 karakter.") && ok;
    if (!polaHP.test(hp)) ok = setError("c-hp", "Nomor HP tidak valid (contoh 081234567890).") && ok;
    if (!polaEmail.test(email)) ok = setError("c-email", "Format email tidak valid.") && ok;
    if (alamat.length < 10) ok = setError("c-alamat", "Alamat minimal 10 karakter.") && ok;
    if (!selEkspedisi.value) ok = setError("c-ekspedisi", "Pilih ekspedisi.") && ok;
    if (!selBayar.value) ok = setError("c-bayar", "Pilih metode pembayaran.") && ok;

    if (ambilKeranjang().length === 0) {
      tampilPesan("Pesanan Kosong", "Tambahkan minimal satu buku ke dalam pesanan.", "error");
      return;
    }
    if (!ok) { tampilPesan("Data Belum Valid", "Periksa kembali isian yang ditandai merah.", "error"); return; }

    const katalog = ambilKatalog();
    const h = hitung();
    const item = ambilKeranjang().map((k) => {
      const b = katalog.find((x) => x.kodeBarang === k.kode);
      return { nama: b.namaBarang, qty: k.qty, harga: b.harga };
    });

    // buat nomor DO unik
    const sudah = new Set(ambilRiwayat().map((r) => r.nomorDO));
    let n = sudah.size + 1, nomorDO;
    do { nomorDO = "DO2026" + String(n++).padStart(3, "0"); } while (sudah.has(nomorDO));

    const tgl = tanggalHariIni();
    const riwayat = simpan.baca(KUNCI.riwayatBaru, []);
    riwayat.push({
      nomorDO, tanggal: tgl, pemesan: nama, item, ongkir: h.ongkir, total: h.total,
      pembayaran: selBayar.value, status: "Diproses", alamat, hp, email
    });
    simpan.tulis(KUNCI.riwayatBaru, riwayat);

    const tracking = simpan.baca(KUNCI.trackingBaru, []);
    tracking.push({
      nomorDO, namaPemesan: nama, ekspedisi: h.eks.nama, tanggalKirim: tgl,
      jenisPaket: h.eks.kode === "SICEPAT" ? "Ekspres" : "Reguler",
      totalPembayaran: h.total, dibuat: Date.now(), dinamis: true, perjalanan: []
    });
    simpan.tulis(KUNCI.trackingBaru, tracking);

    simpanKeranjang([]);
    form.reset();
    $("c-nama").value = user.nama;
    $("c-email").value = user.email;
    renderKeranjang();
    tampilPesan("Pesanan Berhasil", `Nomor Delivery Order Anda: ${nomorDO}. Total ${rupiah(h.total)}. Gunakan nomor ini di halaman Tracking.`);
  });

  renderKeranjang();
}

/* ---------------------------------------------------------
   10. TRACKING (tracking.html)
   --------------------------------------------------------- */
// Pesanan baru disimulasikan: tahap naik 1 setiap 30 detik (maks. "Dalam Perjalanan")
function lengkapiTracking(t) {
  if (!t.dinamis) return t;
  const tahap = Math.min(3, Math.floor((Date.now() - t.dibuat) / 30000));
  const awal = new Date(t.dibuat);
  const jam = awal.toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });
  const ket = [
    "Pesanan dibuat dan menunggu pembayaran dikonfirmasi",
    "Pesanan sedang dikemas di gudang Bandung",
    "Paket diserahkan ke kurir " + t.ekspedisi,
    "Paket dalam perjalanan menuju alamat tujuan"
  ];
  const perjalanan = [];
  for (let i = 0; i <= tahap; i++) perjalanan.push({ waktu: jam, keterangan: ket[i] });
  return Object.assign({}, t, { tahap, perjalanan });
}

function initTracking() {
  const form = $("form-tracking");
  const kotak = $("hasil-tracking");
  const isi = $("isi-hasil");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    setError("nomor-do", "");
    const nomor = $("nomor-do").value.trim().toUpperCase();
    if (!nomor) { setError("nomor-do", "Nomor Delivery Order wajib diisi."); kotak.hidden = true; return; }

    const ketemu = ambilTracking().find((t) => t.nomorDO === nomor);
    if (!ketemu) {
      kotak.hidden = true;
      setError("nomor-do", "Nomor DO tidak ditemukan.");
      tampilPesan("Data Tidak Ditemukan", `Nomor Delivery Order "${nomor}" tidak terdaftar.`, "error");
      return;
    }
    renderTracking(lengkapiTracking(ketemu));
  });

  function renderTracking(t) {
    const jml = tahapPengiriman.length;
    const titik = tahapPengiriman.map((nama, i) => {
      const kelas = i < t.tahap || t.tahap === jml - 1 ? "selesai" : i === t.tahap ? "sekarang" : "";
      const tanda = kelas === "selesai" ? "✓" : String(i + 1);
      return `<li class="${kelas}"><div class="titik">${tanda}</div>${esc(nama)}</li>`;
    }).join("");

    const status = tahapPengiriman[t.tahap];
    const lokasi = t.perjalanan.slice().reverse()
      .map((p) => `<li><time>${esc(p.waktu)}</time>${esc(p.keterangan)}</li>`).join("");

    isi.innerHTML = `
      <div class="detail-grid">
        <div class="detail-item"><span>Nomor DO</span><strong>${esc(t.nomorDO)}</strong></div>
        <div class="detail-item"><span>Nama Pemesan</span><strong>${esc(t.namaPemesan)}</strong></div>
        <div class="detail-item"><span>Status</span><strong>${esc(status)}</strong></div>
      </div>
      <ol class="progress" aria-label="Progres pengiriman">
        <div class="bar-isi" id="bar-isi"></div>
        ${titik}
      </ol>
      <div class="detail-grid">
        <div class="detail-item"><span>Ekspedisi</span><strong>${esc(t.ekspedisi)}</strong></div>
        <div class="detail-item"><span>Tanggal Kirim</span><strong>${esc(t.tanggalKirim)}</strong></div>
        <div class="detail-item"><span>Jenis Paket</span><strong>${esc(t.jenisPaket)}</strong></div>
        <div class="detail-item"><span>Total Pembayaran</span><strong>${rupiah(t.totalPembayaran)}</strong></div>
      </div>
      <h3>Riwayat Perjalanan</h3>
      <ul class="timeline">${lokasi}</ul>`;
    kotak.hidden = false;

    const bar = $("bar-isi");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      bar.style.width = (t.tahap / (jml - 1)) * 90 + "%";
    }));
  }
}

/* ---------------------------------------------------------
   11. HISTORY TRANSAKSI (history.html)
   --------------------------------------------------------- */
function initHistory() {
  const tbody = $("isi-riwayat");

  function render() {
    const kata = $("cari-riwayat").value.trim().toLowerCase();
    const status = $("filter-status").value;
    const semua = ambilRiwayat().slice().reverse(); // terbaru di atas
    tbody.textContent = "";
    let tampil = 0;

    semua.forEach((r) => {
      if (status && r.status !== status) return;
      if (kata && !(r.nomorDO.toLowerCase().includes(kata) || r.pemesan.toLowerCase().includes(kata))) return;
      tampil++;

      const tr = document.createElement("tr");
      const tambah = (teks, kelas) => {
        const td = document.createElement("td");
        td.textContent = teks;
        if (kelas) td.className = kelas;
        tr.appendChild(td);
        return td;
      };
      tambah(r.nomorDO);
      tambah(r.tanggal);
      tambah(r.pemesan);
      tambah(r.pembayaran);
      tambah(rupiah(r.total), "angka");

      const tdS = document.createElement("td");
      const b = document.createElement("span");
      b.className = "badge " + (r.status === "Selesai" ? "badge-ok" : r.status === "Dikirim" ? "badge-warn" : "badge-low");
      b.textContent = r.status;
      tdS.appendChild(b);
      tr.appendChild(tdS);

      const tdA = document.createElement("td");
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "btn btn-kecil"; btn.textContent = "Detail";
      btn.addEventListener("click", () => tampilDetail(r));
      tdA.appendChild(btn);
      tr.appendChild(tdA);

      tbody.appendChild(tr);
    });

    if (tampil === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 7; td.className = "kosong";
      td.textContent = "Tidak ada transaksi yang cocok.";
      tr.appendChild(td); tbody.appendChild(tr);
    }
    $("info-riwayat").textContent = `Menampilkan ${tampil} dari ${semua.length} transaksi`;
  }

  function tampilDetail(r) {
    const baris = r.item.map((i) =>
      `<tr><td>${esc(i.nama)}</td><td class="angka">${i.qty}</td><td class="angka">${rupiah(i.harga)}</td><td class="angka">${rupiah(i.harga * i.qty)}</td></tr>`
    ).join("");
    $("judul-detail").textContent = "Detail " + r.nomorDO;
    $("isi-detail").innerHTML = `
      <p><strong>${esc(r.pemesan)}</strong> — ${esc(r.tanggal)} — ${esc(r.pembayaran)}</p>
      ${r.alamat ? `<p>Alamat: ${esc(r.alamat)}</p>` : ""}
      <div class="table-wrap" style="margin:.8rem 0">
        <table>
          <thead><tr><th>Judul</th><th class="angka">Qty</th><th class="angka">Harga</th><th class="angka">Subtotal</th></tr></thead>
          <tbody>${baris}</tbody>
        </table>
      </div>
      <div class="ringkasan">
        <p><span>Ongkos kirim</span><span>${rupiah(r.ongkir)}</span></p>
        <p class="total"><span>Total</span><span>${rupiah(r.total)}</span></p>
      </div>`;
    bukaModal("modal-detail");
  }

  $("cari-riwayat").addEventListener("input", render);
  $("filter-status").addEventListener("change", render);
  render();
}

/* ---------------------------------------------------------
   12. TITIK MASUK
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  pasangModalUmum();
  const halaman = document.body.dataset.halaman;

  if (halaman === "login") {
    if (penggunaAktif()) { /* sudah login: tetap boleh login ulang */ }
    initLogin();
    return;
  }

  const user = jagaHalaman();
  if (!user) return;

  switch (halaman) {
    case "dashboard": initDashboard(user); break;
    case "stok": initStok(); break;
    case "checkout": initCheckout(user); break;
    case "tracking": initTracking(); break;
    case "history": initHistory(); break;
  }
});
