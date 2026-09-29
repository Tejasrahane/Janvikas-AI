import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { DemandHotspot, DistrictMetric, RequestCategory } from '../types';
import { 
  Layers, 
  FileCheck, 
  MapPin,
  Satellite,
  Compass,
  Sparkles,
  Key,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Mountain,
  Globe2,
  Settings2,
  X
} from 'lucide-react';

interface GeospatialMapProps {
  hotspots: DemandHotspot[];
  districts: DistrictMetric[];
  selectedHotspot: DemandHotspot | null;
  onSelectHotspot: (hotspot: DemandHotspot) => void;
  onOpenDpr: (dprId: string) => void;
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
  onMapPinDropped?: (lat: number, lng: number) => void;
}

export type BasemapStyle = 'dark' | 'google_satellite' | 'esri_satellite' | 'terrain' | 'osm';

// Map center adjustment component
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

// Map click handler for interactive citizen dispatch simulation
const MapClickHandler: React.FC<{ onPinDrop?: (lat: number, lng: number) => void; isInteractiveMode: boolean }> = ({ onPinDrop, isInteractiveMode }) => {
  useMapEvents({
    click: (e) => {
      if (isInteractiveMode && onPinDrop) {
        onPinDrop(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

export const GeospatialMap: React.FC<GeospatialMapProps> = ({
  hotspots,
  districts,
  selectedHotspot,
  onSelectHotspot,
  onOpenDpr,
  selectedSector,
  setSelectedSector,
  onMapPinDropped,
}) => {
  const [activeLayer, setActiveLayer] = useState<'hotspots' | 'districts' | 'hybrid'>('hotspots');
  const [basemap, setBasemap] = useState<BasemapStyle>('dark');
  const [mapCenter, setMapCenter] = useState<[number, number]>([22.5937, 80.9629]); // Central India
  const [zoomLevel, setZoomLevel] = useState<number>(5);
  const [interactivePinMode, setInteractivePinMode] = useState<boolean>(false);
  const [droppedPins, setDroppedPins] = useState<{ id: string; lat: number; lng: number; title: string }[]>([]);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  
  // Stored or default Google Maps API Key from environment or browser localStorage
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('janvikas_google_map_key') || 
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 
      '';
  });
  const [tempApiKey, setTempApiKey] = useState<string>(apiKey);
  const [keySavedToast, setKeySavedToast] = useState<boolean>(false);

  const sectors: (RequestCategory | 'All Sectors')[] = [
    'All Sectors',
    'Rural Roads & Bridges',
    'Water & Sanitation',
    'Health & PHC',
    'Power & Solar',
    'Education & Anganwadis',
    'Irrigation & Flood Control'
  ];

  const quickRegions = [
    { name: '🇮🇳 All India', lat: 22.5937, lng: 80.9629, zoom: 5 },
    { name: '🌾 Kalahandi (OD)', lat: 19.9137, lng: 83.1649, zoom: 9 },
    { name: '🌲 Bastar (CG)', lat: 19.0748, lng: 81.9612, zoom: 9 },
    { name: '🏛️ Bahraich (UP)', lat: 27.5746, lng: 81.5976, zoom: 9 },
    { name: '🏜️ Barmer (RJ)', lat: 25.7532, lng: 71.3967, zoom: 8 },
    { name: '🌊 Ramanathapuram (TN)', lat: 9.3639, lng: 78.8395, zoom: 9 },
    { name: '🏔️ Dhubri (AS)', lat: 26.0207, lng: 89.9742, zoom: 9 },
  ];

  const filteredHotspots = hotspots.filter(h => {
    if (selectedSector !== 'All Sectors' && h.sector !== selectedSector) return false;
    return true;
  });

  const getSectorColor = (sector: RequestCategory) => {
    switch (sector) {
      case 'Rural Roads & Bridges': return '#F97316'; // orange
      case 'Water & Sanitation': return '#06B6D4'; // cyan
      case 'Health & PHC': return '#EF4444'; // red
      case 'Power & Solar': return '#EAB308'; // yellow
      case 'Education & Anganwadis': return '#8B5CF6'; // purple
      case 'Irrigation & Flood Control': return '#3B82F6'; // blue
      default: return '#10B981';
    }
  };

  const getTileLayerConfig = () => {
    switch (basemap) {
      case 'google_satellite':
        return {
          url: apiKey
            ? `https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=${apiKey}`
            : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: apiKey ? '&copy; Google Maps Platform &amp; Maxar Technologies' : '&copy; Esri, DigitalGlobe, GeoEye, Earthstar Geographics',
          maxZoom: 20,
        };
      case 'esri_satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri, DigitalGlobe, GeoEye, Earthstar Geographics',
          maxZoom: 19,
        };
      case 'terrain':
        return {
          url: apiKey
            ? `https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}&key=${apiKey}`
            : 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
          attribution: apiKey ? '&copy; Google Maps Terrain &amp; USGS' : '&copy; OpenTopoMap contributors',
          maxZoom: 20,
        };
      case 'osm':
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        };
      case 'dark':
      default:
        // Free, zero-watermark tactical dark gray base from Esri World Canvas
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri, HERE, Garmin, OpenStreetMap contributors',
          maxZoom: 18,
        };
    }
  };

  const currentTileConfig = getTileLayerConfig();

  const handleSaveApiKey = () => {
    const trimmed = tempApiKey.trim();
    setApiKey(trimmed);
    localStorage.setItem('janvikas_google_map_key', trimmed);
    setKeySavedToast(true);
    setTimeout(() => {
      setKeySavedToast(false);
      setShowKeyModal(false);
    }, 1200);
  };

  const handleMapPin = (lat: number, lng: number) => {
    const newPin = {
      id: `pin-${Date.now()}`,
      lat,
      lng,
      title: `Citizen Voice Dispatch (LAT: ${lat.toFixed(4)}, LNG: ${lng.toFixed(4)})`,
    };
    setDroppedPins(prev => [...prev, newPin]);
    if (onMapPinDropped) {
      onMapPinDropped(lat, lng);
    }
  };

  const createHotspotIcon = (hotspot: DemandHotspot) => {
    const color = getSectorColor(hotspot.sector);
    const isCritical = hotspot.compositeUrgency >= 90;
    const isSelected = selectedHotspot?.id === hotspot.id;

    return L.divIcon({
      className: 'custom-hotspot-pin',
      html: `
        <div class="relative flex items-center justify-center">
          ${isCritical ? `<div class="absolute -inset-2 rounded-full animate-ping opacity-75" style="background-color: ${color};"></div>` : ''}
          <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-lg transition-transform ${isSelected ? 'scale-125 ring-4 ring-white' : 'hover:scale-110'}" 
               style="background-color: #040711; border-color: ${color}; box-shadow: 0 0 15px ${color};">
            <span class="text-[11px] font-black" style="color: ${color};">
              ${hotspot.totalRequests}
            </span>
          </div>
          <div class="absolute -bottom-1 w-1.5 h-1.5 rounded-full" style="background-color: ${color};"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18],
    });
  };

  const createDistrictIcon = (district: DistrictMetric) => {
    return L.divIcon({
      className: 'custom-district-pin',
      html: `
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 shadow-md backdrop-blur-md hover:border-amber-400">
          <span class="w-2 h-2 rounded-full bg-amber-400 ${district.aspirationalDistrict ? 'animate-pulse' : ''}"></span>
          <span class="text-[11px] font-bold whitespace-nowrap">${district.name}</span>
        </div>
      `,
      iconSize: [90, 24],
      iconAnchor: [45, 12],
    });
  };

  const createDroppedPinIcon = () => {
    return L.divIcon({
      className: 'custom-dropped-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute -inset-2 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
          <div class="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white font-bold text-xs shadow-glow-emerald">
            ✓
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  };

  return (
    <div className="space-y-3">
      {/* 1. Dedicated High-Visibility Map Controls Toolbar */}
      <div className="glass-panel-elevated p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left Side: Large Basemap Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-india-saffron" />
            <span>Map Layer:</span>
          </span>

          {/* 1. Street Map (OSM Light) */}
          <button
            onClick={() => setBasemap('osm')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              basemap === 'osm'
                ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-2 ring-blue-400/30'
                : 'bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Street Map</span>
            {basemap === 'osm' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
          </button>

          {/* 2. Google Satellite */}
          <button
            onClick={() => setBasemap('google_satellite')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              basemap === 'google_satellite'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400/30 shadow-glow-emerald'
                : 'bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>Google Satellite</span>
            {basemap === 'google_satellite' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
          </button>

          {/* 3. Esri High-Res Satellite */}
          <button
            onClick={() => setBasemap('esri_satellite')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              basemap === 'esri_satellite'
                ? 'bg-teal-600 text-white border-teal-500 shadow-md ring-2 ring-teal-400/30'
                : 'bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Esri High-Res</span>
            {basemap === 'esri_satellite' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
          </button>

          {/* 4. Google Terrain */}
          <button
            onClick={() => setBasemap('terrain')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              basemap === 'terrain'
                ? 'bg-amber-600 text-white border-amber-500 shadow-md ring-2 ring-amber-400/30'
                : 'bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>Terrain</span>
            {basemap === 'terrain' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
          </button>

          {/* 5. Dark Base */}
          <button
            onClick={() => setBasemap('dark')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              basemap === 'dark'
                ? 'bg-slate-900 text-cyan-300 border-cyan-500 shadow-md ring-2 ring-cyan-400/30'
                : 'bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Dark Base</span>
            {basemap === 'dark' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>}
          </button>
        </div>

        {/* Right Side: Sector Filter, Interactive Pin Drop, and API Settings */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sector Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/90 px-2.5 py-1 rounded-xl border border-slate-300 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Sector:</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Pin Drop Toggle */}
          <button
            onClick={() => setInteractivePinMode(!interactivePinMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
              interactivePinMode
                ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse shadow-glow-emerald'
                : 'bg-slate-100 dark:bg-slate-900/80 text-emerald-600 dark:text-emerald-400 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{interactivePinMode ? '🎯 Drop Pin Active' : '📍 Pin Mode'}</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={() => setShowKeyModal(true)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
            title="Configure Map Engine & Google Maps API Key"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Quick Region Focus Jump Bar */}
      <div className="flex items-center gap-1.5 flex-wrap px-1">
        <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 mr-1">
          Quick Jump:
        </span>
        {quickRegions.map((region) => (
          <button
            key={region.name}
            onClick={() => {
              setMapCenter([region.lat, region.lng]);
              setZoomLevel(region.zoom);
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-india-saffron hover:text-india-saffron transition-all shadow-sm"
          >
            {region.name}
          </button>
        ))}
      </div>

      {/* 3. Main Leaflet Map Viewport Container */}
      <div className="relative w-full h-[580px] lg:h-[650px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-[#040711] z-0 isolate">
        {/* Top-Right Telemetry Chip inside map */}
        <div className="absolute top-3 right-3 z-20 glass-panel-elevated px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 shadow-md flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Critical Clusters:</span>
            <span className="text-xs font-bold text-red-600 dark:text-red-400">
              {hotspots.filter(h => h.compositeUrgency >= 90).length}
            </span>
          </div>
          <div className="w-[1px] h-3.5 bg-slate-300 dark:bg-slate-700"></div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Active Map:</span>
            <strong className="text-emerald-600 dark:text-emerald-400 uppercase font-mono">{basemap.replace('_', ' ')}</strong>
          </div>
        </div>

        {/* Tactical Zoom & Navigation Controls */}
        <div className="absolute right-4 bottom-20 z-20 flex flex-col items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 1, 18))}
            className="glass-panel-elevated p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 shadow-xl transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 1, 4))}
            className="glass-panel-elevated p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 shadow-xl transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setMapCenter([22.5937, 80.9629]);
              setZoomLevel(5);
            }}
            className="glass-panel-elevated p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 shadow-xl transition-all"
            title="Reset to Central India"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Leaflet Map Container */}
        <MapContainer
          key={`${basemap}-${apiKey}`} // Re-render tile container when basemap or key changes
          center={mapCenter}
          zoom={zoomLevel}
          scrollWheelZoom={true}
          className="w-full h-full"
          zoomControl={false}
        >
          <MapController center={mapCenter} zoom={zoomLevel} />
          <MapClickHandler onPinDrop={handleMapPin} isInteractiveMode={interactivePinMode} />
          
          {/* Dynamic Basemap Layer */}
          <TileLayer
            key={`${basemap}-${apiKey}`}
            attribution={currentTileConfig.attribution}
            url={currentTileConfig.url}
            maxZoom={currentTileConfig.maxZoom}
          />

          {/* Dropped Interactive Pins */}
          {droppedPins.map((pin) => (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={createDroppedPinIcon()}
            >
              <Popup className="custom-dark-popup">
                <div className="p-1 max-w-xs text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      NEW CITIZEN DISPATCH
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                    {pin.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-2">
                    ✓ Ingested via Bhashini ASR. Aggregated into nearest H3 Hex cluster.
                  </p>
                  <button
                    onClick={() => onOpenDpr('dpr-1')}
                    className="w-full py-1 px-2 rounded-lg text-xs font-bold bg-india-saffron text-white hover:bg-orange-600 transition-all"
                  >
                    View Synthesized DPR →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Hotspot Markers */}
          {(activeLayer === 'hotspots' || activeLayer === 'hybrid') &&
            filteredHotspots.map((hotspot) => {
              const color = getSectorColor(hotspot.sector);
              return (
                <React.Fragment key={hotspot.id}>
                  {/* Visual H3 Radius Bubble */}
                  <Circle
                    center={[hotspot.lat, hotspot.lng]}
                    radius={hotspot.totalRequests * 18}
                    pathOptions={{
                      color: color,
                      fillColor: color,
                      fillOpacity: 0.2,
                      weight: 2,
                      dashArray: '4, 4',
                    }}
                  />

                  <Marker
                    position={[hotspot.lat, hotspot.lng]}
                    icon={createHotspotIcon(hotspot)}
                    eventHandlers={{
                      click: () => onSelectHotspot(hotspot),
                    }}
                  >
                    <Popup className="custom-dark-popup">
                      <div className="p-1 max-w-xs text-slate-800 dark:text-slate-200">
                        {/* Badge & Urgency */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                            style={{
                              backgroundColor: `${color}20`,
                              color: color,
                              border: `1px solid ${color}40`,
                            }}
                          >
                            {hotspot.sector}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30">
                            Urgency: {hotspot.compositeUrgency}%
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-1">
                          {hotspot.title}
                        </h4>

                        {/* Location details */}
                        <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3 text-india-saffron" />
                          {hotspot.block} Block, {hotspot.district}, {hotspot.state}
                        </p>

                        {/* Metric Grid */}
                        <div className="grid grid-cols-2 gap-1.5 py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-[11px] mb-2.5">
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Demands Logged:</span>
                            <span className="font-bold text-slate-900 dark:text-white ml-1">{hotspot.totalRequests}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Pop. Affected:</span>
                            <span className="font-bold text-cyan-600 dark:text-cyan-300 ml-1">
                              {hotspot.populationAffected.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Infra Deficit:</span>
                            <span className="font-bold text-amber-600 dark:text-amber-400 ml-1">{hotspot.infraDeficitScore}/100</span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Est. Capex:</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 ml-1">₹{hotspot.estimatedCapexCr} Cr</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => onOpenDpr(hotspot.recommendedProjectId)}
                          className="w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-gradient-to-r from-india-saffron to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white flex items-center justify-center gap-1.5 shadow-glow-saffron transition-all"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          View AI Project Proposal (DPR)
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                </React.Fragment>
              );
            })}

          {/* District Markers */}
          {(activeLayer === 'districts' || activeLayer === 'hybrid') &&
            districts.map((district) => (
              <Marker
                key={district.id}
                position={[district.lat, district.lng]}
                icon={createDistrictIcon(district)}
                eventHandlers={{
                  click: () => {
                    setMapCenter([district.lat, district.lng]);
                    setZoomLevel(8);
                  },
                }}
              >
                <Popup className="custom-dark-popup">
                  <div className="p-1 max-w-xs text-slate-800 dark:text-slate-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {district.name} District
                      </span>
                      {district.aspirationalDistrict && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                          Aspirational #{district.nitiAayogRank}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                      State: {district.state} • Pop: {(district.population / 100000).toFixed(1)} Lakh
                    </p>
                    <div className="space-y-1 text-[11px] bg-slate-100 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 mb-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Citizen Demands:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{district.totalRequests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Identified Hotspots:</span>
                        <span className="font-bold text-orange-600 dark:text-orange-400">{district.activeHotspots}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Poverty (SECC):</span>
                        <span className="font-bold text-red-600 dark:text-red-400">{district.povertyRatePercent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Sanctioned Capex:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{district.totalSanctionedCapexCr} Cr</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>

        {/* Bottom Map Legend Bar */}
        <div className="absolute bottom-4 left-4 right-4 z-20 glass-panel-elevated p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">
              Sector Legend:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">Roads &amp; Bridges</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
              <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">Water &amp; Sanitation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">Health &amp; PHC</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
              <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">Power &amp; Solar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">Flood &amp; Irrigation</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-[11px]">
            <span>🛰️ Basemap: <strong className="text-emerald-600 dark:text-emerald-400 uppercase font-mono">{basemap.replace('_', ' ')}</strong></span>
            <span>🔴 Pulse: Urgent Cluster (<span className="text-red-600 dark:text-red-400 font-bold">&gt;90%</span>)</span>
          </div>
        </div>
      </div>


      {/* Map Engine & API Key Settings Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-elevated w-full max-w-md rounded-2xl p-6 border border-slate-700 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowKeyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-india-saffron/20 border border-india-saffron/40 flex items-center justify-center text-india-saffron">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Geospatial Tile &amp; API Key Engine</h3>
                <p className="text-xs text-slate-400">Google Maps Platform &amp; Open DPG Basemap Engine</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Active Basemap Engine:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                    {basemap.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Engine Status:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> High-Resolution Live
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Google Maps API Key:
                </label>
                <input
                  type="text"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-india-saffron"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Configured for Google Satellite, Terrain, and Places API. Saved locally in browser storage.
                </p>
              </div>

              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <p className="font-semibold text-slate-200">✨ Zero-Configuration Fallback:</p>
                <p>If Google Maps API key limits are reached, the platform seamlessly renders <strong>Esri Photorealistic World Imagery</strong> and <strong>Sovereign Tactical Dark</strong> with zero watermarks!</p>
              </div>

              {keySavedToast && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-medium flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> API Key updated &amp; reloaded successfully!
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleSaveApiKey}
                  className="flex-1 py-2 px-4 rounded-xl font-bold bg-gradient-to-r from-india-saffron to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-glow-saffron transition-all"
                >
                  Save &amp; Apply Engine
                </button>
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

