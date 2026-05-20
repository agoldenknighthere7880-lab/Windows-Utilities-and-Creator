import { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Activity, 
  Trash2, 
  CheckCircle, 
  RefreshCw, 
  Sparkles,
  Zap,
  Flame,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function RamOptimizerView() {
  const [memoryHistory, setMemoryHistory] = useState<number[]>([
    58, 62, 60, 65, 71, 74, 78, 76, 75, 79, 78, 77, 80, 81, 79
  ]);
  const [totalMemoryGb, setTotalMemoryGb] = useState<number>(16);
  const [usedMemoryPercent, setUsedMemoryPercent] = useState<number>(75);
  const [optimizing, setOptimizing] = useState<boolean>(false);
  const [freedGb, setFreedGb] = useState<number | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  // Automatically fetch device physical memory or fallback
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'deviceMemory' in navigator) {
      const gbObj = (navigator as any).deviceMemory;
      if (gbObj) setTotalMemoryGb(gbObj);
    }
  }, []);

  // Periodic wave update simulator
  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      setMemoryHistory(prev => {
        const lastVal = prev[prev.length - 1];
        // Organically drift value by -3 to +3 percent, keeping within 25-90 limits
        const drift = Math.floor(Math.random() * 7) - 3;
        const newVal = Math.max(25, Math.min(90, lastVal + drift));
        
        // Update local single indicators
        if (!optimizing) {
          setUsedMemoryPercent(newVal);
        }
        
        // Shift history left
        return [...prev.slice(1), newVal];
      });
    }, 2000);

    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, [optimizing]);

  // Execute Memory optimization scrub
  const handleOptimizeRam = () => {
    if (optimizing) return;
    setOptimizing(true);
    setTerminalLogs([]);

    const steps = [
      { text: 'Initiating memory garbage collection analyzer...', delay: 0 },
      { text: 'Indexing allocated process handles inside current workspace...', delay: 300 },
      { text: 'Discharging idle DLL registers from high standby heap segments...', delay: 600 },
      { text: 'Flushing transient cache buffers in Chrome/V8 Virtual Machines...', delay: 900 },
      { text: 'Paging cached application states safely to disk swap margins...', delay: 1200 },
      { text: 'Garbage collection finished successfully. Reclaimed RAM handles.', delay: 1500 }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, `[MEM_OPT] ${step.text}`]);
      }, step.delay);
    });

    // Action completed triggers drop in memory
    setTimeout(() => {
      const dropTarget = Math.max(28, Math.min(35, Math.floor(Math.random() * 10) + 28)); // Drops down to ~30%
      const initialUsedPercent = usedMemoryPercent;
      const initialFreedGb = parseFloat(((initialUsedPercent - dropTarget) * totalMemoryGb / 100).toFixed(1));
      
      setFreedGb(initialFreedGb);
      setUsedMemoryPercent(dropTarget);
      
      setMemoryHistory(prev => {
        // Splice a sudden dip into the history
        const updated = [...prev];
        updated[updated.length - 1] = dropTarget;
        updated[updated.length - 2] = Math.round((initialUsedPercent + dropTarget) / 2); // gradual transitional dip
        return updated;
      });

      setOptimizing(false);
    }, 1800);
  };

  const usedGb = parseFloat(((usedMemoryPercent * totalMemoryGb) / 100).toFixed(1));
  const freeGb = parseFloat((totalMemoryGb - usedGb).toFixed(1));

  // Render reactive SVG Path
  const width = 600;
  const height = 180;
  const padding = 10;
  const maxVal = 100;

  const pointsStr = memoryHistory.map((val, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (memoryHistory.length - 1);
    const y = height - padding - (val * (height - padding * 2)) / maxVal;
    return `${x},${y}`;
  }).join(' ');

  // Create SVG Area Path string (closes the bottom)
  const firstX = padding;
  const firstY = height - padding;
  const lastX = width - padding;
  const lastY = height - padding;
  const areaPathStr = `M ${firstX},${firstY} L ${pointsStr} L ${lastX},${lastY} Z`;

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 max-w-6xl mx-auto h-full text-zinc-100">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-medium tracking-tight text-white">
            Memory RAM Optimizer
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Free up inactive garbage blocks, reclaim swap space, and flush unused web app registers to boost live device rates.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 h-fit flex items-center gap-3">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="text-[9px] text-zinc-500 font-mono block uppercase">Allocated Memory</span>
            <span className="text-sm font-bold text-white font-mono">
              {usedGb} GB / {totalMemoryGb} GB
            </span>
          </div>
        </div>
      </div>

      {/* Reclaimed Memory Banner */}
      <AnimatePresence>
        {freedGb && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-emerald-500/10 text-emerald-300 rounded-xl p-5 border border-emerald-500/20 flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-700/15 rounded-full blur-xl translate-x-12 -translate-y-8 opacity-40" />
            
            <div className="flex items-center gap-4 relative">
              <div className="bg-emerald-500/20 p-2.5 rounded-lg border border-emerald-500/30">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white font-display">RAM Decompression Reclaimed</h3>
                <p className="text-xs text-emerald-300 mt-0.5">
                  Flush completed! Recycled <strong className="text-white">{freedGb} GB</strong> of idle memory swap spaces. Active programs can run with 100% capacity.
                </p>
              </div>
            </div>

            <button
              onClick={() => setFreedGb(null)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-opacity-90 transition-all shrink-0 cursor-pointer border border-emerald-400/25 shadow-lg shadow-emerald-500/10"
            >
              Verify RAM
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Graph Grid dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Core SVG graph display panel */}
        <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-indigo-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Real-Time Physical Memory Footprint</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Tracker
            </span>
          </div>

          {/* SVG canvas container render */}
          <div className="relative bg-zinc-950 rounded-lg p-3 border border-zinc-850">
            {/* Grid Guideline bounds */}
            <div className="absolute inset-x-0 top-1/2 border-t border-zinc-900/40 border-dashed pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 border-l border-zinc-900/40 border-dashed pointer-events-none" />

            {/* Main Graph SVG */}
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              className="w-full h-44 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="ramAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Area path graph */}
              <path 
                d={areaPathStr} 
                className="fill-[url(#ramAreaGrad)]" 
                strokeWidth="0"
              />

              {/* Core spline line */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                points={pointsStr}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Glow accent */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="5"
                points={pointsStr}
                className="opacity-15 blur-xs"
                strokeLinecap="round"
              />

              {/* Dynamic point highlight circle marker */}
              <circle
                cx={padding + (memoryHistory.length - 1) * (width - padding * 2) / (memoryHistory.length - 1)}
                cy={height - padding - (memoryHistory[memoryHistory.length - 1] * (height - padding * 2)) / maxVal}
                r="4"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="1.5"
                className="shadow-md"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-4 font-mono">
            <span>Standby: 0% MB allocation</span>
            <span>Real-time sweep rate (1x) • Interval 2.0s</span>
            <span>Scale Limit: {totalMemoryGb} GB</span>
          </div>
        </div>

        {/* Big Optimization Trigger dial */}
        <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between overflow-hidden relative">
          
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white font-display">Optimization Speed Dial</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Directly release paging registers associated with idle services instantly. Memory speed loads can increase by up to 2.4x.
            </p>

            {/* Quick dial numbers list */}
            <div className="grid grid-cols-2 gap-3.5 pt-2">
              <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg text-center font-mono">
                <span className="text-[9px] text-zinc-500 font-mono block uppercase">Used Space</span>
                <span className="text-base font-bold text-white mt-1 block tracking-tight">
                  {usedMemoryPercent}%
                </span>
                <span className="text-[9px] text-zinc-500 block font-mono">({usedGb} GB)</span>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg text-center font-mono">
                <span className="text-[9px] text-zinc-500 font-mono block uppercase">Free Standby</span>
                <span className="text-base font-bold text-white mt-1 block tracking-tight">
                  {100 - usedMemoryPercent}%
                </span>
                <span className="text-[9px] text-zinc-500 block font-mono">({freeGb} GB)</span>
              </div>
            </div>
          </div>

          <button
            id="btn-optimize-ram-action"
            onClick={handleOptimizeRam}
            disabled={optimizing}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 mt-5 rounded-xl font-bold text-xs transition-colors border ${
              optimizing
                ? 'bg-zinc-850 text-zinc-650 border-zinc-800 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500/20 cursor-pointer shadow-lg shadow-emerald-500/10'
            }`}
          >
            {optimizing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white mr-1" />
                <span>Reorganizing register frames...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Decompress Memory RAM</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Terminal logs during RAM optimizing */}
      <AnimatePresence>
        {terminalLogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-black/90 text-emerald-400 rounded-xl p-4 border border-zinc-800 font-mono text-[11px] space-y-2 h-44 overflow-y-auto"
          >
            <div className="flex justify-between items-center text-zinc-400 border-b border-zinc-850 pb-2 mb-2 font-semibold">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-sans">RAM Garbage Processor Output Console</span>
              </span>
              <span className="text-[9px] text-zinc-500 tracking-wider">ACTIVE PIPELINES</span>
            </div>
            {terminalLogs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-zinc-600 font-mono">[{index + 1}]</span>
                <span className="text-zinc-250 font-mono">{log}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
