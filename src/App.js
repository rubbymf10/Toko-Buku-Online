import React, { useState } from "react";

const BookstoreEcommerce = () => {
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "Semua Kategori" },
    { id: "fiction", name: "Fiksi" },
    { id: "nonfiction", name: "Non-Fiksi" },
    { id: "children", name: "Buku Anak" },
    { id: "education", name: "Pendidikan" },
    { id: "business", name: "Bisnis & Ekonomi" },
  ];

  const books = [
    {
      id: 1,
      title: "Laskar Pelangi",
      author: "Andrea Hirata",
      price: 85000,
      category: "fiction",
      description:
        "Novel inspiratif tentang perjuangan sekelompok anak di Belitung untuk mendapatkan pendidikan.",
      rating: 4.8,
    },
    {
      id: 2,
      title: "Bumi Manusia",
      author: "Pramoedya Ananta Toer",
      price: 95000,
      category: "fiction",
      description:
        "Novel sejarah yang menggambarkan pergolakan masa kolonial Hindia Belanda.",
      rating: 4.7,
    },
    {
      id: 3,
      title: "Atomic Habits",
      author: "James Clear",
      price: 110000,
      category: "nonfiction",
      description:
        "Buku self-improvement tentang membangun kebiasaan kecil untuk perubahan besar.",
      rating: 4.9,
    },
    {
      id: 4,
      title: "Financial Freedom",
      author: "Grant Sabatier",
      price: 125000,
      category: "business",
      description:
        "Panduan mencapai kebebasan finansial melalui investasi dan pengelolaan uang.",
      rating: 4.6,
    },
    {
      id: 5,
      title: "Seri Petualangan Dora",
      author: "Sarah Jones",
      price: 65000,
      category: "children",
      description:
        "Buku cerita anak dengan ilustrasi warna-warni dan kisah petualangan menyenangkan.",
      rating: 4.5,
    },
    {
      id: 6,
      title: "Matematika Dasar",
      author: "Prof. Ahmad Rizal",
      price: 75000,
      category: "education",
      description:
        "Buku panduan komprehensif untuk pembelajaran matematika tingkat dasar.",
      rating: 4.4,
    },
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (book) => {
    setCartItems([...cartItems, book]);
    alert(`${book.title} ditambahkan ke keranjang!`); // Simulasi notifikasi
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-indigo-600 cursor-pointer select-none">
            TokoBukuOnline
          </h1>
          <div className="flex items-center space-x-4">
            <input
              type="search"
              placeholder="Cari judul atau penulis..."
              className="w-72 px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Cari buku"
            />
            <button
              className="relative p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
              aria-label={`Keranjang belanja, ${cartItems.length} item`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-600 hover:text-indigo-800 transition"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13l-1.5-7M7 13h10m-6 7a1 1 0 11-2 0 1 1 0 012 0zm6 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold animate-pulse">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
        {/* Categories */}
        <nav className="bg-indigo-50 border-t border-indigo-100">
          <div className="container mx-auto px-6 py-3 flex space-x-4 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? "bg-indigo-600 text-white shadow-lg transform scale-105"
                    : "text-indigo-700 hover:bg-indigo-200 hover:scale-105"
                }`}
                aria-current={selectedCategory === cat.id ? "page" : undefined}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white py-20 flex flex-col items-center text-center px-6">
        <h2 className="text-5xl font-extrabold max-w-4xl leading-tight mb-6 drop-shadow-lg">
          Temukan Buku Impianmu di Toko Buku Online Terpercaya
        </h2>
        <p className="text-xl max-w-2xl mb-8 drop-shadow-md">
          Jelajahi ribuan buku dari berbagai genre dengan harga terbaik dan
          layanan pengiriman cepat.
        </p>
        <button
          onClick={() => setSelectedCategory("all")}
          className="bg-white text-indigo-700 font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-100 transition-all duration-300 transform hover:scale-105"
        >
          Jelajahi Koleksi
        </button>
      </section>

      {/* Books Grid */}
      <main className="container mx-auto px-6 py-12 flex-grow">
        <h3 className="text-3xl font-bold mb-8 text-center text-gray-800">
          {filteredBooks.length > 0
            ? `Menampilkan ${filteredBooks.length} Buku`
            : "Buku Tidak Ditemukan"}
        </h3>

        {filteredBooks.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p className="mb-4 text-lg">Coba kata kunci lain atau reset filter.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1"
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                  <img
                    src={`https://source.unsplash.com/300x200/?book,cover,${book.category}`}
                    alt={`Cover buku ${book.title} karya ${book.author}`}
                    className="object-cover h-full w-full transform hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h4 className="text-lg font-semibold text-gray-900 truncate mb-1">
                    {book.title}
                  </h4>
                  <p className="text-indigo-600 font-medium text-sm mb-2 truncate">
                    {book.author}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3 flex-grow mb-3">
                    {book.description}
                  </p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xl font-bold text-indigo-700">
                      Rp {book.price.toLocaleString("id-ID")}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-sm font-medium">{book.rating}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(book)}
                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors font-semibold"
                  >
                    + Tambah ke Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Testimonials Section */}
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h3 className="text-3xl font-bold mb-10 text-indigo-700">
            Apa Kata Pelanggan Kami
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <blockquote className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 italic text-lg mb-4">
                "Pelayanan cepat dan koleksi bukunya lengkap sekali. Saya selalu
                puas berbelanja di sini!"
              </p>
              <footer className="font-semibold text-indigo-600">
                – rubby, sukabumi
              </footer>
            </blockquote>
            <blockquote className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 italic text-lg mb-4">
                "Website mudah digunakan, proses checkout lancar, dan buku sampai
                tepat waktu."
              </p>
              <footer className="font-semibold text-indigo-600">
                – hera, Sukabumi 
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-indigo-100 py-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">TokoBukuOnline</h4>
            <p className="text-sm leading-relaxed">
              Menyediakan buku berkualitas dengan pelayanan terbaik sejak 2020.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Kategori</h5>
            <ul className="space-y-2 text-sm">
              {categories
                .filter((c) => c.id !== "all")
                .map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setSelectedCategory(cat.id)}
                      className="hover:underline"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Kontak</h5>
            <p className="text-sm">email: support@tokobukuonline.id</p>
            <p className="text-sm">Telp: (021) 1234-5678</p>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Ikuti Kami</h5>
            <p className="text-sm">Instagram / Facebook / Twitter</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BookstoreEcommerce;
