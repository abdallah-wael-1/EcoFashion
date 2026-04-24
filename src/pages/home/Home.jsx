// src/pages/Home.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SectionTitle from '../../components/common/SectionTitle'; 

const featuredProducts = [
  { id: 1, name: 'Vintage Denim Jacket',   price: 45, image: '🧥', ecoCredits: 15, seller: 'EcoStyle Co.',  condition: 'Excellent' },
  { id: 2, name: 'Organic Cotton T-Shirt', price: 28, image: '👕', ecoCredits: 10, seller: 'Green Threads', condition: 'New'       },
  { id: 3, name: 'Sustainable Sneakers',   price: 65, image: '👞', ecoCredits: 25, seller: 'Eco Kicks',     condition: 'Good'      },
  { id: 4, name: 'Recycled Wool Sweater',  price: 52, image: '🧶', ecoCredits: 20, seller: 'Warm Planet',   condition: 'Excellent' },
];

const Home = () => {
  const navigate = useNavigate();
  const [newsletter, setNewsletter]       = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletter.includes('@')) { setNewsletterMsg('Enter a valid email.'); return; }
    setNewsletterMsg('Subscribed successfully!');
    setNewsletter('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">

      {/* ── Hero ── */}
      <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium">
                  <span>♻️</span>
                  <span>Sustainable Fashion Platform</span>
                </div>

                <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                  Fashion That{' '}
                  <span className="text-green-600 dark:text-green-400">Doesn't Cost the Earth</span>
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                  Buy, sell, and swap sustainable fashion. Earn EcoCredits for every conscious choice
                  and build your digital closet. Join our community of 12,800+ eco-conscious fashion enthusiasts.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/marketplace"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-all duration-200 shadow-[0_2px_8px_rgba(22,163,74,0.35)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.45)] active:scale-[0.98] cursor-pointer"
                >
                  Explore Marketplace
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:border-green-400 dark:hover:border-green-600 hover:text-green-700 dark:hover:text-green-400 transition-all duration-200 bg-white dark:bg-transparent cursor-pointer"
                >
                  Join Now
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                {[
                  { value: '5.2K+',  label: 'Items Swapped' },
                  { value: '12.8K+', label: 'Active Members' },
                  { value: '847T',   label: 'CO₂ Saved'      },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{s.value}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right — Premium product grid ── */}
            <div className="hidden lg:block">
              <div className="space-y-4">

                {/* Row 1: large card + 2 small stacked */}
                <div className="flex gap-4">

                  {/* Large hero card */}
                  <div className="
                    flex-[1.4] h-64 rounded-2xl overflow-hidden relative
                    bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600
                    shadow-[0_8px_32px_rgba(22,163,74,0.35)]
                    group cursor-pointer
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(22,163,74,0.45)]
                  ">
                    {/* Subtle inner texture */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
                    {/* Bottom label */}
                    <div className="absolute bottom-0 inset-x-0 px-5 py-4 bg-gradient-to-t from-black/40 to-transparent">
                      <p className="text-white font-semibold text-sm">New Arrivals</p>
                      <p className="text-white/70 text-xs mt-0.5">12 items · just added</p>
                    </div>
                    {/* Emoji */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-7xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300 select-none">
                        👗
                      </span>
                    </div>
                  </div>

                  {/* Right column — 2 small cards */}
                  <div className="flex-1 flex flex-col gap-4">
                    {[
                      { emoji: '👜', label: 'Bags',       count: '34 items' },
                      { emoji: '👠', label: 'Footwear',   count: '21 items' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="
                          flex-1 rounded-2xl relative overflow-hidden
                          bg-white dark:bg-[#131318]
                          border border-gray-200/80 dark:border-gray-800/80
                          shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]
                          hover:border-green-300 dark:hover:border-green-700
                          hover:shadow-[0_8px_24px_rgba(22,163,74,0.12)] dark:hover:shadow-[0_8px_24px_rgba(22,163,74,0.12)]
                          hover:-translate-y-0.5
                          group cursor-pointer transition-all duration-300
                          flex items-center gap-4 px-5
                        "
                      >
                        <span className="text-4xl group-hover:scale-110 transition-transform duration-300 select-none">
                          {item.emoji}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.label}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.count}</p>
                        </div>
                        {/* Arrow */}
                        <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-green-500 transition-colors ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Row 2: 3 equal small cards */}
                <div className="flex gap-4">
                  {[
                    { emoji: '🧣', label: 'Accessories', count: '58 items' },
                    { emoji: '👖', label: 'Bottoms',     count: '43 items' },
                    { emoji: '🧤', label: 'Winter',      count: '19 items' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="
                        flex-1 h-24 rounded-2xl relative overflow-hidden
                        bg-white dark:bg-[#131318]
                        border border-gray-200/80 dark:border-gray-800/80
                        shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]
                        hover:border-green-300 dark:hover:border-green-700
                        hover:shadow-[0_8px_24px_rgba(22,163,74,0.12)]
                        hover:-translate-y-0.5
                        group cursor-pointer transition-all duration-300
                        flex flex-col items-center justify-center gap-1
                      "
                    >
                      <span className="text-3xl group-hover:scale-110 transition-transform duration-300 select-none">
                        {item.emoji}
                      </span>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{item.label}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">{item.count}</p>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-24 sm:py-16  rounded-2xl border-t border-gray-200/60 dark:border-gray-800/60 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">

          {/* SectionTitle — centered with subtitle */}
          <div className="flex flex-col items-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200/80 dark:border-green-800/60 text-green-700 dark:text-green-400 text-sm font-medium mb-4 shadow-sm">
              <span>✨</span>
              <span>Curated Collection</span>
            </div>
            <SectionTitle
              title="Featured Products"
              subtitle="Sustainable fashion handpicked from our marketplace — verified sellers, premium quality."
              align="center"
              size="md"
            />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="
                  group relative flex flex-col
                  bg-white dark:bg-[#131318]
                  rounded-2xl overflow-hidden
                  border border-gray-100 dark:border-gray-800/80
                  shadow-[0_1px_4px_rgba(0,0,0,0.06)]
                  dark:shadow-[0_1px_8px_rgba(0,0,0,0.35)]
                  hover:-translate-y-1.5
                  hover:shadow-[0_12px_40px_rgba(0,0,0,0.10),0_0_0_1px_rgba(22,163,74,0.15)]
                  dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(34,197,94,0.12)]
                  dark:hover:border-gray-700/80
                  transition-all duration-300 ease-out
                  cursor-pointer
                "
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Image area */}
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-750 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-green-50/60 to-emerald-100/40 dark:from-green-950/40 dark:to-emerald-900/20" />
                  <span className="relative text-6xl transition-transform duration-300 ease-out group-hover:scale-110 drop-shadow-sm select-none">
                    {product.image}
                  </span>
                  <span className="
                    absolute top-3 right-3
                    inline-flex items-center gap-1
                    px-2.5 py-1 rounded-full
                    bg-white/90 dark:bg-gray-900/90
                    border border-green-200/60 dark:border-green-800/60
                    text-green-700 dark:text-green-400
                    text-xs font-semibold
                    shadow-sm backdrop-blur-sm leading-none
                  ">
                    🌱 +{product.ecoCredits}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-5 gap-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-[0.95rem] leading-snug text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
                      {product.name}
                    </h3>
                    <p className="text-[0.78rem] text-gray-400 dark:text-gray-500 font-medium tracking-wide">
                      by {product.seller}
                    </p>
                  </div>
                  <div className="flex-1" />
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800/80">
                    <div className="flex flex-col">
                      <span className="text-[0.65rem] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-medium">Price</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white leading-tight">${product.price}</span>
                    </div>
                    {product.condition && (
                      <span className="px-2.5 py-1 rounded-lg text-[0.7rem] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200/60 dark:border-gray-700/60">
                        {product.condition}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                    className="
                      w-full px-4 py-2.5 rounded-xl
                      bg-green-600 hover:bg-green-500
                      text-white text-sm font-semibold
                      shadow-[0_1px_3px_rgba(22,163,74,0.35)]
                      hover:shadow-[0_4px_14px_rgba(22,163,74,0.45)]
                      active:scale-[0.97]
                      transition-all duration-200 ease-out
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2
                      cursor-pointer
                    "
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-green-600 dark:text-green-400 font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group cursor-pointer"
            >
              View All Products
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Sustainable ── */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200/80 dark:border-green-800/60 text-green-700 dark:text-green-400 text-sm font-medium mb-4">
              <span>🌱</span>
              <span>Why Sustainable?</span>
            </div>
            <SectionTitle
              title="Building a Sustainable Future"
              subtitle="Every purchase contributes to reducing environmental impact and supporting ethical fashion."
              align="center"
              size="md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🌍', title: 'Reduce Carbon Footprint', description: 'Every garment swap saves approximately 7kg of CO₂. Join thousands of conscious consumers making a tangible environmental impact.' },
              { icon: '💚', title: 'Support Ethical Brands',  description: 'Discover and support brands committed to sustainable practices, fair labor, and responsible production methods.' },
              { icon: '💰', title: 'Earn EcoCredits & Save', description: 'Buy quality pre-loved items and earn EcoCredits to unlock exclusive deals and rewards in our community.' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#131318] p-8 hover:border-green-300 dark:hover:border-green-700 hover:shadow-[0_8px_24px_rgba(22,163,74,0.10)] dark:hover:shadow-[0_8px_24px_rgba(22,163,74,0.08)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300 inline-block">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 sm:py-18 px-4 sm:px-6  border-t border-gray-200/60 dark:border-gray-800/60">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <SectionTitle
            title="Ready to Join the Movement?"
            subtitle="Start building your sustainable wardrobe today. Swap, buy, and sell with confidence in our trusted community."
            align="center"
            size="md"
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-sm shadow-[0_2px_8px_rgba(22,163,74,0.35)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.45)] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              Create Free Account
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:border-green-300 dark:hover:border-green-700 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50/50 dark:hover:bg-green-900/20 active:scale-[0.98] shadow-sm transition-all duration-200 cursor-pointer"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-2xl text-center">
          <SectionTitle
            title="Stay Updated"
            subtitle="Get tips on sustainable fashion, exclusive deals, and marketplace updates delivered to your inbox."
          />
          <form onSubmit={handleNewsletter} className="flex flex-col py-10 sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={newsletter}
              onChange={(e) => setNewsletter(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-all duration-200 shadow-[0_2px_8px_rgba(22,163,74,0.3)] hover:shadow-[0_4px_14px_rgba(22,163,74,0.4)] active:scale-[0.98] whitespace-nowrap cursor-pointer"
            >
              Subscribe
            </button>
          </form>
          {newsletterMsg && (
            <p className="text-sm mt-3 text-green-600 dark:text-green-400">{newsletterMsg}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

    </div>
  );
};

export default Home;