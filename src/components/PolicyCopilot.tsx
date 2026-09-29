import React, { useState } from 'react';
import type { DistrictMetric, DemandHotspot, ProjectProposal } from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';

interface PolicyCopilotProps {
  districts: DistrictMetric[];
  hotspots: DemandHotspot[];
  proposals: ProjectProposal[];
  onOpenDpr: (id: string) => void;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  dataCard?: {
    title: string;
    metrics: { label: string; value: string }[];
    actionDprId?: string;
  };
}

export const PolicyCopilot: React.FC<PolicyCopilotProps> = ({
  districts: _districts,
  hotspots: _hotspots,
  proposals: _proposals,
  onOpenDpr,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `🇮🇳 **JanVikas AI Policy Copilot Online**\n\nI am connected to the live National Demand Ledger, PM GatiShakti GIS layers, NITI Aayog Aspirational District indicators, and Central Scheme budgets. How can I assist your planning review today?`,
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const samplePrompts = [
    'Show top Aspirational Districts with severe road connectivity deficits (>75%)',
    'Compare drinking water distress: Dharmapuri (TN) vs Barmer (RJ)',
    'Generate an executive summary brief for Mayurbhanj Budhabalanga bridge sanction',
    'What is the remaining unallocated budget under Jal Jeevan Mission for FY 2026-27?'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    setInputText('');
    const newMessages: Message[] = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let response: Message;

      const lower = query.toLowerCase();
      if (lower.includes('road') || lower.includes('aspirational')) {
        response = {
          sender: 'assistant',
          text: `📊 **Analysis of High-Deficit Aspirational Districts (Roads Sector)**\n\nCross-referencing PMGSY-IV GIS layers and 2026 citizen intake, the following 3 districts exhibit the highest unpaved connectivity vulnerability:`,
          dataCard: {
            title: 'Top Road-Deficit Aspirational Districts',
            metrics: [
              { label: 'Bastar (CG)', value: '85% Deficit • Rank #4' },
              { label: 'Darrang (AS)', value: '82% Deficit • Rank #16' },
              { label: 'Mayurbhanj (OR)', value: '78% Deficit • Rank #12' },
            ],
            actionDprId: 'dpr-1'
          }
        };
      } else if (lower.includes('water') || lower.includes('dharmapuri') || lower.includes('barmer')) {
        response = {
          sender: 'assistant',
          text: `💧 **Comparative Water Vulnerability Analysis**\n\n• **Dharmapuri (Tamil Nadu)**: Severe groundwater fluoride contamination (>3.8 mg/L). 418 citizen complaints clustered in Pennagaram block. Requires surface water extension from Hogenakkal grid.\n\n• **Barmer (Rajasthan)**: Arid water table depletion (94% Water Stress Index). Needs deep solar-powered desalinization and pipeline feeder.`,
          dataCard: {
            title: 'Pennagaram Fluoride Piped Water Project',
            metrics: [
              { label: 'Beneficiaries', value: '36,200 Citizens' },
              { label: 'Capex Required', value: '₹14.80 Cr (JJM 50:50)' },
              { label: 'Fluoride Target', value: '<0.8 mg/L Treated' }
            ],
            actionDprId: 'dpr-2'
          }
        };
      } else if (lower.includes('mayurbhanj') || lower.includes('bridge')) {
        response = {
          sender: 'assistant',
          text: `🌉 **Cabinet Briefing Note: Budhabalanga River Bridge (Mayurbhanj, Odisha)**\n\n• **Problem**: 12 tribal villages completely cut off during monsoon rains (July-Oct).\n• **Solution**: 240m 6-span submersible-proof RCC bridge with 4.2 km approach roads.\n• **Funding Model**: ₹18.40 Cr total (60% PMGSY-IV Central Share + 40% State RIDF).\n• **Status**: Sanctioned by MoRD Empowered Committee.`,
          dataCard: {
            title: 'Budhabalanga Bridge DPR #001',
            metrics: [
              { label: 'Travel Time Saved', value: '55 mins' },
              { label: 'Beneficiary Habitations', value: '12 Tribal Villages' },
              { label: 'Completion Timeline', value: '14 Months' }
            ],
            actionDprId: 'dpr-1'
          }
        };
      } else {
        response = {
          sender: 'assistant',
          text: `✅ Synthesized data across 148,920 citizen requests and 6 central flagship schemes. Found 1,420 active H3 demand clusters nationwide with ₹4,850 Cr in prioritized DPR pipelines.`
        };
      }

      setMessages([...newMessages, response]);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="glass-panel-elevated p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              JanVikas AI Policy Copilot
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Connected to NDAP &amp; PM GatiShakti
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Natural language intelligence for Central Ministries, PMO, and District Collectors.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 hover:border-purple-500/40 whitespace-nowrap transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-4 space-y-4 min-h-[440px] max-h-[500px] overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-india-saffron to-amber-600 text-white rounded-tr-none font-medium shadow-glow-saffron'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Attached Data Card if available */}
              {msg.dataCard && (
                <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <span className="font-bold text-amber-300 block mb-2">
                    {msg.dataCard.title}
                  </span>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {msg.dataCard.metrics.map((m, mi) => (
                      <div key={mi} className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">{m.label}</span>
                        <span className="font-bold text-cyan-300 text-xs">{m.value}</span>
                      </div>
                    ))}
                  </div>
                  {msg.dataCard.actionDprId && (
                    <button
                      onClick={() => onOpenDpr(msg.dataCard!.actionDprId!)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 transition-all"
                    >
                      <span>Open Associated AI DPR</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium p-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></div>
            <span>Analyzing national spatial indices and DPR schemas...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask anything (e.g. 'Show Mayurbhanj bridge cost breakdown' or 'Identify water hotspots')..."
          className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-glow-purple flex items-center gap-2 transition-all"
        >
          <Send className="w-4 h-4" />
          <span>Ask Copilot</span>
        </button>
      </form>
    </div>
  );
};
