'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface Option {
  id: number;
  name: string;
}

interface FilterableMultiSelectProps {
  label: string;
  options: Option[];
  selectedValues: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

const FilterableMultiSelect = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = 'Search...'
}: FilterableMultiSelectProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <label
              key={option.id}
              className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option.name)}
                onChange={() => onChange(option.name)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">{option.name}</span>
            </label>
          ))
        ) : (
          <div className="col-span-2 md:col-span-3 text-center py-4 text-gray-500 text-sm">
            No options found
          </div>
        )}
      </div>

      {/* Selected Count */}
      {selectedValues.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          {selectedValues.length} selected: {selectedValues.join(', ')}
        </div>
      )}
    </div>
  );
};

export default FilterableMultiSelect;
