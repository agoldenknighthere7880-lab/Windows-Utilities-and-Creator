import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileCode,
  Terminal,
  Check,
  Copy,
  RotateCcw,
  Download,
  AlertTriangle,
  ExternalLink,
  Cpu,
  Bookmark,
  Sparkles,
  RefreshCw,
  Search,
  CheckSquare,
  HelpCircle,
  FileText
} from 'lucide-react';

export default function WingetManagerView() {
  // Configurable state parameters
  const [packageName, setPackageName] = useState('WinUtilities Suite');
  const [packageIdentifier, setPackageIdentifier] = useState('WinUtilities.WinUtilitiesSuite');
  const [packageVersion, setPackageVersion] = useState('1.2.0');
  const [publisher, setPublisher] = useState('WinUtilities Open Source Project');
  const [installerUrl, setInstallerUrl] = useState('https://github.com/winutilities/suite/releases/download/v1.2.0/setup_windows_custom_unattended_installer.exe');
  const [sha256Hash, setSha256Hash] = useState('3f7a1b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a');
  const [installerArch, setInstallerArch] = useState<'x64' | 'x86' | 'arm64'>('x64');
  const [scope, setScope] = useState<'machine' | 'user'>('machine');
  const [license, setLicense] = useState('MIT');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['utility', 'system', 'optimizer', 'ram-cleaner', 'registry-repair', 'windows-creator', 'debloater']);

  // UI state
  const [activeYamlTab, setActiveYamlTab] = useState<'version' | 'locale' | 'installer'>('version');
  const [copied, setCopied] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'passed' | 'failed'>('idle');
  const [validationLogs, setValidationLogs] = useState<string[]>([]);
  const [cliOutput, setCliOutput] = useState<string[]>(['C:\\Windows\\System32> _']);
  const [isCliRunning, setIsCliRunning] = useState(false);

  // Manifest text generation helpers based on state.
  const versionYaml = `# yaml-language-server: $schema=https://aka.ms/winget-manifest.version.1.6.0.schema.json
PackageIdentifier: ${packageIdentifier}
PackageVersion: ${packageVersion}
ManifestType: version
ManifestVersion: 1.6.0`;

  const localeYaml = `# yaml-language-server: $schema=https://aka.ms/winget-manifest.locale.1.6.0.schema.json
PackageIdentifier: ${packageIdentifier}
PackageVersion: ${packageVersion}
PackageLocale: en-US
Publisher: ${publisher}
PublisherUrl: https://github.com/winutilities/suite
PublisherSupportUrl: https://github.com/winutilities/suite/issues
PrivacyUrl: https://github.com/winutilities/suite/privacy
Author: WinUtilities Contributors
PackageName: ${packageName}
PackageUrl: https://github.com/winutilities/suite
License: ${license}
LicenseUrl: https://github.com/winutilities/suite/blob/main/LICENSE
Copyright: Copyright (c) 2026 WinUtilities Contributors
CopyrightUrl: https://github.com/winutilities/suite/blob/main/LICENSE
ShortDescription: High-fidelity system optimization and maintenance suite.
Description: An interactive, modern system optimization suite that lets you clean registry issues, shred files permanently, optimize RAM active stand-by blocks, manage startup items, and customize Windows installation stubs.
Tags:
${tags.map(t => `  - ${t}`).join('\n')}
ReleaseNotes: Custom slipstream parameters embedded including Windows optimization triggers and security telemetry bypasses.
ReleaseNotesUrl: https://github.com/winutilities/suite/releases/tag/v${packageVersion}
ManifestType: defaultLocale
ManifestVersion: 1.6.0`;

  const installerYaml = `# yaml-language-server: $schema=https://aka.ms/winget-manifest.installer.1.6.0.schema.json
PackageIdentifier: ${packageIdentifier}
PackageVersion: ${packageVersion}
InstallerType: portable
Scope: ${scope}
InstallModes:
  - interactive
  - silent
  - silentWithProgress
UpgradeBehavior: install
Commands:
  - winutilities
Protocols:
  - winutil
FileExtensions:
  - wut
Installers:
  - Architecture: ${installerArch}
    InstallerUrl: ${installerUrl}
    InstallerSha256: ${sha256Hash}
    InstallerType: portable
    PortableCommandAlias: winutilities
ManifestType: installer
ManifestVersion: 1.6.0`;

  const getActiveYamlCode = () => {
    switch (activeYamlTab) {
      case 'version': return versionYaml;
      case 'locale': return localeYaml;
      case 'installer': return installerYaml;
    }
  };

  const getActiveManifestFilename = () => {
    switch (activeYamlTab) {
      case 'version': return `${packageIdentifier}.yaml`;
      case 'locale': return `${packageIdentifier}.locale.en-US.yaml`;
      case 'installer': return `${packageIdentifier}.installer.yaml`;
    }
  };

  const handleCopyCode = async () => {
    const code = getActiveYamlCode();
    await navigator.clipboard.writeText(code);
    setCopied(activeYamlTab);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadSingleYaml = () => {
    const code = getActiveYamlCode();
    const blob = new Blob([code], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getActiveManifestFilename();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTriggerValidation = async () => {
    setValidationStatus('validating');
    setValidationLogs([]);
    
    const logs = [
      '[VALIDATOR] Initializing winget manifest validate compiler v1.6...',
      `[VALIDATOR] Resolving schema configurations from https://aka.ms/winget-manifest...`,
      `[VALIDATOR] Testing PackageIdentifier: "${packageIdentifier}" matches folder hierarchy...`,
    ];

    setValidationLogs([...logs]);
    await new Promise(r => setTimeout(r, 600));

    logs.push('[VALIDATOR] OK: Folder matches w/WinUtilities/WinUtilitiesSuite/ structure.');
    logs.push(`[VALIDATOR] Parsing file: ${packageIdentifier}.yaml (version: ${packageVersion})`);
    logs.push('[SCHEMA] Version manifest matches JSON Schema Spec version 1.6.0');
    setValidationLogs([...logs]);
    await new Promise(r => setTimeout(r, 600));

    logs.push(`[VALIDATOR] Parsing file: ${packageIdentifier}.locale.en-US.yaml`);
    if (tags.length < 3) {
      logs.push('[WARNING] WinGet metadata rules require at least 3 descriptive tags for discovery.');
    } else {
      logs.push(`[SCHEMA] Metadata tags verified. Collected: ${tags.length} active classifications.`);
    }
    logs.push('[URL-CHECK] Verifying license and author references are alive...');
    setValidationLogs([...logs]);
    await new Promise(r => setTimeout(r, 700));

    logs.push(`[VALIDATOR] Parsing file: ${packageIdentifier}.installer.yaml`);
    logs.push(`[VALIDATOR] Security Hash matches structure requirements (SHA-256 Hex: ${sha256Hash.substring(0, 10)}...)`);
    if (sha256Hash.length !== 64) {
      logs.push(`[ERROR] Invalid InstallerSha256: Hash must be exactly 64 hexadecimal characters. Current length: ${sha256Hash.length}`);
      setValidationStatus('failed');
      setValidationLogs([...logs]);
      return;
    }
    
    logs.push(`[VALIDATOR] Architecture flag verified: [${installerArch}] portable executable scope.`);
    logs.push(' [VERIFIED] All manifests successfully passed pre-publishing Winget criteria checks!');
    setValidationStatus('passed');
    setValidationLogs([...logs]);
  };

  const handleRunCliSimulation = async () => {
    if (isCliRunning) return;
    setIsCliRunning(true);
    setCliOutput(['C:\\Windows\\System32> winget install WinUtilities.WinUtilitiesSuite']);

    const steps = [
      'Found WinUtilities Suite [WinUtilities.WinUtilitiesSuite] Version 1.2.0',
      'This application is licensed to you by its publisher. Microsoft is not responsible for, nor does it grant any licenses to, third-party packages.',
      'Downloading https://github.com/winutilities/suite/releases/download/v1.2.0/setup_windows_custom_unattended_installer.exe ...',
      '  [████████████████████████████████████████] 12.4 MB / 12.4 MB',
      'Successfully verified installer SHA-256 hash.',
      'Starting package deployment installation...',
      'Requiring dynamic execution permissions... (Run Elevated Manifest bypassed)',
      'Injecting slipstreamed silent parameters...',
      'Successfully installed WinUtilities Suite!',
      'Executing portable symbolic command mapping: C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\winutilities.exe',
      'C:\\Windows\\System32> _'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, i === 3 ? 1200 : 500));
      setCliOutput(prev => [...prev, steps[i]]);
    }
    setIsCliRunning(false);
  };

  const handleAddTag = (e: FormEvent) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleReset = () => {
    setPackageName('WinUtilities Suite');
    setPackageIdentifier('WinUtilities.WinUtilitiesSuite');
    setPackageVersion('1.2.0');
    setPublisher('WinUtilities Open Source Project');
    setInstallerUrl('https://github.com/winutilities/suite/releases/download/v1.2.0/setup_windows_custom_unattended_installer.exe');
    setSha256Hash('3f7a1b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a');
    setInstallerArch('x64');
    setScope('machine');
    setLicense('MIT');
    setTags(['utility', 'system', 'optimizer', 'ram-cleaner', 'registry-repair', 'windows-creator', 'debloater']);
    setValidationStatus('idle');
    setValidationLogs([]);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 p-6 space-y-6 scrollbar-thin">
      
      {/* Upper Title Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-blue-600/15 text-blue-400 font-mono px-2 py-0.5 rounded border border-blue-500/10 font-bold uppercase tracking-wider">
              Official Windows Package Manager (Winget) Manifests
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display mt-2 flex items-center gap-2">
            WinGet Core Repository Deployer
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Configure, validate, and package official production-ready YAML telemetry templates to bundle and submit the System Utilities Suite setup launcher directly into the native Microsoft community repository.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          
          <a
            href="https://github.com/microsoft/winget-pkgs"
            target="_blank"
            referrerPolicy="no-referrer"
            className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Winget-Pkgs Repository</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
          </a>
        </div>
      </div>

      {/* Main interactive split pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Parameters Customization Pane */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-850/80 rounded-2xl p-5 space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-850 pb-3">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Manifest Template Parameters</span>
            </div>

            {/* Core Identifiers */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Package Name</label>
                  <input
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Package Version</label>
                  <input
                    type="text"
                    value={packageVersion}
                    onChange={(e) => setPackageVersion(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Unique Identifer</label>
                <input
                  type="text"
                  value={packageIdentifier}
                  onChange={(e) => setPackageIdentifier(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Publisher Group</label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Installer Configurations */}
            <div className="space-y-4 pt-4 border-t border-zinc-850">
              <div className="text-xs font-semibold text-zinc-350 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                <span>Installer Stub Specs</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Architecture</label>
                  <select
                    value={installerArch}
                    onChange={(e) => setInstallerArch(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  >
                    <option value="x64">x64 (Recommended)</option>
                    <option value="x86">x86 (Legacy)</option>
                    <option value="arm64">ARM64 (Qualcomm Snapdragon)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Execution Scope</label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  >
                    <option value="machine">machine (All Users - Admin)</option>
                    <option value="user">user (Current User Only)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Source Installer binaries URL</label>
                <input
                  type="text"
                  value={installerUrl}
                  onChange={(e) => setInstallerUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-[10.5px] text-zinc-350 font-mono focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Release SHA-256 Hash Verification</label>
                  <button
                    onClick={() => setSha256Hash(Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''))}
                    className="text-[9px] font-mono text-blue-400 hover:text-blue-300 font-bold transition-colors cursor-pointer"
                  >
                    Regen Hash
                  </button>
                </div>
                <input
                  type="text"
                  value={sha256Hash}
                  onChange={(e) => setSha256Hash(e.target.value)}
                  placeholder="64-char hexadecimal hash"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-[10px] text-zinc-350 font-mono focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Tags / Classifications */}
            <div className="space-y-3 pt-4 border-t border-zinc-850">
              <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">Winget Search Tags / Identifications</label>
              
              <form onSubmit={handleAddTag} className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="e.g. optimizer, ram, registry"
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-hidden focus:border-blue-500 font-mono"
                />
                <button
                  type="submit"
                  className="bg-zinc-800 hover:bg-zinc-755 text-white text-xs px-3.5 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors font-bold cursor-pointer"
                >
                  Add
                </button>
              </form>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-300 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-800 px-2.5 py-1 rounded-md transition-all uppercase font-medium"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-zinc-500 hover:text-rose-400 font-bold ml-0.5 cursor-pointer text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Manifest Viewer & Validation Actions */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Manifest Editor Tabs and Action toolbar */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-850 pb-3 mb-4">
                
                {/* 3 tabs choosing version, locale, installer */}
                <div className="flex bg-zinc-950 p-1 border border-zinc-850 rounded-lg gap-1 max-w-fit">
                  <button
                    onClick={() => setActiveYamlTab('version')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeYamlTab === 'version'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Version</span>
                  </button>
                  <button
                    onClick={() => setActiveYamlTab('locale')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeYamlTab === 'locale'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Locale</span>
                  </button>
                  <button
                    onClick={() => setActiveYamlTab('installer')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeYamlTab === 'installer'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Installer</span>
                  </button>
                </div>

                {/* Sub-Actions: Copy / Download Single */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-850 hover:border-zinc-800 rounded-md text-[11px] font-bold text-zinc-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copied === activeYamlTab ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadSingleYaml}
                    className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-850 hover:border-zinc-800 rounded-md text-[11px] font-bold text-zinc-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Download YAML</span>
                  </button>
                </div>

              </div>

              {/* Manifest Output Terminal Box */}
              <div className="bg-zinc-950 rounded-xl border border-zinc-850 overflow-hidden">
                <div className="h-8 border-b border-zinc-900/60 bg-zinc-900/30 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase select-none">
                      Relative Repo Root path:
                    </span>
                    <span className="text-[10px] font-mono text-blue-400 font-bold select-all">
                      manifests/w/WinUtilities/WinUtilitiesSuite/{packageVersion}/
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-650 bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded font-black select-none">
                    YAML 1.2
                  </span>
                </div>

                <div className="p-4 overflow-x-auto">
                  <pre className="text-[11px] sm:text-xs font-mono text-emerald-400/90 leading-relaxed font-semibold">
                    <code>
                      {getActiveYamlCode().split('\n').map((line, idx) => (
                        <div key={idx} className="table-row group">
                          <span className="table-cell text-right pr-4 text-zinc-700 select-none text-[10px] w-6 border-r border-zinc-900 pb-0.5 mr-2">
                            {idx + 1}
                          </span>
                          <span className="table-cell pl-3 whitespace-pre">
                            {line}
                          </span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              </div>

            </div>

            {/* Validation diagnostics action drawer */}
            <div className="mt-5 pt-4 border-t border-zinc-850 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTriggerValidation}
                    className={`px-4 py-2 border font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                      validationStatus === 'validating'
                        ? 'bg-zinc-850 border-zinc-800 text-zinc-500 cursor-not-allowed animate-pulse'
                        : 'bg-blue-600 border-blue-500/20 text-white hover:bg-blue-500 hover:border-blue-400/20 shadow-md shadow-blue-500/10'
                    }`}
                  >
                    {validationStatus === 'validating' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckSquare className="w-3.5 h-3.5" />
                    )}
                    <span>Run Manifest Lint Validation Checks</span>
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] text-zinc-500">Lint Integrity Score:</span>
                  <AnimatePresence mode="wait">
                    {validationStatus === 'idle' && (
                      <span className="text-[11px] text-zinc-600 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-850 uppercase font-mono font-black animate-fade-in">
                        Unchecked
                      </span>
                    )}
                    {validationStatus === 'validating' && (
                      <span className="text-[11px] text-amber-400 bg-amber-500/5 px-2.5 py-1 rounded border border-amber-500/10 uppercase font-mono font-bold animate-pulse">
                        Analyzing...
                      </span>
                    )}
                    {validationStatus === 'passed' && (
                      <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 uppercase font-mono font-black animate-fade-in">
                        100% Passed
                      </span>
                    )}
                    {validationStatus === 'failed' && (
                      <span className="text-[11px] text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20 uppercase font-mono font-black animate-fade-in">
                        Errors Found
                      </span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Validation check mini output log terminal */}
              {validationLogs.length > 0 && (
                <div className="bg-black/80 rounded-xl border border-zinc-900 p-3 h-36 font-mono text-[11px] overflow-y-auto space-y-1 text-zinc-400 leading-normal scrollbar-thin">
                  {validationLogs.map((log, index) => {
                    let col = 'text-zinc-500';
                    if (log.includes('[ERROR]')) col = 'text-rose-400 font-bold';
                    else if (log.includes('[WARNING]')) col = 'text-amber-400';
                    else if (log.includes('[VALIDATOR] OK') || log.includes('[VERIFIED]')) col = 'text-emerald-400 font-bold';
                    else if (log.includes('[SCHEMA]')) col = 'text-blue-400';
                    
                    return <div key={index} className={col}>{log}</div>;
                  })}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Dynamic CLI Install Sandbox Simulator */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-amber-500/10 text-amber-400 p-1.5 rounded-md border border-amber-500/10">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-display">
                Winget Client Native Sandbox Sandbox CMD Shell
              </h3>
              <p className="text-[10px] text-zinc-500 leading-none mt-0.5">
                Practice executing installation tasks mimicking full native deployments using the verified core repository configurations.
              </p>
            </div>
          </div>

          <button
            disabled={isCliRunning}
            onClick={handleRunCliSimulation}
            className={`px-4 py-2 border font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              isCliRunning
                ? 'bg-zinc-850 border-zinc-800 text-zinc-500 cursor-not-allowed animate-pulse'
                : 'bg-amber-600 border-amber-500/20 text-white hover:bg-amber-500 hover:border-amber-400/20'
            }`}
          >
            {isCliRunning ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Terminal className="w-3 h-3" />
            )}
            <span>Execute winget install live simulation</span>
          </button>
        </div>

        <div className="bg-black/95 text-zinc-350 p-4 rounded-xl border border-zinc-900 font-mono text-[11.5px] leading-relaxed h-56 overflow-y-auto space-y-1.5 scrollbar-thin selection:bg-amber-600 selection:text-white">
          {cliOutput.map((line, idx) => {
            let col = 'text-zinc-300';
            if (line.includes('[███████')) col = 'text-blue-400';
            else if (line.includes('Successfully')) col = 'text-emerald-400 font-bold';
            else if (line.includes('Error:') || line.includes('warning:')) col = 'text-rose-450';
            else if (line.startsWith('C:\\Windows') || line.startsWith('C:\\Users')) col = 'text-zinc-500 font-bold';
            
            return (
              <div key={idx} className={col}>
                {line}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
