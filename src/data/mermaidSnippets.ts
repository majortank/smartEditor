export interface MermaidSnippet {
  id: string;
  name: string;
  syntaxKey: string;
  category: 'Structure' | 'Behavior' | 'Planning' | 'Data & Analytics' | 'Specification';
  description: string;
  code: string;
}

export const MERMAID_SNIPPETS: MermaidSnippet[] = [
  {
    id: 'requirementDiagram',
    name: 'Requirement Diagram',
    syntaxKey: 'requirementDiagram',
    category: 'Specification',
    description: 'System requirement traceability, risk levels, and verification methods',
    code: `requirementDiagram
    requirement auth_security {
      id: "REQ-101"
      text: "System must enforce hardware MFA for all admin mutations."
      risk: high
      verifymethod: test
    }
    requirement audit_logging {
      id: "REQ-102"
      text: "All authorization events must be recorded to immutable storage."
      risk: medium
      verifymethod: inspection
    }
    element iam_gateway {
      type: "Component"
    }
    iam_gateway - satisfies -> auth_security
    iam_gateway - satisfies -> audit_logging`
  },
  {
    id: 'classDiagram',
    name: 'Class Diagram',
    syntaxKey: 'classDiagram',
    category: 'Structure',
    description: 'Object-oriented domain modeling, fields, methods, and relationships',
    code: `classDiagram
    class User {
      +UUID id
      +String email
      +String passwordHash
      +Role role
      +validatePassword(plainText) Boolean
      +generateAuthToken() String
    }
    class Account {
      +UUID accountId
      +String tier
      +DateTime createdAt
      +upgradeTier(newTier)
    }
    class APIKey {
      +String keyHash
      +String name
      +DateTime expiresAt
      +revoke()
    }
    User "1" *-- "1" Account : belongs to
    Account "1" o-- "*" APIKey : provisions`
  },
  {
    id: 'sequenceDiagram',
    name: 'Sequence Diagram',
    syntaxKey: 'sequenceDiagram',
    category: 'Behavior',
    description: 'Synchronous/asynchronous message passing, participants, and lifelines',
    code: `sequenceDiagram
    autonumber
    actor Client as User Browser
    participant Edge as Edge CDN Gateway
    participant Auth as Auth0 / OAuth2
    participant Core as Core Microservice
    participant DB as Postgres Cluster

    Client->>Edge: POST /api/v2/session/login
    Edge->>Auth: Validate Credential Claims
    Auth-->>Edge: Issue Signed RS256 JWT
    Edge-->>Client: Set HttpOnly Cookie (jwt_token)
    Client->>Edge: GET /api/v2/workspaces
    Edge->>Core: Forward with Claims (sub, tenant_id)
    Core->>DB: SELECT * FROM workspaces WHERE tenant_id = $1
    DB-->>Core: Workspace Rows
    Core-->>Client: 200 OK (Workspace Payloads)`
  },
  {
    id: 'erDiagram',
    name: 'Entity Relationship (ER)',
    syntaxKey: 'erDiagram',
    category: 'Structure',
    description: 'Relational database schema with keys, cardinalities, and attributes',
    code: `erDiagram
    ORGANIZATION ||--|{ USER : contains
    ORGANIZATION ||--o{ SUBSCRIPTION : maintains
    USER ||--o{ DOCUMENT : authors
    DOCUMENT ||--o{ DIAGRAM : embeds
    ORGANIZATION {
        uuid id PK
        string name
        string billing_email
        timestamp created_at
    }
    USER {
        uuid id PK
        uuid org_id FK
        string full_name
        string email
    }
    DOCUMENT {
        uuid id PK
        uuid user_id FK
        string title
        text content
        string mode
    }`
  },
  {
    id: 'stateDiagram-v2',
    name: 'State Machine (v2)',
    syntaxKey: 'stateDiagram-v2',
    category: 'Behavior',
    description: 'Finite state machine transitions, triggers, and terminal states',
    code: `stateDiagram-v2
    [*] --> Draft
    Draft --> InReview : Submit for Review
    InReview --> Approved : Lead Approves
    InReview --> ChangesRequested : Request Edits
    ChangesRequested --> InReview : Re-submit
    Approved --> QueuedForDeploy : Trigger Pipeline
    QueuedForDeploy --> Deploying : Worker Assigned
    Deploying --> LiveProduction : Healthchecks Pass
    Deploying --> Rollback : Canary Degradation
    Rollback --> Draft : Reopen Issue
    LiveProduction --> [*]`
  },
  {
    id: 'mindmap',
    name: 'Mindmap',
    syntaxKey: 'mindmap',
    category: 'Specification',
    description: 'Hierarchical node clustering for brainstorms and technical architecture',
    code: `mindmap
  root((Fullstack Architecture))
    Frontend Studio
      Next.js 15 App Router
      React 19 Hooks
      Tailwind CSS 3.4
      Lucide Vector Icons
    Rendering Engines
      Marked GFM Compiler
      DOMPurify Security Sandbox
      Mermaid v12 Engine
    Export & Distribution
      Standalone HTML Bundle
      Print-Isolated Iframe
      Netlify Edge CDN
    State & Persistence
      Browser LocalStorage
      Reactive Split Synchronization`
  },
  {
    id: 'venn-beta',
    name: 'Venn Diagram',
    syntaxKey: 'venn-beta',
    category: 'Data & Analytics',
    description: 'Set intersection modeling and proportional overlapping domains',
    code: `venn-beta
    set A["Frontend Engineering"]: 12
    set B["Backend Systems"]: 12
    set C["DevOps & Infrastructure"]: 10
    union A, B["Fullstack Architecture"]: 5
    union B, C["Site Reliability"]: 4
    union A, C["Edge Performance"]: 3
    union A, B, C["Platform Tech Lead"]: 2`
  },
  {
    id: 'timeline',
    name: 'Timeline',
    syntaxKey: 'timeline',
    category: 'Planning',
    description: 'Chronological milestone tracker and major historical events',
    code: `timeline
    title Studio Evolution Roadmap
    2024 : Project Conception : Initial Prototype
    2025 : TypeScript Migration : Markdown Core
    2026 : Next.js 15 Migration : Bidirectional HTML Converter : Complete Mermaid Engine
    2027 : Collaborative Workspaces : Cloud Storage Sync`
  },
  {
    id: 'usecase-beta',
    name: 'Usecase Diagram',
    syntaxKey: 'usecase-beta',
    category: 'Behavior',
    description: 'User personas, actors, and functional system boundaries',
    code: `usecase-beta
    actor TechnicalWriter
    actor SoftwareEngineer
    actor ProductManager

    TechnicalWriter --> CreateDocument
    TechnicalWriter --> ExportStandaloneHTML
    SoftwareEngineer --> EditArchitectureDiagram
    SoftwareEngineer --> ConvertMarkdownToHTMLComponent
    ProductManager --> ReviewSpecifications
    ProductManager --> PrintExecutiveSummary`
  },
  {
    id: 'sankey-beta',
    name: 'Sankey Flow',
    syntaxKey: 'sankey-beta',
    category: 'Data & Analytics',
    description: 'Proportional source-to-target energy, cost, and bandwidth flow mapping',
    code: `sankey-beta
    Cloud Revenue,Product Engineering,380
    Cloud Revenue,Infrastructure Operations,220
    Cloud Revenue,Security & Compliance,140
    Cloud Revenue,Net Operating Profit,260
    Infrastructure Operations,Compute Instances,120
    Infrastructure Operations,Managed Databases,60
    Infrastructure Operations,CDN Egress,40`
  },
  {
    id: 'xychart-beta',
    name: 'XY Chart (Bar & Line)',
    syntaxKey: 'xychart-beta',
    category: 'Data & Analytics',
    description: 'Bivariate coordinate plotting with combined bars and trend lines',
    code: `xychart-beta
    title "Monthly Document Exports & Compilations (2026)"
    x-axis [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep]
    y-axis "Operations (Thousands)" 10 --> 90
    bar [15, 24, 32, 45, 58, 67, 74, 82, 89]
    line [12, 20, 28, 41, 52, 63, 71, 79, 86]`
  },
  {
    id: 'pie',
    name: 'Pie Chart',
    syntaxKey: 'pie',
    category: 'Data & Analytics',
    description: 'Proportional distribution slicing with label tooltips and percentages',
    code: `pie title Cloud Infrastructure Resource Distribution
    "Kubernetes Pods" : 44
    "Relational Databases" : 26
    "Serverless Functions" : 18
    "Storage & CDN" : 12`
  },
  {
    id: 'quadrantChart',
    name: 'Quadrant Chart',
    syntaxKey: 'quadrantChart',
    category: 'Data & Analytics',
    description: '4-quadrant strategic value vs effort analysis matrix',
    code: `quadrantChart
    title Technical Roadmap Prioritization
    x-axis Low Effort --> High Effort
    y-axis Low Strategic Value --> High Strategic Value
    quadrant-1 Quick High Value
    quadrant-2 Major Strategic Investments
    quadrant-3 Deprioritize
    quadrant-4 Low Impact Work
    "Live Mermaid Suite": [0.35, 0.90]
    "Next.js App Router": [0.25, 0.85]
    "Isolated Iframe Print": [0.20, 0.70]
    "Bespoke Monogram": [0.15, 0.65]
    "Custom WASM AST Compiler": [0.85, 0.45]`
  },
  {
    id: 'railroad-abnf-beta',
    name: 'Railroad ABNF Grammar',
    syntaxKey: 'railroad-abnf-beta',
    category: 'Specification',
    description: 'Syntax diagram railroad track visualizer for grammar validation',
    code: `railroad-abnf-beta
    http-request = method SP request-target SP http-version CRLF;
    method = "GET" / "POST" / "PUT" / "DELETE" / "PATCH";
    http-version = "HTTP/1.1" / "HTTP/2.0" / "HTTP/3.0";`
  },
  {
    id: 'gitGraph',
    name: 'Git Graph',
    syntaxKey: 'gitGraph',
    category: 'Planning',
    description: 'Git branching, checkout, tags, cherry-picks, and merge flows',
    code: `gitGraph
    commit id: "v1.0.0"
    branch develop
    checkout develop
    commit id: "feat: app-router"
    commit id: "feat: html-converter"
    branch feature/mermaid
    checkout feature/mermaid
    commit id: "feat: mermaid-suite"
    commit id: "fix: debounce-preview"
    checkout develop
    merge feature/mermaid id: "merge: mermaid"
    checkout main
    merge develop id: "v2.0.0-release"
    commit id: "hotfix: icon-refactor"`
  },
  {
    id: 'gantt',
    name: 'Gantt Chart',
    syntaxKey: 'gantt',
    category: 'Planning',
    description: 'Critical path scheduling with dependencies, milestones, and sections',
    code: `gantt
    title Enterprise Delivery Schedule Q3-Q4
    dateFormat YYYY-MM-DD
    section Platform
      App Router Migration    :done, t1, 2026-08-01, 2026-08-15
      Mermaid v12 Engine      :done, t2, 2026-08-10, 2026-08-25
      Component Snippet Suite :active, t3, 2026-08-20, 2026-09-10
    section Deployment
      Netlify Production Setup:done, d1, 2026-08-25, 2026-09-05
      Security & Type Auditing:active, d2, 2026-09-01, 2026-09-20
      General Availability GA :milestone, m1, 2026-09-20, 0d`
  },
  {
    id: 'eventmodeling',
    name: 'Event Modeling (CQRS)',
    syntaxKey: 'eventmodeling',
    category: 'Behavior',
    description: 'Commands, events, read models, and UI time-frames for CQRS architectures',
    code: `eventmodeling
    entity OrderService
    entity PaymentService
    entity InventoryService
    tf 1 ui OrderScreen
    tf 2 cmd PlaceOrder
    tf 3 event OrderPlaced
    tf 4 cmd ReserveInventory
    tf 5 event InventoryReserved
    tf 6 cmd ProcessPayment
    tf 7 event PaymentCaptured
    tf 8 rmo OrderConfirmation`
  },
  {
    id: 'zenuml',
    name: 'ZenUML Sequence',
    syntaxKey: 'zenuml',
    category: 'Behavior',
    description: 'Code-first sequence syntax for clean microservice call cascades',
    code: `zenuml
    title Distributed Order Processing
    Client->OrderService.checkout(cart) {
        OrderService->InventoryService.reserve(items)
        OrderService->PaymentGateway.charge(amount) {
            PaymentGateway->Bank.authorize()
            return receipt
        }
        return orderId
    }`
  },
  {
    id: 'packet',
    name: 'Packet Protocol Header',
    syntaxKey: 'packet-beta',
    category: 'Structure',
    description: 'Binary protocol bit fields, word offsets, and networking frame formats',
    code: `packet-beta
0-15: "Source Port (16 bits)"
16-31: "Destination Port (16 bits)"
32-63: "Sequence Number (32 bits)"
64-95: "Acknowledgment Number (32 bits)"
96-99: "Data Offset"
100-105: "Reserved"
106-111: "TCP Control Flags (URG, ACK, PSH, RST, SYN, FIN)"
112-127: "Window Size (16 bits)"
128-143: "Checksum (16 bits)"
144-159: "Urgent Pointer (16 bits)"`
  },
  {
    id: 'kanban',
    name: 'Kanban Board',
    syntaxKey: 'kanban',
    category: 'Planning',
    description: 'Agile columns, task cards, and stage progression pipelines',
    code: `kanban
  Backlog
    [Multi-user Realtime Collab]
    [WASM Syntax Tree Highlighter]
    [Self-hosted Docker Container]
  In Development
    [Comprehensive 20-Diagram Suite]
    [Component Preset Dropdown]
  Review & QA
    [Debounced Syntax Recovery]
    [Vector Monogram Branding]
  Completed
    [Next.js 15 App Router]
    [Bidirectional Markdown Converter]
    [Isolated Content Print]`
  }
];
