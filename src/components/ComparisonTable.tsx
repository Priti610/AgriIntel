import React, { useState } from 'react';
import { MandiEconomics } from '../utils/revenueCalculator';
import { ArrowUpDown, AlertTriangle, CheckCircle, Info, Fuel, TrendingUp } from 'lucide-react';

interface ComparisonTableProps {
  economicsList: MandiEconomics[];
  isLoading: boolean;
}

type SortField = 'netRevenue' | 'modalPrice' | 'transportCost' | 'distance';

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  economicsList,
  isLoading,
}) => {
  const [sortField, setSortField] = useState<SortField>('netRevenue');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'transportCost' || field === 'distance'); // default ascending for costs
    }
  };

  const sortedList = [...economicsList].sort((a, b) => {
    let valA = 0;
    let valB = 0;

    switch (sortField) {
      case 'netRevenue':
        valA = a.estimatedNetRevenue;
        valB = b.estimatedNetRevenue;
        break;
      case 'modalPrice':
        valA = a.modalPrice;
        valB = b.modalPrice;
        break;
      case 'transportCost':
        valA = a.transportCost;
        valB = b.transportCost;
        break;
      case 'distance':
        valA = a.transportResult.roadDistanceKm;
        valB = b.transportResult.roadDistanceKm;
        break;
    }

    return sortAsc ? valA - valB : valB - valA;
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs">
        <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="text-base font-bold text-gray-800">Calculating Mandi Market Economics...</h3>
        <p className="text-xs text-gray-500 mt-1">
          Evaluating road distance freight, loading, handling cess, and transit perishability.
        </p>
      </div>
    );
  }

  if (economicsList.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden space-y-4">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 block">
            Ranked Market Comparison Table
          </span>
          <h3 className="text-lg font-extrabold text-gray-900">
            Side-by-Side Mandi Economic Breakdown
          </h3>
          <p className="text-xs text-gray-500">
            Indian Rupee (₹) calculations based on {economicsList[0]?.quantityQuintals} Quintals of {economicsList[0]?.crop.name}.
          </p>
        </div>

        {/* Quick Sort Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-gray-500 mr-1">Sort by:</span>
          <button
            type="button"
            onClick={() => handleSort('netRevenue')}
            className={`px-2.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              sortField === 'netRevenue'
                ? 'bg-emerald-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Highest Net Revenue {sortField === 'netRevenue' && (sortAsc ? '↑' : '↓')}
          </button>
          <button
            type="button"
            onClick={() => handleSort('modalPrice')}
            className={`px-2.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              sortField === 'modalPrice'
                ? 'bg-emerald-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Highest Modal Price {sortField === 'modalPrice' && (sortAsc ? '↑' : '↓')}
          </button>
          <button
            type="button"
            onClick={() => handleSort('transportCost')}
            className={`px-2.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              sortField === 'transportCost'
                ? 'bg-emerald-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Lowest Transport Cost {sortField === 'transportCost' && (sortAsc ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50/80 text-[11px] font-extrabold text-gray-600 uppercase tracking-wider border-y border-gray-200/80">
              <th className="py-3 px-4">Mandi & District</th>
              <th className="py-3 px-3 text-right">Modal Price (₹/qtl)</th>
              <th className="py-3 px-3 text-right">Road Distance</th>
              <th className="py-3 px-3 text-right">Gross Revenue</th>
              <th className="py-3 px-3 text-right">Transport Cost</th>
              <th className="py-3 px-3 text-right">Handling Cess</th>
              <th className="py-3 px-3 text-right">Transit Spoilage</th>
              <th className="py-3 px-4 text-right">Estimated Net Revenue</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {sortedList.map((item) => {
              const isTop = item.statusBadge === 'Highest Net Return';
              return (
                <tr
                  key={item.mandi.id}
                  className={`hover:bg-gray-50/80 transition-colors ${
                    isTop ? 'bg-emerald-50/40' : ''
                  }`}
                >
                  {/* Mandi & District */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {isTop && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                      )}
                      <div>
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          <span>{item.mandi.name}</span>
                          {isTop && (
                            <span className="text-[10px] font-extrabold uppercase bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                              Top Choice
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.mandi.district}, {item.mandi.state}
                          {item.priceRecord && (
                            <span className="ml-2 text-[11px] text-gray-400">
                              · Rpt: {item.priceRecord.reportDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Modal Price */}
                  <td className="py-3.5 px-3 text-right">
                    {item.hasPriceData ? (
                      <div>
                        <span className="font-extrabold text-gray-900 text-sm">
                          ₹{item.modalPrice.toLocaleString('en-IN')}
                        </span>
                        <div className="text-[11px] text-gray-500">per quintal</div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">No price data</span>
                    )}
                  </td>

                  {/* Road Distance */}
                  <td className="py-3.5 px-3 text-right text-xs text-gray-700">
                    <div>
                      <span className="font-bold">{item.transportResult.roadDistanceKm} km</span>
                      <div className="text-[11px] text-gray-400">
                        ~{item.transportResult.estimatedTravelTimeHours} hrs travel
                      </div>
                    </div>
                  </td>

                  {/* Gross Revenue */}
                  <td className="py-3.5 px-3 text-right">
                    {item.hasPriceData ? (
                      <span className="font-semibold text-gray-800">
                        ₹{item.grossRevenue.toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  {/* Transport Cost */}
                  <td className="py-3.5 px-3 text-right text-rose-700">
                    <div>
                      <span className="font-semibold">-₹{item.transportCost.toLocaleString('en-IN')}</span>
                      <div className="text-[10px] text-gray-500">
                        (₹{item.transportResult.transportCostPerQuintal}/qtl)
                      </div>
                    </div>
                  </td>

                  {/* Handling Cess */}
                  <td className="py-3.5 px-3 text-right text-gray-600 text-xs">
                    -₹{item.handlingCost.toLocaleString('en-IN')}
                  </td>

                  {/* Transit Spoilage */}
                  <td className="py-3.5 px-3 text-right text-xs">
                    {item.spoilageLossAmount > 0 ? (
                      <span className="text-amber-700 font-medium">
                        -₹{item.spoilageLossAmount.toLocaleString('en-IN')}{' '}
                        <span className="text-[10px]">({item.spoilagePercentage}%)</span>
                      </span>
                    ) : (
                      <span className="text-gray-400">₹0</span>
                    )}
                  </td>

                  {/* Estimated Net Revenue */}
                  <td className="py-3.5 px-4 text-right">
                    {item.hasPriceData ? (
                      <div>
                        <span
                          className={`text-base font-extrabold ${
                            isTop ? 'text-emerald-700' : 'text-gray-900'
                          }`}
                        >
                          ₹{item.estimatedNetRevenue.toLocaleString('en-IN')}
                        </span>
                        <div className="text-[11px] text-gray-500">
                          Net: ₹{item.netRevenuePerQuintal}/qtl
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-amber-700 italic">Unranked</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    {item.hasPriceData ? (
                      item.statusBadge === 'Highest Net Return' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3 text-emerald-700" />
                          <span>Highest Net</span>
                        </span>
                      ) : item.statusBadge === 'High Transport Drag' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          <Fuel className="w-3 h-3" />
                          <span>High Freight</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                          Eligible
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>No Data</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-gray-50/60 border-t border-gray-100 text-xs text-gray-500 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            Net Revenue Formula: Expected Selling Price × Qty − Transport Cost − Handling Cess − Spoilage Loss
          </span>
        </div>
        <div>
          Demo Agmarknet bulletin dataset · Indian Rupee formatting
        </div>
      </div>
    </div>
  );
};
