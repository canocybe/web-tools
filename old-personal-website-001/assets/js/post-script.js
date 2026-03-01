// =================== Konfigurasi dan Utilitas ===================

// Daftar file JSON yang berisi artikel
const fileList = [
  '/old-personal-website-001/data/post-1.json',
  '/old-personal-website-001/data/post-2.json'
];

// Variabel global untuk menyimpan semua artikel
let artikelGabungan = [];

// Fungsi untuk mengambil semua artikel dari file JSON dan menggabungkannya
async function ambilSemuaArtikel() {
  try {
    const responses = await Promise.all(
      fileList.map(file =>
        fetch(file).then(res => {
          if (!res.ok) throw new Error(`Gagal fetch ${file}`);
          return res.json();
        })
      )
    );
    return responses.flat(); // Gabungkan semua artikel menjadi satu array
  } catch (err) {
    console.error("Gagal memuat artikel:", err);
    return [];
  }
}

// Fungsi untuk mengambil parameter ID dari URL
function ambilIdDariURL() {
  return parseInt(new URLSearchParams(window.location.search).get('id'));
}

// Fungsi untuk merender konten artikel ke dalam HTML
function renderKontenArtikel(data) {
  return `
    <h1 class="judul-kontent">${data.judul}</h1>
    <p class="penulis-kontent">${data.tanggal} oleh ${data.penulis}</p>
    ${data.konten.map(k => {
    if (k.tipe === "paragraf") return `<p class="paragraf-konten">${k.isi}</p>`;
    if (k.tipe === "subjudul") return `<h2 class="sub-judul-konten">${k.isi}</h2>`;
    if (k.tipe === "code") return `<ul class="source-code-konten">${k.isi.map(i => `<li>${i}</li>`).join("")}</ul>`;
    if (k.tipe === "list") {
      function renderList(items) {
        return `<ul class="list-kontent">${items.map(i => {
          if (typeof i === "string") {
            return `<li>${i}</li>`;
          } else if (typeof i === "object" && i.item) {
            return `<li>${i.item}${i.sub ? renderList(i.sub) : ""}</li>`;
          }
          return "";
        }).join("")}</ul>`;
      }
      return renderList(k.isi);
    }
    if (k.tipe === "link") return `<a href="${k.src}" target="${k.target}" class="link-konten">${k.isi}</a>`;
    if (k.tipe === "gambar") return `<img src="${k.src}" alt="${k.alt}" class="img-konten"/>`;
    return "";
  }).join("")}
  `;
}

// Fungsi untuk membuat tombol navigasi artikel (pagination)
function buatPagination(id) {
  const prevId = id - 1;
  const nextId = id + 1;
  let html = `<a href="/" class="post-pagination-item post-pagination-item-home">Beranda</a>`;

  if (artikelGabungan.some(a => a.id === prevId)) {
    html = `<a href="post.html?id=${prevId}" class="post-pagination-item">« Sebelumnya</a>` + html;
  }

  if (artikelGabungan.some(a => a.id === nextId)) {
    html += `<a href="post.html?id=${nextId}" class="post-pagination-item">Berikutnya »</a>`;
  }

  return html;
}

// =================== Fungsi Utama Artikel ===================

// Fungsi utama untuk menampilkan artikel berdasarkan ID dari URL
function tampilkanArtikel() {
  const id = ambilIdDariURL();
  const data = artikelGabungan.find(a => a.id === id);
  const el = document.getElementById("konten");

  if (!data) {
    el.innerHTML = "<p>Artikel tidak ditemukan.</p>";
    return;
  }

  document.title = data.judul;
  el.innerHTML = renderKontenArtikel(data);

  const paginationEl = document.getElementById("post-pagination");
  paginationEl.innerHTML = buatPagination(id);
}

// =================== Scroll Button ===================

// Ambil elemen tombol scroll
const scrollBtn = document.getElementById("scrollBtn");

// Tampilkan atau sembunyikan tombol scroll saat pengguna menggulir halaman
window.onscroll = function () {
  scrollBtn.style.display = document.documentElement.scrollTop > 100 ? "block" : "none";
};

// Isi tombol scroll dan tambahkan fungsi scroll ke atas saat diklik
scrollBtn.textContent = "▲";
scrollBtn.onclick = () => document.documentElement.scrollTop = 0;

// =================== Header Menu ===================

// Atur tautan menu "Beranda" di header
Object.assign(document.getElementById("link-header-menu-list-1"), {
  href: "/old-personal-website-001.html",
  textContent: "Beranda"
});

// =================== Pencarian Artikel ===================

// Fungsi untuk mencocokkan keyword dengan isi artikel
function cocokkanArtikel(artikel, keyword) {
  const lowerKeyword = keyword.toLowerCase();

  const metadata = [artikel.judul, artikel.kategori, artikel.penulis, artikel.tanggal]
    .filter(Boolean).join(" ").toLowerCase();

  const kontenText = artikel.konten.map(k => {
    const isi = typeof k.isi === "string" ? k.isi : Array.isArray(k.isi) ? k.isi.join(" ") : "";
    const src = k.src || "";
    const alt = k.alt || "";
    return `${isi} ${src} ${alt}`;
  }).join(" ").toLowerCase();

  return metadata.includes(lowerKeyword) || kontenText.includes(lowerKeyword);
}

// Fungsi untuk menampilkan saran pencarian berdasarkan keyword
function tampilkanSaran(keyword) {
  const kotakSaran = document.getElementById("suggestions");
  kotakSaran.innerHTML = "";

  if (!keyword.trim()) {
    kotakSaran.style.display = "none";
    return;
  }

  const hasil = artikelGabungan.filter(a => cocokkanArtikel(a, keyword));

  if (hasil.length === 0) {
    kotakSaran.style.display = "none";
    return;
  }

  hasil.forEach(a => {
    const item = document.createElement("div");
    item.textContent = a.judul;
    item.className = "suggestion-item";
    item.onclick = () => {
      window.location.href = `post.html?id=${a.id}`;
    };
    kotakSaran.appendChild(item);
  });

  kotakSaran.style.display = "block";
}

// =================== Inisialisasi ===================

// Jalankan saat DOM sudah siap
document.addEventListener("DOMContentLoaded", async () => {
  // Muat semua artikel satu kali dan simpan ke variabel global
  artikelGabungan = await ambilSemuaArtikel();

  // Tampilkan artikel berdasarkan ID dari URL
  tampilkanArtikel();

  document.getElementById("footer").classList.remove("hidden");

  // Aktifkan fitur pencarian
  const input = document.getElementById("search");
  input.addEventListener("input", e => {
    tampilkanSaran(e.target.value);
  });

  // Sembunyikan saran saat klik di luar kotak pencarian
  document.addEventListener("click", e => {
    if (!e.target.closest("#search") && !e.target.closest("#suggestions")) {
      document.getElementById("suggestions").style.display = "none";
    }
  });
});
