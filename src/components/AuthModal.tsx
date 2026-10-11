import React, { useState } from 'react';
import { X, Sprout, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (user: { name: string; district: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Nashik, Maharashtra');
  const [mobileOrEmail, setMobileOrEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Farmer Member';
    const user = { name: finalName, district };
    localStorage.setItem('prima_agri_user', JSON.stringify(user));
    onSuccess(user);
    onClose();
  };

  const handleDemoLogin = () => {
    const demoUser = { name: 'Prit Patel (Farmer)', district: 'Nashik, Maharashtra' };
    localStorage.setItem('prima_agri_user', JSON.stringify(demoUser));
    onSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <Sprout className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {mode === 'login' ? 'Sign in to Prima-AgriIntel' : 'Create Farmer Account'}
          </h2>
          <p className="text-xs text-gray-500">
            Unlock multi-day forecasts, dispatch weather, and saved market journeys.
          </p>
        </div>

        {/* 1-Click Demo Access Button */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Instant Hackathon / Demo Mode</span>
          </div>
          <p className="text-[11px] text-emerald-700 leading-relaxed">
            Experience all registered intelligence features immediately without filling forms.
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Continue as Demo Farmer (Prit - Nashik) &rarr;
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-[11px] uppercase font-bold text-gray-400 absolute">
            Or standard sign in
          </span>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Your Name
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Patil"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              District / State
            </label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Mobile Number / Email (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 98220XXXXX"
              value={mobileOrEmail}
              onChange={(e) => setMobileOrEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            {mode === 'login' ? 'Sign In' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};
