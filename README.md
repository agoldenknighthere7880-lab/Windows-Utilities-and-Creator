# System Utilities Suite (WinUtilities Professional v1.2.0)

A high-fidelity, interactive, modern desktop-grade system optimization and maintenance suite modeled after classic utility software. Built using **React**, **Tailwind CSS v4**, and **Motion (framer-motion)** for smooth, immersive hardware-native animations.

This application is designed with **Architectural Honesty** and a dark, modern high-contrast aesthetic. It features a customizable CSS-variable style engine with multiple responsive color design schemes. The suite provides instant simulated telemetry for diagnostics and lets you configure offline installation packages and Winget manifests.

---

## 🛠️ Key Capabilities & View Modules

The suite includes nine fully decoupled, high-fidelity native view modules:

1. **📊 Diagnostic Monitor (Dashboard)**
   - Instant full-system integrity scan.
   - Computes weighted, dynamic system health scores.
   - Live telemetry progress displays with terminal diagnostic output logging.
   - Actionable single-click speed-up recommendations.

2. **🧹 Disk Cleaner**
   - Scans and categories disk clutter: Temporary Files, System Logs, Browser Cache, Windows Update Leftovers, and Error Dumps.
   - Expandable folder navigation details.
   - Selective cleanup checkboxes with dynamic disk space calculations.

3. **⚡ RAM Optimizer**
   - Real-time physical memory telemetry tracking.
   - Interactive, hardware-aligned memory usage line charts.
   - Purge memory cache blocks: Purge working sets, clear active Standby lists, and defragment RAM pages.
   - Frees estimated standby caches instantly.

4. **🧩 Registry Integrity Fixer**
   - Comprehensive deep diagnostics of key Windows registry hives (`HKLM`, `HKCU`).
   - Catalogues issues with Active X/COM components, Missing Shared DLLs, Invalid Shortcuts, and Uninstalled Leftovers.
   - Simulated Repair Wizard with progress lines and visual confirmation logs.

5. **🚀 Startup Booster Manager**
   - Displays all background launching services on Windows boot.
   - Assesses impact levels (High, Medium, Low) on startup speed.
   - Enable/Disable toggle controllers to save physical host resources.
   - Add custom startup paths and registry triggers with real-time field validation.

6. **📁 File Shredder (Permanent Deletion)**
   - Securely overwrites files to render them unrecoverable.
   - Fully interactive Drag & Drop capture drop-zone as well as manual file picking selectors.
   - Multiple standards-compliant wiping algorithms:
     - **DoD 5220.22-M (3-Pass)** (Standard Department of Defense)
     - **Gutmann System (35-Pass)** (Max Security)
     - **Pseudorandom Write (1-Pass)** (Fastest Performance)
   - Dynamic terminal wipe shredding tracking logs.

7. **🖥️ Hardware Specs Viewer**
   - Detailed specifications overview: Motherboard, CPU threads, Graphics adapters, Socket speed metrics, and BIOS version.
   - Dynamic real-time S.M.A.R.T integrity checks for attached solid-state storage.
   - Thermal sensor mock updates.

8. **💿 Windows Installation Creator**
   - Tailors custom, unattended installation WIM configurations.
   - Tweak checkboxes: Telemetry bypasses, Bloatware removal, TPM/Secure Boot hardware constraint bypass (for Windows 11), Default Developer Mode, Force Dark Mode.
   - Configures target compilation types: bootable ISO-9660, targeted live external USB drive, or localized secondary dual-boot partitions.
   - Includes **Setup.exe PE Win32 helper compiler** simulating a portable PE binary generator that has unattended dual-boot configs built in.

9. **📦 Winget Core Repository Manager**
   - Configures official package manifests compliant with the Microsoft Community Repository framework.
   - Generates and views modular YAML specifications: `Version YAML`, `Locale YAML`, and `Installer YAML`.
   - Built-in manifest linter validator to enforce strict JSON schemas.
   - CMD Shell Simulator to execute live simulated mock sandbox `winget install` commands with accurate progress and visual output.

---

## 🎨 Visual Identity & Multi-Theme Engine

The site is built with a custom-tailored twilight dark theme centered around deep charcoal grays and vibrant accessibility states. It incorporates a **Dynamic Theme Switcher** letting you transition color profiles globally. 

Choosing a theme dynamically applies CSS custom property variables to the document tree:
- **Classic Blue (`default`)**: Windows signature administrator blue.
- **Emerald Mint**: High-performance cyber-green.
- **Cyber Amber**: Terminal command-line orange.
- **Royal Amethyst**: Cyberpunk fantasy purple.
- **Crimson Rust**: High-intensity warning crimson.

---

## 🚀 How to Install and Run Locally

Ensure you have [Node.js](https://nodejs.org/) (Version 18.0 or high recommended) and `npm` installed.

### 1. Extract or Clone
Extract the project archive into your workspace directory.

```bash
cd SystemUtilitiesSuite
```

### 2. Install Project Dependencies
Run `npm install` to download all modern framework compilers, Tailwind v4 engines, and TypeScript dependencies.

```bash
npm install
```

### 3. Run the Development Server
Launch the local dev environment. The Vite engine will default to port `3000` to bypass sandbox restrictions.

```bash
npm run dev
```

Open your browser to `http://localhost:3000` to interact with the application.

### 4. Build for Production Deployment
Deploy a minified, fully optimized, static client-side single-page app (SPA) bundle target inside `/dist`.

```bash
npm run build
```

### 5. Preview Production Build Locally
Verify the production-ready assets inside the output directory.

```bash
npm run preview
```

---

## 💎 Winget Repository Directory Layout

We pre-bundle static package manager files under the community manifests hierarchy rules:
```
/winget/manifests/w/WinUtilities/WinUtilitiesSuite/1.2.0/
  ├── WinUtilities.WinUtilitiesSuite.yaml (Version)
  ├── WinUtilities.WinUtilitiesSuite.locale.en-US.yaml (Locale)
  └── WinUtilities.WinUtilitiesSuite.installer.yaml (Installer/Hash)
```

---

## ⚡ Built Stack

- **Framework**: [React 19](https://react.dev/) — Functional components with Hooks.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) — Lightning-fast, modern utility variables.
- **Animations**: [Motion (framer-motion)](https://motion.dev/) — Declarative physics-based layout transitions.
- **Icons**: [Lucide React](https://lucide.dev/) — Crisp, standard visual vectors.
- **Core Engine**: [Vite](https://vite.dev/) — Lightning-fast ES modules assembly.
- **Languages**: [TypeScript](https://www.typescriptlang.org/) — Strict typing validation checking.
