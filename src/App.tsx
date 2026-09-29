import React, { useState } from 'react';
import { 
  CITIZEN_REQUESTS, 
  DEMAND_HOTSPOTS, 
  DISTRICTS, 
  PROJECT_PROPOSALS, 
  SCHEMES 
} from './data/mockData';
import { CitizenRequest, ProjectProposal } from './types';
import { Header, ActiveTab } from './components/Header';
import { NationalCommandView } from './components/NationalCommandView';
import { DistrictDrilldown } from './components/DistrictDrilldown';
import { DprStudio } from './components/DprStudio';
import { BudgetSimulator } from './components/BudgetSimulator';
import { CitizenStudio } from './components/CitizenStudio';
import { PolicyCopilot } from './components/PolicyCopilot';
import { 
  ShieldCheck, 
  HeartHandshake, 
  Globe2, 
  Layers, 
  ExternalLink,
  Code2
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('national');
  const [selectedRole, setSelectedRole] = useState<string>('PMO / Central Ministry');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('janvikas_theme') as 'light' | 'dark') || 'light';
  });

  const [requests, setRequests] = useState<CitizenRequest[]>(CITIZEN_REQUESTS);
  const [proposals, setProposals] = useState<ProjectProposal[]>(PROJECT_PROPOSALS);
  const [selectedDprId, setSelectedDprId] = useState<string | null>(PROJECT_PROPOSALS[0].id);

  // Sync theme to root html element
  React.useEffect(() => {
    localStorage.setItem('janvikas_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleOpenDpr = (dprId: string) => {
    setSelectedDprId(dprId);
    setActiveTab('dpr');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDistrict = (districtName: string) => {
    setActiveTab('district');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSanctionProposal = (id: string, signatoryName: string) => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            approvalStatus: 'Sanctioned',
            sanctionedBy: signatoryName,
            sanctionedDate: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      })
    );
  };

  const handleNewRequestLogged = (newReq: CitizenRequest) => {
    setRequests((prev) => [newReq, ...prev]);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${theme === 'dark' ? 'bg-[#0B0F19] text-slate-100' : 'bg-[#F1F5F9] text-slate-900'}`}>
      {/* Universal Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        theme={theme}
        onToggleTheme={toggleTheme}
      />


      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'national' && (
          <NationalCommandView
            onOpenDpr={handleOpenDpr}
            onOpenDistrict={handleOpenDistrict}
          />
        )}

        {activeTab === 'district' && (
          <DistrictDrilldown
            districts={DISTRICTS}
            hotspots={DEMAND_HOTSPOTS}
            requests={requests}
            onOpenDpr={handleOpenDpr}
            onSelectHotspot={(h) => handleOpenDpr(h.recommendedProjectId)}
          />
        )}

        {activeTab === 'dpr' && (
          <DprStudio
            proposals={proposals}
            schemes={SCHEMES}
            selectedDprId={selectedDprId}
            onSelectDpr={(id) => setSelectedDprId(id)}
            onSanctionProposal={handleSanctionProposal}
          />
        )}

        {activeTab === 'simulator' && (
          <BudgetSimulator
            proposals={proposals}
            schemes={SCHEMES}
            onOpenDpr={handleOpenDpr}
          />
        )}

        {activeTab === 'citizen' && (
          <CitizenStudio
            onNewRequestLogged={handleNewRequestLogged}
            requests={requests}
          />
        )}

        {activeTab === 'copilot' && (
          <PolicyCopilot
            districts={DISTRICTS}
            hotspots={DEMAND_HOTSPOTS}
            proposals={proposals}
            onOpenDpr={handleOpenDpr}
          />
        )}
      </main>

      {/* Official DPG Footer */}
      <footer className="bg-slate-950/80 border-t border-slate-850 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <span className="text-india-saffron">जन</span>
              <span>JanVikas AI</span>
            </div>
            <span>•</span>
            <span>Digital Public Good (DPG Standard 1.2)</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">DPDP Act 2023 Compliant</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5 text-orange-400" />
              Bhashini Language Stack
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              PM GatiShakti GIS Alignment
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Differential Privacy Anonymized
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
