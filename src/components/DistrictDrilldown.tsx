import React, { useState } from 'react';
import { DistrictMetric, DemandHotspot, CitizenRequest } from '../types';
import { 
  Building, 
  MapPin, 
  Users, 
  AlertOctagon, 
  TrendingUp, 
  CheckCircle2, 
  FileText, 
  Layers, 
  ExternalLink,
  Droplet,
  Truck,
  HeartPulse,
  Sun,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface DistrictDrilldownProps {
  districts: DistrictMetric[];
  hotspots: DemandHotspot[];
  requests: CitizenRequest[];
  onOpenDpr: (dprId: string) => void;
  onSelectHotspot: (hotspot: DemandHotspot) => void;
}

export const DistrictDrilldown: React.FC<DistrictDrilldownProps> = ({
  districts,
  hotspots,
  requests,
  onOpenDpr,
  onSelectHotspot,
}) => {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(districts[0].id);

  const currentDistrict = districts.find(d => d.id === selectedDistrictId) || districts[0];
  const districtHotspots = hotspots.filter(h => h.district.toLowerCase() === currentDistrict.name.toLowerCase());
  const districtRequests = requests.filter(r => r.location.district.toLowerCase() === currentDistrict.name.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Top Selector & District Header Banner */}
      <div className="glass-panel-elevated p-5 rounded-2xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">
                  {currentDistrict.name} District Command
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                  {currentDistrict.state}
                </span>
                {currentDistrict.aspirationalDistrict && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
                    ★ NITI Aayog Aspirational Rank #{currentDistrict.nitiAayogRank}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Local Government Directory (LGD) ID: LGD-{currentDistrict.id.toUpperCase()} • Population: {(currentDistrict.population / 100000).toFixed(2)} Lakh
              </p>
            </div>
          </div>

          {/* District Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {districts.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDistrictId(d.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  d.id === selectedDistrictId
                    ? 'bg-gradient-to-r from-india-saffron to-amber-600 text-white shadow-glow-saffron border border-orange-400/40'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                {d.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* District Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Demands Ingested</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {currentDistrict.totalRequests.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1">
            <span>↑ 14% this month</span>
            <span className="text-slate-500">• 22 Langs</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Acute Hotspots</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400">
            {currentDistrict.activeHotspots}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {districtHotspots.filter(h => h.compositeUrgency >= 90).length} Critical Priority
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">SECC Poverty Ratio</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {currentDistrict.povertyRatePercent}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Deprivation Weight: High
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Sanctioned Capex</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            ₹{currentDistrict.totalSanctionedCapexCr} Cr
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            {currentDistrict.sanctionedProjectsCount} Projects Approved
          </div>
        </div>
      </div>

      {/* Infrastructure Deficit Index vs Demand Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Hotspots & Gram Panchayat Clusters */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-india-saffron" />
              Identified Demand Hotspots ({districtHotspots.length})
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              H3 Hex Spatial Aggregation
            </span>
          </div>

          <div className="space-y-3">
            {districtHotspots.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center">
                <p className="text-slate-400 text-sm">No active demand hotspots recorded for this district yet.</p>
              </div>
            ) : (
              districtHotspots.map((hotspot) => (
                <div
                  key={hotspot.id}
                  className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-india-saffron/50 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        {hotspot.sector}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        H3: {hotspot.h3Index.substring(0, 8)}...
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                        Urgency Score: {hotspot.compositeUrgency}/100
                      </span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Priority: {hotspot.priorityScore}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mb-1">
                    {hotspot.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    <span className="text-slate-400">Recommended Project:</span> {hotspot.recommendedProjectTitle}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] mb-3">
                    <div>
                      <span className="text-slate-400 block">Block &amp; GPs:</span>
                      <span className="font-bold text-white">
                        {hotspot.block} ({hotspot.gramPanchayats.length} GPs)
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Demands Clustered:</span>
                      <span className="font-bold text-cyan-300">
                        {hotspot.totalRequests} citizen inputs
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Pop. Benefited:</span>
                      <span className="font-bold text-amber-300">
                        {hotspot.populationAffected.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Estimated Capex:</span>
                      <span className="font-bold text-emerald-400">
                        ₹{hotspot.estimatedCapexCr} Cr
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <span>Nearest {hotspot.nearestFacility.type}:</span>
                      <span className="font-semibold text-white">
                        {hotspot.nearestFacility.name} ({hotspot.nearestFacility.distanceKm} km away)
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenDpr(hotspot.recommendedProjectId)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-india-saffron hover:bg-orange-500 text-white flex items-center gap-1.5 shadow-glow-saffron transition-all"
                    >
                      <span>Open AI DPR Document</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Infrastructure Gap vs PM GatiShakti Benchmarks */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Infrastructure Deficit vs Benchmarks
          </h3>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              Cross-correlated with PM GatiShakti GIS National Master Plan &amp; NITI Aayog Aspirational District Indicators.
            </p>

            {/* Road Deficit */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-orange-400" />
                  All-Weather Road Deficit
                </span>
                <span className="font-bold text-orange-400">{currentDistrict.roadDeficitIndex}% Gap</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                  style={{ width: `${currentDistrict.roadDeficitIndex}%` }}
                ></div>
              </div>
            </div>

            {/* Tap Water Stress */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                  Piped Tap Water Stress (JJM)
                </span>
                <span className="font-bold text-cyan-400">{currentDistrict.waterStressIndex}% Gap</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  style={{ width: `${currentDistrict.waterStressIndex}%` }}
                ></div>
              </div>
            </div>

            {/* Health Infrastructure Deficit */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-red-400" />
                  PHC / Maternal Care Deficit
                </span>
                <span className="font-bold text-red-400">{currentDistrict.healthDeficitIndex}% Gap</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-rose-600 rounded-full"
                  style={{ width: `${currentDistrict.healthDeficitIndex}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Action for Collector */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
              <span className="font-bold block mb-1">District Magistrate Action Memo:</span>
              3 projects in this district meet 100% eligibility criteria for PMGSY and JJM fast-track sanction.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
