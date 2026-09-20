import { TemplateItem } from './types';

export const TEMPLATES: TemplateItem[] = [
  {
    id: 'tech-spec',
    name: 'Engineering RFC / Spec',
    description: 'System architecture, data pipelines, API contracts, and SLA targets with Mermaid flowchart',
    category: 'Architecture',
    mode: 'markdown',
    content: `# RFC-042: High-Throughput Event Ingestion Engine

> **Status**: In Review  
> **Authors**: Thabo Tankiso Thebe (@majortank)  
> **Target Release**: 2026.Q4  

---

## 1. Executive Summary

This RFC outlines the transition from synchronous HTTP batch polling to an asynchronous streaming event ingestion gateway. The target architecture guarantees **sub-10ms p99 latency** and zero-loss durability during peak bursts of up to 50,000 events/sec.

---

## 2. System Architecture

\`\`\`mermaid
flowchart LR
    A[Clients / Edge SDKs] -->|HTTP/2 POST| B[Smart Ingestion Gateway]
    B -->|Zero-Copy RingBuffer| C[Kafka / Redpanda Cluster]
    C --> D[Stream Processor]
    C --> E[Cold Storage S3]
    D --> F[(TimescaleDB)]
    D --> G[Real-Time WebSocket Push]
\`\`\`

### Key Architectural Pillars:
1. **Zero-Copy Serialization**: Binary Protobuf schemas replacing JSON across internal message buses.
2. **Backpressure Flow Control**: Adaptive TCP buffer throttling when worker pool queue saturation exceeds 85%.
3. **Partitioning Key Strategy**: Sharded by \`tenant_id + hash(user_id)\` to prevent hot-spotting.

---

## 3. API Contract

### \`POST /v2/events/batch\`
Submit a compressed batch of telemetric events.

#### Headers:
- \`Authorization\`: \`Bearer <jwt_token>\`
- \`Content-Type\`: \`application/x-protobuf\`
- \`Content-Encoding\`: \`zstd\`

#### Success Response (\`202 Accepted\`):
\`\`\`json
{
  "batch_id": "bch_9841f2a0c7e1",
  "received_count": 250,
  "committed_offset": 1849204,
  "processing_node": "us-east-worker-04"
}
\`\`\`

---

## 4. SLA Targets & Operational Metrics

| Metric | Target SLA | Degraded Threshold | Alert Trigger |
| :--- | :--- | :--- | :--- |
| **Ingestion p99** | < 12ms | > 25ms | P2 Alert |
| **Durability** | 99.999% | < 99.99% | P0 Immediate Escalation |
| **Queue Depth** | < 5,000 | > 20,000 | Auto-scale Pods |

---

## 5. Security & Multi-Tenancy

- **At-Rest Encryption**: AES-256-GCM hardware accelerated via AWS KMS.
- **In-Transit**: TLS 1.3 with mandatory mTLS for internal service meshes.
- **Tenant Isolation**: Row-Level Security (RLS) coupled with cryptographically signed tenant context claims.
`
  },
  {
    id: 'mermaid-diagram-suite',
    name: 'Mermaid Diagram Gallery',
    description: 'Showcase of Flowcharts, Sequence diagrams, State machines, and Class diagrams',
    category: 'Diagrams',
    mode: 'markdown',
    content: `# Mermaid Diagram Gallery & Visual Specifications

This document demonstrates the full breadth of Mermaid diagrams supported natively within SmartEditor with live interactive rendering and automatic theme adaptation.

---

## 1. Microservices Mesh Flowchart (Subgraphs & Directions)

\`\`\`mermaid
flowchart LR
    subgraph Ingestion["Ingestion Layer"]
        A[API Clients] --> B[Edge API Gateway]
        B --> C[Rate Limiter]
    end
    subgraph Core["Core Processing"]
        C --> D[Auth Service]
        C --> E[Order Engine]
        C --> F[Notification Bus]
    end
    subgraph Persistence["Storage Tier"]
        E --> G[(Primary Postgres)]
        E --> H[(Read Replica)]
        F --> I[(Redis Cache)]
    end
\`\`\`

---

## 2. Authentication & JWT Handshake (Sequence Diagram)

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor Client as Client App
    participant GW as API Gateway
    participant Auth as Auth0 / Identity
    participant API as Core Microservice
    participant DB as Postgres DB

    Client->>GW: POST /v1/auth/login (credentials)
    GW->>Auth: Validate Credentials & Sign Claims
    Auth-->>GW: 200 OK (access_token, refresh_token)
    GW-->>Client: Set-Cookie (HttpOnly JWT)
    Client->>GW: GET /v1/accounts/me + Bearer Token
    GW->>API: Forward with Decoded Claims
    API->>DB: SELECT * FROM accounts WHERE id = ?
    DB-->>API: Account Record
    API-->>Client: 200 OK { id, email, tier: "pro" }
\`\`\`

---

## 3. Order Lifecycle State Machine (State Diagram)

\`\`\`mermaid
stateDiagram-v2
    [*] --> PendingCheckout
    PendingCheckout --> PaymentProcessing: Submit Payment
    PaymentProcessing --> OrderConfirmed: Capture Succeeded
    PaymentProcessing --> PaymentFailed: Card Declined
    PaymentFailed --> PendingCheckout: Retry Payment
    OrderConfirmed --> FulfillmentQueue: Auto-Dispatch
    FulfillmentQueue --> InTransit: Carrier Pickup
    InTransit --> Delivered: Proof of Delivery
    Delivered --> [*]
    OrderConfirmed --> Refunded: Cancel Request
    PaymentFailed --> [*]
\`\`\`

---

## 4. Domain Class Architecture (Class Diagram)

\`\`\`mermaid
classDiagram
    class User {
        +String id
        +String email
        +String role
        +authenticate()
        +upgradePlan()
    }
    class Subscription {
        +String planId
        +Date renewalDate
        +Boolean active
        +cancel()
    }
    class Invoice {
        +String invoiceId
        +Float amount
        +String status
        +generatePdf()
    }
    User "1" --> "*" Subscription : maintains
    Subscription "1" --> "*" Invoice : bills
\`\`\`
`
  },
  {
    id: 'html-dashboard-card',
    name: 'Interactive Metric Dashboard',
    description: 'Modern UI widget with glassmorphism, responsive grid, progress bars, and metrics',
    category: 'UI Components',
    mode: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com?plugins=typography,forms,aspect-ratio"></script>
  <style>
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.8; }
    }
    .glow { animation: pulse-slow 3s infinite ease-in-out; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 p-6 sm:p-8 min-h-screen">

  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-6">
    <div class="relative w-full max-w-md bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl overflow-hidden backdrop-blur-xl">
      <div class="absolute -top-12 -right-12 w-40 h-40 bg-sky-500/20 rounded-full blur-2xl glow pointer-events-none"></div>

      <div class="flex items-center justify-between pb-4 border-b border-slate-800">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-white">Cluster Health Monitor</h3>
            <p class="text-xs text-slate-400">Node: us-east-prod-01</p>
          </div>
        </div>
        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Optimal
        </span>
      </div>

      <div class="grid grid-cols-2 gap-3 py-5">
        <div class="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Memory Allocation</span>
          <div class="text-xl font-bold text-white mt-1">4.2 <span class="text-xs font-normal text-slate-400">/ 16 GB</span></div>
          <div class="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div class="bg-sky-500 h-full rounded-full" style="width: 26%"></div>
          </div>
        </div>

        <div class="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Workers</span>
          <div class="text-xl font-bold text-sky-400 mt-1">128 <span class="text-xs font-normal text-slate-400">threads</span></div>
          <div class="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div class="bg-emerald-400 h-full rounded-full" style="width: 68%"></div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
        <span class="text-slate-400">Uptime: <strong class="text-slate-200">99.98% (42 days)</strong></span>
        <button onclick="alert('Triggering cluster diagnostic snapshot...')" class="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg transition shadow-md shadow-sky-500/20 active:scale-95">
          Run Diagnostics
        </button>
      </div>
    </div>
  </div>

</body>
</html>
`
  },
  {
    id: 'html-mermaid-component',
    name: 'Live Embedded Mermaid Card',
    description: 'Tailwind UI component card wrapping an embedded live Mermaid architecture diagram',
    category: 'Diagrams',
    mode: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com?plugins=typography,forms,aspect-ratio"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
</head>
<body class="bg-slate-950 text-slate-100 p-6 sm:p-8 min-h-screen">

  <div class="max-w-2xl mx-auto my-6 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl backdrop-blur-xl">
    <!-- Header -->
    <div class="flex items-center justify-between pb-4 border-b border-slate-800">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </div>
        <div>
          <h3 class="text-base font-bold text-white">Pipeline Execution Graph</h3>
          <p class="text-xs text-slate-400">Live Stage Orchestration & Dependency Flow</p>
        </div>
      </div>
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        Active Pipeline
      </span>
    </div>

    <!-- Embedded Live Mermaid Diagram -->
    <div class="my-6">
      <div class="mermaid">
flowchart LR
    Source[Kafka Ingest] --> Clean[Payload Sanitizer]
    Clean --> ML[Model Inference]
    ML --> Analytics[TimescaleDB Analytics]
    ML --> Notify[WebSocket Broadcast]
      </div>
    </div>

    <!-- Metrics Footer -->
    <div class="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-center">
      <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        <span class="text-[10px] uppercase font-bold text-slate-400">Latency</span>
        <div class="text-lg font-bold text-sky-400 mt-0.5">8.4 ms</div>
      </div>
      <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        <span class="text-[10px] uppercase font-bold text-slate-400">Throughput</span>
        <div class="text-lg font-bold text-emerald-400 mt-0.5">42.8k/s</div>
      </div>
      <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        <span class="text-[10px] uppercase font-bold text-slate-400">Success</span>
        <div class="text-lg font-bold text-white mt-0.5">99.99%</div>
      </div>
    </div>
  </div>

</body>
</html>
`
  },
  {
    id: 'html-hero-showcase',
    name: 'SaaS Product Hero Banner',
    description: 'Conversion-optimized hero section with badge pill, gradient typography, and CTAs',
    category: 'UI Components',
    mode: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com?plugins=typography,forms,aspect-ratio"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-6 sm:p-12 flex items-center justify-center">

  <section class="relative w-full max-w-4xl mx-auto text-center py-12 px-6 rounded-3xl bg-radial from-slate-900 to-slate-950 border border-slate-800/90 shadow-2xl overflow-hidden">
    <!-- Glow effects -->
    <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Badge Pill -->
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 mb-6 backdrop-blur-md">
      <span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
      Next-Generation Technical Editor v2.0
    </div>

    <!-- Main Heading -->
    <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
      Write Markdown. Build UI Components.<br />
      <span class="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
        Visualize Everything Seamlessly.
      </span>
    </h1>

    <!-- Subtitle -->
    <p class="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
      SmartEditor bridges the gap between technical documentation, interactive Tailwind components, and Mermaid diagrams with zero compilation lag.
    </p>

    <!-- CTAs -->
    <div class="flex flex-wrap items-center justify-center gap-3 mb-10">
      <button onclick="alert('Starting live interactive playground session!')" class="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-xl shadow-sky-500/25 transition active:scale-95">
        Start Creating Now
      </button>
      <button onclick="alert('Opening documentation preview...')" class="px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition">
        Explore Architecture Spec
      </button>
    </div>

    <!-- Feature Pill Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-6 border-t border-slate-800/80">
      <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
        <div class="flex items-center gap-2 text-sky-400 font-bold text-base mb-1">
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
          <span>Bidirectional</span>
        </div>
        <div class="text-xs text-slate-400">Convert Markdown to UI component cards and back losslessly.</div>
      </div>
      <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
        <div class="flex items-center gap-2 text-sky-400 font-bold text-base mb-1">
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          <span>Live Mermaid</span>
        </div>
        <div class="text-xs text-slate-400">Syntax-safe diagram rendering with automatic dark and light theme switching.</div>
      </div>
      <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
        <div class="flex items-center gap-2 text-sky-400 font-bold text-base mb-1">
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          <span>Clean Export</span>
        </div>
        <div class="text-xs text-slate-400">Export standalone HTML or print pristine documents with zero UI artifacts.</div>
      </div>
    </div>
  </section>

</body>
</html>
`
  },
  {
    id: 'html-settings-panel',
    name: 'Settings & Profile Panel',
    description: 'Full responsive settings form with avatar, toggles, text inputs, and action buttons',
    category: 'Forms',
    mode: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com?plugins=typography,forms,aspect-ratio"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-6 sm:p-10 flex items-center justify-center">

  <div class="w-full max-w-xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
    <!-- Header -->
    <div class="pb-5 border-b border-slate-800 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-white">Account & Environment Settings</h2>
        <p class="text-xs text-slate-400 mt-0.5">Manage your identity credentials and cloud workspace</p>
      </div>
      <span class="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-sky-400 border border-slate-700">PRO Plan</span>
    </div>

    <!-- Form Body -->
    <div class="py-6 space-y-5">
      <!-- Profile Header Row -->
      <div class="flex items-center space-x-4">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-sky-500/20">
          TT
        </div>
        <div class="space-y-1">
          <div class="text-sm font-bold text-white">Thabo Tankiso Thebe</div>
          <p class="text-xs text-slate-400">majortank@example.com</p>
          <button onclick="alert('Choose a new avatar photo...')" class="text-xs text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-2">
            Change photo
          </button>
        </div>
      </div>

      <!-- Text Input: Workspace Name -->
      <div>
        <label class="block text-xs font-semibold text-slate-300 mb-1.5">Workspace Name</label>
        <input type="text" value="Enterprise Ingestion Cluster" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition" />
      </div>

      <!-- API Key Row -->
      <div>
        <label class="block text-xs font-semibold text-slate-300 mb-1.5">Personal API Secret</label>
        <div class="flex items-center space-x-2">
          <input type="password" value="sec_live_994820a1ef8c001" readonly class="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-400 focus:outline-none" />
          <button onclick="alert('API Secret copied to clipboard!')" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-700">
            Copy
          </button>
        </div>
      </div>

      <!-- Switches -->
      <div class="pt-2 space-y-3">
        <label class="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition">
          <div>
            <div class="text-xs font-semibold text-white">Automated Cloud Backups</div>
            <div class="text-[11px] text-slate-400">Create hourly snapshots of all Markdown diagrams and specs</div>
          </div>
          <input type="checkbox" checked class="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 bg-slate-900 border-slate-700" />
        </label>

        <label class="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition">
          <div>
            <div class="text-xs font-semibold text-white">Two-Factor Security Enforcement</div>
            <div class="text-[11px] text-slate-400">Require hardware security key for deployment approvals</div>
          </div>
          <input type="checkbox" checked class="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 bg-slate-900 border-slate-700" />
        </label>
      </div>
    </div>

    <!-- Actions Footer -->
    <div class="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
      <button onclick="alert('Changes discarded.')" class="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition">
        Discard
      </button>
      <button onclick="alert('Settings saved successfully!')" class="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-sky-500/25 transition active:scale-95">
        Save Changes
      </button>
    </div>
  </div>

</body>
</html>
`
  },
  {
    id: 'html-pricing-table',
    name: 'SaaS Pricing Matrix (3-Tier)',
    description: 'Responsive 3-tier pricing comparison (Starter, Pro [Popular], Enterprise)',
    category: 'Pricing',
    mode: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com?plugins=typography,forms,aspect-ratio"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-6 sm:p-12 flex items-center justify-center">

  <div class="w-full max-w-5xl mx-auto space-y-8">
    <!-- Title -->
    <div class="text-center space-y-2">
      <h2 class="text-3xl font-extrabold text-white">Transparent, Scalable Pricing</h2>
      <p class="text-sm text-slate-400">Choose the ideal plan for individual developers and high-throughput engineering teams.</p>
    </div>

    <!-- Pricing Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Starter Plan -->
      <div class="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
        <div>
          <div class="text-xs font-bold uppercase tracking-wider text-slate-400">Starter</div>
          <div class="text-3xl font-black text-white mt-2">$0 <span class="text-xs font-normal text-slate-400">/ month</span></div>
          <p class="text-xs text-slate-400 mt-2">Essential Markdown editing with local storage persistence.</p>
          <ul class="mt-6 space-y-2.5 text-xs text-slate-300">
            <li class="flex items-center gap-2"><svg class="w-3.5 h-3.5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span>Unlimited Local Documents</span></li>
            <li class="flex items-center gap-2"><svg class="w-3.5 h-3.5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span>Standard Markdown & GFM</span></li>
            <li class="flex items-center gap-2"><svg class="w-3.5 h-3.5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span>Basic Mermaid Diagramming</span></li>
            <li class="flex items-center gap-2 text-slate-500"><svg class="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg><span>Automated Cloud Sync</span></li>
          </ul>
        </div>
        <button onclick="alert('Starter plan selected.')" class="mt-8 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition">
          Get Started
        </button>
      </div>

      <!-- Professional Plan (Featured) -->
      <div class="relative p-6 rounded-2xl bg-slate-900 border-2 border-sky-500 flex flex-col justify-between shadow-2xl shadow-sky-500/10">
        <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-sky-500 text-slate-950 font-bold text-[11px] uppercase tracking-wider shadow">
          Most Popular
        </div>
        <div>
          <div class="text-xs font-bold uppercase tracking-wider text-sky-400">Professional</div>
          <div class="text-3xl font-black text-white mt-2">$29 <span class="text-xs font-normal text-slate-400">/ month</span></div>
          <p class="text-xs text-slate-400 mt-2">Full bidirectional component compilation and diagram pipeline.</p>
          <ul class="mt-6 space-y-2.5 text-xs text-slate-200">
            <li class="flex items-center gap-2"><svg class="w-3.5 h-3.5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span>Everything in Starter</span></li>
            <li class="flex items-center gap-2"><svg class="w-3.5 h-3.5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span>Instant Markdown ↔ HTML Component</span></li>
            <li class="flex items-center gap-2"><svg class="w-3.5 h-3.5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span>Live Debounced Mermaid Suite</span></li>
            <li class="flex items-center gap-2"><svg class="w-3.5 h-3.5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span>Standalone Styled HTML Export</span></li>
            <li class="flex items-center gap-2"><svg class="w-3.5 h-3.5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span>Isolated Zero-Artifact Print</span></li>
          </ul>
        </div>
        <button onclick="alert('Upgrading to Professional plan!')" class="mt-8 w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/25 transition active:scale-95">
          Upgrade to Pro
        </button>
      </div>

      <!-- Enterprise Plan -->
      <div class="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
        <div>
          <div class="text-xs font-bold uppercase tracking-wider text-slate-400">Enterprise</div>
          <div class="text-3xl font-black text-white mt-2">$99 <span class="text-xs font-normal text-slate-400">/ month</span></div>
          <p class="text-xs text-slate-400 mt-2">Dedicated clusters, custom Mermaid styling, and SSO integration.</p>
          <ul class="mt-6 space-y-2.5 text-xs text-slate-300">
            <li class="flex items-center gap-2"><svg class="w-3.5 h-3.5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span>Everything in Pro</span></li>
            <li class="flex items-center gap-2"><svg class="w-3.5 h-3.5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span>SAML SSO & Okta Integration</span></li>
            <li class="flex items-center gap-2"><svg class="w-3.5 h-3.5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span>Dedicated RingBuffer Gateway</span></li>
            <li class="flex items-center gap-2"><svg class="w-3.5 h-3.5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span>99.999% SLA & 24/7 Phone Support</span></li>
          </ul>
        </div>
        <button onclick="alert('Contacting Enterprise sales team...')" class="mt-8 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition">
          Contact Sales
        </button>
      </div>
    </div>
  </div>

</body>
</html>
`
  },
  {
    id: 'api-docs',
    name: 'REST API Reference & Webhooks',
    description: 'Clean RESTful API reference with authentication, webhooks, and retry sequence diagram',
    category: 'API Spec',
    mode: 'markdown',
    content: `# Core Payment Gateway API

Welcome to the Core Payment Gateway API. This documentation covers authentication, pagination, rate limiting, and webhooks.

## Base URL
\`\`\`bash
https://api.gateway.example.com/v1
\`\`\`

## Authentication
All API requests require a valid Bearer token provided in the HTTP header:
\`\`\`http
Authorization: Bearer sec_live_948f2bc0e319
\`\`\`

---

## Endpoints

### 1. Create a Payment Intent
Initiates a single-use payment intent session.

\`POST /payment-intents\`

#### Request Body:
\`\`\`json
{
  "amount": 4900,
  "currency": "USD",
  "customer_id": "cus_40817",
  "metadata": {
    "order_id": "ord_88201",
    "tier": "enterprise"
  }
}
\`\`\`

#### Response (\`201 Created\`):
\`\`\`json
{
  "id": "pi_99182a47e0",
  "client_secret": "pi_99182a47e0_secret_841",
  "status": "requires_payment_method",
  "created_at": 1726000000
}
\`\`\`

---

## Webhook Delivery & Exponential Retry Lifecycle

When payments transition state, the event gateway dispatches HTTP webhook payloads to your configured endpoint with automatic backoff retries:

\`\`\`mermaid
sequenceDiagram
    autonumber
    participant Gateway as Event Gateway
    participant Webhook as Customer Webhook Endpoint
    Gateway->>Webhook: POST /webhook (event: payment.succeeded)
    alt Success (200 OK)
        Webhook-->>Gateway: 200 OK
        Note over Gateway: Delivery Marked Completed
    else Timeout or 5xx Error
        Webhook--xGateway: 504 Gateway Timeout
        Note over Gateway: Exponential Backoff (1m, 5m, 15m)
        Gateway->>Webhook: POST /webhook (retry #1)
        Webhook-->>Gateway: 200 OK
    end
\`\`\`

---

## Error Handling Matrix

| HTTP Status | Error Code | Description |
| :--- | :--- | :--- |
| \`400 Bad Request\` | \`invalid_parameters\` | One or more required fields are missing or malformed. |
| \`401 Unauthorized\` | \`invalid_api_key\` | The supplied API token is expired or revoked. |
| \`429 Too Many Requests\`| \`rate_limit_exceeded\` | Exceeded 1,000 requests / minute quota. |
`
  },
  {
    id: 'roadmap-kanban',
    name: 'Sprint Kanban & Roadmap',
    description: 'Engineering roadmap with pipeline flow, task checklists, and milestone tracker',
    category: 'Project Plan',
    mode: 'markdown',
    content: `# Sprint 42: Engineering Roadmap & Release Board

> **Sprint Duration**: Sep 20 - Oct 04, 2026  
> **Sprint Goal**: Ship Bidirectional Markdown ↔ HTML Component conversion, debounced Mermaid suite, and isolated print rendering.

---

## 1. Continuous Delivery Pipeline

\`\`\`mermaid
flowchart TD
    Backlog[Backlog Issues] --> Design[UI/UX Design Review]
    Design --> Impl[Core Implementation]
    Impl --> CI[Automated CI & Linters]
    CI --> Review[Peer Code Review]
    Review --> Staging[Deploy to Staging]
    Staging --> Canary[Canary 5% Rollout]
    Canary --> Prod[100% Production Netlify]
\`\`\`

---

## 2. Sprint Task Checklist

### Core Architecture
- [x] Migrate repository structure to Next.js 15 App Router
- [x] Configure class-based Tailwind dark mode synchronization
- [x] Eliminate hard-coded Django template dependencies
- [x] Create Netlify build deployment configuration (\`netlify.toml\`)

### Component Conversion & Mermaid Engine
- [x] Bidirectional Markdown ↔ HTML Component transformation
- [x] Debounce Mermaid rendering (120ms) to prevent race conditions during typing
- [x] Add \`mermaid.parse()\` pre-validation to avoid polluting \`document.body\`
- [x] Implement inline diagnostic preview card during incomplete syntax typing
- [x] Preserve original Mermaid source code across dark and light theme toggles

### Export & Printing
- [x] Standalone self-contained HTML export with Tailwind & Mermaid CDN
- [x] Isolated iframe printing of content & styling only (zero UI chrome printed)
- [x] Keyboard shortcuts: \`Ctrl+S\` (Save) and \`Ctrl+P\` (Clean Print)

---

## 3. Milestone Velocity Tracker

| Milestone | Target Completion | Current Status | Owner |
| :--- | :--- | :--- | :--- |
| **Mermaid Live Preview** | Day 2 | **Completed (100%)** | @majortank |
| **Component Templates** | Day 3 | **Completed (100%)** | @likanono |
| **Netlify Production Build**| Day 4 | **In Verification** | Devops Team |
| **General Availability GA**| Day 10 | Scheduled | Core Team |
`
  }
];
