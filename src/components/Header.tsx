import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  FileText, 
  Sliders, 
  Mic, 
  Bot, 
  Globe2, 
  Radio,
  Layers,
  Trophy,
  Sparkles,
  Presentation,
  Server,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';
import { HackathonPitchModal } from './HackathonPitchModal';
import { PitchDeckModal } from './PitchDeckModal';
import { checkBackendHealth, BackendHealthResponse } from '../services/api';

export type ActiveTab = 'national' | 'district' | 'dpr' | 'simulator' | 'citizen' | 'copilot';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedRole,
  setSelectedRole,
  selectedLanguage,
  setSelectedLanguage,
  theme = 'light',
  onToggleTheme,
}) => {
  const [showPitchModal, setShowPitchModal] = useState<boolean>(false);
  const [showPitchDeck, setShowPitchDeck] = useState<boolean>(false);
  const [backendOnline, setBackendOnline] = useState<boolean>(true);
  const [backendData, setBackendData] = useState<BackendHealthResponse | null>(null);

  useEffect(() => {
    const verifyHealth = async () => {
      const res = await checkBackendHealth();
      setBackendOnline(res.online);
      if (res.data) setBackendData(res.data);
    };
    verifyHealth();
    const interval = setInterval(verifyHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'national' as ActiveTab, label: 'National Command Hub', icon: Compass, badge: 'Live' },
    { id: 'district' as ActiveTab, label: 'District Ground-Zero', icon: MapPin },
    { id: 'dpr' as ActiveTab, label: 'AI DPR & Sanctions', icon: FileText, badge: 'AI' },
    { id: 'simulator' as ActiveTab, label: 'Policy Budget Simulator', icon: Sliders },
    { id: 'citizen' as ActiveTab, label: 'Multilingual Ingestion', icon: Mic, badge: 'Bhashini' },
    { id: 'copilot' as ActiveTab, label: 'JanVikas Copilot', icon: Bot, badge: 'GPT-4o' },
  ];

  const roles = [
    'PMO / Central Ministry',
    'District Magistrate (DM)',
    'State Planning Secretary',
    'Gram Panchayat Officer',
    'Citizen / Public DPG View'
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'or', label: 'ଓଡ଼ିଆ (Odia)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-200 ${
        theme === 'dark' 
          ? 'bg-[#040711]/95 border-slate-800/80 text-slate-100' 
          : 'bg-white/95 border-slate-200 shadow-sm text-slate-900'
      }`}>
        {/* Top Bar: Official Branding & Status */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between border-b border-slate-800/40">
          <div className="flex items-center gap-3.5">
            {/* Ashoka / Tricolor Glow Badge */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-india-saffron via-white to-india-green p-[2px] shadow-glow-saffron">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`}>
                <span className="font-extrabold text-sm tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-600">
                  जन
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight flex items-center gap-1.5">
                  <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>JanVikas</span>
                  <span className="text-india-saffron">AI</span>
                  <span className={`text-xs font-normal hidden sm:inline ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>| Rashtriya Vikas Netram</span>
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  DPG CERTIFIED
                </span>
              </div>
              <p className={`text-[11px] hidden md:block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Digital Public Good for Multilingual Civic Ingestion &amp; National Infrastructure Planning
              </p>
            </div>
          </div>

          {/* Live System Telemetry & Selectors */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  theme === 'light'
                    ? 'bg-amber-500/10 text-amber-700 border-amber-300 hover:bg-amber-500/20 shadow-sm'
                    : 'bg-indigo-500/10 text-cyan-300 border-cyan-500/30 hover:bg-indigo-500/20'
                }`}
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              >
                {theme === 'light' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
                    <span className="text-[11px]">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[11px]">Dark</span>
                  </>
                )}
              </button>
            )}

            {/* Live Backend Connection Status Pill */}
            <a
              href={import.meta.env.VITE_BACKEND_API_URL ? `${import.meta.env.VITE_BACKEND_API_URL}/docs` : '/docs'}
              target="_blank"
              rel="noreferrer"
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold flex items-center gap-1.5 border transition-all ${
                backendOnline
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
              }`}
              title={backendOnline ? "FastAPI Backend is Connected. Click to open Swagger API Docs." : "FastAPI Backend offline - running on local mock fallback"}
            >
              <Server className="w-3.5 h-3.5" />
              <span className="hidden md:inline">API:</span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                {backendOnline ? 'Connected' : 'Offline'}
              </span>
            </a>

            {/* 12-Slide Pitch Deck Button */}
            <button
              onClick={() => setShowPitchDeck(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 text-purple-600 dark:text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Presentation className="w-3.5 h-3.5 text-purple-500" />
              <span className="hidden sm:inline">12-Slide Pitch Deck</span>
            </button>

            {/* Hackathon Pitch CTA Button */}
            <button
              onClick={() => setShowPitchModal(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-700 dark:text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Hackathon Rubric</span>
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center">
              <Globe2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className={`pl-7 pr-3 py-1 text-xs border rounded-lg focus:outline-none focus:border-india-saffron transition-colors ${
                  theme === 'dark' 
                    ? 'bg-slate-900/80 border-slate-700 text-slate-200' 
                    : 'bg-white border-slate-300 text-slate-800 shadow-sm'
                }`}
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Persona Switcher */}
            <div className="flex items-center">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className={`px-3 py-1 text-xs font-medium rounded-lg focus:outline-none focus:border-amber-400 transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-900 border border-slate-700 text-amber-300'
                    : 'bg-amber-50/80 border border-amber-300 text-amber-900 shadow-sm'
                }`}
              >
                {roles.map((r) => (
                  <option key={r} value={r} className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                    👤 {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>



        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-india-saffron/20 via-india-saffron/10 to-transparent text-white border border-india-saffron/50 shadow-glow-saffron'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-india-saffron' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                        tab.badge === 'Live'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : tab.badge === 'AI'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Hackathon Rubric Modal */}
      <HackathonPitchModal
        isOpen={showPitchModal}
        onClose={() => setShowPitchModal(false)}
      />

      {/* 12-Slide Pitch Deck Modal */}
      <PitchDeckModal
        isOpen={showPitchDeck}
        onClose={() => setShowPitchDeck(false)}
      />
    </>
  );
};
