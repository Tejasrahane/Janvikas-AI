import React, { useState } from 'react';
import { 
  NATIONAL_SUMMARY, 
  DEMAND_HOTSPOTS, 
  DISTRICTS, 
  CITIZEN_REQUESTS 
} from '../data/mockData';
import type { DemandHotspot, CitizenRequest } from '../types';
import { GeospatialMap } from './GeospatialMap';
import { LiveFeedTicker } from './LiveFeedTicker';
import { 
  Activity, 
  FileText, 
  CheckCircle2, 
  Users, 
  Coins, 
  Flame, 
  ArrowRight,
  X,
  Sparkles
} from 'lucide-react';

interface NationalCommandViewProps {
  onOpenDpr: (dprId: string) => void;
  onOpenDistrict?: (districtName: string) => void;
}

export const NationalCommandView: React.FC<NationalCommandViewProps> = ({
  onOpenDpr,
  onOpenDistrict: _onOpenDistrict,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<DemandHotspot | null>(null);
  const [selectedRequestModal, setSelectedRequestModal] = useState<CitizenRequest | null>(null);
  const [selectedSector, setSelectedSector] = useState<string>('All Sectors');
  const [livePinAlert, setLivePinAlert] = useState<string | null>(null);

  const handleMapPinDropped = (lat: number, lng: number) => {
    setLivePinAlert(`📍 New Citizen Ingestion Pin at [${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E] -> Ingested via Bhashini Indic ASR & clustered into H3 Res-8 Hexagon.`);
    setTimeout(() => setLivePinAlert(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Live Map Pin Alert Notification */}
      {livePinAlert && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-glow-emerald animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{livePinAlert}</span>
          </div>
          <button
            onClick={() => onOpenDpr('dpr-1')}
            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
          >
            <span>Open AI DPR</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Demands Logged</span>
            <Users className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {NATIONAL_SUMMARY.totalDemandsLogged.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">
            ↑ 18.2% this week (22 Langs)
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">H3 Hotspots</span>
            <Flame className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-orange-400 font-mono">
            {NATIONAL_SUMMARY.activeHotspotsDetected.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Resolution 8 Hex Clusters
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">AI DPRs Drafted</span>
            <FileText className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-400 font-mono">
            {NATIONAL_SUMMARY.dprsGenerated}
          </div>
          <div className="text-[10px] text-purple-300 mt-0.5">
            CPWD SOR Auto-Estimated
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Sanctioned</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            {NATIONAL_SUMMARY.sanctionedProjects}
          </div>
          <div className="text-[10px] text-emerald-300 mt-0.5">
            59% National Conversion
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Sanctioned Capex</span>
            <Coins className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
            ₹{NATIONAL_SUMMARY.totalSanctionedCapexCr} Cr
          </div>
          <div className="text-[10px] text-amber-300 mt-0.5">
            PFMS Fund Disbursed
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Beneficiaries</span>
            <Activity className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-400 font-mono">
            1.84 Cr
          </div>
          <div className="text-[10px] text-blue-300 mt-0.5">
            Across 112 Aspirational Dists
          </div>
        </div>
      </div>

      {/* Main Grid: Geospatial Map (7-8 cols) + Live Multilingual Feed (4-5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <GeospatialMap
            hotspots={DEMAND_HOTSPOTS}
            districts={DISTRICTS}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={(h) => setSelectedHotspot(h)}
            onOpenDpr={onOpenDpr}
            selectedSector={selectedSector}
            setSelectedSector={setSelectedSector}
            onMapPinDropped={handleMapPinDropped}
          />

          {/* Sector Breakdown Quick Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
            {NATIONAL_SUMMARY.sectorBreakdown.map((sec) => (
              <button
                key={sec.sector}
                onClick={() => setSelectedSector(sec.sector === selectedSector ? 'All Sectors' : sec.sector)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedSector === sec.sector
                    ? 'bg-slate-800 border-india-saffron shadow-sm'
                    : 'glass-panel border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] text-slate-400 block truncate font-medium">
                  {sec.sector}
                </span>
                <span className="text-xs font-black text-white font-mono block">
                  {sec.count.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  ₹{sec.capexCr} Cr
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <LiveFeedTicker
            requests={CITIZEN_REQUESTS}
            onSelectRequest={(req) => setSelectedRequestModal(req)}
          />
        </div>
      </div>

      {/* Citizen Request Detail Modal */}
      {selectedRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-elevated rounded-2xl border border-slate-700 max-w-lg w-full p-6 text-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {selectedRequestModal.ticketId}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400">
                  {selectedRequestModal.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedRequestModal(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Original Voice/Text ({selectedRequestModal.languageNative}):
                </span>
                <p className="text-sm font-sans text-amber-200 bg-slate-950 p-3 rounded-xl border border-slate-800 italic">
                  "{selectedRequestModal.originalText}"
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  AI Translation &amp; Intent:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                  {selectedRequestModal.translatedText}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">District &amp; Block:</span>
                  <span className="font-bold text-white">
                    {selectedRequestModal.location.block}, {selectedRequestModal.location.district} ({selectedRequestModal.location.state})
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Gram Panchayat:</span>
                  <span className="font-bold text-white">
                    {selectedRequestModal.location.gramPanchayat} GP (PIN {selectedRequestModal.location.pincode})
                  </span>
                </div>
              </div>

              {selectedRequestModal.attachments && selectedRequestModal.attachments.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                    Attached Evidence &amp; AI Geo-Verification:
                  </span>
                  <div className="relative rounded-xl overflow-hidden border border-slate-800 h-40">
                    <img
                      src={selectedRequestModal.attachments[0].url}
                      alt="Citizen evidence"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                      <div className="flex flex-wrap gap-1">
                        {selectedRequestModal.attachments[0].aiTags?.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/80 text-white backdrop-blur-sm"
                          >
                            ✓ {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  Channel: <span className="text-white font-semibold capitalize">{selectedRequestModal.channel}</span>
                </span>
                <button
                  onClick={() => {
                    const hotspot = DEMAND_HOTSPOTS.find(h => h.id === selectedRequestModal.hotspotClusterId) || DEMAND_HOTSPOTS[0];
                    setSelectedRequestModal(null);
                    onOpenDpr(hotspot.recommendedProjectId);
                  }}
                  className="px-4 py-2 bg-india-saffron hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-glow-saffron flex items-center gap-1.5"
                >
                  <span>Open Target AI DPR</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
