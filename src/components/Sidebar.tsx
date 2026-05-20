import { ActiveTab } from '../types';
import { 
  LayoutDashboard, 
  Trash2, 
  ShieldAlert, 
  Power, 
  Cpu, 
  Lock, 
  Info, 
  Laptop,
  CheckCircle,
  AlertCircle,
  Sliders,
  Binary
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  systemHealth: {
    score: number;
    junkMb: number;
    regKeysCount: number;
  };
}

export default function Sidebar({ activeTab, setActiveTab, systemHealth }: SidebarProps) {
  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500/10';
    if (score >= 70) return 'text-amber-400 bg-amber-500/10';
    return 'text-rose-400 bg-rose-500/10';
  };

  const getStatusIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    return <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse" />;
  };

  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: '1-Click Dashboard',
      description: 'Central integrity score & repair',
      icon: LayoutDashboard,
      badge: systemHealth.score < 100 ? `${systemHealth.score}%` : 'Clean'
    },
    {
      id: 'disk_cleaner' as ActiveTab,
      label: 'Disk Cleaner',
      description: 'Erase redundant caches & temp files',
      icon: Trash2,
      badge: systemHealth.junkMb > 0 ? `${(systemHealth.junkMb / 1024).toFixed(1)} GB` : null
    },
    {
      id: 'registry_fixer' as ActiveTab,
      label: 'Registry Fixer',
      description: 'Repair broken system bindings',
      icon: ShieldAlert,
      badge: systemHealth.regKeysCount > 0 ? `${systemHealth.regKeysCount} keys` : null
    },
    {
      id: 'startup_manager' as ActiveTab,
      label: 'Startup Booster',
      description: 'Optimize background boot times',
      icon: Power,
      badge: 'Speed'
    },
    {
      id: 'ram_optimizer' as ActiveTab,
      label: 'RAM Optimizer',
      description: 'Reclaim stand-by memory blocks',
      icon: Cpu,
      badge: 'Live'
    },
    {
      id: 'file_shredder' as ActiveTab,
      label: 'Secure Shredder',
      description: 'Cryptographic permanent erase',
      icon: Lock,
      badge: 'Safe'
    },
    {
      id: 'system_specs' as ActiveTab,
      label: 'Hardware Specs',
      description: 'Device hardware & useragent info',
      icon: Laptop,
      badge: 'Specs'
    },
    {
      id: 'windows_creator' as ActiveTab,
      label: 'Windows Creator',
      description: 'Build custom unattended installer ISOs',
      icon: Sliders,
      badge: 'Build'
    },
    {
      id: 'winget_manager' as ActiveTab,
      label: 'Winget Repos',
      description: 'Manage Windows Package Repo manifests',
      icon: Binary,
      badge: 'Repo'
    }
  ];

  return (
    <aside className="w-72 bg-zinc-950/40 text-zinc-100 flex flex-col border-r border-zinc-800/80 shrink-0 select-none h-full justify-between">
      {/* Upper Logo / Banner */}
      <div className="p-5 border-b border-zinc-800/80">
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold px-1 mb-4">Diagnostics Console</div>
        
        {/* Dynamic System State Box */}
        <div className={`p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 flex items-center justify-between`}>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">System state</span>
            <span className="text-xs font-semibold mt-0.5 text-zinc-200">
              {systemHealth.score >= 90 ? 'Healthy State' : systemHealth.score >= 70 ? 'Needs Analysis' : 'Critical Bloat'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-display font-black text-white">{systemHealth.score}</span>
            {getStatusIcon(systemHealth.score)}
          </div>
        </div>
      </div>

      {/* Main Tab Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold px-2 py-1 mb-2">Maintenance Hub</div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              id={`tab-btn-${item.id}`}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left duration-200 group relative border ${
                isActive 
                  ? 'bg-accent-500/10 text-accent-400 border-accent-500/20 font-semibold' 
                  : 'hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100 border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-accent-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold leading-none truncate">{item.label}</p>
                <p className={`text-[10px] mt-0.5 truncate ${isActive ? 'text-accent-300/60' : 'text-zinc-600 group-hover:text-zinc-500'}`}>
                  {item.description}
                </p>
              </div>

              {item.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium tracking-wide shrink-0 border ${
                  isActive 
                    ? 'bg-accent-950/40 text-accent-400 border-accent-500/20' 
                    : item.id === 'dashboard' && systemHealth.score < 100
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                }`}>
                  {item.badge}
                </span>
              )}

              {/* Smooth Vertical Selection indicator bar on hover/active */}
              {isActive && (
                <div className="absolute left-0 top-2.5 bottom-2.5 w-0.5 bg-accent-500 rounded-r" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / System status credits */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 text-center">
        <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">
          SECURE SANDBOX WORKSPACE
        </p>
        <p className="text-[9px] text-zinc-600 mt-1">
          Memory Isolated • Zero Tracking
        </p>
      </div>
    </aside>
  );
}
