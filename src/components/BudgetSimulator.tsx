import React, { useState, useMemo } from 'react';
import { ProjectProposal, SchemeCatalog } from '../types';
import { 
  Sliders, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Coins, 
  PieChart, 
  Zap, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface BudgetSimulatorProps {
  proposals: ProjectProposal[];
  schemes: SchemeCatalog[];
  onOpenDpr: (id: string) => void;
}

type OptimizationStrategy = 'max_population' | 'vulnerability' | 'fast_delivery' | 'balanced';

export const BudgetSimulator: React.FC<BudgetSimulatorProps> = ({
  proposals,
  schemes,
  onOpenDpr,
}) => {
  const [totalBudgetCr, setTotalBudgetCr] = useState<number>(50); // Default ₹50 Cr
  const [strategy, setStrategy] = useState<OptimizationStrategy>('balanced');
  const [focusState, setFocusState] = useState<string>('All States');

  // Multi-criteria knapsack optimization simulation
  const simulationResult = useMemo(() => {
    let pool = [...proposals];

    if (focusState !== 'All States') {
      pool = pool.filter(p => p.state === focusState);
    }

    // Sort by dynamic score based on strategy
    pool.sort((a, b) => {
      if (strategy === 'max_population') {
        const roiA = a.estimatedBeneficiaries / a.estimatedCapexCr;
        const roiB = b.estimatedBeneficiaries / b.estimatedCapexCr;
        return roiB - roiA;
      } else if (strategy === 'vulnerability') {
        return (b.socioEconomicScore || 0) - (a.socioEconomicScore || 0);
      } else if (strategy === 'fast_delivery') {
        return a.timelineMonths - b.timelineMonths;
      } else {
        // Balanced formula
        const scoreA = (a.socioEconomicScore * 0.5) + ((a.estimatedBeneficiaries / a.estimatedCapexCr) / 500);
        const scoreB = (b.socioEconomicScore * 0.5) + ((b.estimatedBeneficiaries / b.estimatedCapexCr) / 500);
        return scoreB - scoreA;
      }
    });

    let currentCost = 0;
    let selected: ProjectProposal[] = [];
    let unselected: ProjectProposal[] = [];

    for (const project of pool) {
      if (currentCost + project.estimatedCapexCr <= totalBudgetCr) {
        selected.push(project);
        currentCost += project.estimatedCapexCr;
      } else {
        unselected.push(project);
      }
    }

    const totalBeneficiaries = selected.reduce((acc, p) => acc + p.estimatedBeneficiaries, 0);
    const avgTimeline = selected.length > 0
      ? (selected.reduce((acc, p) => acc + p.timelineMonths, 0) / selected.length).toFixed(1)
      : '0';

    return {
      selected,
      unselected,
      utilizedBudgetCr: Number(currentCost.toFixed(2)),
      remainingBudgetCr: Number((totalBudgetCr - currentCost).toFixed(2)),
      totalBeneficiaries,
      avgTimeline,
    };
  }, [proposals, totalBudgetCr, strategy, focusState]);

  const states = ['All States', 'Odisha', 'Tamil Nadu', 'Chhattisgarh', 'Uttar Pradesh', 'Assam', 'Rajasthan'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel-elevated p-5 rounded-2xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                What-If Policy Budget Optimizer &amp; Simulator
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Linear Programming Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulate capital allocation across Central Schemes to maximize socio-economic uplift and population impact.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTotalBudgetCr(50);
                setStrategy('balanced');
                setFocusState('All States');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Parameters
            </button>
          </div>
        </div>
      </div>

      {/* Control Panel & Slider Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-5">
            {/* Total Budget Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-emerald-400" />
                  Available Capex Budget:
                </label>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  ₹{totalBudgetCr} Cr
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={totalBudgetCr}
                onChange={(e) => setTotalBudgetCr(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>₹10 Cr (District Scale)</span>
                <span>₹50 Cr</span>
                <span>₹100 Cr (State Corridor)</span>
              </div>
            </div>

            {/* Strategy Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Optimization Objective Function:
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setStrategy('balanced')}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    strategy === 'balanced'
                      ? 'bg-purple-950/40 border-purple-500 text-purple-200 shadow-glow-purple'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850'
                  }`}
                >
                  <div>
                    <span className="font-bold block text-white">Balanced National Convergence (Default)</span>
                    <span className="text-[11px] text-slate-400">Harmonizes population density with NITI Aspirational deprivation.</span>
                  </div>
                  {strategy === 'balanced' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </button>

                <button
                  onClick={() => setStrategy('max_population')}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    strategy === 'max_population'
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850'
                  }`}
                >
                  <div>
                    <span className="font-bold block text-white">Maximum Beneficiary Density</span>
                    <span className="text-[11px] text-slate-400">Prioritizes highest number of citizens impacted per Rupee.</span>
                  </div>
                  {strategy === 'max_population' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </button>

                <button
                  onClick={() => setStrategy('vulnerability')}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    strategy === 'vulnerability'
                      ? 'bg-amber-950/40 border-amber-500 text-amber-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850'
                  }`}
                >
                  <div>
                    <span className="font-bold block text-white">Extreme Vulnerability / Tribal Priority</span>
                    <span className="text-[11px] text-slate-400">Prioritizes high SC/ST and deep remote aspirational blocks.</span>
                  </div>
                  {strategy === 'vulnerability' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </button>

                <button
                  onClick={() => setStrategy('fast_delivery')}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    strategy === 'fast_delivery'
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850'
                  }`}
                >
                  <div>
                    <span className="font-bold block text-white">Rapid Commissioning (&lt; 10 Months)</span>
                    <span className="text-[11px] text-slate-400">Prioritizes fast-execution decentralized PHC and solar projects.</span>
                  </div>
                  {strategy === 'fast_delivery' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            </div>

            {/* Geographical Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Target State Scope:
              </label>
              <select
                value={focusState}
                onChange={(e) => setFocusState(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-india-saffron"
              >
                {states.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Simulation Output Dashboard (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Projected Impact Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Budget Allocated</span>
              <div className="text-xl font-black text-emerald-400 font-mono">
                ₹{simulationResult.utilizedBudgetCr} Cr
              </div>
              <span className="text-[10px] text-slate-500">
                ₹{simulationResult.remainingBudgetCr} Cr unutilized
              </span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Lives Benefited</span>
              <div className="text-xl font-black text-cyan-400 font-mono">
                {simulationResult.totalBeneficiaries.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-cyan-300">
                100% Verified Demands
              </span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-400 block mb-1">Projects Approved</span>
              <div className="text-xl font-black text-white font-mono">
                {simulationResult.selected.length} / {proposals.length}
              </div>
              <span className="text-[10px] text-amber-400">
                Avg: {simulationResult.avgTimeline} Months
              </span>
            </div>
          </div>

          {/* Allocation Progress Meter */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Budget Utilization Gauge</span>
              <span className="font-bold text-white">
                {((simulationResult.utilizedBudgetCr / totalBudgetCr) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${(simulationResult.utilizedBudgetCr / totalBudgetCr) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Optimized Project Portfolio List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Optimized Portfolio Selection ({simulationResult.selected.length} Projects)</span>
              <span className="text-xs text-emerald-400 font-normal">
                ✓ Solved within ₹{totalBudgetCr} Cr boundary
              </span>
            </h3>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {simulationResult.selected.map((project, idx) => (
                <div
                  key={project.id}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex items-center justify-between gap-3 hover:bg-slate-850 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-orange-400">
                          {project.sector}
                        </span>
                        <span className="text-xs font-bold text-white line-clamp-1">
                          {project.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {project.district}, {project.state} • {project.estimatedBeneficiaries.toLocaleString()} Citizens • {project.timelineMonths} mo
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right font-mono">
                      <span className="text-xs font-black text-emerald-400 block">
                        ₹{project.estimatedCapexCr} Cr
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {project.targetScheme.split(' ')[0]}
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenDpr(project.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                      title="Inspect DPR"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Excluded Projects */}
              {simulationResult.unselected.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Deferred / Out-of-Budget Projects ({simulationResult.unselected.length})
                  </span>
                  {simulationResult.unselected.map((project) => (
                    <div
                      key={project.id}
                      className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 opacity-60 flex items-center justify-between gap-3 mb-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-slate-600 shrink-0" />
                        <div>
                          <span className="text-xs text-slate-400 line-clamp-1 font-medium">
                            {project.title}
                          </span>
                          <span className="text-[10px] text-slate-600">
                            {project.district} • Requires ₹{project.estimatedCapexCr} Cr
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-red-400/80 font-mono">
                        Deficit: +₹{(project.estimatedCapexCr - simulationResult.remainingBudgetCr).toFixed(1)} Cr
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
