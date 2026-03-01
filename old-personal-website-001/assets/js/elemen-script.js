// Header Menu
const elementHtml = [
  // ========== Header ==========
  // Header Logo Link
  { id: "header-logo-link", href: "/old-personal-website-001/old-personal-website-001.html" },
  // Header Logo Img
  { id: "header-logo-link-img", src: "/old-personal-website-001/assets/images/id-0-images-icon.svg", alt: "Logo" },
  // Header Logo Span
  { id: "header-logo-link-span", text: "Rizki Octaf" },

  // Header Menu Lihat
  { id: "link-header-menu-list-2", href: "https://github.com/rizkioctaf/", target: "_blank", text: "Lihat" },
  // Header Menu Animasi
  { id: "link-header-menu-list-3", text: "Animasi ▾" },
  // Header Menu Animasi Dropdown
  { id: "menu-list-anime-dropdown-1", href: "/old-personal-website-001/data/post.html?id=6", text: "Kimi No Nawa" },
  { id: "menu-list-anime-dropdown-2", href: "/old-personal-website-001/data/post.html?id=9", text: "5 Centimeters per Second" },
  { id: "menu-list-anime-dropdown-3", href: "/old-personal-website-001/data/post.html?id=5", text: "Anohana" },
  { id: "menu-list-anime-dropdown-4", href: "/old-personal-website-001/data/post.html?id=7", text: "Kotonoha no Niwa" },
  { id: "menu-list-anime-dropdown-5", href: "/old-personal-website-001/data/post.html?id=10", text: "Koe no Katachi" },
  // Header Menu Program
  { id: "link-header-menu-list-4", text: "Program ▾" },
  // Header Menu Program Dropdown
  { id: "menu-list-program-dropdown-1", href: "/old-personal-website-001/data/post.html?id=1", text: "Resize & Converter Gambar" },
  { id: "menu-list-program-dropdown-2", href: "/old-personal-website-001/data/post.html?id=2", text: "Chess Sederhana" },
  // Header Menu Hubungi
  { id: "link-header-menu-list-5", href: "mailto:rizkioctafadilah96@gmail.com", text: "Hubungi" },

  // Header Search
  { id: "search", placeholder: "Temukan Artikel..." },
  // Header Search Logo
  { id: "search-icon", src: "/old-personal-website-001/assets/images/id-0-images-search.svg", alt: "Search-Logo" },
  // Header Search Logo Close
  { id: "search-close-icon", innerhtml: "&#x2715;" },

  // Header Burger Button
  { id: "burger", innerhtml: "&#9776;" },
  // Header Close Button
  { id: "close-btn", innerhtml: "&#x2715;" },

  // ========= Footer =========
  // Footer Deskripsi
  { id: "footer-about-item", text: "Situs ini menyajikan artikel seputar teknologi, animasi, pemrograman, dan proyek sederhana yang bertujuan memperkaya pengetahuan serta keterampilan di bidang digital" },
  // Footer Copyright
  { id: "copyright-item", text: "© 2025 Rizki Octaf. All rights reserved." },
];

// Loop melalui setiap objek dalam array elementHtml
elementHtml.forEach(item => {
  // Ambil elemen HTML berdasarkan ID yang diberikan dalam item
  const el = document.getElementById(item.id);
  if ("text" in item) { // Jika item memiliki properti "text", ubah isi teks elemen
    el.textContent = item.text;
  } if ("href" in item) { // Jika item memiliki properti "href", ubah atribut href (biasanya untuk <a>)
    el.href = item.href;
  } if ("target" in item) { // Jika item memiliki properti "target", ubah atribut target (misalnya "_blank" untuk membuka di tab baru)
    el.target = item.target;
  } if ("src" in item) {  // Jika item memiliki properti "src", ubah sumber gambar atau media (biasanya untuk <img>, <video>, dll)
    el.src = item.src;
  } if ("alt" in item) {  // Jika item memiliki properti "alt", ubah teks alternatif gambar (biasanya untuk <img>)
    el.alt = item.alt;
  } if ("placeholder" in item) {  // Jika item memiliki properti "placeholder", ubah teks placeholder (biasanya untuk <input> atau <textarea>)
    el.placeholder = item.placeholder;
  } if ("innerhtml" in item) {  // Jika item memiliki properti "innerhtml", ubah isi HTML mentah dari elemen
    el.innerHTML = item.innerhtml;
  }
});

// Menambahkan event klik ke elemen dengan ID "header-logo-link"
document.getElementById("header-logo-link").addEventListener("click", () => {
  // Set nilai halaman ke 1 di localStorage (halaman utama)
  localStorage.setItem("halaman", 1);
  // Arahkan pengguna ke halaman index.html
  window.location.href = "/";
});

// Menampilkan Shadow pada Header saat melakukan scroll
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("header"); // Ambil elemen dengan ID 'header'

  if (window.scrollY > 0) {
    // Jika pengguna menggulir ke bawah (scrollY > 0), tambahkan class 'shadow'
    navbar.classList.add("shadow");
  } else {
    // Jika di posisi paling atas (scrollY = 0), hapus class 'shadow'
    navbar.classList.remove("shadow");
  }
});

// Konfigurasi Bagian Header Menu dan Dropdown Class
// Ambil elemen menu utama
const navMenu = document.getElementById('linkHeaderMenu');

// Fungsi untuk membuka menu navigasi
function toggleNav() {
  navMenu.classList.add('active'); // Tambahkan class 'active' agar menu muncul
}

// Fungsi untuk menutup menu navigasi
function closeNav() {
  navMenu.classList.remove('active'); // Hapus class 'active' agar menu hilang
  tutupSemuaDropdown(); // Tutup semua dropdown yang terbuka
}

// Fungsi untuk membuka/tutup dropdown saat item diklik
function toggleDropdown(elemen) {
  const sudahTerbuka = elemen.classList.contains('show'); // Cek apakah dropdown sudah terbuka

  tutupSemuaDropdown(); // Tutup semua dropdown dulu

  if (!sudahTerbuka) {
    elemen.classList.add('show'); // Kalau belum terbuka, buka dropdown ini
  }
}

// Fungsi untuk menutup semua dropdown
function tutupSemuaDropdown() {
  const semuaItem = navMenu.querySelectorAll('li.show'); // Cari semua item yang sedang terbuka
  semuaItem.forEach(item => {
    item.classList.remove('show'); // Tutup dengan menghapus class 'show'
  });
}

// Tutup dropdown jika pengguna klik di luar menu
document.addEventListener('click', function (event) {
  const klikDiLuarMenu = !navMenu.contains(event.target); // Cek apakah klik di luar menu
  if (klikDiLuarMenu) {
    tutupSemuaDropdown(); // Tutup semua dropdown
  }
});

// Expand dan Hide Header Input Search
// Fungsi untuk mengatur tampilan elemen (muncul atau disembunyikan)
function toggleDisplay(id, tampilkan) {
  const elemen = document.getElementById(id);
  // Jika tampilkan = true, maka tampilkan elemen
  // Jika tampilkan = false, maka sembunyikan elemen
  if (tampilkan) {
    elemen.style.display = "block";
  } else {
    elemen.style.display = "none";
  }
}

// Fungsi untuk memperluas kotak pencarian
function expandSearch() {
  const searchBox = document.getElementById('searchBox');
  searchBox.classList.add('expanded'); // Tambahkan class 'expanded'

  // Cek ukuran layar
  if (window.innerWidth >= 976) {
    // Jika layar besar, sembunyikan menu header
    toggleDisplay('header-menu', false);
  } else {
    // Jika layar kecil, sembunyikan logo
    toggleDisplay('header-logo', false);
  }

  // Tunda autofocus agar keyboard muncul setelah transisi selesai
  setTimeout(() => {
    const inputSearch = searchBox.querySelector('input');
    if (inputSearch) {
      inputSearch.focus();
      inputSearch.setAttribute('autocomplete', 'on'); // bantu browser aktifkan keyboard
    }
  }, 300); // Sesuaikan dengan durasi transisi CSS
}

// Fungsi untuk mengembalikan tampilan pencarian ke semula
function collapseSearch() {
  const searchBox = document.getElementById('searchBox');
  searchBox.classList.remove('expanded'); // Hapus class 'expanded'

  // Cek ukuran layar
  if (window.innerWidth >= 976) {
    // Jika layar besar, tampilkan menu header
    toggleDisplay('header-menu', true);
  } else {
    // Jika layar kecil, tampilkan logo
    toggleDisplay('header-logo', true);
  }
}


