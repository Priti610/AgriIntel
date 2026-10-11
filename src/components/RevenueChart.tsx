import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MandiEconomics } from '../utils/revenueCalculator';

interface RevenueChartProps {
  economicsList: MandiEconomics[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ economicsList }) => {
  const chartData = economicsList
    .filter((e) => e.hasPriceData)
    .map((item) => ({
      name: item.mandi.name.replace(' APMC', '').replace(' (Gultekdi)', '').replace(' (Panchavati)', ''),
      fullName: item.mandi.name,
      district: item.mandi.district,
      'Net Revenue (₹)': item.estimatedNetRevenue,
      'Transport & Deductions (₹)': item.totalDeductions,
      'Gross Value (₹)': item.grossRevenue,
    }));

  if (chartData.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 block">
            Visual Financial Comparison
          </span>
          <h3 className="text-lg font-extrabold text-gray-900">
            Estimated Net Revenue vs Freight Deductions
          </h3>
        </div>
        <div className="text-xs text-gray-500">
          Amounts in Indian Rupees (₹)
        </div>
      </div>

      <div className="h-72 sm:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 600 }}
              interval={0}
              angle={-10}
              textAnchor="end"
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 11 }}
              tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: any, name: any) => [`₹${Number(value).toLocaleString('en-IN')}`, name]}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 500 }}
            />
            <Bar
              dataKey="Net Revenue (₹)"
              fill="#047857"
              radius={[6, 6, 0, 0]}
              name="Estimated Net Revenue (In Hand)"
            />
            <Bar
              dataKey="Transport & Deductions (₹)"
              fill="#e11d48"
              radius={[6, 6, 0, 0]}
              name="Transport & Mandi Deductions"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-500 text-center italic">
        A higher Gross Value does not always yield higher Net Revenue if long transport freight absorbs the price difference.
      </p>
    </div>
  );
};
