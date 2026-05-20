export type ActiveTab = 
  | 'dashboard' 
  | 'disk_cleaner' 
  | 'registry_fixer' 
  | 'startup_manager' 
  | 'ram_optimizer' 
  | 'file_shredder' 
  | 'system_specs'
  | 'windows_creator'
  | 'winget_manager';

export interface JunkCategory {
  id: string;
  name: string;
  description: string;
  sizeInMb: number;
  selected: boolean;
  cleaned: boolean;
  files: string[];
}

export interface RegistryIssue {
  id: string;
  hive: string;
  path: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  selected: boolean;
  fixed: boolean;
}

export interface StartupItem {
  id: string;
  name: string;
  publisher: string;
  impact: 'low' | 'medium' | 'high';
  enabled: boolean;
  path: string;
  custom?: boolean;
}

export interface ShreddedFile {
  id: string;
  name: string;
  sizeKb: number;
}

export interface SystemScore {
  healthScore: number;
  junkFoundMb: number;
  registryIssuesCount: number;
  disabledStartupCount: number;
  freeableRamBg: number;
}
