import { useState } from 'react';
import { 
  Trash2, 
  FolderOpen, 
  Check, 
  AlertTriangle, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  Layers,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { JunkCategory } from '../types';

interface DiskCleanerViewProps {
  categories: JunkCategory[];
  onCleanCategories: (ids: string[]) => Promise<void>;
  isOptimizing: boolean;
}

export default function DiskCleanerView({
  categories,
  onCleanCategories,
  isOptimizing
}: DiskCleanerViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    categories.filter(c => c.selected && !c.cleaned).map(c => c.id)
  );
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [cleanCompleted, setCleanCompleted] = useState(false);
  const [reclaimedMb, setReclaimedMb] = useState(0);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(x => x !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const toggleSelectAll = () => {
    const uncleaned = categories.filter(c => !c.cleaned);
    if (selectedIds.length === uncleaned.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(uncleaned.map(c => c.id));
    }
  };

  const handleClean = async () => {
    if (selectedIds.length === 0 || isOptimizing) return;
    
    // Calculate size we are about to reclaim
    const targetSize = categories
      .filter(c => selectedIds.includes(c.id))
      .reduce((sum, c) => sum + c.sizeInMb, 0);
    
    await onCleanCategories(selectedIds);
    setReclaimedMb(targetSize);
    setCleanCompleted(true);
    setSelectedIds([]);
    
    // Hide completion screen after 6 seconds
    setTimeout(() => {
      setCleanCompleted(false);
    }, 6000);
  };

  const totalUncleanedSize = categories
    .filter(c => !c.cleaned)
    .reduce((sum, c) => sum + c.sizeInMb, 0);

  const totalUncleanedSelectedSize = categories
    .filter(c => selectedIds.includes(c.id))
    .reduce((sum, c) => sum + c.sizeInMb, 0);

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 max-w-6xl mx-auto h-full text-zinc-100">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-medium tracking-tight text-white">
            Disk De-Clutter & Cache Purge
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Safely shred outdated cache piles, user crash records, browser cookies, and temporary setups.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 h-fit flex items-center gap-3">
          <Trash2 className="w-4 h-4 text-blue-400" />
          <div>
            <span className="text-[9px] text-zinc-500 font-mono block uppercase">Total Cleanable Bloat</span>
            <span className="text-sm font-bold text-white font-mono">
              {totalUncleanedSize > 0 ? `${(totalUncleanedSize / 1024).toFixed(2)} GB` : '0.00 GB'}
            </span>
          </div>
        </div>
      </div>

      {/* Reclaimed Success Alert Banner */}
      <AnimatePresence>
        {cleanCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-emerald-500/10 text-emerald-300 rounded-xl p-5 border border-emerald-500/20 flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-600/10 rounded-full blur-xl translate-x-12 -translate-y-8 opacity-40" />
            
            <div className="flex items-center gap-4 relative">
              <div className="bg-emerald-500/20 p-2.5 rounded-lg border border-emerald-500/30">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-bounce" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white font-display">Optimization Succeeded!</h3>
                <p className="text-xs text-emerald-400 mt-0.5">
                  Reclaimed <strong className="text-white">{(reclaimedMb / 1024).toFixed(2)} GB</strong> of disk storage space across the selected parameters.
                </p>
              </div>
            </div>

            <button
              onClick={() => setCleanCompleted(false)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer border border-emerald-400/25 shadow-lg shadow-emerald-500/10"
            >
              Great, thank you!
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Core Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Category table selection list */}
        <div className="lg:col-span-8 space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 font-mono">
              Target Selection Categories
            </h3>
            
            {categories.filter(c => !c.cleaned).length > 0 && (
              <button
                id="btn-select-all-junk"
                onClick={toggleSelectAll}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-all"
              >
                {selectedIds.length === categories.filter(c => !c.cleaned).length ? 'Unselect All' : 'Select All Categories'}
              </button>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800/80">
            {categories.map((category) => {
              const isSelected = selectedIds.includes(category.id);
              const isExpanded = expandedCategoryId === category.id;
              
              return (
                <div 
                  key={category.id} 
                  className={`transition-all duration-200 ${
                    category.cleaned 
                      ? 'bg-zinc-950/20 text-zinc-500' 
                      : isSelected 
                        ? 'bg-blue-600/5' 
                        : 'hover:bg-zinc-850/40'
                  }`}
                >
                  {/* Category main bar */}
                  <div className="flex items-center justify-between p-4.5 gap-3">
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      {/* Checkbox trigger */}
                      {!category.cleaned ? (
                        <input
                          id={`chk-junk-${category.id}`}
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(category.id)}
                          className="w-4 h-4 bg-zinc-950 border-zinc-850 rounded focus:ring-blue-500/50 cursor-pointer accent-blue-500"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                          <Check className="w-3 text-emerald-400 stroke-[3px]" />
                        </div>
                      )}

                      {/* Info layout */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs font-semibold truncate ${category.cleaned ? 'text-zinc-650 line-through' : 'text-zinc-200'}`}>
                            {category.name}
                          </h4>
                          {category.cleaned && (
                            <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[8px] px-1.5 py-0.5 rounded font-mono font-medium tracking-wide">
                              PURGED
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 font-normal mt-0.5 leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    {/* Right side Size & toggle detailed folder explorer */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`font-mono text-xs ${category.cleaned ? 'text-zinc-600' : 'font-semibold text-zinc-300'}`}>
                        {category.cleaned ? '0.00 MB' : `${category.sizeInMb.toFixed(1)} MB`}
                      </span>

                      <button
                        id={`btn-toggle-junk-folder-${category.id}`}
                        onClick={() => setExpandedCategoryId(isExpanded ? null : category.id)}
                        className={`p-1.5 rounded-lg hover:bg-zinc-800 transition-all ${isExpanded ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-350'}`}
                        title="Explore folders"
                      >
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Drawer Explorer containing simulated files folder tree */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-zinc-800 bg-zinc-950/70 px-10 py-3.5 text-[11px] font-mono text-zinc-500 space-y-2"
                      >
                        <div className="flex items-center gap-2 text-zinc-300 font-medium mb-1">
                          <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
                          <span>Simulated Path Target Inventory:</span>
                        </div>
                        {category.files.map((file, idx) => (
                          <div key={idx} className="flex gap-2">
                            <span className="text-zinc-700">└─</span>
                            <span className={category.cleaned ? 'text-zinc-600 line-through' : 'text-zinc-400'}>
                              {file}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Panel sidebar inside tab context */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-4">
          <div className="bg-zinc-900 text-zinc-200 p-5 rounded-xl border border-zinc-850/85">
            <h3 className="text-sm font-display font-medium text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span className="uppercase tracking-wider text-xs">Purging Control Hub</span>
            </h3>
            <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
              Verify checked categories. Reclaiming disk storage operates immediately inside local simulated memory layers safely and fast.
            </p>

            <div className="space-y-3 mt-5 border-t border-zinc-800 pt-4">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Total Selection:</span>
                <span className="font-mono text-white">{selectedIds.length} categories</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Clearable Size:</span>
                <span className="font-mono text-white">{(totalUncleanedSelectedSize / 1024).toFixed(2)} GB</span>
              </div>
            </div>

            <button
              id="btn-execute-junk-clean"
              onClick={handleClean}
              disabled={selectedIds.length === 0 || isOptimizing}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 mt-5 rounded-xl font-bold text-xs transition-colors border ${
                selectedIds.length === 0 || isOptimizing
                  ? 'bg-zinc-850 text-zinc-600 border-zinc-800 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500/20 cursor-pointer shadow-lg shadow-blue-500/10'
              }`}
            >
              {isOptimizing ? (
                <>
                  <Trash2 className="w-3.5 h-3.5 animate-spin text-white animate-pulse" />
                  <span>Clearing Files...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Scrub {selectedIds.length} Checked Targets</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/15 text-amber-400 text-xs flex gap-3 leading-relaxed">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-white block mb-0.5">Need a rollback?</strong>
              Everything optimized is retained in temporary workspace caches logs. You can regenerate standard files instantly by running diagnostics diagnostic scan again at the direct dashboard view.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
