import React from 'react';
import { 
  Trophy, 
  X, 
  Sparkles, 
  Cloud, 
  Layers, 
  CheckCircle2, 
  Globe2, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  ExternalLink,
  Flame,
  FileCode2,
  Users
} from 'lucide-react';

interface HackathonPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HackathonPitchModal: React.FC<HackathonPitchModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="glass-panel-elevated rounded-3xl border border-cyan-500/30 max-w-4xl w-full p-6 sm:p-8 text-slate-100 relative my-8 animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-400 shadow-glow-saffron">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Google Cloud Hackathon Edition
              </span>
              <span className="text-xs text-slate-400">Build with AI: Code for Communities</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              JanVikas AI // Executive Architecture &amp; Impact Blueprint
            </h2>
          </div>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-300">
          {/* Executive Overview Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-cyan-500/20 leading-relaxed">
            <p className="font-medium text-slate-200">
              <strong className="text-amber-400">The Problem:</strong> Over ₹14 Lakh Crore is invested annually in Indian national infrastructure schemes (PM GatiShakti, Jal Jeevan Mission, PMGSY, Ayushman Bharat). Yet citizen development requests remain trapped in fragmented silos across 22+ languages, leading to unaddressed infrastructure dark zones and misaligned public spending.
            </p>
            <p className="mt-2 text-slate-300">
              <strong className="text-cyan-400">The Solution:</strong> JanVikas AI is a <strong>Digital Public Good (DPG)</strong> that ingests multilingual voice/text citizen feedback, aggregates demands using <strong>H3 Hexagonal Spatial Intelligence</strong>, and synthesizes <strong>ready-to-sanction Detailed Project Reports (DPRs)</strong> linked to Central &amp; State budgets.
            </p>
          </div>

          {/* Google Cloud & AI Tech Stack Grid */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Cloud className="w-4 h-4 text-cyan-400" />
              Google Cloud &amp; AI Integration Matrix
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Vertex AI (Gemini 1.5)
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Multilingual NLU, entity extraction of administrative LGD nodes, and automated DPR engineering specification drafting.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-xs">
                  <Globe2 className="w-4 h-4 text-orange-400" />
                  Google Speech-to-Text &amp; Bhashini
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Voice intake in 22 Scheduled Indian languages, tribal dialects (Bastaria, Santhali), and code-mixed Hinglish/Tanglish over IVR.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Google Maps Platform
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  High-res Satellite, Terrain, and Geometry APIs for physical ground verification, river crossing surveys, and road access audits.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  BigQuery GIS &amp; Uber H3
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Hexagonal spatial indexing (Res 7-9) clustering 50,000+ citizen demands into high-density priority action zones.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <FileCode2 className="w-4 h-4 text-amber-400" />
                  Stitch MCP Design System
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Engineered using Stitch "Sovereign Tactical Telemetry" tokens, glassmorphic HUD docks, and high-density telemetry meters.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  DPDP Act 2023 &amp; DPG
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Full differential privacy anonymization of citizen PII with public open data transparency and zero vendor lock-in.
                </p>
              </div>
            </div>
          </div>

          {/* Key Impact Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Sanction Turnaround</span>
              <span className="text-xl font-black text-emerald-400 font-mono">14 Days</span>
              <span className="text-[10px] text-slate-500 block">vs 18 Months Traditional</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Language Inclusivity</span>
              <span className="text-xl font-black text-cyan-400 font-mono">22 Langs</span>
              <span className="text-[10px] text-slate-500 block">Voice, WhatsApp &amp; SMS</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Tender De-duplication</span>
              <span className="text-xl font-black text-amber-400 font-mono">100%</span>
              <span className="text-[10px] text-slate-500 block">AI Demand Clustering</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">DPG Standard</span>
              <span className="text-xl font-black text-purple-400 font-mono">Level 1.2</span>
              <span className="text-[10px] text-slate-500 block">Certified Open DPI</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              Submitted to: <strong className="text-white">Build with AI: Code for Communities (2nd Edition)</strong>
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-india-saffron to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-glow-saffron transition-all"
            >
              Explore Live System Demonstration →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
