import React, { useState, useRef, useEffect } from "react";
import BookCover from "./components/BookCover";

const BookstoreEcommerce = () => {
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "Semua Kategori", icon: "📚" },
    { id: "fiction", name: "Fiksi", icon: "📖" },
    { id: "nonfiction", name: "Non-Fiksi", icon: "📘" },
    { id: "children", name: "Buku Anak", icon: "🧒" },
    { id: "education", name: "Pendidikan", icon: "🏫" },
    { id: "business", name: "Bisnis & Ekonomi", icon: "💼" },
  ];

  const booksRef = useRef(null);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const update = () => {
      const h = headerRef.current ? headerRef.current.offsetHeight : 0;
      setHeaderHeight(h);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Fetch real books from Google Books API to show real/verified items.
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchBooks() {
      setLoadingBooks(true);
      const perCategory = 40; // Google Books allows maxResults up to 40
      const fetches = [];
      for (const cat of categories) {
        if (cat.id === "all") continue;
        const q = `subject:${cat.id}`;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=${perCategory}`;
        fetches.push(
          fetch(url)
            .then((r) => r.json())
            .then((data) => ({ cat: cat.id, items: data.items || [] }))
            .catch(() => ({ cat: cat.id, items: [] }))
        );
      }

      try {
        const results = await Promise.all(fetches);
        const items = [];
        for (const res of results) {
          for (const vol of res.items) {
            const info = vol.volumeInfo || {};
            const industry = info.industryIdentifiers || [];
            const isbnObj = industry.find((i) => i.type === "ISBN_13") || industry.find((i) => i.type === "ISBN_10");
            const isbn = isbnObj ? isbnObj.identifier : undefined;
            const imageLinks = info.imageLinks || {};
            let image = imageLinks.thumbnail || imageLinks.smallThumbnail;
            if (image && image.startsWith("http:")) image = image.replace("http:", "https:");

            items.push({
              id: vol.id,
              title: info.title || "Untitled",
              author: (info.authors && info.authors.join(", ")) || "Unknown",
              price: Math.round((50 + Math.random() * 150) * 1000),
              category: res.cat,
              image: image || `https://source.unsplash.com/600x400/?${encodeURIComponent(info.title || "book")}&sig=${vol.id}`,
              description: info.description ? String(info.description).replace(/(<([^>]+)>)/gi, "").slice(0, 300) : info.subtitle || "",
              rating: info.averageRating ? Number(info.averageRating.toFixed(1)) : Number((3.5 + Math.random() * 1.3).toFixed(1)),
              ...(isbn ? { isbn } : {}),
            });
          }
        }

        if (mounted) {
          setBooks(items);
          setLoadingBooks(false);
        }
      } catch (err) {
        if (mounted) {
          setBooks([]);
          setLoadingBooks(false);
        }
      }
    }

    fetchBooks();
    return () => (mounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const [showCart, setShowCart] = useState(false);

  const removeFromCart = (index) => {
    setCartItems((items) => items.filter((_, i) => i !== index));
  };

  const clearCart = () => setCartItems([]);

  const checkout = () => {
    if (cartItems.length === 0) {
      alert("Keranjang kosong.");
      return;
    }
    // Simulasi checkout
    const titles = cartItems.map((b) => b.title).join("\n- ");
    alert(`Checkout berhasil. Buku yang dibeli:\n- ${titles}`);
    clearCart();
    setShowCart(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Header */}
  <header ref={headerRef} className="sticky top-0 z-50 bg-white shadow-md">
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
              onClick={() => setShowCart(true)}
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
                onClick={() => {
                  setSelectedCategory(cat.id);
                  // scroll to books section for better UX on mobile
                  if (booksRef && booksRef.current) {
                    booksRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? "bg-indigo-600 text-white shadow-lg transform scale-105"
                    : "text-indigo-700 hover:bg-indigo-200 hover:scale-105"
                }`}
                aria-current={selectedCategory === cat.id ? "page" : undefined}
              >
                <span className="mr-2">{cat.icon}</span>
                <span className="align-middle">{cat.name}</span>
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
      </section>

      {/* Books Grid */}
  <main ref={booksRef} className="container mx-auto px-6 py-12 flex-grow">
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
                  {book.isbn ? (
                    <BookCover
                      isbn={book.isbn}
                      alt={`Cover buku ${book.title} karya ${book.author}`}
                      className="object-cover h-full w-full transform hover:scale-110 transition-transform duration-300"
                      fallback={
                        book.image ||
                        `https://source.unsplash.com/600x400/?${encodeURIComponent(
                          book.title
                        )},${encodeURIComponent(book.author)},${encodeURIComponent(book.category)}&sig=${book.id}`
                      }
                    />
                  ) : (
                    <img
                      src={
                        book.image ||
                        `https://source.unsplash.com/600x400/?${encodeURIComponent(
                          book.title
                        )},${encodeURIComponent(book.author)},${encodeURIComponent(book.category)}&sig=${book.id}`
                      }
                      alt={`Cover buku ${book.title} karya ${book.author}`}
                      className="object-cover h-full w-full transform hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22 viewBox=%220 0 300 200%22%3E%3Crect width=%22300%22 height=%22200%22 fill=%22%23e5e7eb%22/%3E%3Ctext x=%22150%22 y=%22105%22 font-size=%2216%22 text-anchor=%22middle%22 fill=%22%23737474%22%3EImage%20not%20available%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  )}
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
      {/* Cart Modal / Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-60 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => setShowCart(false)}
          />
          <aside
            className="w-full sm:w-96 bg-white shadow-xl p-6 overflow-auto"
            style={{ position: 'fixed', right: 0, top: headerHeight, height: `calc(100vh - ${headerHeight}px)` }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Keranjang Belanja</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowCart(false)}
                aria-label="Tutup keranjang"
              >
                ✕
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <p>Keranjang Anda kosong.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="w-16 h-20 bg-gray-100 flex-shrink-0 overflow-hidden rounded">
                      {/* reuse BookCover or image */}
                      {item.isbn ? (
                        <img
                          src={`https://source.unsplash.com/120x160/?${encodeURIComponent(
                            item.title + "," + item.category
                          )}&sig=${item.id}`}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={
                            item.image ||
                            `https://source.unsplash.com/120x160/?${encodeURIComponent(
                              item.title
                            )},${encodeURIComponent(item.category)}&sig=${item.id}`
                          }
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.author}</div>
                      <div className="text-sm text-indigo-700 font-bold">Rp {item.price.toLocaleString('id-ID')}</div>
                    </div>
                    <div>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-gray-700 font-medium">Total</div>
                    <div className="text-xl font-bold text-indigo-700">
                      Rp {cartItems.reduce((s, b) => s + b.price, 0).toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button onClick={checkout} className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded">Checkout</button>
                    <button onClick={clearCart} className="bg-gray-100 px-4 py-2 rounded">Kosongkan</button>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
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
            <div className="flex items-center space-x-4">
              {/* Instagram link - replace `your_instagram` with your handle */}
              <a
                href="https://instagram.com/rubbymf_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Buka Instagram kami di tab baru"
                className="flex items-center space-x-2 text-sm hover:underline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-pink-400"
                  aria-hidden="true"
                >
                  <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm0 2h10c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3zm5 3.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 2a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm4.75-.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z" />
                </svg>
                <span>Instagram</span>
              </a>

              {/* GitHub link - replace `your_username` with your GitHub username */}
              <a
                href="https://github.com/rubbymf10"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Buka GitHub kami di tab baru"
                className="flex items-center space-x-2 text-sm hover:underline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-indigo-100"
                  aria-hidden="true"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.16 6.84 9.49.5.09.66-.22.66-.49 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.2-3.37-1.2-.45-1.14-1.11-1.44-1.11-1.44-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.9 1.54 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85.004 1.71.115 2.51.337 1.9-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85 0 1.33-.01 2.4-.01 2.73 0 .27.16.59.67.49A10 10 0 0022 12c0-5.52-4.48-10-10-10z" />
                </svg>
                <span>GitHub</span>
              </a>
            </div>
            <p className="mt-2 text-xs text-indigo-200">Ketuk untuk membuka akun di tab baru</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BookstoreEcommerce;
