import React from 'react';
import { User, BarChart2, Truck, CheckCircle } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: 1,
      icon: User,
      title: 'Choose a crop',
      desc: 'Tell us what you have and where it starts.',
    },
    {
      num: 2,
      icon: BarChart2,
      title: 'Compare mandis',
      desc: 'See prices and data freshness side by side.',
    },
    {
      num: 3,
      icon: Truck,
      title: 'Count the journey',
      desc: 'Add distance, quantity, and vehicle assumptions.',
    },
    {
      num: 4,
      icon: CheckCircle,
      title: 'Keep more',
      desc: 'Review an estimated net-return path.',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 block mb-2">
            Simple by design
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            From harvest to a better decision.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative pt-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-emerald-700" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
