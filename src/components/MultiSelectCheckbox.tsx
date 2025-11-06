'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

interface Option {
  id: number | string;
  name: string;
}

interface MultiSelectCheckboxProps {
  label: string;
  options: Option[];
  selectedValues: (number | string)[];
  onChange: (values: (number | string)[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxHeight?: string;
}

const MultiSelectCheckbox = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = 'Select options',
  disabled = false,
  maxHeight = '240px'
}: MultiSelectCheckboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (value: number | string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectAll = () => {
    onChange(filteredOptions.map(opt => opt.id));
  };

  const getSelectedNames = () => {
    return options
      .filter(opt => selectedValues.includes(opt.id))
      .map(opt => opt.name)
      .join(', ');
  };

  const filteredOptions = options.filter(opt =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={dropdownRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {selectedValues.length > 0 && (
          <span className="ml-2 text-xs text-red-600 font-semibold">
            ({selectedValues.length} selected)
          </span>
        )}
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors flex items-center justify-between ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : isOpen
            ? 'border-red-500 bg-white'
            : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
      >
        <span className={`truncate ${selectedValues.length === 0 ? 'text-gray-400' : 'text-gray-900'}`}>
          {selectedValues.length === 0 ? placeholder : getSelectedNames()}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {/* Search Box */}
          {options.length > 5 && (
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={selectAll}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Select All ({filteredOptions.length})
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </button>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto" style={{ maxHeight }}>
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.id);
                return (
                  <label
                    key={option.id}
                    className={`flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-red-50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOption(option.id)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
                    />
                    <span className={`ml-3 text-sm ${isSelected ? 'text-red-700 font-medium' : 'text-gray-700'}`}>
                      {option.name}
                    </span>
                    {isSelected && (
                      <Check className="h-4 w-4 ml-auto text-red-600" />
                    )}
                  </label>
                );
              })
            )}
          </div>

          {/* Footer with count */}
          {selectedValues.length > 0 && (
            <div className="p-2 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-600 text-center">
                {selectedValues.length} option{selectedValues.length !== 1 ? 's' : ''} selected
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectCheckbox;
