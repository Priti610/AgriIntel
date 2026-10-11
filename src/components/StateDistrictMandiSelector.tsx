import React, { useState } from 'react';
import { State, District, Mandi, SUPPORTED_LOCATIONS } from '../data/locations';
import { Crop } from '../data/crops';
import { CropDropdown } from './CropDropdown';
import { Check, Plus, Trash2, MapPin, Building2, Layers, AlertCircle, ArrowRight } from 'lucide-react';

interface StateDistrictMandiSelectorProps {
  selectedCrop: Crop;
  onChangeCrop: (crop: Crop) => void;
  selectedState: State;
  onChangeState: (state: State) => void;
  selectedDistrict: District;
  onChangeDistrict: (district: District) => void;
  originLocation: string;
  onChangeOriginLocation: (origin: string) => void;
  quantityValue: number;
  onChangeQuantityValue: (val: number) => void;
  quantityUnit: 'quintals' | 'kg';
  onChangeQuantityUnit: (unit: 'quintals' | 'kg') => void;
  selectedMandis: Mandi[];
  onToggleMandi: (mandi: Mandi) => void;
  onSelectAllDistrictMandis: () => void;
  onClearMandis: () => void;
  onTriggerCompare: () => void;
}

export const StateDistrictMandiSelector: React.FC<StateDistrictMandiSelectorProps> = ({
  selectedCrop,
  onChangeCrop,
  selectedState,
  onChangeState,
  selectedDistrict,
  onChangeDistrict,
  originLocation,
  onChangeOriginLocation,
  quantityValue,
  onChangeQuantityValue,
  quantityUnit,
  onChangeQuantityUnit,
  selectedMandis,
  onToggleMandi,
  onSelectAllDistrictMandis,
  onClearMandis,
  onTriggerCompare,
}) => {
  const [showCrossDistrictAdder, setShowCrossDistrictAdder] = useState(false);
  const [selectedCrossDistrict, setSelectedCrossDistrict] = useState<District | null>(null);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = SUPPORTED_LOCATIONS.find((s) => s.code === e.target.value);
    if (newState) {
      onChangeState(newState);
      if (newState.districts.length > 0) {
        onChangeDistrict(newState.districts[0]);
      }
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDist = selectedState.districts.find((d) => d.code === e.target.value);
    if (newDist) {
      onChangeDistrict(newDist);
    }
  };

  const isMandiSelected = (mandiId: string) => {
    return selectedMandis.some((m) => m.id === mandiId);
  };

  const quantityInQuintals = quantityUnit === 'kg' ? quantityValue / 100 : quantityValue;
  const isQuantityValid = quantityValue > 0;
  const canCompare = selectedMandis.length > 0 && isQuantityValid;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 sm:p-7 space-y-7">
      {/* Top Header */}
      <div className="border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-widest">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Decision Desk Configuration</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
          Configure Your Produce & Target Mandis
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Select state, verified district, origin hub, and choose markets to evaluate true net returns.
        </p>
      </div>

      {/* Grid: 4 Core Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Crop Dropdown */}
        <div>
          <CropDropdown selectedCrop={selectedCrop} onSelectCrop={onChangeCrop} />
        </div>

        {/* 2. State Dropdown */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            State
          </label>
          <div className="relative">
            <select
              value={selectedState.code}
              onChange={handleStateChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-xs font-semibold text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer appearance-none"
            >
              {SUPPORTED_LOCATIONS.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name} ({state.districts.length} verified districts)
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <Building2 className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* 3. District Dropdown */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            District
          </label>
          <div className="relative">
            <select
              value={selectedDistrict.code}
              onChange={handleDistrictChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-xs font-semibold text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer appearance-none"
            >
              {selectedState.districts.map((district) => (
                <option key={district.code} value={district.code}>
                  {district.name} ({district.mandis.length} mandis)
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <MapPin className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* 4. Origin Hub / Village */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Farmer Origin (Village / Taluka)
          </label>
          <div className="relative">
            <select
              value={originLocation}
              onChange={(e) => onChangeOriginLocation(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-xs font-semibold text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer appearance-none"
            >
              {selectedDistrict.keyOrigins.map((origin) => (
                <option key={origin} value={origin}>
                  {origin} (Taluka hub)
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Produce Quantity & Unit Row */}
      <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-200/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
            Produce Quantity:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              step="1"
              value={quantityValue}
              onChange={(e) => onChangeQuantityValue(Math.max(1, Number(e.target.value) || 1))}
              className="w-28 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {/* Unit Selector */}
            <div className="inline-flex rounded-lg border border-gray-300 bg-white p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => onChangeQuantityUnit('quintals')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md cursor-pointer transition-colors ${
                  quantityUnit === 'quintals'
                    ? 'bg-emerald-700 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Quintals (100 kg)
              </button>
              <button
                type="button"
                onClick={() => onChangeQuantityUnit('kg')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md cursor-pointer transition-colors ${
                  quantityUnit === 'kg'
                    ? 'bg-emerald-700 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Kilograms (kg)
              </button>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-700">
          Evaluated quantity:{' '}
          <span className="font-extrabold text-emerald-800">
            {quantityInQuintals} Quintals
          </span>{' '}
          ({(quantityInQuintals * 100).toLocaleString('en-IN')} kg)
        </div>
      </div>

      {/* Mandi Selection Directory */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
              VERIFIED MANDI DIRECTORY
            </div>
            <h3 className="text-base font-bold text-gray-900">
              Mandis in {selectedDistrict.name} District ({selectedDistrict.mandis.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSelectAllDistrictMandis}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 px-2 py-1 rounded hover:bg-emerald-50 cursor-pointer"
            >
              Select All in District
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={onClearMandis}
              className="text-xs font-semibold text-gray-500 hover:text-red-600 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
            >
              Clear All ({selectedMandis.length})
            </button>
          </div>
        </div>

        {/* Primary District Mandi Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {selectedDistrict.mandis.map((mandi) => {
            const selected = isMandiSelected(mandi.id);
            return (
              <div
                key={mandi.id}
                onClick={() => onToggleMandi(mandi)}
                className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                  selected
                    ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500/30'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-sm text-gray-900">{mandi.name}</span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                        selected
                          ? 'bg-emerald-700 border-emerald-700 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5 stroke-3" />}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span>~{mandi.approxRoadDistanceKmFromHub} km from central hub</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {mandi.isEnamEnabled && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                        e-NAM
                      </span>
                    )}
                    {mandi.facilities.slice(0, 2).map((fac, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cross-District Mandi Adder Toggle */}
        <div className="pt-2">
          {!showCrossDistrictAdder ? (
            <button
              type="button"
              onClick={() => {
                setShowCrossDistrictAdder(true);
                const otherDists = selectedState.districts.filter((d) => d.code !== selectedDistrict.code);
                if (otherDists.length > 0) setSelectedCrossDistrict(otherDists[0]);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add mandis from other districts (e.g. Pune, Solapur, Ahmednagar)</span>
            </button>
          ) : (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Select Mandis From Neighboring Districts
                </span>
                <button
                  type="button"
                  onClick={() => setShowCrossDistrictAdder(false)}
                  className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* District tabs */}
              <div className="flex flex-wrap gap-1.5">
                {selectedState.districts
                  .filter((d) => d.code !== selectedDistrict.code)
                  .map((d) => (
                    <button
                      key={d.code}
                      type="button"
                      onClick={() => setSelectedCrossDistrict(d)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer ${
                        selectedCrossDistrict?.code === d.code
                          ? 'bg-emerald-700 text-white'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {d.name} ({d.mandis.length})
                    </button>
                  ))}
              </div>

              {/* Cross-District Mandis Grid */}
              {selectedCrossDistrict && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                  {selectedCrossDistrict.mandis.map((mandi) => {
                    const selected = isMandiSelected(mandi.id);
                    return (
                      <button
                        key={mandi.id}
                        type="button"
                        onClick={() => onToggleMandi(mandi)}
                        className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer flex items-center justify-between ${
                          selected
                            ? 'bg-emerald-100/60 border-emerald-500 font-bold text-emerald-950'
                            : 'bg-white border-gray-200 hover:border-gray-300 text-gray-800'
                        }`}
                      >
                        <div>
                          <div className="font-bold">{mandi.name}</div>
                          <div className="text-[11px] text-gray-500">{mandi.district}</div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                            selected
                              ? 'bg-emerald-700 border-emerald-700 text-white'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {selected && <Check className="w-3 h-3 stroke-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Mandis Summary Bar & Compare Action */}
      <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          <span className="font-extrabold text-emerald-800 text-base">{selectedMandis.length}</span>{' '}
          {selectedMandis.length === 1 ? 'mandi' : 'mandis'} selected for comparison
          {selectedMandis.length > 0 && (
            <span className="text-xs text-gray-500 ml-2">
              ({selectedMandis.map((m) => m.name.split(' ')[0]).join(', ')})
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onTriggerCompare}
          disabled={!canCompare}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer ${
            canCompare
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-800/20 hover:translate-y-[-1px]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>Compare selected mandis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {!canCompare && (
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            {selectedMandis.length === 0
              ? 'Please select at least 1 mandi above to generate market economics.'
              : 'Please enter a produce quantity greater than zero.'}
          </span>
        </div>
      )}
    </div>
  );
};
