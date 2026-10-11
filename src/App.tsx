import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MarketTicker } from './components/MarketTicker';
import { FeatureCardsSection } from './components/FeatureCardsSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { Footer } from './components/Footer';
import { DashboardView } from './components/DashboardView';
import { StateDistrictMandiSelector } from './components/StateDistrictMandiSelector';
import { ComparisonTable } from './components/ComparisonTable';
import { RevenueChart } from './components/RevenueChart';
import { RecommendationCard } from './components/RecommendationCard';
import { TransportCalculatorView } from './components/TransportCalculatorView';
import { ForecastView } from './components/ForecastView';
import { WeatherView } from './components/WeatherView';
import { AboutView } from './components/AboutView';
import { AuthModal } from './components/AuthModal';

import { SUPPORTED_CROPS, Crop } from './data/crops';
import { SUPPORTED_LOCATIONS, State, District, Mandi } from './data/locations';
import { getPriceForCropAndMandi } from './data/demoPrices';
import { estimateRoadDistance } from './utils/transportCalculator';
import { calculateAllMandisEconomics, MandiEconomics } from './utils/revenueCalculator';
import { generateRecommendation, BestMandiRecommendation } from './utils/recommendationEngine';
import { getAiRecommendationExplanation, AiExplanationResponse } from './services/geminiService';
import { Bookmark, BookmarkCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentUser, setCurrentUser] = useState<{ name: string; district: string } | null>(null);

  // Initialize selected crop: default Tomato
  const [selectedCrop, setSelectedCrop] = useState<Crop>(
    () => SUPPORTED_CROPS.find((c) => c.id === 'tomato') || SUPPORTED_CROPS[0]
  );

  // Initialize location: default Maharashtra -> Nashik
  const [selectedState, setSelectedState] = useState<State>(SUPPORTED_LOCATIONS[0]);
  const [selectedDistrict, setSelectedDistrict] = useState<District>(
    SUPPORTED_LOCATIONS[0].districts[0]
  );
  const [originLocation, setOriginLocation] = useState<string>(
    SUPPORTED_LOCATIONS[0].districts[0].keyOrigins[0]
  );

  // Produce quantity
  const [quantityValue, setQuantityValue] = useState<number>(40);
  const [quantityUnit, setQuantityUnit] = useState<'quintals' | 'kg'>('quintals');

  // Selected mandis: default to first 3 verified mandis in Nashik
  const [selectedMandis, setSelectedMandis] = useState<Mandi[]>(() => {
    const nashikMandis = SUPPORTED_LOCATIONS[0].districts[0].mandis;
    return nashikMandis.slice(0, 3);
  });

  // Saved comparisons for registered users
  const [savedComparisons, setSavedComparisons] = useState<any[]>([]);
  const [hasSavedCurrent, setHasSavedCurrent] = useState(false);

  // AI explanation state
  const [aiExplanation, setAiExplanation] = useState<AiExplanationResponse | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Load user & saved comparisons from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('prima_agri_user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      const storedSaved = localStorage.getItem('prima_saved_comparisons');
      if (storedSaved) {
        setSavedComparisons(JSON.parse(storedSaved));
      }
    } catch {
      // ignore parsing error
    }
  }, []);

  // Compute quantity in quintals
  const quantityQuintals = useMemo(() => {
    return quantityUnit === 'kg' ? quantityValue / 100 : quantityValue;
  }, [quantityValue, quantityUnit]);

  // Compute economics for all selected mandis
  const economicsList: MandiEconomics[] = useMemo(() => {
    return calculateAllMandisEconomics({
      crop: selectedCrop,
      quantityQuintals,
      originName: originLocation,
      originDistrict: selectedDistrict.name,
      mandis: selectedMandis,
      getPriceFn: getPriceForCropAndMandi,
      getDistanceFn: (originName, originDistrict, mandi) => {
        return estimateRoadDistance(
          originName,
          originDistrict,
          mandi.name,
          mandi.district,
          mandi.approxRoadDistanceKmFromHub
        );
      },
    });
  }, [selectedCrop, quantityQuintals, originLocation, selectedDistrict, selectedMandis]);

  // Compute recommendation
  const recommendation: BestMandiRecommendation = useMemo(() => {
    return generateRecommendation(economicsList);
  }, [economicsList]);

  // Fetch or update AI explanation when economics changes with debouncing
  const runAiAnalysis = useCallback(async (bypassCache = false) => {
    if (!recommendation.bestMandi) {
      setAiExplanation(null);
      return;
    }
    setIsLoadingAi(true);
    try {
      const result = await getAiRecommendationExplanation(recommendation, economicsList, bypassCache);
      setAiExplanation(result);
    } catch (err) {
      console.warn('AI Analysis failed, fallback in use:', err);
    } finally {
      setIsLoadingAi(false);
    }
  }, [recommendation, economicsList]);

  // Debounced effect for parameters change to avoid exceeding free-tier Gemini rate limits (5 RPM)
  useEffect(() => {
    setHasSavedCurrent(false);
    const timer = setTimeout(() => {
      runAiAnalysis(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [selectedCrop.id, quantityQuintals, selectedMandis.length, originLocation, runAiAnalysis]);

  // Handlers for state & district changes
  const handleChangeState = (state: State) => {
    setSelectedState(state);
    if (state.districts.length > 0) {
      const newDist = state.districts[0];
      setSelectedDistrict(newDist);
      setOriginLocation(newDist.keyOrigins[0] || newDist.headquarters);
      setSelectedMandis(newDist.mandis.slice(0, 3));
    }
  };

  const handleChangeDistrict = (district: District) => {
    setSelectedDistrict(district);
    setOriginLocation(district.keyOrigins[0] || district.headquarters);
    setSelectedMandis(district.mandis.slice(0, 3));
  };

  const handleToggleMandi = (mandi: Mandi) => {
    if (selectedMandis.some((m) => m.id === mandi.id)) {
      setSelectedMandis(selectedMandis.filter((m) => m.id !== mandi.id));
    } else {
      setSelectedMandis([...selectedMandis, mandi]);
    }
  };

  const handleSelectAllDistrictMandis = () => {
    const combined = [...selectedMandis];
    selectedDistrict.mandis.forEach((mandi) => {
      if (!combined.some((m) => m.id === mandi.id)) {
        combined.push(mandi);
      }
    });
    setSelectedMandis(combined);
  };

  const handleClearMandis = () => {
    setSelectedMandis([]);
  };

  const handleSaveComparison = () => {
    if (!currentUser) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-IN'),
      crop: selectedCrop.name,
      quantity: `${quantityQuintals} Quintals`,
      bestMandi: recommendation.bestMandi?.mandi.name,
      netRevenue: recommendation.bestMandi?.estimatedNetRevenue,
    };
    const updated = [newEntry, ...savedComparisons];
    setSavedComparisons(updated);
    localStorage.setItem('prima_saved_comparisons', JSON.stringify(updated));
    setHasSavedCurrent(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('prima_agri_user');
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-emerald-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Sections based on Active Tab */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-0">
            {/* Hero Section */}
            <HeroSection
              onExploreMarkets={() => setActiveTab('mandi-prices')}
              onOpenAuth={() => {
                setAuthMode('signup');
                setAuthModalOpen(true);
              }}
            />

            {/* Market Ticker */}
            <MarketTicker />

            {/* Feature Cards Section */}
            <FeatureCardsSection onNavigate={setActiveTab} />

            {/* How It Works Section */}
            <HowItWorksSection />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigateToMandi={(cropId) => {
              if (cropId) {
                const found = SUPPORTED_CROPS.find((c) => c.id === cropId);
                if (found) setSelectedCrop(found);
              }
              setActiveTab('mandi-prices');
            }}
            onNavigateToTransport={() => setActiveTab('transport')}
            onOpenAuth={() => {
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
          />
        )}

        {activeTab === 'mandi-prices' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Breadcrumb Header */}
            <div>
              <div className="text-xs uppercase font-extrabold tracking-widest text-emerald-800 mb-1">
                PRIMA-AGRINTEL / DECISION DESK
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
                Compare verified mandis by district.
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Choose a state, then a district, then compare only the mandis that belong to it.
              </p>
            </div>

            {/* Form Selector */}
            <StateDistrictMandiSelector
              selectedCrop={selectedCrop}
              onChangeCrop={setSelectedCrop}
              selectedState={selectedState}
              onChangeState={handleChangeState}
              selectedDistrict={selectedDistrict}
              onChangeDistrict={handleChangeDistrict}
              originLocation={originLocation}
              onChangeOriginLocation={setOriginLocation}
              quantityValue={quantityValue}
              onChangeQuantityValue={setQuantityValue}
              quantityUnit={quantityUnit}
              onChangeQuantityUnit={setQuantityUnit}
              selectedMandis={selectedMandis}
              onToggleMandi={handleToggleMandi}
              onSelectAllDistrictMandis={handleSelectAllDistrictMandis}
              onClearMandis={handleClearMandis}
              onTriggerCompare={() => {
                const resultsEl = document.getElementById('results-section');
                if (resultsEl) {
                  resultsEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* Results Section */}
            <div id="results-section" className="space-y-8 pt-4">
              {/* Highlighted AI-Assisted Recommendation Card */}
              <RecommendationCard
                recommendation={recommendation}
                aiExplanation={aiExplanation}
                isLoadingAi={isLoadingAi}
                onRefreshAi={() => runAiAnalysis(true)}
              />

              {/* Action row: Save comparison */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Calculated across {economicsList.length} mandis for {quantityQuintals} qtl of {selectedCrop.name}.
                </div>
                <button
                  onClick={handleSaveComparison}
                  disabled={hasSavedCurrent}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    hasSavedCurrent
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {hasSavedCurrent ? (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Comparison Saved!</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 text-gray-500" />
                      <span>Save Comparison</span>
                    </>
                  )}
                </button>
              </div>

              {/* Interactive Revenue Chart */}
              <RevenueChart economicsList={economicsList} />

              {/* Detailed Comparison Table */}
              <ComparisonTable economicsList={economicsList} isLoading={false} />
            </div>
          </div>
        )}

        {activeTab === 'transport' && (
          <TransportCalculatorView
            onNavigateToMandi={() => setActiveTab('mandi-prices')}
          />
        )}

        {activeTab === 'forecast' && (
          <ForecastView
            isUnlocked={!!currentUser}
            onOpenAuth={() => {
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
          />
        )}

        {activeTab === 'weather' && (
          <WeatherView
            isUnlocked={!!currentUser}
            onOpenAuth={() => {
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
          />
        )}

        {activeTab === 'about' && (
          <AboutView onNavigateToMandi={() => setActiveTab('mandi-prices')} />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        mode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    </div>
  );
}
