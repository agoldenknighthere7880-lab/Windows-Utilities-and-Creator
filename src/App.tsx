import { useState, CSSProperties } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import DiskCleanerView from './components/DiskCleanerView';
import RegistryFixerView from './components/RegistryFixerView';
import StartupManagerView from './components/StartupManagerView';
import RamOptimizerView from './components/RamOptimizerView';
import FileShredderView from './components/FileShredderView';
import SystemSpecsView from './components/SystemSpecsView';
import WindowsCreatorView from './components/WindowsCreatorView';
import WingetManagerView from './components/WingetManagerView';
import { Palette } from 'lucide-react';

import { ActiveTab, JunkCategory, RegistryIssue, StartupItem, SystemScore } from './types';
import { 
  INITIAL_JUNK_CATEGORIES, 
  INITIAL_REGISTRY_ISSUES, 
  INITIAL_STARTUP_ITEMS 
} from './mockData';

interface ThemeConfig {
  name: string;
  primary: string;
  primaryHover: string;
  accent300: string;
  accent400: string;
  accent500: string;
  accent600: string;
  accent950: string;
}

const THEMES: Record<string, ThemeConfig> = {
  blue: {
    name: 'Classic Blue',
    primary: '#0078d4',
    primaryHover: '#106ebe',
    accent300: '#93c5fd',
    accent400: '#60a5fa',
    accent500: '#0078d4',
    accent600: '#106ebe',
    accent950: '#0c2240',
  },
  emerald: {
    name: 'Emerald Mint',
    primary: '#10b981',
    primaryHover: '#059669',
    accent300: '#6ee7b7',
    accent400: '#34d399',
    accent500: '#10b981',
    accent600: '#059669',
    accent950: '#022c22',
  },
  amber: {
    name: 'Cyber Amber',
    primary: '#f59e0b',
    primaryHover: '#d97706',
    accent300: '#fde047',
    accent400: '#fbbf24',
    accent500: '#f59e0b',
    accent600: '#d97706',
    accent950: '#2d1a00',
  },
  purple: {
    name: 'Royal Amethyst',
    primary: '#8b5cf6',
    primaryHover: '#7c3aed',
    accent300: '#c084fc',
    accent400: '#a78bfa',
    accent500: '#8b5cf6',
    accent600: '#7c3aed',
    accent950: '#2e1065',
  },
  crimson: {
    name: 'Crimson Rust',
    primary: '#ef4444',
    primaryHover: '#dc2626',
    accent300: '#fca5a5',
    accent400: '#f87171',
    accent500: '#ef4444',
    accent600: '#dc2626',
    accent950: '#450a0a',
  }
};

export default function App() {
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('winutilities_theme') || 'blue');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [junkCategories, setJunkCategories] = useState<JunkCategory[]>(INITIAL_JUNK_CATEGORIES);
  const [registryIssues, setRegistryIssues] = useState<RegistryIssue[]>(INITIAL_REGISTRY_ISSUES);
  const [startupItems, setStartupItems] = useState<StartupItem[]>(INITIAL_STARTUP_ITEMS);
  const [isScanning, setIsScanning] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [scanHasRun, setScanHasRun] = useState(false);

  // Dynamic calculated system integrity score
  const getDynamicScore = (): SystemScore => {
    let baseScore = 100;

    // 1. Scrap Files Penalty: Deduct 2.5 points per 500 MB
    const activeJunkSize = junkCategories
      .filter(c => !c.cleaned)
      .reduce((sum, c) => sum + c.sizeInMb, 0);
    const junkPenalty = (activeJunkSize / 500) * 2.5;
    baseScore -= junkPenalty;

    // 2. Corrupt entries: Deduct 4 points per unfixed issue
    const activeRegCount = registryIssues.filter(i => !i.fixed).length;
    const regPenalty = activeRegCount * 4;
    baseScore -= regPenalty;

    // 3. Startup payload impact load penalties
    const activeHighStartup = startupItems.filter(i => i.enabled && i.impact === 'high').length;
    const activeMedStartup = startupItems.filter(i => i.enabled && i.impact === 'medium').length;
    const startupPenalty = (activeHighStartup * 3) + (activeMedStartup * 1);
    baseScore -= startupPenalty;

    // Ensure score scales safely
    const finalScore = Math.max(12, Math.min(100, Math.round(baseScore)));

    return {
      healthScore: finalScore,
      junkFoundMb: Math.round(activeJunkSize),
      registryIssuesCount: activeRegCount,
      disabledStartupCount: startupItems.filter(i => !i.enabled).length,
      freeableRamBg: 2.8 // Standby reclaim estimate
    };
  };

  const systemScore = getDynamicScore();

  // Full-suite Analysis Diagnostic simulator
  const handleFullScan = async () => {
    setIsScanning(true);
    await new Promise(resolve => setTimeout(resolve, 3400));
    setScanHasRun(true);
    setIsScanning(false);
  };

  // 1-Click Repair System Routine optimizer
  const handleFullOptimize = async () => {
    setIsOptimizing(true);
    await new Promise(resolve => setTimeout(resolve, 2200));

    // Clear Selected checklist categories
    setJunkCategories(prev =>
      prev.map(c => c.selected ? { ...c, cleaned: true, sizeInMb: 0 } : c)
    );

    // Patch selected issues
    setRegistryIssues(prev =>
      prev.map(i => i.selected ? { ...i, fixed: true } : i)
    );

    setIsOptimizing(false);
  };

  // Inline Category Disk Cleans
  const handleCleanCategories = async (ids: string[]) => {
    setIsOptimizing(true);
    await new Promise(resolve => setTimeout(resolve, 1400));

    setJunkCategories(prev =>
      prev.map(c => ids.includes(c.id) ? { ...c, cleaned: true, sizeInMb: 0 } : c)
    );

    setIsOptimizing(false);
  };

  // Inline Registry Issues Fixes
  const handleFixIssues = async (ids: string[]) => {
    setIsOptimizing(true);
    await new Promise(resolve => setTimeout(resolve, 1400));

    setRegistryIssues(prev =>
      prev.map(i => ids.includes(i.id) ? { ...i, fixed: true } : i)
    );

    setIsOptimizing(false);
  };

  // Toggle startup booster active daemon state
  const handleToggleStartupItem = (id: string) => {
    setStartupItems(prev =>
      prev.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item)
    );
  };

  // Add custom boot loader definitions to startup
  const handleAddStartupItem = (newItem: Omit<StartupItem, 'id'>) => {
    const itemWithId: StartupItem = {
      ...newItem,
      id: `start_${Date.now()}`
    };
    setStartupItems(prev => [itemWithId, ...prev]);
  };

  // Remove custom loader definitions from table
  const handleRemoveStartupItem = (id: string) => {
    setStartupItems(prev => prev.filter(item => item.id !== id));
  };

  // Routing render helper
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            score={systemScore}
            onScan={handleFullScan}
            onOptimize={handleFullOptimize}
            isScanning={isScanning}
            isOptimizing={isOptimizing}
            scanHasRun={scanHasRun}
          />
        );
      case 'disk_cleaner':
        return (
          <DiskCleanerView
            categories={junkCategories}
            onCleanCategories={handleCleanCategories}
            isOptimizing={isOptimizing}
          />
        );
      case 'registry_fixer':
        return (
          <RegistryFixerView
            issues={registryIssues}
            onFixIssues={handleFixIssues}
            isOptimizing={isOptimizing}
          />
        );
      case 'startup_manager':
        return (
          <StartupManagerView
            startupItems={startupItems}
            onToggleItem={handleToggleStartupItem}
            onAddItem={handleAddStartupItem}
            onRemoveItem={handleRemoveStartupItem}
          />
        );
      case 'ram_optimizer':
        return <RamOptimizerView />;
      case 'file_shredder':
        return <FileShredderView />;
      case 'system_specs':
        return <SystemSpecsView />;
      case 'windows_creator':
        return <WindowsCreatorView />;
      case 'winget_manager':
        return <WingetManagerView />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center p-8 text-slate-400">
            Route under layout construction.
          </div>
        );
    }
  };

  return (
    <div 
      id="main-applet-shell" 
      className="flex flex-col h-screen w-screen bg-[#09090b] text-zinc-100 overflow-hidden select-none"
      style={{
        '--accent-300': THEMES[theme]?.accent300 || THEMES.blue.accent300,
        '--accent-400': THEMES[theme]?.accent400 || THEMES.blue.accent400,
        '--accent-500': THEMES[theme]?.accent500 || THEMES.blue.accent500,
        '--accent-600': THEMES[theme]?.accent600 || THEMES.blue.accent600,
        '--accent-950': THEMES[theme]?.accent950 || THEMES.blue.accent950,
      } as CSSProperties}
    >
      {/* Top Application Header spanning fully across */}
      <header className="h-16 border-b border-zinc-800/80 flex items-center justify-between px-6 bg-zinc-950/60 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-accent-500/25 transition-all duration-300">W</div>
          <h1 className="text-sm sm:text-base font-semibold tracking-tight text-white flex items-center gap-2">
            WinUtilities Suite <span className="text-zinc-500 font-normal text-xs sm:text-sm ml-1 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 font-mono">v1.2.0 Professional</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Dynamic Theme color switcher palette picker */}
          <div className="flex items-center gap-2.5 bg-zinc-900/60 border border-zinc-800/80 px-3 py-1.5 rounded-full shadow-inner">
            <Palette className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[10px] uppercase font-mono text-zinc-500 font-bold hidden md:inline">Theme:</span>
            <div className="flex items-center gap-1.5">
              {Object.entries(THEMES).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key);
                    localStorage.setItem('winutilities_theme', key);
                  }}
                  title={`Switch to ${config.name} theme`}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 relative cursor-pointer hover:scale-115 active:scale-90 border`}
                  style={{ 
                    backgroundColor: config.primary,
                    borderColor: theme === key ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: theme === key ? `0 0 8px ${config.primary}` : 'none'
                  }}
                />
              ))}
            </div>
          </div>

          <div className="px-3 py-1 bg-zinc-900 rounded-full text-[10px] sm:text-xs font-medium text-zinc-400 border border-zinc-800">
            Last Scan: {scanHasRun ? 'Completed just now' : 'Never analyzed'}
          </div>
          <div className="text-xs text-zinc-500 font-mono hidden sm:inline-block bg-zinc-900/50 px-2.5 py-1 rounded border border-zinc-800/60">
            SECURE WORKSPACE
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Visual Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          systemHealth={{
            score: systemScore.healthScore,
            junkMb: systemScore.junkFoundMb,
            regKeysCount: systemScore.registryIssuesCount
          }}
        />

        {/* Viewport Render area */}
        <main className="flex-1 bg-zinc-950/20 overflow-hidden relative">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
