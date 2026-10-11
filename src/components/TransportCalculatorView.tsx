import React, { useState } from 'react';
import { Truck, Route, Fuel, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { calculateTransportCost, STANDARD_VEHICLES } from '../utils/transportCalculator';

export const TransportCalculatorView: React.FC<{ onNavigateToMandi: () => void }> = ({
  onNavigateToMandi,
}) => {
  const [distanceKm, setDistanceKm] = useState<number>(120);
  const [quantityQuintals, setQuantityQuintals] = useState<number>(40);
  const [ratePerKm, setRatePerKm] = useState<number>(28);
  const [loadingHandling, setLoadingHandling] = useState<number>(800);
  const [vehicleCapacity, setVehicleCapacity] = useState<number>(100);
  const [selectedVehiclePreset, setSelectedVehiclePreset] = useState<string>('truck_light');

  const handlePresetChange = (presetId: string) => {
    setSelectedVehiclePreset(presetId);
    const vehicle = STANDARD_VEHICLES.find((v) => v.id === presetId);
    if (vehicle) {
      setRatePerKm(vehicle.defaultRatePerKm);
      setLoadingHandling(vehicle.defaultLoadingHandling);
      setVehicleCapacity(vehicle.capacityQuintals);
    }
  };

  const calculation = calculateTransportCost({
    roadDistanceKm: distanceKm,
    produceQuantityQuintals: quantityQuintals,
    ratePerKm,
    loadingHandlingFee: loadingHandling,
    vehicleCapacityQuintals: vehicleCapacity,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title Header matching Screenshot 6 */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
          Count the cost of the journey.
        </h1>
        <p className="text-gray-600 text-base max-w-2xl">
          Use a manual estimate now; connect routing data later for road-aware distance and travel time.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Manual Estimate Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 block">
                MANUAL ESTIMATE
              </span>
              <h2 className="text-xl font-bold text-gray-900">
                Transport calculator
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>

          {/* Vehicle Preset Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Vehicle Type Preset
            </label>
            <select
              value={selectedVehiclePreset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {STANDARD_VEHICLES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} (Cap: {v.capacityQuintals} qtl · ₹{v.defaultRatePerKm}/km)
                </option>
              ))}
            </select>
          </div>

          {/* Form Inputs Grid matching screenshot 6 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Road distance */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Road distance (km)
              </label>
              <input
                type="number"
                min="1"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Produce quantity */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Produce quantity (quintals)
              </label>
              <input
                type="number"
                min="1"
                value={quantityQuintals}
                onChange={(e) => setQuantityQuintals(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Rate per km */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Rate per km (₹)
              </label>
              <input
                type="number"
                min="5"
                value={ratePerKm}
                onChange={(e) => setRatePerKm(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Loading & handling */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Loading & handling (₹)
              </label>
              <input
                type="number"
                min="0"
                value={loadingHandling}
                onChange={(e) => setLoadingHandling(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Vehicle capacity */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Vehicle capacity (quintals)
              </label>
              <input
                type="number"
                min="5"
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(Math.max(5, Number(e.target.value)))}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                If produce quantity exceeds capacity, multiple trips will be calculated automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Live Results matching screenshot 6 Dark Green Card */}
        <div className="lg:col-span-5 bg-emerald-900 text-white rounded-3xl p-7 sm:p-8 shadow-xl border border-emerald-800 space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-800 pb-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-300">
              Trip Cost Breakdown
            </span>
            <Route className="w-5 h-5 text-emerald-300" />
          </div>

          <div className="space-y-1">
            <div className="text-xs text-emerald-200 uppercase tracking-wider font-semibold">
              Total Estimated Transport Cost
            </div>
            <div className="text-4xl font-black text-white tracking-tight">
              ₹{calculation.totalTransportCost.toLocaleString('en-IN')}
            </div>
            <div className="text-sm text-emerald-300 font-semibold">
              ₹{calculation.transportCostPerQuintal} per quintal freight cost
            </div>
          </div>

          {/* Details list */}
          <div className="divide-y divide-emerald-800/80 text-sm space-y-2.5 pt-2">
            <div className="flex justify-between py-1 text-emerald-100">
              <span>Road Distance:</span>
              <span className="font-bold text-white">{calculation.roadDistanceKm} km</span>
            </div>
            <div className="flex justify-between py-1 text-emerald-100">
              <span>Estimated Travel Time:</span>
              <span className="font-bold text-white">~{calculation.estimatedTravelTimeHours} Hours (at 40 km/h)</span>
            </div>
            <div className="flex justify-between py-1 text-emerald-100">
              <span>Trips Required:</span>
              <span className="font-bold text-white">{calculation.tripsRequired} trip(s)</span>
            </div>
            <div className="flex justify-between py-1 text-emerald-100">
              <span>Transit Freight (Distance × Rate):</span>
              <span className="font-bold text-white">₹{calculation.transitCostOnly.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 text-emerald-100">
              <span>Loading & Unloading Charges:</span>
              <span className="font-bold text-white">₹{(calculation.loadingHandlingFee * calculation.tripsRequired).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-200">
            <span className="font-bold text-white block mb-0.5">Decision Insight:</span>
            To make a trip to this mandi profitable, the mandi&apos;s modal price must be at least ₹{calculation.transportCostPerQuintal}/qtl higher than your local village farmgate offer.
          </div>

          <button
            onClick={onNavigateToMandi}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            <span>Apply to Mandi Comparison</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
