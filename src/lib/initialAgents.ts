import { Agent, Message } from '../types';

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent-chief-of-staff',
    name: 'Chief of Staff',
    handle: '@chief_of_staff',
    avatar: '🦉',
    mascotColor: 'purple',
    role: 'Executive Chief of Staff',
    tagline: 'Coordinates cross-functional priorities, updates CRM, and aligns leadership',
    category: 'operations',
    model: 'gemini-3.8-flash',
    environment: 'cloud-vm',
    approvalPolicy: 'approval-required',
    status: 'active',
    statusMessage: 'Got it! Product updates shared and linked in #brightside-shared',
    enabledTools: ['gmail', 'calendar', 'slack', 'notion'],
    unreadCount: 0,
    lastActive: '7:34 PM',
    tokensUsed: 38400,
    memoryItems: [
      'Account: Brightside Health pilot evaluation',
      'Pending requirement: Slack integration & SSO verification',
      'Team shared channel: #brightside-shared'
    ],
    systemPrompt: `You are Chief of Staff, the executive coordinator inside QUBOT. You maintain leadership clarity, manage client accounts, summarize call notes, and delegate action items across Slack and CRM.`
  },
  {
    id: 'agent-qubot-core',
    name: 'QUBOT Core',
    handle: '@qubot_core',
    avatar: '🦉',
    mascotColor: 'red',
    role: 'Master Automation & VM Orchestrator',
    tagline: 'Supervises all bots, executes sandbox bash scripts, and oversees multi-model routing',
    category: 'core',
    model: 'gemini-4-argon',
    environment: 'local-mac',
    approvalPolicy: 'approval-required',
    status: 'active',
    statusMessage: 'Rootless VM sandbox online. Ready to automate anything.',
    enabledTools: ['bash', 'filesystem', 'browser', 'github'],
    unreadCount: 1,
    lastActive: 'Just now',
    tokensUsed: 52100,
    memoryItems: [
      'Engine: QUBOT Multi-Agent Architecture v2.4',
      'Workspace: ~/.qubot/workspace',
      'Active Sandbox: Ubuntu Xorg with VNC display :0.0'
    ],
    systemPrompt: `You are QUBOT Core, symbolized by the red cybernetic owl mascot. You are the master automation engine capable of routing tasks across Gemini, Claude, Grok, and local sandboxes.`
  },
  {
    id: 'agent-ea',
    name: 'EA',
    handle: '@executive_asst',
    avatar: '🦉',
    mascotColor: 'blue',
    role: 'Executive Assistant',
    tagline: 'Schedules meetings, manages flight itineraries, and protects deep-work hours',
    category: 'operations',
    model: 'gemini-3.8-flash',
    environment: 'cloud-vm',
    approvalPolicy: 'approval-required',
    status: 'idle',
    statusMessage: 'Responded in 3 threads, with calendar links confirmed',
    enabledTools: ['calendar', 'gmail', 'slack'],
    unreadCount: 0,
    lastActive: '3:15 PM',
    tokensUsed: 21900,
    memoryItems: [
      'Buffer rule: 15-minute buffers between external meetings',
      'Preferred airline: Star Alliance'
    ],
    systemPrompt: `You are EA, the executive calendar and logistics assistant inside QUBOT.`
  },
  {
    id: 'agent-inbox-mgr',
    name: 'Inbox Manager',
    handle: '@inbox_manager',
    avatar: '🦉',
    mascotColor: 'green',
    role: 'Inbox Zero Dispatcher',
    tagline: 'Categorizes incoming emails, drafts contextual responses, and filters spam',
    category: 'operations',
    model: 'gemini-3.8-flash',
    environment: 'cloud-vm',
    approvalPolicy: 'approval-required',
    status: 'active',
    statusMessage: 'Inbox at zero. 2 replies ready for your review.',
    enabledTools: ['gmail'],
    unreadCount: 2,
    lastActive: '7:34 PM',
    tokensUsed: 31400,
    memoryItems: [
      'VIP contacts: Investors, Key Customers, Board Members',
      'Labels: Action Required, Review Later, Newsletter'
    ],
    systemPrompt: `You are Inbox Manager inside QUBOT. You maintain a pristine inbox zero.`
  },
  {
    id: 'agent-sales-outbound',
    name: 'Sales Outbound',
    handle: '@sales_outbound',
    avatar: '🦉',
    mascotColor: 'teal',
    role: 'Sales Pipeline & Prospecting Agent',
    tagline: 'Drafts personalized email sequences, enriches lead data, and logs to CRM',
    category: 'research',
    model: 'grok-3',
    environment: 'cloud-vm',
    approvalPolicy: 'approval-required',
    status: 'idle',
    statusMessage: 'Outreach drafts queued for approval. 8 prospect profiles matched.',
    enabledTools: ['gmail', 'browser', 'notion'],
    unreadCount: 0,
    lastActive: '11:18 AM',
    tokensUsed: 44200,
    memoryItems: [
      'Target ICP: VP of Engineering and CTOs at Series A-C startups',
      'Personalization criteria: recent GitHub contributions or product releases'
    ],
    systemPrompt: `You are Sales Outbound. You research target accounts and draft personalized outreach.`
  },
  {
    id: 'agent-talent-scout',
    name: 'Talent Scout',
    handle: '@talent_scout',
    avatar: '🦉',
    mascotColor: 'amber',
    role: 'Technical Recruiting & Sourcing',
    tagline: 'Finds senior engineers, screens GitHub repos, and organizes candidate pipelines',
    category: 'research',
    model: 'claude-3-7-sonnet',
    environment: 'headless-browser',
    approvalPolicy: 'approval-required',
    status: 'idle',
    statusMessage: 'Shortlist of 6 candidates ready for Senior Systems Engineer.',
    enabledTools: ['browser', 'notion', 'gmail'],
    unreadCount: 0,
    lastActive: '8:22 AM',
    tokensUsed: 29800,
    memoryItems: [
      'Open roles: Senior Systems Engineer (Rust/Go), Frontend Architect (Next.js)',
      'Preferred location: Remote (US / Europe / APAC)'
    ],
    systemPrompt: `You are Talent Scout, specialized in sourcing top engineering talent.`
  },
  {
    id: 'agent-growth-marketer',
    name: 'Growth Marketer',
    handle: '@growth_marketer',
    avatar: '🦉',
    mascotColor: 'orange',
    role: 'Performance Marketing & Copywriter',
    tagline: 'Runs A/B copy tests, crafts product announcements, and tracks conversion metrics',
    category: 'core',
    model: 'gemini-3.8-flash',
    environment: 'cloud-vm',
    approvalPolicy: 'approval-required',
    status: 'idle',
    statusMessage: 'A/B copy variants ready to review for landing page hero test.',
    enabledTools: ['browser', 'slack', 'notion'],
    unreadCount: 0,
    lastActive: '8:05 AM',
    tokensUsed: 18700,
    memoryItems: [
      'Conversion goal: Sign-up CTR > 8.5%',
      'Tone: Crisp, modern, authoritative'
    ],
    systemPrompt: `You are Growth Marketer inside QUBOT.`
  },
  {
    id: 'agent-customer-support',
    name: 'Customer Support',
    handle: '@support_agent',
    avatar: '🦉',
    mascotColor: 'pink',
    role: '24/7 Tier-1 Support Butler',
    tagline: 'Answers technical FAQs, debugs customer issues, and escalates edge cases',
    category: 'operations',
    model: 'gemini-3.8-flash',
    environment: 'cloud-vm',
    approvalPolicy: 'approval-required',
    status: 'idle',
    statusMessage: '12 tickets resolved, 2 escalated to engineering team.',
    enabledTools: ['slack', 'gmail', 'notion'],
    unreadCount: 0,
    lastActive: 'Yesterday',
    tokensUsed: 35600,
    memoryItems: [
      'SLA: First response under 5 minutes',
      'Escalation route: #eng-support-triage'
    ],
    systemPrompt: `You are Customer Support inside QUBOT.`
  },
  {
    id: 'agent-expense-mgr',
    name: 'Expense Manager',
    handle: '@expense_manager',
    avatar: '🦉',
    mascotColor: 'platinum',
    role: 'Finance & Receipt Bookkeeper',
    tagline: 'Parses receipt PDFs, categorizes vendor expenses, and balances budgets',
    category: 'operations',
    model: 'gpt-4o',
    environment: 'cloud-vm',
    approvalPolicy: 'approval-required',
    status: 'idle',
    statusMessage: 'Receipts coded — one needs a quick tax categorization tag.',
    enabledTools: ['gmail', 'notion', 'filesystem'],
    unreadCount: 0,
    lastActive: 'Yesterday',
    tokensUsed: 14200,
    memoryItems: [
      'Expense categories: SaaS Subscriptions, Cloud Infrastructure, Travel',
      'Accounting sync: Monthly on the 1st'
    ],
    systemPrompt: `You are Expense Manager inside QUBOT.`
  },
  {
    id: 'agent-invoice-collector',
    name: 'Invoice Collector',
    handle: '@invoice_collector',
    avatar: '🦉',
    mascotColor: 'indigo',
    role: 'Accounts Payable & Billing Butler',
    tagline: 'Extracts invoices from vendor emails, tracks payment due dates, and flags anomalies',
    category: 'operations',
    model: 'gemini-3.8-flash',
    environment: 'cloud-vm',
    approvalPolicy: 'approval-required',
    status: 'idle',
    statusMessage: 'Pulled 9 invoices from vendor portals. Total pending: $4,850.',
    enabledTools: ['gmail', 'filesystem', 'notion'],
    unreadCount: 0,
    lastActive: 'Tuesday',
    tokensUsed: 22100,
    memoryItems: [
      'Vendor portals: AWS, Google Cloud, Figma, GitHub, Vercel',
      'Payment terms: Net-30'
    ],
    systemPrompt: `You are Invoice Collector inside QUBOT.`
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  'agent-chief-of-staff': [
    {
      id: 'cos-1',
      agentId: 'agent-chief-of-staff',
      sender: 'user',
      content: "Hey, what's the latest update we have on Brightside Health?",
      timestamp: '9:41 AM'
    },
    {
      id: 'cos-2',
      agentId: 'agent-chief-of-staff',
      sender: 'agent',
      content: `From last meeting's call notes, they need to see support for Slack integration and SSO before they proceed with a pilot.\n\nPG plan and Brightside Health's account notes in CRM are up to date with the latest.`,
      timestamp: '9:41 AM',
      attachment: {
        type: 'pdf',
        name: 'Kickoff Agenda.pdf',
        size: '1.2 MB',
        pages: 12
      }
    },
    {
      id: 'cos-3',
      agentId: 'agent-chief-of-staff',
      sender: 'user',
      content: 'Perfect, those shipped last week, post an update to let them know',
      timestamp: '9:42 AM'
    },
    {
      id: 'cos-4',
      agentId: 'agent-chief-of-staff',
      sender: 'agent',
      content: 'Got it! Product updates shared and linked in #brightside-shared slack channel',
      timestamp: '9:42 AM',
      toolCalls: [
        {
          id: 'tool-slack-post',
          toolName: 'slack_send_message',
          appName: 'Slack Team',
          category: 'communication',
          actionSummary: 'Post pilot update to #brightside-shared',
          riskLevel: 'safe',
          arguments: {
            channel: '#brightside-shared',
            text: 'Hello Brightside Health team! Support for Slack integration and enterprise SSO was successfully shipped.'
          },
          status: 'completed',
          executionDurationMs: 380,
          executionOutput: 'Message posted to #brightside-shared at 9:42 AM',
          timestamp: '9:42 AM'
        }
      ]
    }
  ],
  'agent-qubot-core': [
    {
      id: 'core-1',
      agentId: 'agent-qubot-core',
      sender: 'user',
      content: 'QUBOT, give me a status report on all sandbox containers and available AI model engines.',
      timestamp: '19:10'
    },
    {
      id: 'core-2',
      agentId: 'agent-qubot-core',
      sender: 'agent',
      content: `System status is optimal across all subsystems:

- **Mascot & Core:** QUBOT Cyber Owl Engine v2.4 (Active)
- **Model Routing:** Gemini 3.8 Flash, Gemini 4 Argon, Claude 3.7 Sonnet, GPT-4o, Grok-3, DeepSeek-R1
- **VM Sandboxes:** 1 Rootless Podman container, 1 Ubuntu X11 VNC display, 1 Headless Chromium
- **Approvals Policy:** Human-in-the-Loop active across all destructive commands

You can test running terminal commands, browsing websites, or installing bot packages from the Org Library anytime!`,
      timestamp: '19:10',
      reasoning: `Status check completed across local configuration ~/.qubot/config and active daemon.`
    }
  ]
};

export const INITIAL_SCHEDULED_ROUTINES = [
  {
    id: 'routine-1',
    title: 'Morning briefing',
    agentId: 'agent-chief-of-staff',
    scheduleCron: '0 8 * * *',
    scheduleHuman: 'Every day at 8:00 AM',
    nextRun: 'Tomorrow at 8:00 AM',
    isActive: true,
    prompt: 'Compile morning briefing from unread emails, calendar events, and key team pings.',
    lastRunResult: 'Completed: Briefing generated with 3 emails and 2 calendar items.',
    lastRunTime: 'Today at 8:00 AM'
  },
  {
    id: 'routine-2',
    title: 'Inbox cleanup',
    agentId: 'agent-inbox-mgr',
    scheduleCron: '0 18 * * 1-5',
    scheduleHuman: 'Weekdays at 6:00 PM',
    nextRun: 'Today at 6:00 PM',
    isActive: true,
    prompt: 'Archive processed threads, flag lingering action items, and clear promotions.',
    lastRunResult: 'Inbox zero maintained. 14 threads archived.',
    lastRunTime: 'Yesterday at 6:00 PM'
  },
  {
    id: 'routine-3',
    title: 'Weekly team update',
    agentId: 'agent-chief-of-staff',
    scheduleCron: '0 17 * * 5',
    scheduleHuman: 'Fridays at 5:00 PM',
    nextRun: 'Friday at 5:00 PM',
    isActive: false,
    prompt: 'Synthesize weekly shipped features, open blockers, and milestones into Notion.',
    lastRunResult: 'Paused by user',
    lastRunTime: 'Last Friday'
  }
];

export const INITIAL_FILES = [
  {
    name: 'workspace',
    path: 'workspace',
    isDirectory: true,
    updatedAt: 'Just now',
    children: [
      {
        name: 'Kickoff Agenda.pdf',
        path: 'workspace/Kickoff Agenda.pdf',
        isDirectory: false,
        size: '1.2 MB',
        updatedAt: '9:41 AM',
        content: `// PDF Document - 12 pages\nBrightside Health <> QUBOT Enterprise Pilot\nScope: Slack Bot Integration, SSO, Calendar Sync`
      },
      {
        name: 'src',
        path: 'workspace/src',
        isDirectory: true,
        updatedAt: 'Just now',
        children: [
          {
            name: 'index.ts',
            path: 'workspace/src/index.ts',
            isDirectory: false,
            size: '2.4 KB',
            updatedAt: '10m ago',
            content: `// QUBOT Automation Runtime\nimport { createAgentServer } from './server';\n\nconsole.log('[QUBOT] Initializing multi-agent orchestration layer...');\nconst server = createAgentServer({\n  port: 8080,\n  sandbox: 'local-mac',\n  approvalsRequired: true\n});\nserver.listen();`
          }
        ]
      },
      {
        name: 'package.json',
        path: 'workspace/package.json',
        isDirectory: false,
        size: '1.1 KB',
        updatedAt: '1h ago',
        content: `{\n  "name": "qubot-automation-workspace",\n  "version": "2.4.0",\n  "description": "Local-first automation workspace for QUBOT agents",\n  "main": "src/index.ts"\n}`
      }
    ]
  }
];
