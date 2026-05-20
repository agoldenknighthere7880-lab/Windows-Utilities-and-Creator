import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, 
  Disc, 
  Usb, 
  FolderOpen, 
  CheckCircle, 
  Cpu, 
  Terminal, 
  RefreshCw, 
  Flame,
  ShieldCheck, 
  EyeOff, 
  Layers, 
  Sparkles,
  Download,
  AlertTriangle,
  Info,
  HardDrive,
  Binary
} from 'lucide-react';

interface OsTemplate {
  id: string;
  family: 'win11' | 'win10' | 'server';
  name: string;
  version: string;
  sizeGb: string;
  released: string;
  description: string;
}

const OS_TEMPLATES: OsTemplate[] = [
  // Windows 11 Editions (All Versions)
  {
    id: 'win11_pro',
    family: 'win11',
    name: 'Windows 11 Professional',
    version: '24H2 (Build 26100)',
    sizeGb: '6.4 GB',
    released: 'Oct 2024',
    description: 'Standard enterprise/retail version supporting full virtualization (Hyper-V), remote desktop, and BitLocker encryption.'
  },
  {
    id: 'win11_home',
    family: 'win11',
    name: 'Windows 11 Home Edition',
    version: '24H2 (Build 26100)',
    sizeGb: '5.8 GB',
    released: 'Oct 2024',
    description: 'Perfect for standard home consumers. Fully optimized for core applications, high-performance gaming, and security.'
  },
  {
    id: 'win11_enterprise',
    family: 'win11',
    name: 'Windows 11 Enterprise',
    version: '23H2 (Build 22631)',
    sizeGb: '6.6 GB',
    released: 'Oct 2023',
    description: 'Optimized for high-density corporate networks with software-restriction policies and advanced AppLocker policy sets.'
  },
  {
    id: 'win11_education',
    family: 'win11',
    name: 'Windows 11 Education',
    version: '23H2 (Build 22631)',
    sizeGb: '6.1 GB',
    released: 'Oct 2023',
    description: 'Pre-configured scholastic version with restricted app scopes, customized default templates, and zero commercial ads.'
  },
  {
    id: 'win11_ltsc',
    family: 'win11',
    name: 'Windows 11 Enterprise LTSC',
    version: '2024 IoT Enterprise LTSC',
    sizeGb: '4.8 GB',
    released: 'Apr 2024',
    description: 'Clean, light IoT enterprise edition with absolute zero pre-installed telemetry, Xbox drivers, or Windows Store bloatware.'
  },
  {
    id: 'win11_se',
    family: 'win11',
    name: 'Windows 11 SE Cloud Edition',
    version: '22H2 (Cloud Managed)',
    sizeGb: '4.2 GB',
    released: 'Jan 2022',
    description: 'Ultra-lightweight cloud-first operating system designed for restricted web terminal clients and educational environments.'
  },

  // Windows 10 Editions (All Versions)
  {
    id: 'win10_pro',
    family: 'win10',
    name: 'Windows 10 Professional',
    version: '22H2 (Build 19045)',
    sizeGb: '5.8 GB',
    released: 'Nov 2022',
    description: 'Traditional solid desktop workspace, fully customized with legacy hardware configurations and hypervisor profiles.'
  },
  {
    id: 'win10_home',
    family: 'win10',
    name: 'Windows 10 Home Edition',
    version: '22H2 (Build 19045)',
    sizeGb: '5.2 GB',
    released: 'Nov 2022',
    description: 'Standard consumer desktop experience. Simple profile, low background overhead, stable device rate capability.'
  },
  {
    id: 'win10_enterprise',
    family: 'win10',
    name: 'Windows 10 Enterprise',
    version: '22H2 (Build 19045)',
    sizeGb: '6.1 GB',
    released: 'Nov 2022',
    description: 'High-availability retail profile with branch cache modules, credential guards, and volume deployment licenses.'
  },
  {
    id: 'win10_education',
    family: 'win10',
    name: 'Windows 10 Education',
    version: '22H2 (Build 19045)',
    sizeGb: '5.4 GB',
    released: 'Nov 2022',
    description: 'Clean school desktop image with restricted app execution policies and pre-disabled Cortana system modules.'
  },
  {
    id: 'win10_ltsc',
    family: 'win10',
    name: 'Windows 10 Enterprise LTSC',
    version: '2021 IoT Enterprise LTSC',
    sizeGb: '3.9 GB',
    released: 'Nov 2021',
    description: 'Sublime ultra-stable distribution. Absolutely zero telemetry, minimal services, and targeted security hotfix maintenance.'
  },

  // Server Versions
  {
    id: 'win_server_2025',
    family: 'server',
    name: 'Windows Server 2025 Standard',
    version: 'Standard Edition vNext',
    sizeGb: '7.1 GB',
    released: 'Jan 2025',
    description: 'High-availability directory host image formatted with dense hypervisor drivers, active directory features, and clustering.'
  },
  {
    id: 'win_server_2022',
    family: 'server',
    name: 'Windows Server 2022 LTSC',
    version: 'Datacenter / Standard',
    sizeGb: '6.7 GB',
    released: 'Aug 2021',
    description: 'Robust server backbone supporting dense container deployments, virtualization networks, and local area directory storage.'
  }
];

const MOCK_USB_DRIVES = [
  { id: 'usb_1', label: 'SanDisk Ultra Luxe - USB 3.1 (32 GB) [/dev/sdb]', size: '28.8 GB free' },
  { id: 'usb_2', label: 'Samsung BAR Plus - High Speed (64 GB) [/dev/sdc]', size: '59.6 GB free' },
  { id: 'usb_3', label: 'Crucial Glide Safe Boot (16 GB) [/dev/sdd]', size: '14.9 GB free' }
];

const MOCK_LOCAL_DISKS = [
  {
    id: 'disk_0',
    name: 'Disk 0: Samsung 990 Pro NVMe SSD (1 TB)',
    interface: 'NVMe Gen 4x4 PCIe',
    freeSpace: '180 GB',
    partitions: [
      { id: 'd0_p1', label: 'Partition 1: Recovery System', size: '529 MB', type: 'NTFS', canInstall: false, badge: 'System Locked' },
      { id: 'd0_p2', label: 'Partition 2: EFI System Partition', size: '100 MB', type: 'FAT32', canInstall: false, badge: 'Boot Protected' },
      { id: 'd0_p4', label: 'Partition 4: OS Main Partition [C:]', size: '620 GB', type: 'NTFS', canInstall: false, badge: 'Active OS' },
      { id: 'd0_p5', label: 'Partition 5: Dual Boot Free Storage', size: '180 GB', type: 'RAW', canInstall: true, badge: 'Ready Volume' },
      { id: 'd0_p6', label: 'Partition 6: Local Scratch Space [D:]', size: '130 GB', type: 'NTFS', canInstall: true, badge: 'Data Volume' }
    ]
  },
  {
    id: 'disk_1',
    name: 'Disk 1: Crucial MX500 SATA III SSD (2 TB)',
    interface: 'SATA III (6 Gbps)',
    freeSpace: '363 GB',
    partitions: [
      { id: 'd1_p1', label: 'Partition 1: Backup Storage [E:]', size: '1.5 TB', type: 'NTFS', canInstall: true, badge: 'Data Volume' },
      { id: 'd1_p2', label: 'Partition 2: Unallocated Target Partition [F:]', size: '363 GB', type: 'RAW', canInstall: true, badge: 'Ready Volume' }
    ]
  }
];

export default function WindowsCreatorView() {
  const [selectedOs, setSelectedOs] = useState<string>('win11_pro');
  const [targetType, setTargetType] = useState<'iso' | 'usb' | 'partition' | 'setup_exe'>('iso');
  const [selectedUsb, setSelectedUsb] = useState<string>('usb_2');
  
  // Local Hard Drive states
  const [selectedLocalDisk, setSelectedLocalDisk] = useState<string>('disk_0');
  const [selectedLocalPartition, setSelectedLocalPartition] = useState<string>('d0_p5');
  const [formatPartition, setFormatPartition] = useState<boolean>(true);
  const [injectBcd, setInjectBcd] = useState<boolean>(true);

  // Setup.exe Custom Stubs states
  const [setupSilentMode, setSetupSilentMode] = useState<boolean>(false);
  const [setupEmbedWim, setSetupEmbedWim] = useState<boolean>(false);
  const [setupCompressExe, setSetupCompressExe] = useState<boolean>(true);
  const [setupRequireAdmin, setSetupRequireAdmin] = useState<boolean>(true);
  const [setupTitle, setSetupTitle] = useState<string>('Windows Custom Unattended Installer');

  // OS List filters
  const [osFilter, setOsFilter] = useState<'all' | 'win11' | 'win10' | 'server'>('all');
  
  // Custom Slipstream Tweaks State
  const [bypassHardware, setBypassHardware] = useState(true);
  const [bypassOnlineAccount, setBypassOnlineAccount] = useState(true);
  const [disableTelemetry, setDisableTelemetry] = useState(true);
  const [removeBloatware, setRemoveBloatware] = useState(true);
  const [devMode, setDevMode] = useState(false);
  const [forceDarkMode, setForceDarkMode] = useState(true);

  // Build Operation States
  const [building, setBuilding] = useState(false);
  const [buildPercent, setBuildPercent] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [buildCompleted, setBuildCompleted] = useState(false);
  const [fileOutputName, setFileOutputName] = useState<string>('');

  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleDiskChange = (diskId: string) => {
    setSelectedLocalDisk(diskId);
    const disk = MOCK_LOCAL_DISKS.find(d => d.id === diskId);
    const readyPartition = disk?.partitions.find(p => p.canInstall);
    if (readyPartition) {
      setSelectedLocalPartition(readyPartition.id);
    }
  };

  const handleDownloadSetup = () => {
    const mzHeader = [0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0xff, 0xff, 0x00, 0x00];
    const metaString = JSON.stringify({
      engine: "Unattended Setup Engine v2.4",
      compiledAt: new Date().toISOString(),
      targetOS: selectedOs,
      title: setupTitle,
      tweaks: {
        bypassHardware,
        bypassOnlineAccount,
        disableTelemetry,
        removeBloatware,
        devMode,
        forceDarkMode,
        setupSilentMode,
        setupEmbedWim,
        setupCompressExe,
        setupRequireAdmin
      },
      warning: "This is a custom-tailored unattended deployment setup assistant stub helper compiled online. Run on target Windows machine to initialize partitioning."
    });
    const metaBytes = Array.from(new TextEncoder().encode(metaString));
    const blobContent = new Uint8Array([...mzHeader, ...metaBytes]);
    const blob = new Blob([blobContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${setupTitle.replace(/\s+/g, '_').toLowerCase()}.exe`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Run customized builder logic simulator
  const handleStartBuild = async () => {
    if (building) return;

    setBuilding(true);
    setBuildCompleted(false);
    setBuildPercent(0);
    setLogs([]);

    const addLog = (text: string) => {
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
    };

    const steps = [
      {
        percent: 5,
        step: 'Initializing distribution sandbox folder...',
        log: 'Acquiring localized volume indicators... Sandbox directory allocated.'
      },
      {
        percent: 15,
        step: 'Extracting source install.wim distribution archives...',
        log: 'Mounting virtual install.wim image (Index 1: Professional Edition)...'
      },
      {
        percent: 28,
        step: 'Integrating registry hardware bypass files...',
        log: 'Slipstreaming Registry values: Setup\\LabConfig\\BypassTPMCheck = 0x00000001...'
      },
      {
        percent: 34,
        step: 'Injecting BypassSecureBootCheck registry tables...',
        log: 'Slipstreaming Registry values: Setup\\LabConfig\\BypassSecureBootCheck = 0x00000001...'
      },
      {
        percent: 42,
        step: 'Writing auto-unattended OOBE response file (Autounattend.xml)...',
        log: 'Pre-config: Auto-skipping Windows Welcome, injecting OOBE\\BypassNRO offline parameters.'
      },
      {
        percent: 58,
        step: 'Executing targeted bloatware package removal...',
        log: 'Running DISM.exe /Offline /Remove-ProvisionedAppxPackage (Removed: Clipchamp, Disney+, TikTok).'
      },
      {
        percent: 65,
        step: 'Disabling diagnostic telemetry pipelines...',
        log: 'Applied registry override: HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection\\AllowTelemetry = 0'
      },
      {
        percent: 74,
        step: 'Configuring user environment settings...',
        log: 'Setting default personalization accent colors. Enforced system dark mode values.'
      },
      {
        percent: 85,
        step: targetType === 'iso' 
          ? 'Packaging custom bootable ISO image...' 
          : targetType === 'usb'
            ? 'Formatting target USB partition table...'
            : targetType === 'partition'
              ? 'Pre-allocating local physical drive partition...'
              : 'Embedding execution manifest and compiling setup.exe stub...',
        log: targetType === 'iso' 
          ? 'Compiling files into ISO 9660 Joliet-format with bootsect.exe loader...'
          : targetType === 'usb'
            ? 'Initializing FAT32 boot sector layout on target flash media partition...'
            : targetType === 'partition'
              ? `Locking local disk blocks... Preparing quick-format to NTFS on targeted partition index...`
              : `Embedding Win32 manifest metadata, requiring level="requireAdministrator" execution rights...`
      },
      {
        percent: 94,
        step: targetType === 'iso' 
          ? 'Finalizing metadata headers...' 
          : targetType === 'usb'
            ? 'Writing active boot sectors to USB...'
            : targetType === 'partition'
              ? 'Writing customized Windows components to partition...'
              : 'Generating final setup.exe self-extracting payload structure...',
        log: targetType === 'iso'
          ? 'Calculating SHA-256 integrity hash for built distribution payload...'
          : targetType === 'usb'
            ? 'Copying PE-WIM image frames... Synchronizing volume tables...'
            : targetType === 'partition'
              ? `DISM.exe /Apply-Image script successfully wrote files. Running Bcdboot.exe to configure dual-boots.`
              : `Assembling executable segments. Configured ${setupEmbedWim ? 'embedded WIM frame storage' : 'dynamic network payload downloader'}. Applying UPX packer...`
      },
      {
        percent: 100,
        step: 'Build pipeline completed successfully!',
        log: targetType === 'iso'
          ? 'Distribution ISO ready for deployment. MD5 Hash verified.'
          : targetType === 'usb'
            ? 'USB Boot Drive has been provisioned. Hardware deployment ready!'
            : targetType === 'partition'
              ? 'Local SSD Partition configured! Dual-boot UEFI entry successfully registered.'
              : `Executable setup helper "${setupTitle}.exe" successfully compiled. Deploy-ready on any Windows system.`
      }
    ];

    // Speed parameter depending on toggles
    for (const action of steps) {
      setCurrentStep(action.step);
      addLog(action.step);
      if (action.log) {
        await new Promise((resolve) => setTimeout(resolve, 310));
        addLog(action.log);
      }

      // Prepend extra log details on specific stages based on user selections
      if (action.percent === 28 && !bypassHardware) {
        addLog('--> User chose not to bypass TPM/Secure Boot. Skipping registry patch.');
      }
      if (action.percent === 42 && !bypassOnlineAccount) {
        addLog('--> Skipping automatic OOBE offline account bypass generation.');
      }
      if (action.percent === 58 && !removeBloatware) {
        addLog('--> Retaining default telemetry index app packages.');
      }
      if (action.percent === 65 && disableTelemetry) {
        addLog("[INFO] Policy enforced: OOBE Microsoft Advertising Hub shut down completely.");
      }
      if (action.percent === 74 && devMode) {
        addLog('[PATCH] Developer mode enabled. Provisioning WSL-2 Hyper-V component parameters.');
      }
      if (action.percent === 85 && targetType === 'setup_exe') {
        if (setupSilentMode) addLog('[WIZARD] Configured in-silent background mode check. Installation runs with /quiet command-line parameters.');
        if (setupCompressExe) addLog('[PACKER] UPX packer applied level-9 compression. Reduced launcher stub file weight by ~45% securely.');
        if (setupRequireAdmin) addLog('[SECURITY] Win32 manifest compiled: requestedExecutionLevel set to high-privilege requireAdministrator.');
      }

      setBuildPercent(action.percent);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    const templateName = OS_TEMPLATES.find(o => o.id === selectedOs)?.name || 'WindowsCustom';
    const cleanName = templateName.replace(/\s+/g, '_').toLowerCase();
    
    let outcomeName = '';
    if (targetType === 'iso') {
      outcomeName = `${cleanName}_tweaked.iso`;
    } else if (targetType === 'usb') {
      outcomeName = 'USB Flash boot sectors';
    } else if (targetType === 'partition') {
      const diskObj = MOCK_LOCAL_DISKS.find(d => d.id === selectedLocalDisk);
      const partObj = diskObj?.partitions.find(p => p.id === selectedLocalPartition);
      outcomeName = `${diskObj?.name || 'Local SSD'} (${partObj?.label || 'Target Partition'})`;
    } else {
      outcomeName = `${setupTitle.replace(/\s+/g, '_').toLowerCase()}.exe`;
    }
    setFileOutputName(outcomeName);
    setBuilding(false);
    setBuildCompleted(true);
  };

  const activeOsDetails = OS_TEMPLATES.find(o => o.id === selectedOs);

  // Filter templates list based on filter tab state
  const filteredTemplates = OS_TEMPLATES.filter(tpl => {
    if (osFilter === 'all') return true;
    return tpl.family === osFilter;
  });

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 max-w-6xl mx-auto h-full text-zinc-100 animate-fade-in font-sans">
      
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-medium tracking-tight text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-blue-500" />
            Windows Installer Creator
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Build custom slimmed-down ISO files, bootable USB devices, or provision custom Windows installations on any local drive partition.
          </p>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 h-fit flex items-center gap-3">
          <Disc className="w-5 h-5 text-blue-400 animate-spin-slow" />
          <div>
            <span className="text-[9px] text-zinc-500 font-mono block uppercase">Active slipstream engine</span>
            <span className="text-sm font-bold text-white font-mono">
              Unattended v2.4
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Division Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Options Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Choose Base Edition */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  1. Select Target Windows OS Distribution
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850">
                {filteredTemplates.length} Editions Available
              </span>
            </div>

            {/* Sub-tabs Filters */}
            <div className="flex flex-wrap gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-850 w-full sm:w-fit">
              <button
                disabled={building}
                onClick={() => setOsFilter('all')}
                className={`px-3 py-1 text-[11px] font-semibold select-none cursor-pointer duration-150 transition-colors uppercase rounded-md ${
                  osFilter === 'all' ? 'bg-zinc-800 text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                All ({OS_TEMPLATES.length})
              </button>
              <button
                disabled={building}
                onClick={() => setOsFilter('win11')}
                className={`px-3 py-1 text-[11px] font-semibold select-none cursor-pointer duration-150 transition-colors uppercase rounded-md ${
                  osFilter === 'win11' ? 'bg-blue-600/15 text-blue-400 border border-blue-500/10' : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
              >
                Win 11 ({OS_TEMPLATES.filter(o => o.family === 'win11').length})
              </button>
              <button
                disabled={building}
                onClick={() => setOsFilter('win10')}
                className={`px-3 py-1 text-[11px] font-semibold select-none cursor-pointer duration-150 transition-colors uppercase rounded-md ${
                  osFilter === 'win10' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/10' : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
              >
                Win 10 ({OS_TEMPLATES.filter(o => o.family === 'win10').length})
              </button>
              <button
                disabled={building}
                onClick={() => setOsFilter('server')}
                className={`px-3 py-1 text-[11px] font-semibold select-none cursor-pointer duration-150 transition-colors uppercase rounded-md ${
                  osFilter === 'server' ? 'bg-purple-600/15 text-purple-400 border border-purple-500/10' : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
              >
                Servers ({OS_TEMPLATES.filter(o => o.family === 'server').length})
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {filteredTemplates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => !building && setSelectedOs(tpl.id)}
                  className={`p-4 rounded-xl text-left border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                    selectedOs === tpl.id
                      ? 'bg-blue-600/10 border-blue-500/40 text-white'
                      : 'bg-zinc-950 border-zinc-850 hover:border-zinc-800 text-zinc-400 hover:text-zinc-205'
                  } ${building ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs py-0.5 text-zinc-100">{tpl.name}</span>
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 block px-1.5 py-0.5 rounded border border-zinc-800">
                        {tpl.sizeGb}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{tpl.version}</p>
                    <p className="text-[11px] text-zinc-400 mt-2.5 leading-relaxed line-clamp-2">
                      {tpl.description}
                    </p>
                  </div>
                  <div className="text-[9px] text-zinc-500 mt-4 font-mono font-bold">Released: {tpl.released}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Slipstream Tweaks & Optimizations */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-zinc-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  2. Customize Unattended Installation Patches
                </h3>
              </div>
              <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/25">
                Bypass Restrictions Enforced
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              {/* Box 1: Hardware Bypass */}
              <label className={`p-3.5 rounded-xl border flex gap-3 cursor-pointer items-start transition-all ${
                bypassHardware ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-900/40 border-zinc-850 text-zinc-500 opacity-60'
              }`}>
                <input
                  type="checkbox"
                  disabled={building}
                  checked={bypassHardware}
                  onChange={(e) => setBypassHardware(e.target.checked)}
                  className="mt-1 rounded border-zinc-700 bg-zinc-950 text-blue-500 focus:ring-blue-500 h-4 w-4 shrink-0 checkbox-blue"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-zinc-200">Bypass TPM 2.0 & Secure Boot</span>
                    <Cpu className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                    Inject zero values to skip strict processor type, motherboard TPM modules, and secure bios verification steps completely.
                  </p>
                </div>
              </label>

              {/* Box 2: Force Account Offline */}
              <label className={`p-3.5 rounded-xl border flex gap-3 cursor-pointer items-start transition-all ${
                bypassOnlineAccount ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-900/40 border-zinc-850 text-zinc-500 opacity-60'
              }`}>
                <input
                  type="checkbox"
                  disabled={building}
                  checked={bypassOnlineAccount}
                  onChange={(e) => setBypassOnlineAccount(e.target.checked)}
                  className="mt-1 rounded border-zinc-700 bg-zinc-950 text-blue-500 focus:ring-blue-500 h-4 w-4 shrink-0 checkbox-blue"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-zinc-200">Force Local Offline Account Setup</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                    Prevent OOBE online constraints. Bypasses the Microsoft login screen so you can establish standard local configurations.
                  </p>
                </div>
              </label>

              {/* Box 3: Disable Telemetry */}
              <label className={`p-3.5 rounded-xl border flex gap-3 cursor-pointer items-start transition-all ${
                disableTelemetry ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-900/40 border-zinc-850 text-zinc-500 opacity-60'
              }`}>
                <input
                  type="checkbox"
                  disabled={building}
                  checked={disableTelemetry}
                  onChange={(e) => setDisableTelemetry(e.target.checked)}
                  className="mt-1 rounded border-zinc-700 bg-zinc-950 text-blue-500 focus:ring-blue-500 h-4 w-4 shrink-0 checkbox-blue"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-zinc-200">De-Telemetry Client & Bloat Ads</span>
                    <EyeOff className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                    Stops Microsoft Diagnostic telemetry from forwarding client usage habits. Bypasses lockscreen ads and promoted tiles.
                  </p>
                </div>
              </label>

              {/* Box 4: Debloat Base OS */}
              <label className={`p-3.5 rounded-xl border flex gap-3 cursor-pointer items-start transition-all ${
                removeBloatware ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-900/40 border-zinc-850 text-zinc-500 opacity-60'
              }`}>
                <input
                  type="checkbox"
                  disabled={building}
                  checked={removeBloatware}
                  onChange={(e) => setRemoveBloatware(e.target.checked)}
                  className="mt-1 rounded border-zinc-700 bg-zinc-950 text-blue-500 focus:ring-blue-500 h-4 w-4 shrink-0 checkbox-blue"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-zinc-200">Strip Non-Essential Windows Apps</span>
                    <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                    Removes telemetry pre-shipped third-party junk (like Solitaire, Cortana, Xbox accessories) straight out of the mounted WIM folder.
                  </p>
                </div>
              </label>

              {/* Box 5: Developer Mode */}
              <label className={`p-3.5 rounded-xl border flex gap-3 cursor-pointer items-start transition-all ${
                devMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-900/40 border-zinc-850 text-zinc-500 opacity-60'
              }`}>
                <input
                  type="checkbox"
                  disabled={building}
                  checked={devMode}
                  onChange={(e) => setDevMode(e.target.checked)}
                  className="mt-1 rounded border-zinc-700 bg-zinc-950 text-blue-500 focus:ring-blue-500 h-4 w-4 shrink-0 checkbox-blue"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-zinc-200">Force Developer Mode & WSL</span>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                    Initializes system files with Developer Mode enabled. Unlocks side-loading scripts and sets WSL2 hypervisor ready on bootup.
                  </p>
                </div>
              </label>

              {/* Box 6: Enforce Dark Mode */}
              <label className={`p-3.5 rounded-xl border flex gap-3 cursor-pointer items-start transition-all ${
                forceDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-900/40 border-zinc-850 text-zinc-500 opacity-60'
              }`}>
                <input
                  type="checkbox"
                  disabled={building}
                  checked={forceDarkMode}
                  onChange={(e) => setForceDarkMode(e.target.checked)}
                  className="mt-1 rounded border-zinc-700 bg-zinc-950 text-blue-500 focus:ring-blue-500 h-4 w-4 shrink-0 checkbox-blue"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-zinc-200">Enforce Dark Theme Preset</span>
                    <Disc className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                    Configures installation scripts to enforce system-wide dark mode interface upon initial user login. No bright flash screens.
                  </p>
                </div>
              </label>
              
            </div>
          </div>

        </div>

        {/* Right Sidebar Parameter Card */}
        <div className="lg:col-span-4 space-y-6">
          
           {/* Target Selector Action Box */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between h-full space-y-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-display mb-4">
                3. Choose Physical target Output
              </h3>
 
              {/* Selector Tabs (ISO vs USB vs Partition vs Setup.exe) */}
              <div className="grid grid-cols-2 gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-850">
                <button
                  disabled={building}
                  onClick={() => setTargetType('iso')}
                  className={`py-2 rounded-md font-semibold text-[10px] sm:text-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    targetType === 'iso'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Disc className="w-3.5 h-3.5" />
                  <span className="truncate">ISO Image</span>
                </button>
                <button
                  disabled={building}
                  onClick={() => setTargetType('usb')}
                  className={`py-2 rounded-md font-semibold text-[10px] sm:text-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    targetType === 'usb'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Usb className="w-3.5 h-3.5" />
                  <span className="truncate">USB Disk</span>
                </button>
                <button
                  disabled={building}
                  onClick={() => setTargetType('partition')}
                  className={`py-2 rounded-md font-semibold text-[10px] sm:text-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    targetType === 'partition'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <HardDrive className="w-3.5 h-3.5" />
                  <span className="truncate">Local Drive</span>
                </button>
                <button
                  disabled={building}
                  onClick={() => setTargetType('setup_exe')}
                  className={`py-2 rounded-md font-semibold text-[10px] sm:text-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    targetType === 'setup_exe'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Binary className="w-3.5 h-3.5 text-blue-400" />
                  <span className="truncate font-bold">Setup.exe Helper</span>
                </button>
              </div>
 
              {/* Dynamic Sub-Form depending on selected output */}
              <AnimatePresence mode="wait">
                {targetType === 'iso' && (
                  <motion.div
                    key="iso-form"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-4 p-4 bg-zinc-950 border border-zinc-850 rounded-lg space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-semibold text-zinc-200">ISO Virtual Target Directory</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-normal">
                      Slipstream process exports directly into the internal sandboxed system workspace folders.
                    </p>
                    <div className="text-[10px] font-mono text-zinc-400 bg-zinc-900 p-2 rounded border border-zinc-800 break-all leading-normal">
                      C:\Users\WinUtilities\Downloads\ISO
                    </div>
                  </motion.div>
                )}
 
                {targetType === 'usb' && (
                  <motion.div
                    key="usb-form"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-4 p-4 bg-zinc-950 border border-zinc-850 rounded-lg space-y-3"
                  >
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <Usb className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-zinc-200">Detect Boot Flash Media</span>
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-zinc-500 block uppercase font-bold">Select Local Device partition</label>
                      <select
                        disabled={building}
                        value={selectedUsb}
                        onChange={(e) => setSelectedUsb(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2 text-xs font-mono text-zinc-200 focus:outline-hidden focus:border-blue-500"
                      >
                        {MOCK_USB_DRIVES.map((usb) => (
                           <option key={usb.id} value={usb.id}>
                            {usb.label} ({usb.size})
                          </option>
                        ))}
                      </select>
                    </div>
 
                    <div className="p-2.5 bg-amber-500/5 border border-amber-500/15 rounded-md text-[10px] text-amber-300 leading-normal flex gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>Warning: Selected target USB drive partition will be completely wiped of all active partition data formats.</span>
                    </div>
                  </motion.div>
                )}
 
                {targetType === 'partition' && (
                  <motion.div
                    key="partition-form"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-4 p-4 bg-zinc-950 border border-zinc-850 rounded-lg space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-semibold text-zinc-200">Direct Local Installation</span>
                      </div>
                      <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-bold">
                        Dual Boot Config
                      </span>
                    </div>
 
                    {/* Hard Drive Selector */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-500 block uppercase font-bold">Select Hard Drive</label>
                      <select
                        disabled={building}
                        value={selectedLocalDisk}
                        onChange={(e) => handleDiskChange(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2 text-xs font-mono text-zinc-200 focus:outline-hidden focus:border-blue-500"
                      >
                        {MOCK_LOCAL_DISKS.map((disk) => (
                          <option key={disk.id} value={disk.id}>
                            {disk.name} ({disk.freeSpace} free)
                          </option>
                        ))}
                      </select>
                    </div>
 
                    {/* Partition Selector Table lists */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-zinc-500 block uppercase font-bold">Choose Targeted Volume Partition</label>
                      <div className="space-y-1 max-h-40 overflow-y-auto pr-1 bg-zinc-900 border border-zinc-850 rounded-lg p-1.5">
                        {MOCK_LOCAL_DISKS.find(d => d.id === selectedLocalDisk)?.partitions.map((part) => (
                          <button
                            key={part.id}
                            type="button"
                            disabled={building || !part.canInstall}
                            onClick={() => setSelectedLocalPartition(part.id)}
                            className={`w-full p-2 rounded text-left flex items-center justify-between text-xs transition-colors font-mono ${
                              selectedLocalPartition === part.id
                                ? 'bg-blue-600/15 border border-blue-500/25 text-wide text-white'
                                : part.canInstall
                                  ? 'bg-zinc-950 hover:bg-zinc-850 text-zinc-300 border border-transparent hover:border-zinc-800 cursor-pointer'
                                  : 'bg-zinc-900 text-zinc-650 border border-transparent cursor-not-allowed opacity-40'
                            }`}
                          >
                            <span className="truncate max-w-[140px] text-[10px] font-medium">{part.label}</span>
                            <div className="flex items-center gap-1.5 shrink-0 text-[10px]">
                              <span>{part.size}</span>
                              <span className={`px-1 py-0.5 rounded text-[8px] font-bold uppercase ${
                                part.id === 'd0_p4'
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  : part.canInstall
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-zinc-800 text-zinc-550'
                              }`}>
                                {part.badge}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
 
                    {/* Partition installation options check */}
                    <div className="space-y-2 pt-2 border-t border-zinc-900">
                      <label className="flex items-center gap-2 cursor-pointer text-[11px] text-zinc-400 hover:text-zinc-200">
                        <input
                          type="checkbox"
                          disabled={building}
                          checked={formatPartition}
                          onChange={(e) => setFormatPartition(e.target.checked)}
                          className="rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500 h-3.5 w-3.5 checkbox-blue cursor-pointer"
                        />
                        <span>Format partition to clean NTFS system volume</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-[11px] text-zinc-400 hover:text-zinc-200">
                        <input
                          type="checkbox"
                          disabled={building}
                          checked={injectBcd}
                          onChange={(e) => setInjectBcd(e.target.checked)}
                          className="rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500 h-3.5 w-3.5 checkbox-blue cursor-pointer"
                        />
                        <span>Inject UEFI Dual-Boot record via BCDBoot</span>
                      </label>
                    </div>
 
                    <div className="p-2 bg-blue-500/5 border border-blue-500/15 rounded text-[10px] text-blue-300 leading-normal flex gap-1.5">
                      <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>This prepares a live dual-boot config directly. Secure boot files are automatically configured.</span>
                    </div>
                  </motion.div>
                )}

                {targetType === 'setup_exe' && (
                  <motion.div
                    key="setup-exe-form"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-4 p-4 bg-zinc-950 border border-zinc-850 rounded-lg space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Binary className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-semibold text-zinc-200">Setup.exe Builder</span>
                      </div>
                      <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase">
                        PE Win32
                      </span>
                    </div>

                    {/* Stub Title Input */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-500 block uppercase font-bold">Executable Launcher Name</label>
                      <input
                        type="text"
                        disabled={building}
                        value={setupTitle}
                        onChange={(e) => setSetupTitle(e.target.value)}
                        placeholder="Setup Assistant Title"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2 text-xs font-mono text-zinc-200 focus:outline-hidden focus:border-blue-500 text-ellipse"
                      />
                    </div>

                    {/* Embedding Choice Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-zinc-500 block uppercase font-bold">Image Staging Strategy</label>
                      <div className="grid grid-cols-2 gap-1 bg-zinc-900 p-0.5 rounded-md border border-zinc-850">
                        <button
                          type="button"
                          disabled={building}
                          onClick={() => setSetupEmbedWim(false)}
                          className={`py-1 rounded font-semibold text-[9.5px] uppercase transition-colors ${
                            !setupEmbedWim
                              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                              : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                          }`}
                        >
                          On-demand Web Stub
                        </button>
                        <button
                          type="button"
                          disabled={building}
                          onClick={() => setSetupEmbedWim(true)}
                          className={`py-1 rounded font-semibold text-[9.5px] uppercase transition-colors ${
                            setupEmbedWim
                              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                              : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                          }`}
                        >
                          Embedded Offline
                        </button>
                      </div>
                      <p className="text-[9.5px] text-zinc-500 leading-normal">
                        {setupEmbedWim 
                          ? 'Embeds the ~4GB custom installation archive directly inside setup.exe. File size is large but requires completely zero network connection on the client computer.'
                          : 'A lightweight fast-loading stub helper (~12.4 MB). Automatically fetches staging assets securely over the web only during the setup assistant lifetime.'}
                      </p>
                    </div>

                    {/* Executive configuration toggles */}
                    <div className="space-y-2 pt-2 border-t border-zinc-900">
                      <label className="flex items-center gap-2 cursor-pointer text-[10.5px] text-zinc-400 hover:text-zinc-200 select-none">
                        <input
                          type="checkbox"
                          disabled={building}
                          checked={setupRequireAdmin}
                          onChange={(e) => setSetupRequireAdmin(e.target.checked)}
                          className="rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500 h-3.5 w-3.5 checkbox-blue cursor-pointer"
                        />
                        <span>Require Administrator Manifest</span>
                      </label>
                      
                      <label className="flex items-center gap-2 cursor-pointer text-[10.5px] text-zinc-400 hover:text-zinc-200 select-none">
                        <input
                          type="checkbox"
                          disabled={building}
                          checked={setupSilentMode}
                          onChange={(e) => setSetupSilentMode(e.target.checked)}
                          className="rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500 h-3.5 w-3.5 checkbox-blue cursor-pointer"
                        />
                        <span>Silent Unattended Operation Mode</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-[10.5px] text-zinc-400 hover:text-zinc-200 select-none">
                        <input
                          type="checkbox"
                          disabled={building}
                          checked={setupCompressExe}
                          onChange={(e) => setSetupCompressExe(e.target.checked)}
                          className="rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500 h-3.5 w-3.5 checkbox-blue cursor-pointer"
                        />
                        <span>Compress Binary stub using UPX-9</span>
                      </label>
                    </div>

                    <div className="p-2 bg-blue-500/5 border border-blue-500/15 rounded text-[10px] text-blue-300 leading-normal flex gap-1.5">
                      <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>This compiles an native PE-COFF Windows x64 binary launcher that can execute directly from double-clicks inside active Windows.</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
 
              {/* Dynamic Info Summary */}
              <div className="mt-5 border-t border-zinc-850 pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Source Template:</span>
                  <span className="font-mono text-zinc-300 font-bold text-right truncate max-w-44">{activeOsDetails?.name}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Custom Config size:</span>
                  <span className="font-mono text-zinc-300 font-bold">
                    {targetType === 'setup_exe'
                      ? setupEmbedWim 
                        ? '~4.2 GB (Offline Installer)' 
                        : '~12.4 MB (Web Helper Stub)'
                      : removeBloatware ? '~4.2 GB (debloated)' : activeOsDetails?.sizeGb}
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Output Structure:</span>
                  <span className="font-mono text-zinc-300 font-bold uppercase animate-fade-in" key={targetType}>
                    {targetType === 'iso' 
                      ? 'WIM -> ISO-9660' 
                      : targetType === 'usb'
                        ? 'FAT32-GPT BOOT'
                        : targetType === 'partition'
                          ? 'NTFS NATIVE dual-boot'
                          : 'PORTABLE PE EXE LAUNCHER'}
                  </span>
                </div>
              </div>
            </div>
 
            {/* Start slipstream Button trigger */}
            <div className="space-y-4">
              <button
                disabled={building}
                onClick={handleStartBuild}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold text-xs transition-colors border ${
                  building
                    ? 'bg-zinc-850 text-zinc-500 border-zinc-800 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500/20 cursor-pointer shadow-lg shadow-blue-500/15'
                }`}
              >
                {building ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-white mr-1" />
                    <span>Processing distribution config {buildPercent}%</span>
                  </>
                ) : (
                  <>
                    <Disc className="w-3.5 h-3.5 animate-pulse" />
                    <span>Compile Custom Windows Payload</span>
                  </>
                )}
              </button>
 
              {/* Build Completed notification block */}
              <AnimatePresence>
                {buildCompleted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white">Compilation Complete!</span>
                    </div>
                    <p className="text-[11px] text-emerald-400/80 leading-normal">
                      {targetType === 'setup_exe'
                        ? `The customized setup.exe loader is ready. Dual-boot configs and unattend flags embedded.`
                        : `The customized build files were generated correctly. Boot sectors configured securely.`}
                    </p>
                    <div className="pt-1.5 flex gap-2">
                      {targetType === 'setup_exe' ? (
                        <button 
                          onClick={handleDownloadSetup}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer border border-emerald-400/20 shadow-xs"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download setup.exe Assistant</span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => alert(`Beginning virtual deployment verify for ${fileOutputName}`)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer border border-emerald-400/20"
                        >
                          <Download className="w-3 h-3" />
                          <span>Verify {targetType === 'iso' ? 'ISO File' : targetType === 'usb' ? 'USB Drive' : 'Partition Config'}</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>

      {/* Builder logs terminal shell at bottom */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-inner space-y-3">
        <div className="flex justify-between items-center text-zinc-400 border-b border-zinc-850 pb-2 mb-2 font-semibold">
          <span className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-wider text-zinc-400">
            <Terminal className="w-4.5 h-4.5 text-blue-500 shrink-0 animate-pulse" />
            <span>Slipstream patching terminal output</span>
          </span>
          <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">DISM sandbox pipeline</span>
        </div>

        <div className="bg-black/90 text-zinc-300 p-4 rounded-lg font-mono text-[11.5px] leading-relaxed h-52 overflow-y-auto space-y-1.5 selection:bg-blue-600 selection:text-white">
          {logs.map((log, index) => (
            <div key={index} className="flex gap-2">
              <span className="text-zinc-600 font-mono shrink-0">[{index + 1}]</span>
              <span className="break-all font-mono whitespace-pre-wrap">{log}</span>
            </div>
          ))}

          {building && (
            <div className="flex items-center gap-1.5 text-blue-400 animate-pulse text-[11px] font-bold pt-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>Slipstream process active: {currentStep}</span>
            </div>
          )}

          {logs.length === 0 && !building && (
            <div className="text-zinc-600 italic py-4 text-center text-xs">
              Waiting for compiling instruction... Click "Compile Custom Windows Payload" to start the sandboxed slipstreaming pipeline.
            </div>
          )}
          <div ref={consoleEndRef} />
        </div>
        
        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3 text-zinc-400" />
            Bypasses are loaded directly into target unattend answer schemas structures.
          </span>
          <span>Buffer limits: Standard WIM 64-bit</span>
        </div>
      </div>

    </div>
  );
}
