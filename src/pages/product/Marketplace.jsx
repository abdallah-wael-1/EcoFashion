import { useState, useMemo } from 'react';
import ProductCard from '../../components/product/ProductCard';
import { useAppContext } from '../../context/AppContext';
import SectionTitle from '../../components/common/SectionTitle';
const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Bags', 'Accessories', 'Outerwear'];
const CONDITIONS = ['New', 'Excellent', 'Good', 'Fair'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const MATERIALS = ['Cotton', 'Polyester', 'Wool', 'Denim', 'Silk', 'Linen', 'Recycled', 'Leather', 'Canvas', 'Cashmere'];

const Marketplace = () => {
  const { products } = useAppContext();
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    conditions: [],
    sizes: [],
    materials: [],
    priceRange: [0, 800],
    upcycledOnly: false,
    verifiedOnly: false,
    topRatedOnly: false,
  });
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    category: true,
    condition: true,
    size: true,
    price: true,
    material: true,
    special: true,
  });

  const itemsPerPage = 12;

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory = filters.category === 'All' || product.category === filters.category;

      const matchesCondition =
        filters.conditions.length === 0 || filters.conditions.includes(product.condition);

      const matchesSize = filters.sizes.length === 0 || filters.sizes.includes(product.size);

      const matchesMaterial =
        filters.materials.length === 0 || filters.materials.includes(product.material);

      const matchesPrice =
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];

      const matchesUpcycled = !filters.upcycledOnly || product.isUpcycled;
      const matchesVerified = !filters.verifiedOnly || (product.seller.trustScore >= 90);
      const matchesTopRated = !filters.topRatedOnly || (product.seller.trustScore >= 95);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesCondition &&
        matchesSize &&
        matchesMaterial &&
        matchesPrice &&
        matchesUpcycled &&
        matchesVerified &&
        matchesTopRated
      );
    });
  }, [filters, products]);

  // Sorting logic
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'eco-credits':
        return sorted.sort((a, b) => b.ecoCredits - a.ecoCredits);
      case 'rated':
        return sorted.sort((a, b) => b.seller.trustScore - a.seller.trustScore);
      case 'latest':
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleArrayFilterChange = (filterType, value) => {
    setFilters((prev) => {
      const current = prev[filterType];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [filterType]: updated };
    });
    setCurrentPage(1);
  };

  const handleToggleFilter = (filterType) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      conditions: [],
      sizes: [],
      materials: [],
      priceRange: [0, 800],
      upcycledOnly: false,
      verifiedOnly: false,
      topRatedOnly: false,
    });
    setCurrentPage(1);
  };

  const activeFilterCount = [
    filters.search ? 1 : 0,
    filters.category !== 'All' ? 1 : 0,
    filters.conditions.length,
    filters.sizes.length,
    filters.materials.length,
    filters.priceRange[0] !== 0 || filters.priceRange[1] !== 800 ? 1 : 0,
    filters.upcycledOnly ? 1 : 0,
    filters.verifiedOnly ? 1 : 0,
    filters.topRatedOnly ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800  top-16 z-40"> 
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
            <SectionTitle title="Marketplace" subtitle="Discover sustainable fashion that doesn't cost the earth." />
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside
            className={`${
              sidebarOpen ? 'fixed inset-0 z-50 bg-black/50 md:relative md:z-0 md:bg-transparent cursor-pointer' : 'hidden md:block'
            }`}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSidebarOpen(false);
            }}
          >
            <div className={`${sidebarOpen ? 'fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 z-50 overflow-y-auto cursor-default' : 'w-64 sticky top-24'}`}>
              <div className="p-4 space-y-6">
                {/* Close button (mobile only) */}
                {sidebarOpen && (
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="md:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {/* Search */}
                <div>
                  <button
                    onClick={() => toggleSection('search')}
                    className="w-full flex items-center justify-between py-2 font-semibold text-gray-900 dark:text-white cursor-pointer"
                  >
                    <span>Search</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${expandedSections.search ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7m0 0L5 14m7-7v20" />
                    </svg>
                  </button>
                  {expandedSections.search && (
                    <div className="mt-3 relative">
                      <input
                        type="text"
                        placeholder="Search items..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                      {filters.search && (
                        <button
                          onClick={() => handleFilterChange('search', '')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Category */}
                <div>
                  <button
                    onClick={() => toggleSection('category')}
                    className="w-full flex items-center justify-between py-2 font-semibold text-gray-900 dark:text-white cursor-pointer"
                  >
                    <span>Category</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${expandedSections.category ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7m0 0L5 14m7-7v20" />
                    </svg>
                  </button>
                  {expandedSections.category && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => handleFilterChange('category', cat)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                            filters.category === cat
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Condition */}
                <div>
                  <button
                    onClick={() => toggleSection('condition')}
                    className="w-full flex items-center justify-between py-2 font-semibold text-gray-900 dark:text-white cursor-pointer"
                  >
                    <span>Condition</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${expandedSections.condition ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7m0 0L5 14m7-7v20" />
                    </svg>
                  </button>
                  {expandedSections.condition && (
                    <div className="mt-3 space-y-2">
                      {CONDITIONS.map((cond) => (
                        <label key={cond} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.conditions.includes(cond)}
                            onChange={() => handleArrayFilterChange('conditions', cond)}
                            className="w-4 h-4 rounded border-gray-200 dark:border-gray-700 text-green-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{cond}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Size */}
                <div>
                  <button
                    onClick={() => toggleSection('size')}
                    className="w-full flex items-center justify-between py-2 font-semibold text-gray-900 dark:text-white cursor-pointer"
                  >
                    <span>Size</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${expandedSections.size ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7m0 0L5 14m7-7v20" />
                    </svg>
                  </button>
                  {expandedSections.size && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {SIZES.map((size) => (
                        <button
                          key={size}
                          onClick={() => handleArrayFilterChange('sizes', size)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                            filters.sizes.includes(size)
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

{/* Price Range */}
<div>
  <button
    onClick={() => toggleSection('price')}
    className="w-full flex items-center justify-between py-2 font-semibold text-gray-900 dark:text-white cursor-pointer"
  >
    <span>Price Range</span>

    <svg
      className={`w-4 h-4 transition-transform duration-200 ${
        expandedSections.price ? 'rotate-180' : ''
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </button>

  {expandedSections.price && (
    <div className="mt-3 space-y-3">

      {/* inputs */}
      <div className="flex flex-col gap-2">
        <input
          type="number"
          placeholder="Min price"
          value={filters.priceRange[0]}
          onChange={(e) =>
            handleFilterChange('priceRange', [
              Math.max(0, parseInt(e.target.value) || 0),
              filters.priceRange[1],
            ])
          }
          className="
            w-full px-3 py-2
            rounded-lg
            border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            text-sm
            focus:outline-none focus:ring-2 focus:ring-green-600
          "
        />

        <input
          type="number"
          placeholder="Max price"
          value={filters.priceRange[1]}
          onChange={(e) =>
            handleFilterChange('priceRange', [
              filters.priceRange[0],
              Math.min(1000, parseInt(e.target.value) || 1000),
            ])
          }
          className="
            w-full px-3 py-2
            rounded-lg
            border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            text-sm
            focus:outline-none focus:ring-2 focus:ring-green-600
          "
        />
      </div>

      {/* display */}
      <div className="text-xs text-gray-500 dark:text-gray-400 px-1">
        EGP {filters.priceRange[0]} — EGP {filters.priceRange[1]}
      </div>
    </div>
  )}
</div>

                {/* Material */}
                <div>
                  <button
                    onClick={() => toggleSection('material')}
                    className="w-full flex items-center justify-between py-2 font-semibold text-gray-900 dark:text-white cursor-pointer"
                  >
                    <span>Material</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${expandedSections.material ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7m0 0L5 14m7-7v20" />
                    </svg>
                  </button>
                  {expandedSections.material && (
                    <div className="mt-3 max-h-40 overflow-y-auto space-y-2">
                      {MATERIALS.map((mat) => (
                        <label key={mat} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.materials.includes(mat)}
                            onChange={() => handleArrayFilterChange('materials', mat)}
                            className="w-4 h-4 rounded border-gray-200 dark:border-gray-700 text-green-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{mat}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Special Filters */}
                <div>
                  <button
                    onClick={() => toggleSection('special')}
                    className="w-full flex items-center justify-between py-2 font-semibold text-gray-900 dark:text-white cursor-pointer"
                  >
                    <span>Special</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${expandedSections.special ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7m0 0L5 14m7-7v20" />
                    </svg>
                  </button>
                  {expandedSections.special && (
                    <div className="mt-3 space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.upcycledOnly}
                          onChange={() => handleToggleFilter('upcycledOnly')}
                          className="w-4 h-4 rounded border-gray-200 dark:border-gray-700 text-green-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">♻ Upcycled Items Only</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.verifiedOnly}
                          onChange={() => handleToggleFilter('verifiedOnly')}
                          className="w-4 h-4 rounded border-gray-200 dark:border-gray-700 text-green-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">✓ Verified Sellers (90%+)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.topRatedOnly}
                          onChange={() => handleToggleFilter('topRatedOnly')}
                          className="w-4 h-4 rounded border-gray-200 dark:border-gray-700 text-green-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">⭐ Top Rated (95%+)</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Clear Filters */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {paginatedProducts.length} of {sortedProducts.length} items
                {filteredProducts.length !== products.length &&
                  ` (${products.length - filteredProducts.length} filtered)`}
              </p>

              <div className="flex items-center gap-4">
                {/* Active Filters Pills */}
                {(filters.search || filters.category !== 'All' || activeFilterCount > 0) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {filters.search && (
                      <button
                        onClick={() => handleFilterChange('search', '')}
                        className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                      >
                        Search: {filters.search} <span>✕</span>
                      </button>
                    )}
                    {filters.category !== 'All' && (
                      <button
                        onClick={() => handleFilterChange('category', 'All')}
                        className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                      >
                        {filters.category} <span>✕</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-600 cursor-pointer"
                >
                  <option value="latest">Latest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="eco-credits">Most EcoCredits</option>
                  <option value="rated">Top Rated</option>
                </select>

                {/* View Toggle */}
                <div className="hidden sm:flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid / Empty State */}
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">♻️</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No items found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Try adjusting your filters to find what you're looking for.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 mb-12 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}>
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 py-8">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span>Previous</span>
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                          currentPage === i + 1
                            ? 'bg-green-600 text-white'
                            : 'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                    >
                      <span>Next</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
