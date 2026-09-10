import { TemplateItem } from './types';

export const TEMPLATES: TemplateItem[] = [
  {
    id: 'tech-spec',
    name: 'Engineering RFC / Spec',
    description: 'System architecture, API contracts, database schema, and SLA targets',
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
    id: 'api-docs',
    name: 'REST API Reference',
    description: 'Clean RESTful API reference with authentication and response codes',
    category: 'Documentation',
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

## Error Handling Matrix

| HTTP Status | Error Code | Description |
| :--- | :--- | :--- |
| \`400 Bad Request\` | \`invalid_parameters\` | One or more required fields are missing or malformed. |
| \`401 Unauthorized\` | \`invalid_api_key\` | The supplied API token is expired or revoked. |
| \`429 Too Many Requests\`| \`rate_limit_exceeded\` | Exceeded 1,000 requests / minute quota. |
`
  },
  {
    id: 'html-dashboard-card',
    name: 'Interactive HTML Component',
    description: 'Modern UI widget with glassmorphism, responsive grid, and metrics',
    category: 'UI Components',
    mode: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.8; }
    }
    .glow { animation: pulse-slow 3s infinite ease-in-out; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 p-8 flex items-center justify-center min-h-screen">

  <div class="relative w-full max-w-md bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl overflow-hidden backdrop-blur-xl">
    <div class="absolute -top-12 -right-12 w-40 h-40 bg-sky-500/20 rounded-full blur-2xl glow pointer-events-none"></div>

    <div class="flex items-center justify-between pb-4 border-b border-slate-800">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-lg">
          ⚡
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

</body>
</html>
`
  }
];
