import { useState, useEffect } from "react";
import FilterSidebar from "./FilterSidebar";
import BookCard from "./BookCard";
import { FiFilter, FiChevronDown, FiX, FiRefreshCw } from "react-icons/fi";
import { useFetchAllBooksQuery } from "../../app/features/books/booksApi";
import { useFetchAllCategoriesQuery } from "../../app/features/category/categoryApi";

const Books = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("sortBy");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 5000 },
    ratings: [],
    language: [], // ✅ ADD
    discount: null,
  });

  const booksPerPage = 12;

  const { data: bookData } = useFetchAllBooksQuery({
    // CATEGORY
    category:
      activeFilters.categories.length > 0
        ? activeFilters.categories[0]
        : undefined,

    // PRICE
    minPrice: activeFilters.priceRange?.min || undefined,
    maxPrice: activeFilters.priceRange?.max || undefined,

    // RATING
    rating:
      activeFilters.ratings.length > 0
        ? Math.max(...activeFilters.ratings)
        : undefined,

    // DISCOUNT
    discount: activeFilters.discount || undefined,

    // SORTING
    sortBy: sortBy !== "" ? sortBy : undefined,

    // LANGUAGE
    language:
      activeFilters.language.length > 0 ? activeFilters.language : undefined,

    // PAGINATION
    page: currentPage,
    limit: booksPerPage,
  });

  const books = bookData?.data || [];

  const { data: categoryData } = useFetchAllCategoriesQuery({ active: true });
  const categories = categoryData?.data || [];

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(books.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const paginatedBooks = books.slice(startIndex, startIndex + booksPerPage);

  const handleFilterChange = (newFilters) => {
    setIsLoading(true);
    setActiveFilters(newFilters);
    setCurrentPage(1);

    setTimeout(() => setIsLoading(false), 300);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.categories.length)
      count += activeFilters.categories.length;
    if (activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < 5000)
      count++;
    if (activeFilters.ratings.length) count += activeFilters.ratings.length;
    if (activeFilters.discount) count++;
    return count;
  };

  const clearAllFilters = () => {
    setActiveFilters({
      categories: [],
      priceRange: { min: 0, max: 5000 },
      ratings: [],
      discount: null,
    });
    setCurrentPage(1);
  };

  const getCategoryNameById = (id) => {
    const cat = categories.find((c) => c._id === id);
    return cat ? cat.name : id;
  };

  // Auto-hide loading
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "recommended", label: "Recommended" },
    { value: "trending", label: "Trending" },
    { value: "featured", label: "Featured" },
    { value: "rating", label: "Customer Rating" },
    { value: "discount", label: "Best Discount" },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <FilterSidebar
            categories={categories}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            showFilters={showFilters}
            onClose={() => setShowFilters(false)}
          />

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-linear-to-r from-gray-50 to-white border-b border-gray-200 border-l p-3.75 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Results Info */}
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-gray-600">
                      Showing{" "}
                      <span className="font-bold text-gray-900">
                        {startIndex + 1}-
                        {Math.min(startIndex + booksPerPage, books.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-gray-900">
                        {books.length}
                      </span>{" "}
                      results
                    </p>
                    {getActiveFilterCount() > 0 && (
                      <p className="text-sm text-gray-500">
                        {getActiveFilterCount()} active filter
                        {getActiveFilterCount() > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>

                  {/* Loading Indicator */}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <FiRefreshCw className="animate-spin" />
                      <span className="text-sm">Applying filters...</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer min-w-45"
                    >
                      <option value="">Sort By</option>
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>

                  {/* Clear Filters */}
                  {getActiveFilterCount() > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="px-4 py-2.5 text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Active Filters Display */}
              {getActiveFilterCount() > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.categories.map((catId, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                      >
                        {getCategoryNameById(catId)}
                        <button
                          onClick={() =>
                            handleFilterChange({
                              ...activeFilters,
                              categories: activeFilters.categories.filter(
                                (c) => c !== catId
                              ),
                            })
                          }
                          className="hover:text-blue-900"
                        >
                          <FiX size={14} />
                        </button>
                      </span>
                    ))}

                    {(activeFilters.priceRange.min > 0 ||
                      activeFilters.priceRange.max < 5000) && (
                      <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2">
                        ₹{activeFilters.priceRange.min} - ₹
                        {activeFilters.priceRange.max}
                        <button
                          onClick={() =>
                            handleFilterChange({
                              ...activeFilters,
                              priceRange: { min: 0, max: 5000 },
                            })
                          }
                          className="hover:text-green-900"
                        >
                          <FiX size={14} />
                        </button>
                      </span>
                    )}

                    {activeFilters.discount && (
                      <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-2">
                        {activeFilters.discount}%+ Off
                        <button
                          onClick={() =>
                            handleFilterChange({
                              ...activeFilters,
                              discount: null,
                            })
                          }
                          className="hover:text-orange-900"
                        >
                          <FiX size={14} />
                        </button>
                      </span>
                    )}

                    {activeFilters.ratings.map((rating, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm flex items-center gap-2"
                      >
                        {rating}+ Stars
                        <button
                          onClick={() =>
                            handleFilterChange({
                              ...activeFilters,
                              ratings: activeFilters.ratings.filter(
                                (r) => r !== rating
                              ),
                            })
                          }
                          className="hover:text-amber-900"
                        >
                          <FiX size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* No Results State */}
            {books.length === 0 && !isLoading ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No books found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search term to find what
                    you're looking for.
                  </p>
                  <button
                    // onClick={clearAllFilters}
                    className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Books Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedBooks.map((book) => (
                    <BookCard key={book.id} book={book} view="grid" />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-gray-600">
                      Page <span className="font-bold">{currentPage}</span> of{" "}
                      <span className="font-bold">{totalPages}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>

                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                                currentPage === pageNum
                                  ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}

                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="text-gray-400">...</span>
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                              currentPage === totalPages
                                ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Results Summary */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl">
                      <div className="text-3xl font-bold text-gray-900">
                        {books.length}
                      </div>
                      <div className="text-gray-600 mt-2">Books Found</div>
                    </div>
                    <div className="text-center p-6 bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl">
                      <div className="text-3xl font-bold text-gray-900">
                        ₹
                        {books.length > 0
                          ? Math.min(...books.map((b) => b.price.discounted))
                          : 0}
                      </div>
                      <div className="text-gray-600 mt-2">Starting From</div>
                    </div>
                    <div className="text-center p-6 bg-linear-to-r from-amber-50 to-orange-50 rounded-2xl">
                      <div className="text-3xl font-bold text-gray-900">
                        {bookData?.meta?.maxDiscount || 0}%
                      </div>
                      <div className="text-gray-600 mt-2">Max Discount</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowFilters(true)}
          className="w-14 h-14 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all"
        >
          <FiFilter size={24} />
          {getActiveFilterCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Books;
