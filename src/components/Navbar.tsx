import React from 'react';
import { Sprout, User, LogOut, Sparkles } from 'lucide-react';

export type NavTab = 'home' | 'dashboard' | 'mandi-prices' | 'transport' | 'forecast' | 'weather' | 'about';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currentUser: { name: string; district: string } | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-800 transition-colors">
            <Sprout className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-xl tracking-tight text-gray-900">Prima</span>
              <span className="font-extrabold text-xl tracking-tight text-emerald-700">AgriIntel</span>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 -mt-1 hidden sm:block">
              Market Intelligence
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'home'
                ? 'text-emerald-800 bg-emerald-50'
                : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'text-emerald-800 bg-emerald-50'
                : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('mandi-prices')}
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'mandi-prices'
                ? 'text-emerald-800 bg-emerald-50'
                : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
            }`}
          >
            Mandi prices
          </button>
          <button
            onClick={() => setActiveTab('transport')}
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'transport'
                ? 'text-emerald-800 bg-emerald-50'
                : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
            }`}
          >
            Transport
          </button>
          <button
            onClick={() => setActiveTab('forecast')}
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'forecast'
                ? 'text-emerald-800 bg-emerald-50'
                : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
            }`}
          >
            Forecast
          </button>
          <button
            onClick={() => setActiveTab('weather')}
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'weather'
                ? 'text-emerald-800 bg-emerald-50'
                : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
            }`}
          >
            Weather
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'about'
                ? 'text-emerald-800 bg-emerald-50'
                : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
            }`}
          >
            About
          </button>
        </nav>

        {/* User / Authentication Actions */}
        <div className="flex items-center space-x-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-gray-900">{currentUser.name}</span>
                <span className="text-[11px] text-emerald-700">{currentUser.district}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <button
                onClick={onLogout}
                title="Log out"
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                Log in
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <span>Create account</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-gray-100 bg-gray-50/80 gap-1 scrollbar-none">
        {(['home', 'dashboard', 'mandi-prices', 'transport', 'forecast', 'weather', 'about'] as NavTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? 'bg-emerald-700 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab === 'mandi-prices' ? 'Mandi prices' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </header>
  );
};
