import { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Activity, 
  RefreshCw, 
  Trash2, 
  ShieldAlert, 
  Power, 
  CheckCircle, 
  Clock,
  Terminal,
  ShieldCheck,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SystemScore } from '../types';

interface DashboardViewProps {
  score: SystemScore;
  onScan: () => Promise<void>;
  onOptimize: () => Promise<void>;
  isScanning: boolean;
  isOptimizing: boolean;
  scanHasRun: boolean;
}

export default function DashboardView({
  score,
  onScan,
  onOptimize,
  isScanning,
  isOptimizing,
  scanHasRun
}: DashboardViewProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Status simulation log streamer
  useEffect(() => {
    if (isScanning) {
      setLogs([]);
      setProgress(0);
      const steps = [
        { label: 'Initializing utility engines...', delay: 0 },
        { label: 'Accessing volume metadata for C:\\...', delay: 300 },
        { label: 'Scanning Windows System Cache...', delay: 600 },
        { label: 'Found 824.5 MB redundant caches in SoftwareDistribution.', delay: 900 },
        { label: 'Searching user AppData directories for stale temp files...', delay: 1200 },
        { label: 'Scanned 1,243 MB temp items across local render contexts.', delay: 1500 },
        { label: 'Reading registry catalog indices (HKEY_LOCAL_MACHINE, HKEY_CURRENT_USER)...', delay: 1800 },
        { label: 'Registry Scan completed. Identified 7 orphaned class ids and invalid launchers.', delay: 2100 },
        { label: 'Inspecting startup sequence folder linkages...', delay: 2400 },
        { label: 'Identified 5 active startup tasks with combined heavy payload impact.', delay: 2700 },
        { label: 'Compiling structural assessment summary report...', delay: 3000 },
        { label: 'System diagnostic completed. Status report ready.', delay: 3300 }
      ];

      steps.forEach((step, idx) => {
        setTimeout(() => {
          setLogs(prev => [...prev, `[INFO ${new Date().toLocaleTimeString()}] ${step.label}`]);
          setCurrentStep(step.label);
          setProgress(Math.round(((idx + 1) / steps.length) * 100));
        }, step.delay);
      });
    }
  }, [isScanning]);

  useEffect(() => {
    if (isOptimizing) {
      setLogs([]);
      setProgress(0);
      const steps = [
        { label: 'Spawning cleanup pipelines...', delay: 0 },
        { label: 'Emptying Windows SoftwareDistribution redundant catalogs...', delay: 350 },
        { label: 'Purging local browser session caches and junk installers...', delay: 700 },
        { label: 'Securing registry table. Repairing CLSID keys and defunct commands...', delay: 1050 },
        { label: 'Broadcasting telemetry update. Speeding up startup chain.', delay: 1400 },
        { label: 'Flushing file description buffers and cleaning RAM registers...', delay: 1750 },
        { label: 'System fine-tuning has finished. All indicators optimized!', delay: 2100 }
      ];

      steps.forEach((step, idx) => {
        setTimeout(() => {
          setLogs(prev => [...prev, `[CLEAN ${new Date().toLocaleTimeString()}] ${step.label}`]);
          setCurrentStep(step.label);
          setProgress(Math.round(((idx + 1) / steps.length) * 100));
        }, step.delay);
      });
    }
  }, [isOptimizing]);

  // Keep logs scrolled to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Handle Scan trigger
  const handleScanClick = async () => {
    if (isScanning || isOptimizing) return;
    await onScan();
  };

  // Handle Optimize trigger
  const handleOptimizeClick = async () => {
    if (isScanning || isOptimizing) return;
    await onOptimize();
  };

  const currentHealth = score.healthScore;

  const getDialColor = (sc: number) => {
    if (sc >= 95) return 'stroke-emerald-500';
    if (sc >= 80) return 'stroke-accent-500';
    if (sc >= 60) return 'stroke-amber-500';
    return 'stroke-rose-500';
  };

  const getDialBgColor = (sc: number) => {
    if (sc >= 95) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (sc >= 80) return 'text-accent-400 bg-accent-500/10 border-accent-500/20';
    if (sc >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 max-w-6xl mx-auto h-full text-zinc-100">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-medium tracking-tight text-white">
            One-Click System Maintenance
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Perform universal analysis and instant speed configuration to boost responsiveness.
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-zinc-900 px-3.5 py-2 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-400">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          <span>Last Scan: {scanHasRun ? 'Completed just now' : 'Never analyzed'}</span>
        </div>
      </div>

      {/* Main Dial and Central Controls Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Central Radial Progress Gage */}
        <div className="lg:col-span-4 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800 p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-850/20 rounded-full blur-2xl -translate-y-6 translate-x-6 group-hover:bg-zinc-800/20 transition-all duration-500" />
          
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-6">Total Integrity Score</span>
          
          {/* SVG Progress Circle */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Outer Trail */}
              <circle
                cx="88"
                cy="88"
                r="72"
                className="stroke-zinc-800/60"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Core Arc */}
              <motion.circle
                cx="88"
                cy="88"
                r="72"
                className={`${getDialColor(currentHealth)}`}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={452}
                initial={{ strokeDashoffset: 452 }}
                animate={{ strokeDashoffset: 452 - (452 * currentHealth) / 100 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute flex flex-col items-center text-center">
              <span className="text-4xl font-display font-black text-white tracking-tight">
                {currentHealth}
                <span className="text-base font-normal text-zinc-500 font-sans">%</span>
              </span>
              <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold mt-2 font-mono border ${getDialBgColor(currentHealth)}`}>
                {currentHealth >= 95 ? 'Optimal' : currentHealth >= 80 ? 'Good' : currentHealth >= 60 ? 'Stuffed' : 'Heavy Bloat'}
              </span>
            </div>
          </div>

          <p className="text-xs text-center text-zinc-400 mt-6 max-w-[210px] leading-relaxed">
            Integrity metric calculated from scrap files, registry bugs, and active boot apps.
          </p>
        </div>

        {/* Major Options Actions panel */}
        <div className="lg:col-span-8 bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-accent-500/10 text-accent-400 p-2 rounded-lg border border-accent-500/10">
                <Zap className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wide">System Action Control Center</h3>
            </div>
            <p className="text-xs text-zinc-400 mt-2 max-w-xl">
              Initiate deep cleaning or execute speed optimizations. System backup is simulated automatically, allowing safe reversal of all operations.
            </p>

            {/* Quick status targets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6">
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-850/80 flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-accent-400 shrink-0" />
                <div>
                  <h4 className="text-[9px] text-zinc-500 font-mono leading-none uppercase">JUNK FOUND</h4>
                  <p className="text-sm font-bold text-white mt-1 font-mono">
                    {score.junkFoundMb > 0 ? `${(score.junkFoundMb / 1024).toFixed(2)} GB` : '0 MB'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-850/80 flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <h4 className="text-[9px] text-zinc-500 font-mono leading-none uppercase">REGISTRY BUGS</h4>
                  <p className="text-sm font-bold text-white mt-1 font-mono">
                    {score.registryIssuesCount} keys
                  </p>
                </div>
              </div>

              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-850/80 flex items-center gap-3">
                <Power className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-[9px] text-zinc-500 font-mono leading-none uppercase">BOOT LOAD</h4>
                  <p className="text-sm font-bold text-white mt-1 font-mono">
                    {score.disabledStartupCount} disabled
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap gap-4 mt-8 pt-5 border-t border-zinc-800">
            <button
              id="btn-scan-utilities"
              onClick={handleScanClick}
              disabled={isScanning || isOptimizing}
              className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all text-xs border ${
                isScanning || isOptimizing
                  ? 'bg-zinc-850 text-zinc-600 border-zinc-800 cursor-not-allowed'
                  : 'bg-zinc-800 hover:bg-zinc-750 border-zinc-700 text-zinc-200 cursor-pointer'
              }`}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-zinc-500" />
                  <span>Scanning PC...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Full Scan Diagnostics</span>
                </>
              )}
            </button>

            <button
              id="btn-optimize-utilities"
              onClick={handleOptimizeClick}
              disabled={isScanning || isOptimizing || (!scanHasRun && score.healthScore === 100)}
              className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all text-xs border ${
                isScanning || isOptimizing || (!scanHasRun && score.healthScore === 100)
                  ? 'bg-zinc-850 text-zinc-650 border-zinc-800 cursor-not-allowed'
                  : score.healthScore < 95
                    ? 'bg-accent-500 hover:bg-accent-600 text-white border-accent-500/20 cursor-pointer shadow-lg shadow-accent-500/10'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-200 cursor-pointer'
              }`}
            >
              {isOptimizing ? (
                <>
                  <Activity className="w-4 h-4 animate-pulse text-white" />
                  <span>Scrubbing system...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>{currentHealth < 95 ? 'Optimize Clean Now' : 'Re-Evaluate Suite'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Monitor Console */}
      <AnimatePresence>
        {(isScanning || isOptimizing || logs.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-zinc-950 text-zinc-200 rounded-2xl p-5 shadow-2xl border border-zinc-800/80 overflow-hidden font-mono"
          >
            {/* Header console strip */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4.5 h-4.5 text-accent-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Diagnostic Monitor Output</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-500 animate-ping" />
                <span className="text-xs text-zinc-500">{progress}%</span>
              </div>
            </div>

            {/* Simulated progress slider bar */}
            <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden mb-4">
              <motion.div 
                className="bg-accent-500 h-full rounded-full" 
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Current step line */}
            <div className="text-xs font-semibold text-emerald-400 mb-3 px-1 min-h-[16px]">
              {currentStep && `▶ ${currentStep}`}
            </div>

            {/* Full scrolling history stream */}
            <div 
              ref={logContainerRef}
              className="bg-zinc-950/40 p-3 border border-zinc-900 rounded-xl h-36 overflow-y-auto text-[11px] space-y-1.5 text-zinc-400 scroll-smooth leading-relaxed"
            >
              {logs.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-zinc-700">[{index + 1}]</span>
                  <span>{log}</span>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-zinc-700 italic">No logs initialized... Run diagnostic scans above.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommended tasks cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex gap-3.5">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg h-fit shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm font-display">Simulated Defense Guard</h4>
            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
              Diagnostic layers guarantee system files are untouched. Full integrity sandboxing keeps your registry changes 100% reversible. Set custom limits in system manager anytime.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex gap-3.5">
          <div className="p-2 bg-accent-500/10 text-accent-400 rounded-lg h-fit shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm font-display">Instant Speed Booster Upgrades</h4>
            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
              Disabling auto-boot apps inside our **Startup Booster** can reduce your simulated boot latency down below 2.8 seconds, ensuring top responsiveness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
