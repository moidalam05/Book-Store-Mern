import React, { useState } from "react";
import {
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiCheck,
  FiDollarSign,
  FiStar,
  FiGlobe,
  FiPercent,
  FiPackage,
  FiTag,
  FiRefreshCw,
} from "react-icons/fi";

const FilterSidebar = ({
  activeFilters,
  onFilterChange,
  showFilters,
  onClose,
  categories,
}) => {
  const [open, setOpen] = useState({
    categories: true,
    price: true,
    rating: true,
    language: true,
    discount: true,
    availability: true,
  });

  const toggle = (key) => {
    setOpen((p) => ({ ...p, [key]: !p[key] }));
  };

  const languages = [
    { id: "english", name: "English", count: 156 },
    { id: "hindi", name: "Hindi", count: 78 },
  ];

  const ratings = [
    { value: 4, label: "4 ★ & above", count: 234 },
    { value: 3, label: "3 ★ & above", count: 156 },
    { value: 2, label: "2 ★ & above", count: 89 },
  ];

  const discounts = [
    { value: 50, label: "50% & above" },
    { value: 40, label: "40% & above" },
    { value: 30, label: "30% & above" },
    { value: 20, label: "20% & above" },
  ];

  const toggleArray = (key, value) => {
    const arr = activeFilters[key];
    onFilterChange({
      ...activeFilters,
      [key]: arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value],
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      categories: [],
      priceRange: { min: 0, max: 5000 },
      ratings: [],
      language: [],
      discount: null,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.categories.length > 0)
      count += activeFilters.categories.length;
    if (activeFilters.ratings.length > 0) count += activeFilters.ratings.length;
    if (activeFilters.language.length > 0)
      count += activeFilters.language.length;
    if (activeFilters.availability) count++;
    if (activeFilters.discount) count++;
    if (activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < 5000)
      count++;
    return count;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 lg:top-20 left-0 
          h-screen w-80 lg:w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-out
          shadow-xl lg:shadow-none
          flex flex-col
          ${
            showFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiFilter className="text-blue-600" size={20} />
              <h2 className="font-bold text-lg text-gray-900">Filters</h2>
              {getActiveFilterCount() > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  title="Clear all filters"
                >
                  <FiRefreshCw size={14} />
                  Clear
                </button>
              )}
              <button
                className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={onClose}
              >
                <FiX size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-5 px-2 space-y-8 web-kit-scrollbar-thumb-gray-500 scrollbar-thin ">
          {/* CATEGORY */}
          <div className="space-y-3">
            <Header
              title="Category"
              icon={<FiTag size={16} />}
              open={open.categories}
              onClick={() => toggle("categories")}
            />
            {open.categories && (
              <div className="space-y-2 pl-1">
                {categories.map((c) => (
                  <CheckboxItem
                    key={c?._id}
                    label={c?.name}
                    checked={activeFilters.categories.includes(c?._id)}
                    onChange={() => toggleArray("categories", c?._id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* PRICE */}
          <div className="space-y-3">
            <Header
              title="Price Range"
              icon={<FiDollarSign size={16} />}
              open={open.price}
              onClick={() => toggle("price")}
            />
            {open.price && (
              <div className="space-y-4 pl-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">
                      Min
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={activeFilters.priceRange.min}
                        onChange={(e) =>
                          onFilterChange({
                            ...activeFilters,
                            priceRange: {
                              ...activeFilters.priceRange,
                              min: Math.max(0, Number(e.target.value)),
                            },
                          })
                        }
                        className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">
                      Max
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={activeFilters.priceRange.max}
                        onChange={(e) =>
                          onFilterChange({
                            ...activeFilters,
                            priceRange: {
                              ...activeFilters.priceRange,
                              max: Math.min(10000, Number(e.target.value)),
                            },
                          })
                        }
                        className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="5000"
                      />
                    </div>
                  </div>
                </div>
                <div className="px-1">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={activeFilters.priceRange.max}
                    onChange={(e) =>
                      onFilterChange({
                        ...activeFilters,
                        priceRange: {
                          ...activeFilters.priceRange,
                          max: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>₹0</span>
                    <span>₹{activeFilters.priceRange.max}</span>
                    <span>₹5000</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RATING */}
          <div className="space-y-3">
            <Header
              title="Customer Rating"
              icon={<FiStar size={16} />}
              open={open.rating}
              onClick={() => toggle("rating")}
            />
            {open.rating && (
              <div className="space-y-2 pl-1">
                {ratings.map((r) => (
                  <CheckboxItem
                    key={r.value}
                    label={r.label}
                    count={r.count}
                    checked={activeFilters.ratings.includes(r.value)}
                    onChange={() => toggleArray("ratings", r.value)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* DISCOUNT */}
          <div className="space-y-3">
            <Header
              title="Discount"
              icon={<FiPercent size={16} />}
              open={open.discount}
              onClick={() => toggle("discount")}
            />
            {open.discount && (
              <div className="space-y-2 pl-1">
                {discounts.map((d) => (
                  <RadioItem
                    key={d.value}
                    label={d.label}
                    checked={activeFilters.discount === d.value}
                    onChange={() =>
                      onFilterChange({
                        ...activeFilters,
                        discount:
                          activeFilters.discount === d.value ? null : d.value,
                      })
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* LANGUAGE */}
          <div className="space-y-3">
            <Header
              title="Language"
              icon={<FiGlobe size={16} />}
              open={open.language}
              onClick={() => toggle("language")}
            />
            {open.language && (
              <div className="space-y-2 pl-1">
                {languages.map((l) => (
                  <CheckboxItem
                    key={l.id}
                    label={l.name}
                    count={l.count}
                    checked={activeFilters.language.includes(l.id)}
                    onChange={() => toggleArray("language", l.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Apply Button for Mobile */}
        <div className="p-6 border-t border-gray-200 lg:hidden bg-white">
          <button
            onClick={onClose}
            className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;

/* ===== Reusable Components ===== */

const Header = ({ title, icon, open, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex justify-between items-center font-semibold text-gray-800 hover:text-gray-900 transition-colors group"
  >
    <div className="flex items-center gap-2">
      {icon}
      <span>{title}</span>
    </div>
    {open ? (
      <FiChevronUp className="text-gray-400 group-hover:text-gray-600" />
    ) : (
      <FiChevronDown className="text-gray-400 group-hover:text-gray-600" />
    )}
  </button>
);

const CheckboxItem = ({ label, count, checked, onChange }) => (
  <label className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
    <div className="flex items-center gap-3">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-0 cursor-pointer"
        />
        {checked && (
          <FiCheck
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none"
            size={10}
          />
        )}
      </div>
      <span className="text-gray-700 group-hover:text-gray-900">{label}</span>
    </div>
    {count !== undefined && (
      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
        {count}
      </span>
    )}
  </label>
);

const RadioItem = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 py-1.5 px-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
    <div className="relative">
      <input
        type="radio"
        name="filter-radio"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-0 cursor-pointer"
      />
      {checked && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full pointer-events-none"></div>
      )}
    </div>
    <span className="text-gray-700 group-hover:text-gray-900">{label}</span>
  </label>
);
