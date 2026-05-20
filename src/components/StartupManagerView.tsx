import React, { useState } from 'react';
import { 
  Power, 
  PlusCircle, 
  Trash, 
  AlertTriangle, 
  Gauge, 
  HelpCircle,
  FileCode,
  Check,
  PowerOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StartupItem } from '../types';

interface StartupManagerViewProps {
  startupItems: StartupItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (item: Omit<StartupItem, 'id'>) => void;
  onRemoveItem: (id: string) => void;
}

export default function StartupManagerView({
  startupItems,
  onToggleItem,
  onAddItem,
  onRemoveItem
}: StartupManagerViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPub, setNewItemPub] = useState('');
  const [newItemImpact, setNewItemImpact] = useState<'low' | 'medium' | 'high'>('medium');
  const [newItemPath, setNewItemPath] = useState('');

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPath) return;

    onAddItem({
      name: newItemName,
      publisher: newItemPub || 'User Custom Added',
      impact: newItemImpact,
      enabled: true,
      path: newItemPath,
      custom: true
    });

    // Reset Form Fields
    setNewItemName('');
    setNewItemPub('');
    setNewItemImpact('medium');
    setNewItemPath('');
    setShowAddForm(false);
  };

  // Fun boot latency calculator
  const calculateBootTimeSeconds = () => {
    let baseTime = 14.2; // base OS boot delay
    startupItems.forEach(item => {
      if (item.enabled) {
        if (item.impact === 'high') baseTime += 2.4;
        if (item.impact === 'medium') baseTime += 1.1;
        if (item.impact === 'low') baseTime += 0.4;
      }
    });
    return parseFloat(baseTime.toFixed(1));
  };

  const activeStartupCount = startupItems.filter(i => i.enabled).length;
  const bootTime = calculateBootTimeSeconds();

  const getImpactBadge = (impact: 'low' | 'medium' | 'high') => {
    switch (impact) {
      case 'high':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'low':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 max-w-6xl mx-auto h-full text-zinc-100">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-medium tracking-tight text-white">
            Startup Speed Booster
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Enable or disable background launcher apps to optimize physical desktop start latencies.
          </p>
        </div>

        <div className="flex items-center gap-5 bg-zinc-900 border border-zinc-800 rounded-xl p-3 px-4 h-fit">
          <div className="flex items-center gap-3">
            <Gauge className="w-5 h-5 text-blue-400" />
            <div>
              <span className="text-[9px] text-zinc-500 font-mono block uppercase">Estimated Boot Delay</span>
              <span className="text-sm font-bold text-white font-mono">{bootTime}s</span>
            </div>
          </div>
          <div className="border-l border-zinc-800 pl-5">
            <span className="text-[9px] text-zinc-500 font-mono block uppercase">Active Daemons</span>
            <span className="text-xs font-semibold text-zinc-350 font-mono">{activeStartupCount} services</span>
          </div>
        </div>
      </div>

      {/* Main layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Startup items manager catalog table */}
        <div className="lg:col-span-8 space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 font-mono">
              Boot Registration Catalog
            </h3>

            <button
              id="btn-trigger-add-startup"
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-350 font-semibold transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{showAddForm ? 'Close registry builder' : 'Register Custom Item'}</span>
            </button>
          </div>

          {/* Add custom startup application form modal/drawer */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <form 
                  onSubmit={handleAddItemSubmit}
                  className="bg-[#0c0c0e] text-zinc-200 p-5 rounded-xl border border-zinc-805 space-y-4"
                >
                  <h4 className="font-display font-semibold text-white text-xs flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-400" />
                    <span className="uppercase tracking-wider">Register New Boot Daemon Pointer</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                        Application Name
                      </label>
                      <input
                        id="txt-new-startup-name"
                        type="text"
                        required
                        placeholder="e.g. My Custom Daemon"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="w-full bg-zinc-950 text-white text-xs px-3 py-2 mt-1 rounded-lg border border-zinc-800 focus:outline-hidden focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                        Publisher / Dev
                      </label>
                      <input
                        id="txt-new-startup-pub"
                        type="text"
                        placeholder="e.g. Apple Inc, Google Open Source"
                        value={newItemPub}
                        onChange={(e) => setNewItemPub(e.target.value)}
                        className="w-full bg-zinc-950 text-white text-xs px-3 py-2 mt-1 rounded-lg border border-zinc-800 focus:outline-hidden focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                        Impact Level Analysis
                      </label>
                      <select
                        id="sel-new-startup-impact"
                        value={newItemImpact}
                        onChange={(e) => setNewItemImpact(e.target.value as 'low' | 'medium' | 'high')}
                        className="w-full bg-zinc-950 text-white text-xs px-3 py-2 mt-1 rounded-lg border border-zinc-800 focus:outline-hidden focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/20 cursor-pointer"
                      >
                        <option value="low">Low Boot Lag</option>
                        <option value="medium">Medium Memory Strain</option>
                        <option value="high">High Hardware Interruption</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                        Launch Command Filepath
                      </label>
                      <input
                        id="txt-new-startup-path"
                        type="text"
                        required
                        placeholder="e.g. C:\Program Files\App\app.exe"
                        value={newItemPath}
                        onChange={(e) => setNewItemPath(e.target.value)}
                        className="w-full bg-zinc-950 text-white text-xs px-3 py-2 mt-1 rounded-lg border border-zinc-800 focus:outline-hidden focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3.5 pt-2">
                    <button
                      id="btn-cancel-custom-startup"
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 hover:bg-zinc-850 rounded-lg cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      id="btn-submit-custom-startup"
                      type="submit"
                      className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg font-bold border border-blue-500/20 shadow-lg shadow-blue-500/10 cursor-pointer"
                    >
                      Save to Registry Hives
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Core App Items list */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-850">
            {startupItems.map((item) => (
              <div 
                key={item.id} 
                className={`p-4 transition-all duration-200 flex items-center justify-between gap-4 ${
                  !item.enabled ? 'bg-zinc-950/25 text-zinc-550' : 'hover:bg-zinc-850/40'
                }`}
              >
                {/* Item Details coordinates */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Status disk circle light indicator */}
                  <div className="shrink-0 relative">
                    {item.enabled ? (
                      <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/20" title="Active on Boot" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-zinc-800" title="Disabled on Boot" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`text-xs font-semibold truncate ${item.enabled ? 'text-zinc-200' : 'text-zinc-500 line-through'}`}>
                        {item.name}
                      </h4>
                      <span className={`text-[9px] px-1.5 py-0.5 border rounded-sm font-mono font-bold uppercase ${getImpactBadge(item.impact)}`}>
                        {item.impact} impact
                      </span>

                      {item.custom && (
                        <span className="text-[8px] bg-zinc-950 text-zinc-400 border border-zinc-850 font-mono px-1.5 py-0.5 rounded uppercase">
                          User Added
                        </span>
                      )}
                    </div>

                    <p className={`text-[11px] ${item.enabled ? 'text-zinc-400' : 'text-zinc-550'}`}>
                      {item.publisher}
                    </p>

                    <p className={`text-[10px] font-mono whitespace-nowrap overflow-hidden text-ellipsis ${item.enabled ? 'text-zinc-500' : 'text-zinc-655'}`}>
                      {item.path}
                    </p>
                  </div>
                </div>

                {/* Switch actions and custom deletes */}
                <div className="flex items-center gap-4 shrink-0">
                  {/* Toggle state action */}
                  <button
                    id={`btn-toggle-startup-${item.id}`}
                    onClick={() => onToggleItem(item.id)}
                    className={`relative inline-flex h-5.5 w-10.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      item.enabled ? 'bg-blue-600' : 'bg-zinc-850'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        item.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>

                  {/* Remove command for custom user app startup */}
                  {item.custom && (
                    <button
                      id={`btn-remove-startup-${item.id}`}
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-800 transition-all cursor-pointer"
                      title="Deregister application startup"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informative tutorial sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-zinc-900 text-zinc-200 p-5 rounded-xl border border-zinc-850/85">
            <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-400 font-mono pb-4 border-b border-zinc-800">
              Boot Latency Impact Analysis
            </h3>
            
            <div className="space-y-4 mt-5">
              <div className="flex gap-3 leading-normal">
                <div className="p-1 px-1.5 bg-rose-500/10 text-rose-400 h-fit rounded font-mono text-[9px] font-bold">
                  HIGH
                </div>
                <p className="text-[11px] text-zinc-400">
                  Delays registry read timers by ~2.4s. Includes communication engines and major graphics launchers. Recommended to disable if unused.
                </p>
              </div>

              <div className="flex gap-3 leading-normal">
                <div className="p-1 px-1.5 bg-amber-500/10 text-amber-400 h-fit rounded font-mono text-[9px] font-bold">
                  MED
                </div>
                <p className="text-[11px] text-zinc-400">
                  Adds moderate memory allocations of ~1.1s. Includes secondary update proxies. Keep enabled if auto-sync is crucial.
                </p>
              </div>

              <div className="flex gap-3 leading-normal">
                <div className="p-1 px-1.5 bg-emerald-500/10 text-emerald-400 h-fit rounded font-mono text-[9px] font-bold">
                  LOW
                </div>
                <p className="text-[11px] text-zinc-400">
                  Minimal delay of ~0.4s. Safe processes like OS notifier trays. Safe to remain enabled always.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/15 text-blue-350 text-xs flex gap-3 leading-relaxed">
            <HelpCircle className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-white block mb-0.5">Will this modify my physical PC?</strong>
              No! Startup booster operates inside a simulated system virtualization layer. This sandbox allows you to safely toggle items and observe synthetic latency benchmarks risk-free.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
