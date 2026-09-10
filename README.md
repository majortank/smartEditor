# 📝 SmartEditor Studio

> **Modern, High-Performance Live Markdown & HTML Documentation Workspace with Real-Time AST Preview & Export Suite**

[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**SmartEditor Studio** is a developer-first, distraction-free live documentation environment and web component playground. It bridges the gap between technical markdown authoring and real-time interactive HTML rendering—featuring synchronized scroll, live syntax highlighting, document metrics, and an export suite.

---

## ⚡ Core Features

- 📑 **Dual-Pane Synchronized Workspace**:
  - **Live AST Parsing**: Instant sub-millisecond reactive rendering using `marked` and sanitized via `DOMPurify`.
  - **Bidirectional Scroll Sync**: The preview pane follows editor navigation proportionally.
  - **View Modes**: Switch between **Split Screen**, **Editor Only** (focus mode), or **Preview Only**.

- 🎨 **Dual-Mode Engine (Markdown + HTML Component)**:
  - **Markdown Mode**: Full GitHub Flavored Markdown (GFM) support with tables, checklists, strikethrough, blockquotes, and code fences.
  - **HTML Component Mode**: Live sandboxed iframe preview with responsive viewport switching:
    - 🖥️ **Desktop** (Full width)
    - 📱 **Tablet** (768px container)
    - 📲 **Mobile** (375px phone container)

- 🛠️ **Developer Productivity & Formatting Bar**:
  - Headings (H1–H3), bold, italic, strikethrough, blockquotes.
  - Inline code and language-specific code blocks.
  - Auto-pairing of brackets `()`, brackets `[]`, braces `{}`, quotes `""`, and backticks ` `` `.
  - Tab indentation preservation (2-space soft tabs) and standard keyboard shortcuts (`Ctrl+B`, `Ctrl+I`, `Ctrl+K`, `Ctrl+S`).
  - Pre-built table and Mermaid diagram insertion.

- 🗄️ **Document Management & Persistence**:
  - Multi-document library stored persistently in browser `localStorage`.
  - Document duplication, deletion, and quick renaming.
  - Built-in engineering templates:
    - **Engineering RFC / Technical Specification** (Architecture, SLAs, Data Models)
    - **REST API Reference** (Endpoints, Auth, Request/Response payloads)
    - **Interactive HTML Component** (Glassmorphic card with metric bars)

- 📊 **Real-Time Document Analytics**:
  - Live Word Count, Character Count, and Line Count.
  - Estimated Reading Time calculation (based on standard 200 WPM).
  - Automated Readability Ease scoring (Flesch-Kincaid heuristic metric).

- 📤 **Complete Export Suite**:
  - **Markdown Export**: Download as `.md` file.
  - **Standalone HTML Export**: Download self-contained `.html` document with embedded typography styles.
  - **Print / PDF Ready**: Dedicated `@media print` CSS stylesheet for printing to PDF.
  - **1-Click Clipboard Copy**: Instantly copy raw Markdown or compiled HTML.

---

## 🏗️ Architecture & Project Structure

```
smartEditor/
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Navigation, view switchers, export dropdown, theme
│   │   ├── Toolbar.tsx          # Quick formatting buttons (H1-H3, code, tables)
│   │   ├── EditorPane.tsx       # Textarea with line numbers gutter & keyboard bindings
│   │   ├── PreviewPane.tsx      # GFM markdown renderer & responsive iframe sandbox
│   │   ├── DocumentSidebar.tsx  # Multi-doc workspace manager & templates drawer
│   │   └── StatsFooter.tsx      # Real-time metrics bar (words, chars, reading ease)
│   ├── utils/
│   │   ├── markdown.ts          # Marked parser & DOMPurify sanitizer
│   │   ├── exporter.ts          # File downloader (MD/HTML/Print)
│   │   └── statistics.ts        # Reading time & readability ease algorithms
│   ├── App.tsx                  # Root state coordinator & localStorage sync
│   ├── index.css                # Tailwind base & prose typography rules
│   ├── main.tsx                 # React DOM mount
│   ├── templates.ts             # Built-in RFC, API, and UI component templates
│   └── types.ts                 # TypeScript type definitions
├── index.html                   # HTML entrypoint with font preconnects
├── package.json                 # Project dependencies & scripts
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # Strict TypeScript configuration
├── server.py                    # Zero-dependency Python server for serving production build
└── README.md                    # Technical documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node 26.x)
- npm or pnpm

### Development Server
```bash
git clone https://github.com/majortank/smartEditor.git
cd smartEditor

npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

### Production Build
```bash
npm run build
# Compiles TypeScript and bundles via Vite into dist/
```

### Run with Lightweight Python Server (Optional)
If you prefer serving the compiled application without Node:
```bash
npm run build
python3 server.py
# Serves dist/ at http://localhost:3000 with zero external pip dependencies
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + B` / `Cmd + B` | Wrap selection in **Bold** |
| `Ctrl + I` / `Cmd + I` | Wrap selection in *Italic* |
| `Ctrl + K` / `Cmd + K` | Insert Markdown [Link](url) |
| `Ctrl + S` / `Cmd + S` | Trigger Save confirmation toast |
| `Tab` | Indent with 2 spaces |

---

## 👤 Author

**Thabo Tankiso Thebe**
- Portfolio: [majortank.space](https://majortank.space)
- GitHub: [@majortank](https://github.com/majortank)
- LinkedIn: [@thabotankisothebe](https://linkedin.com/in/thabotankisothebe)

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
