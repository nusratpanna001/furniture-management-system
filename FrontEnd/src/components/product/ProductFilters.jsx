import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { CATEGORIES, MATERIALS } from '../../lib/constants';

function ProductFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    material: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    onFilterChange({
      ...filters,
      search: debouncedSearch,
    });
  }, [debouncedSearch, filters.category, filters.material, filters.minPrice, filters.maxPrice, filters.inStock]);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      category: '',
      material: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          icon={<Search size={20} />}
        />

        <Select
          placeholder="Select category"
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          options={[
            { value: '', label: 'All Categories' },
            ...CATEGORIES.map((cat) => ({ value: cat, label: cat })),
          ]}
        />

        <Select
          placeholder="Select material"
          value={filters.material}
          onChange={(e) => handleChange('material', e.target.value)}
          options={[
            { value: '', label: 'All Materials' },
            ...MATERIALS.map((mat) => ({ value: mat, label: mat })),
          ]}
        />

        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min price"
            value={filters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max price"
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => handleChange('inStock', e.target.checked)}
            className="accent-amber-700"
          />
          <span className="text-sm">In Stock Only</span>
        </label>

        <button
          onClick={handleReset}
          className="text-sm text-amber-700 hover:underline font-medium"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

export default ProductFilters;
