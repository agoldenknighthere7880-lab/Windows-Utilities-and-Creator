import React, { useState, useRef } from 'react';
import { 
  Lock, 
  Trash2, 
  Plus, 
  FileText, 
  ShieldAlert, 
  Terminal, 
  Sparkles, 
  ShieldCheck,
  RotateCcw,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ShreddedFile } from '../types';

export default function FileShredderView() {
  const [shredList, setShredList] = useState<ShreddedFile[]>([
    { id: 'file_01', name: 'financial_records_2025.xlsx', sizeKb: 342 },
    { id: 'file_02', name: 'browser_session_cookies.sqlite', sizeKb: 890 },
    { id: 'file_03', name: 'auth_keys_private.pem', sizeKb: 4 }
  ]);
  const [method, setMethod] = useState<'dod' | 'gutmann' | 'zero' | 'random'>('dod');
  const [shredding, setShredding] = useState(false);
  const [currentPass, setCurrentPass] = useState(0);
  const [totalPasses, setTotalPasses] = useState(3);
  const [shredLog, setShredLog] = useState<string[]>([]);
  const [fileNameInput, setFileNameInput] = useState('');
  const [fileSizeInput, setFileSizeInput] = useState<number>(45);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getPassCount = () => {
    switch (method) {
      case 'dod': return 3;
      case 'gutmann': return 35;
      case 'zero': return 1;
      case 'random': return 1;
    }
  };

  const getMethodName = () => {
    switch (method) {
      case 'dod': return 'DoD 5220.22-M (3-Pass Military Grade)';
      case 'gutmann': return 'Gutmann Algorithm (35-Pass Paranoiac Grade)';
      case 'zero': return 'Quick Zero Fill (1-Pass)';
      case 'random': return 'Random Bits Scrub (1-Pass)';
    }
  };

  const handleAddVirtualFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileNameInput) return;
    
    // clean up name
    let cleanName = fileNameInput.trim();
    if (!cleanName.includes('.')) {
      cleanName += '.txt';
    }

    const newFile: ShreddedFile = {
      id: `file_${Date.now()}`,
      name: cleanName,
      sizeKb: fileSizeInput || 12
    };

    setShredList(prev => [...prev, newFile]);
    setFileNameInput('');
    setFileSizeInput(45);
  };

  const handleRemoveFromList = (id: string) => {
    setShredList(prev => prev.filter(f => f.id !== id));
  };

  const handleResetQueue = () => {
    setShredList([
      { id: 'file_01', name: 'financial_records_2025.xlsx', sizeKb: 342 },
      { id: 'file_02', name: 'browser_session_cookies.sqlite', sizeKb: 890 },
      { id: 'file_03', name: 'auth_keys_private.pem', sizeKb: 4 }
    ]);
  };

  // Run DOD / Secure shredding simulator
  const handleExecuteShred = () => {
    if (shredList.length === 0 || shredding) return;
    setShredding(true);
    setShredLog([]);

    const passes = getPassCount();
    setTotalPasses(passes);

    let progressIndex = 0;
    const items = [...shredList];
    const logPool: string[] = [];

    const addLogLine = (line: string) => {
      logPool.push(`[${new Date().toLocaleTimeString()}] ${line}`);
      setShredLog([...logPool]);
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 50);
    };

    // Stage 1: Setup locks
    addLogLine(`Acquiring standard file description handles for ${items.length} targets...`);
    addLogLine(`Selected security shredding standard: ${getMethodName()}`);
    
    let currentPassCount = 1;

    const runPassSimulator = () => {
      if (currentPassCount <= passes) {
        setCurrentPass(currentPassCount);
        addLogLine(`[PASS ${currentPassCount}/${passes}] Initiated sectors rewrite cycle...`);
        
        items.forEach(file => {
          if (method === 'dod') {
            if (currentPassCount === 1) {
              addLogLine(`-> Writing fixed zero byte patterns (0x00) across blocks of '${file.name}'`);
            } else if (currentPassCount === 2) {
              addLogLine(`-> Writing fixed high polarity patterns (0xFF) across blocks in '${file.name}'`);
            } else {
              addLogLine(`-> Writing complex random seed matrix [0x${Math.floor(Math.random() * 256).toString(16).toUpperCase()}] block indices in '${file.name}'`);
            }
          } else if (method === 'zero') {
            addLogLine(`-> Overwriting sectors in '${file.name}' with binary nulls (0x00)`);
          } else if (method === 'random') {
            addLogLine(`-> Generating cryptographic random seed block sequences on '${file.name}'`);
          } else {
            addLogLine(`-> Gutmann pass ${currentPassCount}/35 executing magnetizing overrides on '${file.name}'`);
          }
        });

        currentPassCount++;
        // Speed up simulation timing for high passes like 35 (Gutmann)
        const nextDelay = method === 'gutmann' ? 120 : 1000;
        setTimeout(runPassSimulator, nextDelay);
      } else {
        // Validation Stage
        addLogLine('Comparing buffer sizes for file data validation...');
        items.forEach(file => {
          addLogLine(`-> Validated empty block residue for '${file.name}' - zero trace bits detected.`);
        });

        addLogLine('Deallocating physical sector pointers from partition index tables (MFT)...');
        addLogLine('Secure vaporize sequence complete! Standard file content is 100% recovered-proof.');

        setTimeout(() => {
          setShredList([]);
          setShredding(false);
          setCurrentPass(0);
        }, 800);
      }
    };

    setTimeout(() => {
      runPassSimulator();
    }, 1000);
  };

  const totalBytesKb = shredList.reduce((sum, f) => sum + f.sizeKb, 0);

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 max-w-6xl mx-auto h-full text-zinc-100">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-medium tracking-tight text-white">
            Secure File Shredder
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Permanently destroy sensitive files, database archives, and cookie sessions, making them completely unrecoverable, even by forensics teams.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 h-fit flex items-center gap-3">
          <Lock className="w-5 h-5 text-rose-500" />
          <div>
            <span className="text-[9px] text-zinc-500 font-mono block uppercase">Queued Payload</span>
            <span className="text-sm font-bold text-white font-mono">
              {shredList.length > 0 ? `${totalBytesKb.toLocaleString()} KB` : 'No files'}
            </span>
          </div>
        </div>
      </div>

      {/* Main dashboard columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column file list & manual adder */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Virtual File Adder Box */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-xs font-bold tracking-wider uppercase text-zinc-400 font-display mb-3">
              Add Virtual Files to Destroy
            </h3>
            
            <form onSubmit={handleAddVirtualFile} className="flex flex-col sm:flex-row gap-3">
              <input
                id="txt-shred-filename"
                type="text"
                required
                placeholder="filename.xlsx, secrets.pem, logs.csv..."
                value={fileNameInput}
                onChange={(e) => setFileNameInput(e.target.value)}
                className="flex-1 bg-zinc-950 text-zinc-100 text-xs px-3.5 py-3 rounded-lg border border-zinc-850 focus:outline-hidden focus:border-rose-500 placeholder-zinc-600"
              />
              <div className="relative w-full sm:w-36">
                <input
                  id="nbr-shred-filesize"
                  type="number"
                  placeholder="Size KB"
                  value={fileSizeInput}
                  onChange={(e) => setFileSizeInput(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-zinc-950 text-zinc-100 text-xs px-3.5 py-3 pr-10 rounded-lg border border-zinc-850 focus:outline-hidden focus:border-rose-500 placeholder-zinc-600"
                />
                <span className="absolute right-3.5 top-3 text-[9px] font-mono text-zinc-500 uppercase">KB</span>
              </div>
              <button
                id="btn-add-shred-file"
                type="submit"
                className="bg-zinc-100 hover:bg-zinc-250 text-zinc-900 px-5 py-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Target</span>
              </button>
            </form>
          </div>

          {/* Core Shred Queue table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-500 font-mono">
                Destroy Catalog Queue
              </span>
              
              {shredList.length === 0 && (
                <button
                  id="btn-reload-shred-fixtures"
                  onClick={handleResetQueue}
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reload Demo Fixtures
                </button>
              )}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-850/70">
              {shredList.map((file) => (
                <div key={file.id} className="p-4 flex items-center justify-between gap-4 hover:bg-zinc-850/40 transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-4.5 h-4.5 text-zinc-550 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-zinc-200 truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-[10px] text-zinc-550 font-mono mt-0.5">
                        Sector allocation: {Math.ceil(file.sizeKb / 4)} block chains
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded">
                      {file.sizeKb} KB
                    </span>
                    
                    <button
                      id={`btn-remove-shred-${file.id}`}
                      disabled={shredding}
                      onClick={() => handleRemoveFromList(file.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-455 rounded-lg hover:bg-zinc-950 transition-colors cursor-pointer"
                      title="Remove file from queue"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {shredList.length === 0 && (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-full w-fit mb-3 border border-emerald-500/20">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-semibold text-white font-display">Shred Queue Empty</h4>
                  <p className="text-[11px] text-zinc-500 max-w-xs mt-1 leading-normal">
                    No files waiting to be vaporized. Use folder generator box above to add mock files.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right column options & Shred Action dashboard */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 animate-fade-in">
          
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl font-sans">
            <h3 className="text-sm font-display font-semibold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-500" />
              <span>Vaporize Parameters</span>
            </h3>

            {/* Algorithm Selector dropdown */}
            <div className="mt-4 space-y-2">
              <label className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase block font-bold">SHREDDING STANDARD</label>
              <select
                id="sel-shred-method"
                disabled={shredding}
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full bg-zinc-950 text-zinc-200 text-xs px-3 py-2.5 rounded-lg border border-zinc-850 focus:outline-hidden focus:border-rose-500 cursor-pointer"
              >
                <option value="dod">DoD 5220.22-M (3-Pass Military)</option>
                <option value="gutmann">Gutmann Algorithm (35-Pass Paranoic)</option>
                <option value="zero text-zinc-500">Quick Zero Fill (1-Pass Zeroes)</option>
                <option value="random">Random bits override (1-Pass)</option>
              </select>
            </div>

            <div className="space-y-3 mt-6 border-t border-zinc-850 pt-4.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Total Files listed:</span>
                <span className="font-mono text-white font-bold">{shredList.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Disk Sectors targeted:</span>
                <span className="font-mono text-white font-bold">{shredList.length > 0 ? `${Math.ceil(totalBytesKb / 4)} chains` : '0 chains'}</span>
              </div>
            </div>

            <button
              id="btn-execute-shred-vaporize"
              disabled={shredList.length === 0 || shredding}
              onClick={handleExecuteShred}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 mt-5 rounded-xl font-bold text-xs transition-colors border ${
                shredList.length === 0 || shredding
                  ? 'bg-zinc-850 text-zinc-650 border-zinc-800 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500/20 cursor-pointer shadow-lg shadow-rose-600/15'
              }`}
            >
              {shredding ? (
                <>
                  <Trash2 className="w-4 h-4 animate-spin text-white mr-1" />
                  <span>Processing Pass {currentPass}/{totalPasses}...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Vaporize & Secure Burn Files</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-amber-500/5 border border-amber-500/15 text-amber-200 rounded-xl text-[11px] leading-relaxed flex gap-2.5">
            <ShieldAlert className="w-4.5 h-4.5 text-amber-500 shrink-0" />
            <div>
              <strong className="font-semibold block text-white mb-0.5">Warning on forensic restoration:</strong>
              Once completed, disk sector indices are overwoven. Files generated cannot be restored by software suites. Play safely!
            </div>
          </div>

        </div>

      </div>

      {/* Shred Console logs scrolling output */}
      <AnimatePresence>
        {(shredLog.length > 0 || shredding) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-black/90 text-rose-400 p-4 rounded-xl border border-zinc-800 font-mono text-[11px]"
          >
            <div className="flex justify-between items-center text-zinc-400 border-b border-zinc-900 pb-2 mb-2 font-semibold">
              <span className="flex items-center gap-1.5 font-display text-xs">
                <Terminal className="w-4 h-4 text-rose-500" />
                <span className="text-zinc-200">Forensics Sector Overwrite Monitor Console</span>
              </span>
              <span className="text-[10px] text-zinc-550 font-mono tracking-widest">REAL-TIME OVERRIDES</span>
            </div>

            <div 
              ref={scrollRef}
              className="h-44 overflow-y-auto space-y-1.5 text-zinc-300 font-mono pr-2"
            >
              {shredLog.map((log, idx) => (
                <div key={idx} className="leading-relaxed font-mono">
                  <span className="text-zinc-600 font-mono">[{idx + 1}]</span> {log}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
