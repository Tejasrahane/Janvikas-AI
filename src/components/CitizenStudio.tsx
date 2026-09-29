import React, { useState } from 'react';
import { CitizenRequest } from '../types';
import { 
  Mic, 
  MicOff, 
  MessageSquare, 
  Send, 
  Camera, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Radio, 
  Volume2, 
  Clock, 
  Search, 
  FileText, 
  ShieldCheck,
  Smartphone,
  ChevronRight,
  ArrowRight,
  Eye,
  Layers,
  Cloud,
  Cpu,
  Zap,
  Globe2
} from 'lucide-react';

interface CitizenStudioProps {
  onNewRequestLogged: (req: CitizenRequest) => void;
  requests: CitizenRequest[];
}

export const CitizenStudio: React.FC<CitizenStudioProps> = ({
  onNewRequestLogged,
  requests,
}) => {
  const [activeChannel, setActiveChannel] = useState<'voice' | 'vision' | 'whatsapp' | 'tracker'>('voice');

  // Voice Ingestion State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [isProcessingVoice, setIsProcessingVoice] = useState<boolean>(false);
  const [processedVoiceOutput, setProcessedVoiceOutput] = useState<CitizenRequest | null>(null);

  // Vision & Multimodal State
  const [selectedPhotoPreset, setSelectedPhotoPreset] = useState<number>(0);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState<boolean>(false);
  const [analyzedPhotoResult, setAnalyzedPhotoResult] = useState<{
    damageType: string;
    severityScore: number;
    detectedAnomalies: string[];
    recommendedSorItem: string;
    estimatedCostCr: number;
    location: string;
    confidence: number;
  } | null>(null);

  // WhatsApp Simulation State
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'bot'; text: string; time: string; image?: string; isLocation?: boolean }[]>([
    { sender: 'bot', text: '🙏 Namaste! Welcome to JanVikas AI Civic Assistant. You can send a voice note, message in any Indian language, or drop your GPS location / photos to report an infrastructure need.', time: '11:30 AM' }
  ]);
  const [inputChatText, setInputChatText] = useState<string>('');

  // Tracker State
  const [searchTicketId, setSearchTicketId] = useState<string>('JV-2026-OR-8921');
  const [trackedRequest, setTrackedRequest] = useState<CitizenRequest | null>(requests[0]);

  const photoDamagePresets = [
    {
      title: '🌊 Washed Away River Culvert Pier',
      category: 'Rural Roads & Bridges' as const,
      location: 'Budhabalanga River Bank, Badasahi Block, Mayurbhanj, Odisha',
      damage: 'Substructure Scour & Abutment Collapse',
      severity: 96,
      anomalies: ['Complete Pier Foundation Undermining', 'RCC Deck Slab Shear Cracks', 'Monsoon Flash Flood Washout'],
      sorItem: 'CPWD DSR 2023 Item 14.3.2: 2-Lane High-Level RCC Bridge (60m Span)',
      costCr: 4.85,
      confidence: 98.4,
      imagePlaceholder: 'Bridge Foundation Scour Visual Inspection (Mayurbhanj)',
    },
    {
      title: '🚰 Fluoride-Corroded Pipeline & Dry Standpost',
      category: 'Water & Sanitation' as const,
      location: 'Pennagaram Gram Panchayat, Dharmapuri, Tamil Nadu',
      damage: 'Severe Pipeline Calcification & Toxic Borewell Contamination',
      severity: 92,
      anomalies: ['High Fluoride Mineral Incrustation', 'Dry Aquifer Salinity Intrusion', 'Pump Motor Burnout'],
      sorItem: 'JJM SOR Item 8.1.1: 50 KLD Reverse Osmosis Water Purification Plant + Piped Distribution',
      costCr: 2.10,
      confidence: 97.1,
      imagePlaceholder: 'Corroded Drinking Water Main & Borewell Analysis (Dharmapuri)',
    },
    {
      title: '🏥 Storm Damaged PHC Maternity Ward Roof',
      category: 'Health & PHC' as const,
      location: 'Darbha Block Health Center, Bastar, Chhattisgarh',
      damage: 'Roof Structural Collapse & Power Distribution Grid Failure',
      severity: 89,
      anomalies: ['CGI Sheet Blowoff', 'Cold-Chain Refrigerator Blackout', 'Internal Seepage'],
      sorItem: 'PM-ABHIM SOR Item 6.4.1: 10kW Rooftop Solarization with Lithium ESS + Structural Waterproofing',
      costCr: 1.45,
      confidence: 95.8,
      imagePlaceholder: 'PHC Maternity Ward Roof Assessment (Bastar)',
    },
    {
      title: '⚡ Collapsed 11kV Agricultural Feeder Pole',
      category: 'Power & Solar' as const,
      location: 'Dalgaon Rural Feeder, Darrang, Assam',
      damage: 'High-Tension Line Grounding & Transformer Overload',
      severity: 85,
      anomalies: ['Conductor Snapping', 'Substation Tripping', '3 Village Blackout'],
      sorItem: 'RDSS SOR Item 12.2.4: 11kV Underground Armored XLPE Cable + Distribution Transformer',
      costCr: 0.95,
      confidence: 96.5,
      imagePlaceholder: 'Feeder Line Snapping Assessment (Darrang)',
    },
  ];

  const handleRunPhotoAnalysis = (index: number) => {
    setSelectedPhotoPreset(index);
    setIsAnalyzingPhoto(true);
    setAnalyzedPhotoResult(null);

    const preset = photoDamagePresets[index];

    setTimeout(() => {
      setIsAnalyzingPhoto(false);
      setAnalyzedPhotoResult({
        damageType: preset.damage,
        severityScore: preset.severity,
        detectedAnomalies: preset.anomalies,
        recommendedSorItem: preset.sorItem,
        estimatedCostCr: preset.costCr,
        location: preset.location,
        confidence: preset.confidence,
      });

      const newReq: CitizenRequest = {
        id: `photo-req-${Date.now()}`,
        ticketId: `JV-2026-VIS-${Math.floor(1000 + Math.random() * 9000)}`,
        channel: 'whatsapp',
        language: 'Hindi / English',
        languageNative: 'Photo / Gemini Vision',
        originalText: `[Photo Analysis]: ${preset.title} - ${preset.damage}`,
        translatedText: `Ground Photo Upload: Detected ${preset.damage} with ${preset.severity}% urgency at ${preset.location}.`,
        category: preset.category,
        subcategory: preset.damage,
        urgency: preset.severity >= 90 ? 'CRITICAL' : 'HIGH',
        severityScore: preset.severity,
        sentiment: 'Urgent',
        location: {
          state: preset.location.split(', ').slice(-1)[0] || 'Odisha',
          district: preset.location.split(', ').slice(-2)[0] || 'Mayurbhanj',
          block: preset.location.split(', ')[1] || 'Badasahi',
          gramPanchayat: preset.location.split(', ')[0] || 'Pratappur',
          pincode: '757017',
          lat: 21.9421,
          lng: 86.7845,
        },
        audioDurationSeconds: 0,
        status: 'Logged',
        timestamp: 'Just now',
      };
      onNewRequestLogged(newReq);
    }, 1500);
  };

  const voicePresets = [
    {
      lang: 'Odia (ଓଡ଼ିଆ)',
      state: 'Odisha',
      district: 'Mayurbhanj',
      block: 'Badasahi',
      text: 'ବୁଢ଼ାବଳଙ୍ଗ ନଦୀ ଉପରେ କୌଣସି ପୋଲ ନଥିବାରୁ ବର୍ଷା ଦିନେ ୧୨ଟି ଗାଁ ସମ୍ପୂର୍ଣ୍ଣ ବିଚ୍ଛିନ୍ନ ହୋଇଯାଏ। ଆମ୍ବୁଲାନ୍ସ ଆସିପାରୁନାହିଁ।',
      translation: 'Because there is no bridge over the Budhabalanga river, 12 villages get completely cut off during the monsoon.',
      category: 'Rural Roads & Bridges' as const,
      urgency: 'CRITICAL' as const,
      severity: 96,
    },
    {
      lang: 'Tamil (தமிழ்)',
      state: 'Tamil Nadu',
      district: 'Dharmapuri',
      block: 'Pennagaram',
      text: 'எங்கள் கிராமத்தில் உள்ள 4 போர்வெல்களிலும் அதிக அளவு புளோரைடு உள்ளது. ஒகேனக்கல் குடிநீர் குழாய் இணைப்பு உடனடியாக தேவை.',
      translation: 'All 4 borewells in our village have severe fluoride contamination. We urgently need a piped drinking water connection from Hogenakkal.',
      category: 'Water & Sanitation' as const,
      urgency: 'CRITICAL' as const,
      severity: 92,
    },
    {
      lang: 'Hindi / Bastaria (हिंदी)',
      state: 'Chhattisgarh',
      district: 'Bastar',
      block: 'Darbha',
      text: 'प्राथमिक स्वास्थ्य केंद्र में बिजली नहीं रहती, वैक्सीन खराब होती है और रात में टार्च से डिलीवरी करानी पड़ती है। 10kW सोलर सिस्टम चाहिए।',
      translation: 'PHC has no electricity, vaccines spoil, and deliveries happen under torchlight. We need a 10kW solar system.',
      category: 'Health & PHC' as const,
      urgency: 'HIGH' as const,
      severity: 89,
    },
    {
      lang: 'Assamese (অসমীয়া)',
      state: 'Assam',
      district: 'Darrang',
      block: 'Dalgaon',
      text: 'মঙ্গলদৈ ব্লকত দলগাঁও সংযোগী মূল পথটো বাৰিষাত সম্পূর্ণ বোকাৰে ভৰি পৰে। ৫ কিলোমিটাৰ পকী ৰাস্তা অতি প্ৰয়োজনীয়।',
      translation: 'The main road connecting Dalgaon turns into mud during rains. 5 km paved road is urgently needed.',
      category: 'Rural Roads & Bridges' as const,
      urgency: 'HIGH' as const,
      severity: 84,
    }
  ];

  const handleStartVoice = () => {
    setIsRecording(true);
    setRecordingTime(0);
    const interval = setInterval(() => {
      setRecordingTime((t) => {
        if (t >= 5) {
          clearInterval(interval);
          handleStopVoice();
          return 5;
        }
        return t + 1;
      });
    }, 1000);
  };

  const handleStopVoice = () => {
    setIsRecording(false);
    setIsProcessingVoice(true);

    const preset = voicePresets[selectedPreset];

    setTimeout(() => {
      setIsProcessingVoice(false);
      const newReq: CitizenRequest = {
        id: `req-${Date.now()}`,
        ticketId: `JV-2026-${preset.state.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        channel: 'voice',
        language: preset.lang.split(' ')[0],
        languageNative: preset.lang,
        originalText: preset.text,
        translatedText: preset.translation,
        category: preset.category,
        subcategory: 'Automated Extraction via Bhashini',
        urgency: preset.urgency,
        severityScore: preset.severity,
        sentiment: 'Urgent',
        location: {
          state: preset.state,
          district: preset.district,
          block: preset.block,
          gramPanchayat: 'Pratappur',
          pincode: '757017',
          lat: 21.9421,
          lng: 86.7845,
        },
        audioDurationSeconds: 14,
        status: 'Logged',
        timestamp: 'Just now',
      };

      setProcessedVoiceOutput(newReq);
      onNewRequestLogged(newReq);
    }, 1800);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChatText.trim()) return;

    const userText = inputChatText;
    setInputChatText('');

    const newMsgs = [...chatMessages, { sender: 'user' as const, text: userText, time: 'Just now' }];
    setChatMessages(newMsgs);

    setTimeout(() => {
      const ticket = `JV-2026-IN-${Math.floor(1000 + Math.random() * 9000)}`;
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot' as const,
          text: `✅ Request received and registered under Ticket ID: *${ticket}*.\n\n🔍 AI Categorized: *Rural Roads & Bridges*\n📍 Location Tagged: Mayurbhanj, Odisha\n⚡ Urgency: *HIGH*\n\nYour request has been grouped with 14 other citizen inputs in your Gram Panchayat for upcoming PMGSY planning.`,
          time: 'Just now'
        }
      ]);
    }, 1000);
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = requests.find(r => r.ticketId.toLowerCase().includes(searchTicketId.toLowerCase())) || requests[0];
    setTrackedRequest(found);
  };

  return (
    <div className="space-y-6">
      {/* Google Cloud Tools & Tech Architecture Banner */}
      <div className="glass-panel-elevated p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                Google Cloud AI &amp; Omnichannel Ingestion Pipeline
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  Full Stack Active
                </span>
              </h4>
              <p className="text-xs text-slate-400">
                Integrating Gemini 1.5 Pro, Vertex AI Multimodal Vision, Bhashini ASR, and BigQuery Spatial GIS.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-[11px] font-medium">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Vertex AI Gemini
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-purple-300 flex items-center gap-1">
              <Eye className="w-3 h-3 text-purple-400" /> Gemini Vision
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 flex items-center gap-1">
              <Globe2 className="w-3 h-3 text-amber-400" /> Bhashini 22 Langs
            </span>
          </div>
        </div>
      </div>

      {/* Channel Switcher */}
      <div className="flex items-center justify-center gap-2">
        <div className="glass-panel-elevated p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1.5 flex-wrap justify-center">
          <button
            onClick={() => setActiveChannel('voice')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeChannel === 'voice'
                ? 'bg-gradient-to-r from-india-saffron to-amber-600 text-white shadow-glow-saffron'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Voice / IVR (Bhashini AI)</span>
          </button>

          <button
            onClick={() => setActiveChannel('vision')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeChannel === 'vision'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>📸 Multimodal Photo Scanner (Gemini Vision)</span>
          </button>

          <button
            onClick={() => setActiveChannel('whatsapp')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeChannel === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-glow-emerald'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp / Chatbot</span>
          </button>

          <button
            onClick={() => setActiveChannel('tracker')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeChannel === 'tracker'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Track My Request</span>
          </button>
        </div>
      </div>

      {/* Multimodal Vision Mode */}
      {activeChannel === 'vision' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          {/* Photo Selector (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-panel-elevated p-6 rounded-2xl border border-slate-800 space-y-4">
              <div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Google Vertex AI Vision &amp; Gemini Multimodal
                </span>
                <h3 className="text-lg font-black text-white mt-2">
                  Citizen Infrastructure Damage Inspector
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Citizens and field engineers upload ground photographs of washed-out culverts, cracked canal linings, or broken transformers for zero-touch severity estimation.
                </p>
              </div>

              {/* Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Ground Inspection Photo Preset:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {photoDamagePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRunPhotoAnalysis(idx)}
                      className={`p-3 rounded-xl text-left border text-xs transition-all ${
                        selectedPhotoPreset === idx
                          ? 'bg-slate-800 border-purple-500 text-white shadow-sm ring-2 ring-purple-500/20'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850'
                      }`}
                    >
                      <span className="font-bold block text-purple-300 mb-1">{preset.title}</span>
                      <span className="text-[11px] text-slate-400 block">{preset.category}</span>
                      <span className="text-[10px] text-amber-400 font-mono mt-1 block">Severity: {preset.severity}%</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Ground Photo Preview */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden text-center">
                <div className="h-40 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center p-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <Camera className="w-10 h-10 text-purple-400 mb-2" />
                  <span className="text-xs font-bold text-slate-200 z-10">
                    {photoDamagePresets[selectedPhotoPreset].imagePlaceholder}
                  </span>
                  <span className="text-[11px] text-slate-400 z-10 mt-1 font-mono">
                    📍 {photoDamagePresets[selectedPhotoPreset].location}
                  </span>

                  {/* Bounding Box HUD Graphic */}
                  <div className="absolute top-4 left-6 right-6 bottom-4 border-2 border-dashed border-purple-400/60 rounded pointer-events-none flex items-start justify-end p-1">
                    <span className="bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      ANOMALY DETECTED ({photoDamagePresets[selectedPhotoPreset].confidence}%)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRunPhotoAnalysis(selectedPhotoPreset)}
                  disabled={isAnalyzingPhoto}
                  className="w-full mt-4 py-2.5 px-4 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple transition-all text-xs flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>{isAnalyzingPhoto ? 'Analyzing via Gemini Multimodal...' : 'Run Vision AI Analysis'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Vision AI Output (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-panel-elevated p-6 rounded-2xl border border-slate-800 space-y-4 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Vertex AI Vision Analysis Report
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    Confidence: 98.4%
                  </span>
                </div>

                {isAnalyzingPhoto ? (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mx-auto"></div>
                    <p className="text-xs text-slate-300 font-medium">
                      Running Gemini 1.5 Pro Multimodal Vision Embedding...
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Extracting structural deformation, crack width, and CPWD SOR rate schedule match.
                    </p>
                  </div>
                ) : analyzedPhotoResult ? (
                  <div className="space-y-4 pt-3">
                    <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300">
                          Detected Structural Failure:
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                          Urgency: {analyzedPhotoResult.severityScore}%
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {analyzedPhotoResult.damageType}
                      </h4>
                      <p className="text-xs text-slate-400">
                        📍 {analyzedPhotoResult.location}
                      </p>
                    </div>

                    {/* Detected Anomaly Tags */}
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Vision Identified Anomalies:
                      </span>
                      <div className="space-y-1.5">
                        {analyzedPhotoResult.detectedAnomalies.map((ano, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{ano}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Auto-Mapped CPWD SOR Repair Item */}
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block">
                        Auto-Matched CPWD Schedule of Rates (SOR):
                      </span>
                      <p className="text-xs font-medium text-slate-200">
                        {analyzedPhotoResult.recommendedSorItem}
                      </p>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800 mt-2">
                        <span className="text-slate-400">Est. Repair Cost:</span>
                        <span className="font-bold text-emerald-400">₹{analyzedPhotoResult.estimatedCostCr} Cr</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center text-xs text-slate-400 space-y-2">
                    <Eye className="w-8 h-8 text-slate-600 mx-auto" />
                    <p>Select any ground photo preset on the left and click "Run Vision AI Analysis".</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice Mode */}
      {activeChannel === 'voice' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Voice Input & Recording Studio (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-panel-elevated p-6 rounded-2xl border border-slate-800 text-center space-y-5">
              <div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Government of India • Bhashini ASR Pipeline
                </span>
                <h3 className="text-lg font-black text-white mt-2">
                  Multilingual Voice Intake Simulator
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Citizens can speak in any of 22 Scheduled Indian languages or local dialects over missed calls or IVR.
                </p>
              </div>

              {/* Language Preset Selector */}
              <div className="text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select Regional Voice Preset:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {voicePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPreset(idx)}
                      className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                        selectedPreset === idx
                          ? 'bg-slate-800 border-india-saffron text-white shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850'
                      }`}
                    >
                      <span className="font-bold block text-amber-300">{preset.lang}</span>
                      <span className="text-[11px] text-slate-400">{preset.district}, {preset.state}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Script Preview */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Simulated Citizen Audio Transcript:
                </span>
                <p className="text-sm font-sans text-amber-200 leading-relaxed italic">
                  "{voicePresets[selectedPreset].text}"
                </p>
              </div>

              {/* Mic Record Button */}
              <div className="py-3 flex flex-col items-center justify-center gap-3">
                <button
                  onClick={isRecording ? handleStopVoice : handleStartVoice}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-500/30'
                      : 'bg-gradient-to-tr from-india-saffron to-amber-500 text-white hover:scale-105 shadow-glow-saffron'
                  }`}
                >
                  {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>

                <div className="text-xs font-mono text-slate-300">
                  {isRecording ? (
                    <span className="text-red-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                      Recording... {recordingTime}s / 5s
                    </span>
                  ) : (
                    <span>Click to Simulate 5-Second Voice Ingestion</span>
                  )}
                </div>

                {/* Animated Audio Waveform */}
                <div className="flex items-center gap-1 w-48 h-8">
                  {[20, 50, 90, 40, 75, 100, 60, 85, 30, 95, 70, 45, 80, 30].map((val, idx) => (
                    <span
                      key={idx}
                      className={`flex-1 rounded-full transition-all duration-200 ${
                        isRecording ? 'bg-india-saffron animate-pulse' : 'bg-slate-800'
                      }`}
                      style={{ height: isRecording ? `${val}%` : '20%' }}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Extraction & Pipeline Output (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-panel-elevated p-6 rounded-2xl border border-slate-800 space-y-4 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Bhashini NLU &amp; Entity Extractor
                  </h3>
                  <span className="text-xs font-mono text-cyan-400">
                    Latency: ~340ms
                  </span>
                </div>

                {isProcessingVoice ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-india-saffron border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs text-slate-300 font-medium">
                      Transcribing Indic Audio &amp; Extracting Administrative LGD Nodes...
                    </p>
                  </div>
                ) : processedVoiceOutput ? (
                  <div className="space-y-4 mt-4 animate-fadeIn">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                        English Normalized Intent:
                      </span>
                      <p className="text-xs font-medium text-slate-100 leading-relaxed">
                        {processedVoiceOutput.translatedText}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Extracted Sector:</span>
                        <span className="font-bold text-orange-400">{processedVoiceOutput.category}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Severity Score:</span>
                        <span className="font-bold text-red-400">{processedVoiceOutput.severityScore}/100</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">LGD Location Node:</span>
                        <span className="font-bold text-white">
                          {processedVoiceOutput.location.block}, {processedVoiceOutput.location.district}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Assigned Ticket ID:</span>
                        <span className="font-bold text-cyan-400 font-mono">{processedVoiceOutput.ticketId}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Clustered into H3 Hexagon Hotspot &amp; synced with Ministry Demand Ledger.</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center text-slate-500 text-xs">
                    Press "Simulate Voice Ingestion" on the left to see live real-time speech translation and entity parsing.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Mode */}
      {activeChannel === 'whatsapp' && (
        <div className="max-w-md mx-auto">
          <div className="glass-panel-elevated rounded-3xl border-2 border-slate-700 overflow-hidden shadow-2xl">
            {/* Phone Top Notch & Header */}
            <div className="bg-emerald-800 px-4 py-3 flex items-center justify-between text-white border-b border-emerald-700">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-950 flex items-center justify-center font-bold text-sm">
                  🇮🇳
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight">JanVikas Civic Bot</h4>
                  <span className="text-[10px] text-emerald-200">Official DPG Verified Account</span>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-200">24x7 AI</span>
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-3 bg-[#081018] min-h-[380px] max-h-[420px] overflow-y-auto">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-500 px-1 mt-0.5">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChat} className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type in any language (e.g. Hindi, Tamil, Hinglish)..."
                value={inputChatText}
                onChange={(e) => setInputChatText(e.target.value)}
                className="flex-1 bg-slate-950 text-white text-xs px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all shadow-md shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Request Tracker Mode */}
      {activeChannel === 'tracker' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="glass-panel-elevated p-6 rounded-2xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2">
              Track Citizen Infrastructure Request
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your 12-digit ticket reference ID to see live administrative progress and DPR sanction milestone.
            </p>

            <form onSubmit={handleTrackSearch} className="flex gap-2">
              <input
                type="text"
                value={searchTicketId}
                onChange={(e) => setSearchTicketId(e.target.value)}
                placeholder="e.g. JV-2026-OR-8921"
                className="flex-1 bg-slate-900 border border-slate-700 text-white font-mono text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:border-india-saffron"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-india-saffron hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-glow-saffron transition-all"
              >
                Track Status
              </button>
            </form>
          </div>

          {trackedRequest && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold block">
                    {trackedRequest.ticketId}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    {trackedRequest.category} ({trackedRequest.subcategory})
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Status: {trackedRequest.status}
                </span>
              </div>

              {/* Progress Stepper */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>1. Ingested &amp; Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>2. H3 Cluster Aggregated</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-400">
                    <Sparkles className="w-4 h-4" />
                    <span>3. DPR Drafted</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>4. Sanction &amp; Works</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="w-3/4 h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-india-saffron rounded-full"></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                <span className="text-slate-400 font-semibold block mb-1">Your Submitted Voice Summary:</span>
                "{trackedRequest.translatedText}"
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
