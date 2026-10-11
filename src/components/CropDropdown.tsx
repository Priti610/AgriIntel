import React, { useState, useRef, useEffect } from 'react';
import { Crop, SUPPORTED_CROPS } from '../data/crops';
import { ChevronDown, Search, Check, AlertCircle } from 'lucide-react';

interface CropDropdownProps {
  selectedCrop: Crop;
  onSelectCrop: (crop: Crop) => void;
}

export const CropDropdown: React.FC<CropDropdownProps> = ({
  selectedCrop,
  onSelectCrop,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCrops = SUPPORTED_CROPS.filter((crop) => {
    const q = searchQuery.toLowerCase();
    return (
      crop.name.toLowerCase().includes(q) ||
      crop.hindiName.toLowerCase().includes(q) ||
      crop.category.toLowerCase().includes(q)
    );
  });

  const categories = Array.from(new Set(SUPPORTED_CROPS.map((c) => c.category)));

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
        Crop Selection
      </label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-xs hover:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-left cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
            {selectedCrop.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span>{selectedCrop.name}</span>
              <span className="text-xs text-gray-500 font-normal">({selectedCrop.hindiName})</span>
            </div>
            <div className="text-xs text-gray-600 flex items-center gap-2">
              <span>{selectedCrop.category}</span>
              <span>·</span>
              <span>Ref rate: ₹{selectedCrop.typicalPricePerQuintal}/qtl</span>
              {selectedCrop.perishable && (
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                  Perishable
                </span>
              )}
            </div>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-40 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-96 overflow-hidden flex flex-col animate-in fade-in-50 duration-150">
          {/* Search field */}
          <div className="p-3 border-b border-gray-100 bg-gray-50/50">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search crop by English, Hindi, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                autoFocus
              />
            </div>
          </div>

          {/* List items grouped by category */}
          <div className="overflow-y-auto p-2 divide-y divide-gray-100">
            {filteredCrops.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <span>No matching Indian crop found</span>
              </div>
            ) : (
              categories.map((category) => {
                const categoryCrops = filteredCrops.filter((c) => c.category === category);
                if (categoryCrops.length === 0) return null;

                return (
                  <div key={category} className="py-2 first:pt-0 last:pb-0">
                    <div className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                      {category}
                    </div>
                    {categoryCrops.map((crop) => {
                      const isSelected = crop.id === selectedCrop.id;
                      return (
                        <button
                          key={crop.id}
                          type="button"
                          onClick={() => {
                            onSelectCrop(crop);
                            setIsOpen(false);
                            setSearchQuery('');
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-900 font-bold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-900">{crop.name}</span>
                            <span className="text-xs text-gray-600 font-normal">({crop.hindiName})</span>
                            {crop.perishable && (
                              <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium">
                                Perishable
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-600 font-medium">
                              ₹{crop.typicalPricePerQuintal}/qtl
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
