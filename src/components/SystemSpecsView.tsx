import { useState, useEffect } from 'react';
import { 
  Laptop, 
  Cpu, 
  Monitor, 
  Settings, 
  Globe, 
  UserCheck, 
  ShieldCheck, 
  Calendar,
  Clock,
  Compass
} from 'lucide-react';

export default function SystemSpecsView() {
  const [specs, setSpecs] = useState({
    cores: 'Loading...',
    memory: 'Loading...',
    screenResolution: 'Loading...',
    colorDepth: 'Loading...',
    language: 'Loading...',
    userAgent: 'Loading...',
    cookiesEnabled: 'Loading...',
    webGlRenderer: 'Loading...',
    touchPoints: 'Loading...',
    onlineState: 'Loading...',
    timezone: 'Loading...'
  });

  useEffect(() => {
    // Collect client-side diagnostics
    const width = window.screen.width;
    const height = window.screen.height;
    const ratio = window.devicePixelRatio;

    let webGlInfo = 'Not Supported';
    try {
      const canvas = document.createElement('canvas');
      const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as any;
      if (gl) {
        const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          webGlInfo = gl.getParameter(debugInfo.UNMASKED_RENDERER_VENDOR_ID) + ' / ' + gl.getParameter(debugInfo.UNMASKED_RENDERER_DEVICE_ID);
        } else {
          webGlInfo = 'Hardware Supported (Unmasked Vendor Offline)';
        }
      }
    } catch (e) {
      webGlInfo = 'WebGL Error during init';
    }

    setSpecs({
      cores: String(navigator.hardwareConcurrency || 'Multiple Core Allocation'),
      memory: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'Not Queried (Default 8GB)',
      screenResolution: `${width} x ${height} (DPR ${ratio})`,
      colorDepth: `${window.screen.colorDepth}-Bit TrueColor`,
      language: navigator.language || 'UTF-8 standard',
      userAgent: navigator.userAgent || 'Modern Standard Browser Engine',
      cookiesEnabled: navigator.cookieEnabled ? 'Enabled (Active Session)' : 'Disabled',
      webGlRenderer: webGlInfo,
      touchPoints: String(navigator.maxTouchPoints || 'No touch support detected'),
      onlineState: navigator.onLine ? 'Connected' : 'Offline Mode',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC standard'
    });
  }, []);

  const deviceData = [
    {
      group: 'Hardware Specifications',
      icon: Cpu,
      items: [
        { label: 'Processor Logical Cores', value: specs.cores },
        { label: 'Indicated Device Memory', value: specs.memory },
        { label: 'Graphic WebGL Engine', value: specs.webGlRenderer },
        { label: 'Max Pointer Touchpoints', value: specs.touchPoints }
      ]
    },
    {
      group: 'Display & Graphics',
      icon: Monitor,
      items: [
        { label: 'Native Monitor Resolution', value: specs.screenResolution },
        { label: 'Sub-pixel Color Depth', value: specs.colorDepth },
        { label: 'Device Pixel Scale Ratio', value: String(window.devicePixelRatio || 1) }
      ]
    },
    {
      group: 'Operating Environment',
      icon: Compass,
      items: [
        { label: 'Selected Browser Language', value: specs.language },
        { label: 'Active Region Timezone', value: specs.timezone },
        { label: 'Session Cookies Allowed', value: specs.cookiesEnabled },
        { label: 'Network Connection Mode', value: specs.onlineState }
      ]
    }
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 max-w-6xl mx-auto h-full text-zinc-100 animate-fade-in">
      {/* View Header */}
      <div>
        <h2 className="text-2xl font-display font-medium tracking-tight text-white">
          System Diagnostics & Telemetry
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Inspect granular client-side physical hardware specs, browser characteristics, and layout telemetry metrics.
        </p>
      </div>

      {/* UTC and Session time row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4.5 rounded-xl flex items-center gap-4">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/10">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-zinc-500 font-mono block uppercase leading-none font-bold">Diagnostic Session Reference</span>
            <span className="text-sm font-semibold text-white mt-1.5 block font-mono">2026-05-20 (Universal UTC)</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4.5 rounded-xl flex items-center gap-4">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/10">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-zinc-500 font-mono block uppercase leading-none font-bold">Local Device Timezone</span>
            <span className="text-sm font-semibold text-white mt-1.5 block font-mono">{specs.timezone} Time</span>
          </div>
        </div>
      </div>

      {/* Main Lists Grid */}
      <div className="space-y-6">
        {deviceData.map((section, idx) => {
          const SectionIcon = section.icon;
          return (
            <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xs">
              {/* Section Header */}
              <div className="bg-zinc-950 px-5 py-3 border-b border-zinc-850 flex items-center gap-2.5">
                <SectionIcon className="w-4 h-4 text-zinc-400" />
                <h3 className="font-display font-bold text-white text-xs tracking-wider uppercase">
                  {section.group}
                </h3>
              </div>

              {/* Items grid table */}
              <div className="divide-y divide-zinc-850/60 px-5">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="py-3.5 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <span className="text-xs text-zinc-400">
                      {item.label}
                    </span>
                    <span className="text-xs font-mono text-zinc-350 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-850/80 max-w-full sm:max-w-md break-all leading-normal text-right">
                      {item.value || "Not Detected"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Browser User Agent Full Details */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-display font-medium text-sm">
            <Globe className="w-4 h-4 text-zinc-400" />
            <span>Interactive Client Useragent Header</span>
          </div>
          <div className="p-3.5 bg-zinc-950 border border-zinc-850 rounded-lg font-mono text-xs text-zinc-400 leading-relaxed break-all">
            {specs.userAgent}
          </div>
        </div>
      </div>
    </div>
  );
}
