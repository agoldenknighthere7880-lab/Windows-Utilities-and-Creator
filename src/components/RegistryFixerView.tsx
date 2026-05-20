import { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Check, 
  AlertOctagon, 
  AlertTriangle, 
  ShieldCheck, 
  Database,
  Filter,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RegistryIssue } from '../types';

interface RegistryFixerViewProps {
  issues: RegistryIssue[];
  onFixIssues: (ids: string[]) => Promise<void>;
  isOptimizing: boolean;
}

export default function RegistryFixerView({
  issues,
  onFixIssues,
  isOptimizing
}: RegistryFixerViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    issues.filter(i => i.selected && !i.fixed).map(i => i.id)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [fixCompleted, setFixCompleted] = useState(false);
  const [fixedCount, setFixedCount] = useState(0);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(x => x !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleFixSelected = async () => {
    const unFixedSelected = selectedIds.filter(id => {
      const issue = issues.find(i => i.id === id);
      return issue && !issue.fixed;
    });

    if (unFixedSelected.length === 0 || isOptimizing) return;

    await onFixIssues(unFixedSelected);
    setFixedCount(unFixedSelected.length);
    setFixCompleted(true);
    setSelectedIds([]);

    setTimeout(() => {
      setFixCompleted(false);
    }, 6000);
  };

  const toggleSelectAll = (filteredIssues: RegistryIssue[]) => {
    const activeFilteredIds = filteredIssues.filter(i => !i.fixed).map(i => i.id);
    const allSelectedInFiltered = activeFilteredIds.every(id => selectedIds.includes(id));

    if (allSelectedInFiltered) {
      // remove filtered IDs from selected
      setSelectedIds(prev => prev.filter(id => !activeFilteredIds.includes(id)));
    } else {
      // add remaining filtered IDs
      setSelectedIds(prev => {
        const set = new Set([...prev, ...activeFilteredIds]);
        return Array.from(set);
      });
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
      issue.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.hive.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.issue.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || issue.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadge = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'low':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const unfixedCount = issues.filter(i => !i.fixed).length;

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 max-w-6xl mx-auto h-full text-zinc-100">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-medium tracking-tight text-white">
            Registry Optimizer & Repair
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Clean up obsolete references, invalid file type associations, and orphaned CLSID links in the system hives.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 h-fit flex items-center gap-3">
          <Database className="w-4 h-4 text-indigo-400" />
          <div>
            <span className="text-[9px] text-zinc-500 font-mono block uppercase">Corrupted Keys</span>
            <span className="text-sm font-bold text-white font-mono">
              {unfixedCount > 0 ? `${unfixedCount} entries` : 'All Clean'}
            </span>
          </div>
        </div>
      </div>

      {/* Registry Fix Success Banner */}
      <AnimatePresence>
        {fixCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-indigo-600/10 text-indigo-300 rounded-xl p-5 border border-indigo-500/20 flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-700/10 rounded-full blur-xl translate-x-12 -translate-y-8 opacity-40" />
            
            <div className="flex items-center gap-4 relative">
              <div className="bg-indigo-500/20 p-2.5 rounded-lg border border-indigo-500/30">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white font-display">System Integrity Revitalized</h3>
                <p className="text-xs text-indigo-300 mt-0.5">
                  Successfully repaired <strong className="text-white">{fixedCount} broken registry keys</strong>. Invalid DLL paths and orphan triggers updated.
                </p>
              </div>
            </div>

            <button
              onClick={() => setFixCompleted(false)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-opacity-90 transition-all shrink-0 cursor-pointer border border-indigo-400/25 shadow-lg shadow-indigo-500/10"
            >
              Confirm State
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Filter Strip row */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            id="txt-search-registry"
            type="text"
            placeholder="Search keys, hives, commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 text-white text-xs pl-9 pr-4 py-2 rounded-lg border border-zinc-800 focus:outline-hidden focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Severity filter selectors */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto overflow-x-auto justify-end">
          <span className="text-xs text-zinc-500 flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['all', 'high', 'medium', 'low'].map((sev) => (
            <button
              id={`btn-reg-filter-${sev}`}
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`text-[10px] px-3 py-1 border rounded-md font-bold uppercase transition-all shrink-0 cursor-pointer ${
                severityFilter === sev
                  ? 'bg-indigo-950 border-indigo-800/80 text-indigo-400'
                  : 'bg-zinc-950/60 border-zinc-850 text-zinc-500 hover:bg-zinc-805 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout contents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Registry Selection Catalog */}
        <div className="lg:col-span-8 space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 font-mono">
              Suspect Registry References found
            </h3>

            {filteredIssues.filter(i => !i.fixed).length > 0 && (
              <button
                id="btn-select-all-reg"
                onClick={() => toggleSelectAll(filteredIssues)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-all"
              >
                Toggle Select Displayed
              </button>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-850">
            {filteredIssues.map((issue) => {
              const isSelected = selectedIds.includes(issue.id);
              return (
                <div 
                  key={issue.id} 
                  className={`p-4 transition-all duration-200 flex items-start gap-4 ${
                    issue.fixed 
                      ? 'bg-zinc-950/25 text-zinc-650' 
                      : isSelected 
                        ? 'bg-indigo-500/5' 
                        : 'hover:bg-zinc-850/40'
                  }`}
                >
                  {/* Checkbox or check identifier */}
                  <div className="mt-0.5 shrink-0">
                    {!issue.fixed ? (
                      <input
                        id={`chk-reg-${issue.id}`}
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(issue.id)}
                        className="w-4 h-4 bg-zinc-950 border-zinc-850 rounded focus:ring-indigo-500/50 cursor-pointer accent-indigo-500"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Check className="w-3 text-emerald-400 stroke-[3px]" />
                      </div>
                    )}
                  </div>

                  {/* Registry coordinates path layout */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded">
                        {issue.hive}
                      </span>
                      
                      <span className={`text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 border rounded-sm font-bold ${getSeverityBadge(issue.severity)}`}>
                        {issue.severity} Impact
                      </span>

                      {issue.fixed && (
                        <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-sm font-mono font-bold uppercase">
                          Repaired
                        </span>
                      )}
                    </div>

                    <p className={`font-mono text-[11px] tracking-tight truncate leading-normal ${issue.fixed ? 'text-zinc-650 line-through' : 'text-zinc-400'}`} title={issue.path}>
                      {issue.path}
                    </p>

                    <p className={`text-xs leading-relaxed ${issue.fixed ? 'text-zinc-550' : 'text-zinc-200 font-medium'}`}>
                      {issue.issue}
                    </p>
                  </div>
                </div>
              );
            })}

            {filteredIssues.length === 0 && (
              <div className="p-8 text-center text-zinc-500 text-sm">
                No matching registry entries found in table.
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-zinc-900 text-zinc-200 p-5 rounded-xl border border-zinc-850/85">
            <h3 className="text-sm font-display font-medium text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <span className="uppercase tracking-wider text-xs">Registry Safe Fix Hub</span>
            </h3>
            <p className="text-[11.5px] text-zinc-400 mt-2 leading-relaxed">
              Dangling path strings are marked safely. Re-indexing is non-destructive and saves system pointers.
            </p>

            <div className="space-y-3 mt-5 border-t border-zinc-800 pt-4">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Target Selected:</span>
                <span className="font-mono text-white">{selectedIds.length} path entries</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Highest Risk Selected:</span>
                <span className="font-mono text-rose-400">
                  {issues.filter(i => selectedIds.includes(i.id) && i.severity === 'high').length} keys
                </span>
              </div>
            </div>

            <button
              id="btn-execute-reg-fix"
              onClick={handleFixSelected}
              disabled={selectedIds.length === 0 || isOptimizing}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 mt-5 rounded-xl font-bold text-xs transition-colors border ${
                selectedIds.length === 0 || isOptimizing
                  ? 'bg-zinc-850 text-zinc-650 border-zinc-800 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/20 cursor-pointer shadow-lg shadow-indigo-500/10'
              }`}
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white animate-spin" />
                  <span>Modifying Hive...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Fix {selectedIds.length} Marked Bugs</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/15 text-blue-350 text-xs flex gap-3 leading-relaxed">
            <AlertOctagon className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-white block mb-0.5">Automatic Backup Enabled</strong>
              WinUtilities simulates creating a system registry restore state point before editing registry fields. This guarantees zero chance of partition corruption.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
