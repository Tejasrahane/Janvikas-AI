import React, { useState } from 'react';
import type { ProjectProposal, SchemeCatalog } from '../types';
import confetti from 'canvas-confetti';
import { 
  FileText, 
  CheckCircle2, 
  Printer, 
  Coins, 
  Building2, 
  Sparkles,
  Stamp
} from 'lucide-react';

interface DprStudioProps {
  proposals: ProjectProposal[];
  schemes: SchemeCatalog[];
  selectedDprId: string | null;
  onSelectDpr: (id: string) => void;
  onSanctionProposal: (id: string, signatoryName: string) => void;
}

export const DprStudio: React.FC<DprStudioProps> = ({
  proposals,
  schemes: _schemes,
  selectedDprId,
  onSelectDpr,
  onSanctionProposal,
}) => {
  const currentDpr = proposals.find(p => p.id === selectedDprId) || proposals[0];
  const [showSignModal, setShowSignModal] = useState<boolean>(false);
  const [signatoryName, setSignatoryName] = useState<string>('Rajesh Kumar, IAS (Joint Secretary)');
  const [signingSuccess, setSigningSuccess] = useState<boolean>(false);

  const handleSanctionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSanctionProposal(currentDpr.id, signatoryName);
    setShowSignModal(false);
    setSigningSuccess(true);

    // Fire festive celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF671F', '#FFFFFF', '#046A38', '#3B82F6']
    });

    setTimeout(() => setSigningSuccess(false), 5000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar: List of AI-Generated DPRs (4 Cols) */}
      <div className="lg:col-span-4 space-y-3">
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-india-saffron" />
            AI DPR Repository ({proposals.length})
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
            CPWD SOR Rate Engine
          </span>
        </div>

        <div className="space-y-2.5">
          {proposals.map((prop) => {
            const isSelected = prop.id === currentDpr.id;
            const isSanctioned = prop.approvalStatus === 'Sanctioned';
            return (
              <div
                key={prop.id}
                onClick={() => onSelectDpr(prop.id)}
                className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-slate-850 border-india-saffron shadow-glow-saffron'
                    : 'glass-panel border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                    {prop.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isSanctioned
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {isSanctioned && <CheckCircle2 className="w-3 h-3" />}
                    {prop.approvalStatus}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug mb-2">
                  {prop.title}
                </h4>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{prop.district}, {prop.state}</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    ₹{prop.estimatedCapexCr} Cr
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Area: Official DPR Document Viewer (8 Cols) */}
      <div className="lg:col-span-8">
        <div className="glass-panel-elevated rounded-2xl border border-slate-800 p-6 relative overflow-hidden">
          {/* Subtle Watermark Branding */}
          <div className="absolute right-6 top-6 opacity-5 pointer-events-none text-right">
            <span className="text-9xl font-black text-white">भारत</span>
          </div>

          {/* Success Banner if freshly sanctioned */}
          {signingSuccess && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold">
                  DPR Successfully Sanctioned &amp; Dispatched to Public Financial Management System (PFMS)!
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400">HASH: #JV-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
          )}

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700">
                REF: {currentDpr.code}
              </span>
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                {currentDpr.sector}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Export
              </button>

              {currentDpr.approvalStatus !== 'Sanctioned' ? (
                <button
                  onClick={() => setShowSignModal(true)}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-glow-emerald flex items-center gap-1.5 transition-all"
                >
                  <Stamp className="w-4 h-4" />
                  Sanction &amp; Route to Ministry
                </button>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Sanctioned by {currentDpr.sanctionedBy || 'Empowered Committee'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Document Content Header */}
          <div className="text-center py-3 mb-6 bg-slate-950/80 rounded-xl border border-slate-800/80">
            <div className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">
              Government of India • Ministry of Rural Development / Jal Shakti
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1 px-4">
              DETAILED PROJECT REPORT (DPR)
            </h2>
            <p className="text-xs text-amber-300 font-medium mt-0.5">
              AI-Synthesized Citizen Infrastructure Proposal under {currentDpr.targetScheme}
            </p>
          </div>

          {/* Project Title & Key Figures */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-black text-white leading-snug">
                {currentDpr.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                <span>📍 Jurisdiction: {currentDpr.block} Block, {currentDpr.district} District ({currentDpr.state})</span>
                <span>• Villages: {currentDpr.coveredVillages.join(', ')}</span>
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Total Est. Capex:</span>
                <span className="text-base font-black text-emerald-400">
                  ₹{currentDpr.estimatedCapexCr} Cr
                </span>
                <span className="text-[10px] text-slate-500 block">CPWD Rate Index 2026</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Target Beneficiaries:</span>
                <span className="text-base font-black text-cyan-400">
                  {currentDpr.estimatedBeneficiaries.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 block">100% Rural Habitations</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Execution Timeline:</span>
                <span className="text-base font-black text-amber-400">
                  {currentDpr.timelineMonths} Months
                </span>
                <span className="text-[10px] text-slate-500 block">Fast-Track Mode</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Funding Convergence:</span>
                <span className="text-base font-black text-purple-400">
                  {currentDpr.centralSharePercent}% Central / {currentDpr.stateSharePercent}% State
                </span>
                <span className="text-[10px] text-slate-500 block">{currentDpr.targetScheme.split(' ')[0]}</span>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-india-saffron" />
                Executive Summary &amp; Citizen Ground-Truth Rationale
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentDpr.dprDetails.executiveSummary}
              </p>
            </div>

            {/* Technical Specifications */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                Technical Specifications &amp; Engineering Design
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
                {currentDpr.dprDetails.technicalSpecifications.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-india-saffron font-bold">✓</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Itemized Bill of Quantities (BOQ) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                Itemized Bill of Quantities (BOQ) with Schedule of Rates
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Item Description</th>
                      <th className="p-2.5">Unit</th>
                      <th className="p-2.5 text-right">Qty</th>
                      <th className="p-2.5 text-right">SOR Rate</th>
                      <th className="p-2.5 text-right">Amount (₹ Cr)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                    {currentDpr.dprDetails.billOfQuantities.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50">
                        <td className="p-2.5 font-medium text-white">{item.item}</td>
                        <td className="p-2.5 text-slate-400">{item.unit}</td>
                        <td className="p-2.5 text-right font-mono">{item.quantity.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-mono text-slate-400">{item.sorRate}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-400">
                          ₹{item.amountCr.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-900/80 font-bold text-white">
                      <td colSpan={4} className="p-2.5 text-right">Grand Total Estimated Capex:</td>
                      <td className="p-2.5 text-right text-emerald-400 font-mono text-sm">
                        ₹{currentDpr.estimatedCapexCr} Cr
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Social & Environmental Impact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  Socio-Economic &amp; Health Uplift
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentDpr.healthImpactMetric || currentDpr.dprDetails.socialImpactSummary}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <h5 className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-1">
                  Environmental Clearance &amp; Compliance
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Status: <span className="font-bold text-white">{currentDpr.dprDetails.environmentalClearance}</span>. Standard EIA parameters verified with zero forest canopy disruption.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Signature & Sanction Modal */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-elevated rounded-2xl border border-slate-700 max-w-md w-full p-6 text-slate-200 animate-scaleUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Stamp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Execute Digital Sanction
                </h3>
                <p className="text-xs text-slate-400">
                  Empowered Committee Sanction Order
                </p>
              </div>
            </div>

            <form onSubmit={handleSanctionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project Code:
                </label>
                <input
                  type="text"
                  disabled
                  value={currentDpr.code}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Total Grant Sanctioned:
                </label>
                <input
                  type="text"
                  disabled
                  value={`₹${currentDpr.estimatedCapexCr} Cr (${currentDpr.centralSharePercent}% Central / ${currentDpr.stateSharePercent}% State)`}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Authorizing Officer / Joint Secretary Name:
                </label>
                <input
                  type="text"
                  required
                  value={signatoryName}
                  onChange={(e) => setSignatoryName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 leading-relaxed">
                By sanctioning, funds will be reserved in the Ministry budget ledger and tender notification drafted for PMGSY/JJM state execution agencies.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSignModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-emerald flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm &amp; Disburse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
