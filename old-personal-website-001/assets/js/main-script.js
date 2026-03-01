// =================== Objek Modular ArtikelApp ===================
const ArtikelApp = {
  // Daftar file JSON yang berisi artikel
  fileList: [
    '/old-personal-website-001/data/post-1.json',
    '/old-personal-website-001/data/post-2.json'
  ],

  // Variabel global untuk menyimpan artikel dan status halaman
  artikel: [],
  halaman: parseInt(localStorage.getItem("halaman")) || 1,
  jumlahPerHalaman: 15, // Jumlah artikel per halaman

  // Fungsi untuk memuat data artikel dari file JSON
  async muatData() {
    try {
      // Ambil semua file JSON secara paralel
      const responses = await Promise.all(
        this.fileList.map(file =>
          fetch(file).then(res => {
            if (!res.ok) throw new Error(`Gagal fetch ${file}`);
            return res.json();
          })
        )
      );

      // Gabungkan semua artikel dari file JSON
      const combinedData = responses.flat();

      // Validasi struktur artikel agar hanya data yang benar diproses
      const validData = combinedData.filter(item =>
        typeof item.id === "number" &&
        typeof item.judul === "string" &&
        Array.isArray(item.konten)
      );

      // Jika tidak ada artikel valid, lempar error
      if (validData.length === 0) {
        throw new Error("Tidak ada artikel valid yang ditemukan");
      }

      // Simpan artikel valid ke variabel global
      this.artikel = validData;

      // Tampilkan daftar artikel
      this.tampilkanJudul();
      // Tampilkan tombol pagination, total artikel dan footer setelah data siap
      document.getElementById("main-total-pencarian").classList.remove("hidden");
      document.getElementById("main-pagination").classList.remove("hidden");
      document.getElementById("footer").classList.remove("hidden");

      // Tambahkan event tombol pagination setelah data siap
      document.getElementById('btn-prev').onclick = () => this.ubahHalaman(-1);
      document.getElementById('btn-next').onclick = () => this.ubahHalaman(1);


      // Tambahkan event listener untuk pencarian
      document.getElementById('search').addEventListener('input', () => {
        this.halaman = 1;
        localStorage.setItem("halaman", this.halaman);
        this.tampilkanJudul();
      });

    } catch (err) {
      console.error("Kesalahan saat memuat data:", err);
      document.getElementById('judul-container').innerHTML =
        `<p class="error">Gagal memuat artikel. Silakan coba lagi nanti.</p>`;
    }
  },

  // Fungsi utama untuk menampilkan daftar artikel
  tampilkanJudul() {
    const keyword = document.getElementById('search').value.toLowerCase();

    const hasil = this.artikel.filter(a => {
      const judul = a.judul?.toLowerCase() || "";
      const kategori = a.kategori?.toLowerCase() || "";
      const isiKonten = a.konten.map(k => {
        if (typeof k.isi === "string") return k.isi.toLowerCase();
        if (Array.isArray(k.isi)) return k.isi.map(i => typeof i === "string" ? i.toLowerCase() : "").join(" ");
        return "";
      }).join(" ");
      return judul.includes(keyword) || kategori.includes(keyword) || isiKonten.includes(keyword);
    });

    hasil.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    // Pisahkan highlight jika di halaman pertama dan tidak ada pencarian
    let highlight = null;
    if (this.halaman === 1 && keyword === "") {
      highlight = hasil[0];
    }

    // Hitung total halaman berdasarkan apakah highlight ditampilkan
    const totalHalaman = Math.ceil((highlight ? hasil.length - 1 : hasil.length) / this.jumlahPerHalaman);

    // Hitung indeks awal
    const mulai = (this.halaman - 1) * this.jumlahPerHalaman;

    // Ambil daftar artikel untuk ditampilkan, lewati highlight jika ada
    const tampil = hasil.slice(highlight ? 1 : 0).slice(mulai, mulai + this.jumlahPerHalaman);

    document.getElementById('totalHasil').textContent = `Total Artikel Ditemukan : ${hasil.length}`;

    this.renderHighlight(highlight);
    this.renderList(tampil);
    this.updatePagination(totalHalaman);
  },

  // Fungsi untuk menampilkan artikel pertama sebagai highlight
  renderHighlight(data) {
    const highlightContainer = document.getElementById('highlight-artikel');
    highlightContainer.innerHTML = "";

    if (!data) return;

    const isiParagraf = data.konten.find(k => k.tipe === "paragraf")?.isi || "";
    const preview = isiParagraf.split(" ").slice(0, 30).join(" ") + "...";

    const highlightItem = document.createElement("div");
    highlightItem.className = "highlight-item";
    highlightItem.innerHTML = `
    <img src="${data.thumbnail}" alt="${data.judul}" class="highlight-thumbnail" />
    <h2 class="highlight-title"><a href="/old-personal-website-001/data/post.html?id=${data.id}">${data.judul}</a></h2>
    <p class="highlight-preview">${preview}</p>
    <small class="highlight-tanggal">${data.tanggal} oleh ${data.penulis}</small>
  `;
    highlightContainer.appendChild(highlightItem);
  },

  // Fungsi untuk menampilkan daftar artikel biasa
  renderList(tampil) {
    const container = document.getElementById('judul-container');
    container.innerHTML = "";

    tampil.forEach(a => {
      const isiParagraf = a.konten.find(k => k.tipe === "paragraf")?.isi || "";
      const preview = isiParagraf.split(" ").slice(0, 15).join(" ") + "...";

      const item = document.createElement("div");
      item.className = "item-artikel";
      item.innerHTML = `
        <img src="${a.thumbnail}" alt="${a.judul}" class="thumbnail-artikel"/>
        <h3 class="title-artikel"><a href="/old-personal-website-001/data/post.html?id=${a.id}">${a.judul}</a></h3>
        <p class="preview">${preview}</p>
        <small class="tanggal-artikel">${a.tanggal} oleh ${a.penulis}</small>
      `;
      container.appendChild(item);
    });
  },

  // Fungsi untuk mengatur tampilan tombol pagination
  updatePagination(totalHalaman) {
    document.getElementById('halamanAktif').textContent = this.halaman;
    document.getElementById('btn-prev').disabled = (this.halaman === 1);
    document.getElementById('btn-next').disabled = (this.halaman >= totalHalaman);
  },

  // Fungsi untuk mengubah halaman saat tombol navigasi diklik
  ubahHalaman(arah) {
    const keyword = document.getElementById('search').value.toLowerCase();
    const hasil = this.artikel.filter(item => item.judul.toLowerCase().includes(keyword));
    const totalHalaman = Math.ceil(hasil.length / this.jumlahPerHalaman);

    this.halaman += arah;
    if (this.halaman < 1) this.halaman = 1;
    if (this.halaman > totalHalaman) this.halaman = totalHalaman;

    localStorage.setItem("halaman", this.halaman);
    this.tampilkanJudul();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

// =================== Inisialisasi Saat Halaman Dimuat ===================
document.addEventListener("DOMContentLoaded", () => {
  // Set judul halaman
  document.title = "Rizki Octaf";

  // Atur menu header "Beranda"
  Object.assign(document.getElementById("link-header-menu-list-1"), {
    href: "/old-personal-website-001.html",
    textContent: "Beranda",
    onclick: () => localStorage.setItem("halaman", 1)
  });

  // Atur label tombol pagination
  document.getElementById('btn-prev').textContent = "« Sebelumnya";
  document.getElementById('btn-next').textContent = "Berikutnya »";

  // Mulai memuat data artikel
  ArtikelApp.muatData();
});
