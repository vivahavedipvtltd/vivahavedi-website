'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface Option {
  id: number;
  name: string;
}

interface FilterableMultiSelectByIdProps {
  label: string;
  options: Option[];
  selectedIds: number[];
  onChange: (id: number) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

const FilterableMultiSelectById = ({
  label,
  options,
  selectedIds,
  onChange,
  placeholder = 'Search...',
  icon
}: FilterableMultiSelectByIdProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedNames = options
    .filter(opt => selectedIds.includes(opt.id))
    .map(opt => opt.name);

  return (
    <div>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
        {icon && <span className="mr-2">{icon}</span>}
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
                checked={selectedIds.includes(option.id)}
                onChange={() => onChange(option.id)}
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

      {/* Selected Items as Badges */}
      {selectedIds.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-medium text-gray-700 mb-2">
            Selected ({selectedIds.length}):
          </div>
          <div className="flex flex-wrap gap-2">
            {options
              .filter(opt => selectedIds.includes(opt.id))
              .map(option => (
                <div
                  key={option.id}
                  className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{option.name}</span>
                  <button
                    type="button"
                    onClick={() => onChange(option.id)}
                    className="ml-2 hover:bg-red-200 rounded-full p-0.5 transition-colors"
                    aria-label={`Remove ${option.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterableMultiSelectById;
