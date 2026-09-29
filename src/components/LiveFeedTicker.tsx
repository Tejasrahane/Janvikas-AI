import React, { useState } from 'react';
import type { CitizenRequest } from '../types';
import { 
  Mic, 
  MessageSquare, 
  Smartphone, 
  Globe, 
  Play, 
  Pause, 
  MapPin,
  Clock
} from 'lucide-react';

interface LiveFeedTickerProps {
  requests: CitizenRequest[];
  onSelectRequest: (request: CitizenRequest) => void;
}

export const LiveFeedTicker: React.FC<LiveFeedTickerProps> = ({
  requests,
  onSelectRequest,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const togglePlay = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      // Simulate audio play for 4 seconds
      setTimeout(() => {
        setPlayingId((curr) => (curr === id ? null : curr));
      }, 4000);
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'voice':
        return <Mic className="w-3.5 h-3.5 text-orange-400" />;
      case 'whatsapp':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
      case 'sms':
        return <Smartphone className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
            HIGH URGENCY
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
            {urgency}
          </span>
        );
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <h3 className="text-sm font-bold text-white tracking-wide">
            Live Multilingual Ingestion Stream
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
            Bhashini ASR &amp; NLU Pipeline
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          {requests.length} Recent Requests
        </span>
      </div>

      {/* Feed List */}
      <div className="space-y-3 overflow-y-auto max-h-[520px] pr-1.5">
        {requests.map((req) => {
          const isPlaying = playingId === req.id;
          return (
            <div
              key={req.id}
              onClick={() => onSelectRequest(req)}
              className="group p-3 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-india-saffron/40 transition-all cursor-pointer shadow-sm hover:shadow-glow-saffron/20"
            >
              {/* Meta row */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-slate-800 border border-slate-700">
                    {getChannelIcon(req.channel)}
                  </div>
                  <span className="text-xs font-semibold text-white">
                    {req.languageNative} ({req.language})
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {req.ticketId}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {getUrgencyBadge(req.urgency)}
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {req.timestamp}
                  </span>
                </div>
              </div>

              {/* Original Native Text */}
              <div className="mb-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <p className="text-xs text-amber-200/90 font-sans italic line-clamp-2 leading-relaxed">
                  "{req.originalText}"
                </p>
              </div>

              {/* English AI Translation & Normalized Intent */}
              <div className="mb-2.5">
                <p className="text-xs text-slate-300 leading-snug font-normal line-clamp-2">
                  <span className="text-india-saffron font-medium mr-1 text-[11px] uppercase tracking-wider">
                    AI Translation:
                  </span>
                  {req.translatedText}
                </p>
              </div>

              {/* Audio Waveform Bar (If voice) */}
              {req.channel === 'voice' && (
                <div className="mb-2.5 flex items-center gap-2 px-2 py-1.5 rounded-lg bg-orange-950/20 border border-orange-500/20">
                  <button
                    onClick={(e) => togglePlay(e, req.id)}
                    className="w-6 h-6 rounded-full bg-india-saffron hover:bg-orange-500 text-white flex items-center justify-center transition-all shadow-sm"
                  >
                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                  </button>

                  {/* Waveform Bars animation */}
                  <div className="flex-1 flex items-center gap-1 h-4">
                    {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 30, 75, 60, 85].map((h, i) => (
                      <span
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          isPlaying ? 'bg-orange-400 animate-pulse' : 'bg-slate-700'
                        }`}
                        style={{ height: isPlaying ? `${h}%` : '30%' }}
                      ></span>
                    ))}
                  </div>

                  <span className="text-[10px] font-mono text-orange-300 font-semibold">
                    {req.audioDurationSeconds}s (Audio)
                  </span>
                </div>
              )}

              {/* Footer row: Location & Sector Tag */}
              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800/60">
                <div className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3 h-3 text-india-saffron" />
                  <span>
                    {req.location.gramPanchayat} GP, {req.location.block}, {req.location.district}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-medium border border-slate-700">
                    {req.category}
                  </span>
                  <span className="text-india-saffron group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
