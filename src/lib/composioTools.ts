import { ComposioApp, ToolCall } from '../types';

export const COMPOSIO_APPS: ComposioApp[] = [
  {
    id: 'bash',
    name: 'Terminal & Bash',
    category: 'system',
    description: 'Execute shell commands, run scripts, manage system processes in VM',
    icon: 'Terminal',
    isConnected: true,
    toolsCount: 6,
    availableTools: ['bash_execute', 'kill_process', 'read_env', 'ps_list', 'install_package', 'curl_fetch']
  },
  {
    id: 'filesystem',
    name: 'File System',
    category: 'system',
    description: 'Read, edit, delete, and inspect files in the workspace sandbox',
    icon: 'Folder',
    isConnected: true,
    toolsCount: 7,
    availableTools: ['file_read', 'file_write', 'file_patch', 'file_delete', 'dir_list', 'grep_search', 'zip_archive']
  },
  {
    id: 'browser',
    name: 'Headless Browser',
    category: 'browser',
    description: 'Playwright-powered browser for navigating web pages, clicking, scraping',
    icon: 'Globe',
    isConnected: true,
    toolsCount: 8,
    availableTools: ['browser_navigate', 'browser_click', 'browser_type', 'browser_screenshot', 'browser_extract_text', 'browser_evaluate', 'browser_download', 'browser_pdf']
  },
  {
    id: 'gmail',
    name: 'Google Mail',
    category: 'email',
    description: 'Search emails, read threads, draft replies, and organize labels',
    icon: 'Mail',
    isConnected: true,
    toolsCount: 5,
    availableTools: ['gmail_search', 'gmail_read_thread', 'gmail_create_draft', 'gmail_send', 'gmail_apply_label']
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    category: 'calendar',
    description: 'Query availability, create invites, reschedule meetings, check conflicts',
    icon: 'Calendar',
    isConnected: true,
    toolsCount: 4,
    availableTools: ['calendar_list_events', 'calendar_create_event', 'calendar_check_conflicts', 'calendar_delete_event']
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'dev',
    description: 'Review Pull Requests, manage issues, git push, inspect repositories',
    icon: 'GitPullRequest',
    isConnected: true,
    toolsCount: 9,
    availableTools: ['github_list_prs', 'github_create_pr', 'github_add_review', 'github_create_issue', 'github_repo_files', 'github_trigger_workflow']
  },
  {
    id: 'notion',
    name: 'Notion Workspace',
    category: 'productivity',
    description: 'Query database tables, create knowledge docs, append meeting notes',
    icon: 'FileText',
    isConnected: true,
    toolsCount: 6,
    availableTools: ['notion_search', 'notion_create_page', 'notion_query_database', 'notion_append_blocks']
  },
  {
    id: 'slack',
    name: 'Slack Team',
    category: 'communication',
    description: 'Post messages to channels, monitor mentions, send direct summaries',
    icon: 'MessageSquare',
    isConnected: true,
    toolsCount: 5,
    availableTools: ['slack_send_message', 'slack_read_channel', 'slack_upload_file', 'slack_set_status']
  },
  {
    id: 'linear',
    name: 'Linear Tracker',
    category: 'productivity',
    description: 'Sync tickets, update task states, link commits, triage backlog',
    icon: 'CheckSquare',
    isConnected: false,
    toolsCount: 5,
    availableTools: ['linear_create_issue', 'linear_list_assigned', 'linear_update_state', 'linear_add_comment']
  }
];

export async function simulateToolExecution(toolCall: ToolCall): Promise<{
  output: string;
  durationMs: number;
  browserUpdate?: { url?: string; title?: string; pageContentSummary?: string; cursorPos?: { x: number; y: number; label?: string } };
  fileUpdate?: { path: string; content: string; isNew?: boolean };
  terminalLogs?: string[];
}> {
  // Realistic latency simulation
  const startTime = Date.now();
  await new Promise(res => setTimeout(res, 800 + Math.random() * 800));
  const durationMs = Date.now() - startTime;

  const { toolName, arguments: args } = toolCall;

  switch (toolName) {
    case 'bash_execute': {
      const cmd = args.command || 'echo "Done"';
      let output = `Command exited with status code 0 (success)\n`;
      let logs = [`$ ${cmd}`];

      if (cmd.includes('npm test') || cmd.includes('test')) {
        output += ` PASS  tests/agent.test.ts\n PASS  tests/workflows.test.ts\n\nTest Suites: 2 passed, 2 total\nTests:       14 passed, 14 total\nSnapshots:   0 total\nTime:        1.42s`;
        logs.push(`Running test runner...`, `PASS tests/agent.test.ts (7 tests passed)`, `PASS tests/workflows.test.ts (7 tests passed)`);
      } else if (cmd.includes('git') || cmd.includes('clone')) {
        output += `Cloning into 'qubot-agent-runner'...\nremote: Enumerating objects: 184, done.\nremote: Total 184 (delta 92), reused 160 (delta 78)\nReceiving objects: 100% (184/184), 420.15 KiB | 3.20 MiB/s, done.`;
        logs.push(`git clone ${args.url || 'repo'}`, `Receiving objects: 100% (184/184)`, `Branch 'main' set up to track remote branch 'main'.`);
      } else if (cmd.includes('docker') || cmd.includes('podman') || cmd.includes('vm')) {
        output += `CONTAINER ID   IMAGE                 COMMAND                  CREATED         STATUS         PORTS\n9b12a8f01c44   qubot/sandbox:latest   "/bin/entrypoint.sh"    12 seconds ago  Up 11 seconds  0.0.0.0:8080->8080/tcp`;
        logs.push(`Container 9b12a8f01c44 is live and healthy.`);
      } else {
        output += `stdout:\n[QUBOT VM RUNNER] Operation completed successfully.\nMemory: 248MB / 4096MB | CPU: 4.2%`;
        logs.push(`Executing: ${cmd}`, `Status: OK (exit code 0)`);
      }

      return { output, durationMs, terminalLogs: logs };
    }

    case 'file_write': {
      const path = args.path || 'workspace/output.txt';
      const content = args.content || '// generated by QUBOT';
      return {
        output: `File written successfully to ${path} (${content.length} bytes, UTF-8).\nIntegrity check: SHA-256 verified.`,
        durationMs,
        fileUpdate: { path, content, isNew: true },
        terminalLogs: [`[fs] Created file: ${path} [${content.length} bytes]`]
      };
    }

    case 'browser_navigate': {
      const url = args.url || 'https://google.com';
      const title = url.includes('github') ? 'GitHub: Where the world builds software' 
                  : url.includes('stripe') ? 'Stripe | Financial Infrastructure for the Internet'
                  : url.includes('news.ycombinator') ? 'Hacker News'
                  : `Web Preview: ${url.replace('https://', '')}`;
      return {
        output: `Browser navigation succeeded to ${url}.\nHTTP 200 OK. Page rendered in 410ms. DOM ready with 34 interactive elements.`,
        durationMs,
        browserUpdate: {
          url,
          title,
          cursorPos: { x: 380, y: 240, label: 'Inspecting DOM element' },
          pageContentSummary: `Rendered viewport for ${url}. All security headers parsed.`
        },
        terminalLogs: [`[browser] GET ${url} -> 200 OK [DOM ready 410ms]`]
      };
    }

    case 'browser_click': {
      return {
        output: `Clicked element "${args.selector || 'button.primary'}" successfully.\nDOM mutated. Triggered event dispatch and network request.`,
        durationMs,
        browserUpdate: {
          cursorPos: { x: 512, y: 310, label: `Clicked ${args.selector || 'Action'}` }
        },
        terminalLogs: [`[browser] MouseClick on ${args.selector || 'button.primary'}`]
      };
    }

    case 'gmail_send': {
      return {
        output: `Email dispatched successfully.\nMessage-ID: <msg-${Date.now()}@qubot.mail>\nTo: ${args.to || 'recipient@example.com'}\nSubject: "${args.subject || 'Automated Update'}"\nStatus: Delivered.`,
        durationMs,
        terminalLogs: [`[gmail] Sent email to ${args.to} | Subject: "${args.subject}"`]
      };
    }

    case 'gmail_search': {
      return {
        output: `Found 3 matching threads for query "${args.query || 'recent'}":\n1. "Q3 Product Architecture Review" from alex@corp.com (Unread)\n2. "Cloud VM Infrastructure Billing" from billing@gcp.com\n3. "Action Required: API Quota Renewal" from support@api.io`,
        durationMs,
        terminalLogs: [`[gmail] Query: "${args.query || 'recent'}" -> 3 threads retrieved`]
      };
    }

    case 'calendar_create_event': {
      return {
        output: `Calendar Event scheduled:\nEvent: "${args.title || 'Automation Review'}"\nWhen: ${args.time || 'Tomorrow at 10:00 AM UTC'}\nAttendees: ${args.attendees ? args.attendees.join(', ') : 'self'}\nLink: https://meet.google.com/qub-ot-aut`,
        durationMs,
        terminalLogs: [`[calendar] Created event: "${args.title}" at ${args.time}`]
      };
    }

    case 'github_create_pr': {
      return {
        output: `Pull Request #42 opened successfully!\nRepository: ${args.repo || 'qubot/core'}\nBranch: ${args.branch || 'feature/bot-autonomous-loop'}\nURL: https://github.com/${args.repo || 'qubot/core'}/pull/42\nAll automated checks passed.`,
        durationMs,
        terminalLogs: [`[github] Created PR #42 in ${args.repo || 'qubot/core'} [Checks 4/4 passing]`]
      };
    }

    case 'notion_append_blocks': {
      return {
        output: `Page updated in Notion.\nTarget: "${args.pageTitle || 'Engineering Specs'}"\nAppended 4 new blocks (Summary, Code Block, Checklist, Action Items).`,
        durationMs,
        terminalLogs: [`[notion] Appended 4 blocks to "${args.pageTitle || 'Doc'}"`]
      };
    }

    case 'slack_send_message': {
      return {
        output: `Message posted to #${args.channel || 'general'}:\n"${args.text || 'Automated ping from QUBOT'}"\nTimestamp: ${new Date().toLocaleTimeString()}`,
        durationMs,
        terminalLogs: [`[slack] Posted to #${args.channel || 'general'}`]
      };
    }

    default:
      return {
        output: `Tool "${toolName}" executed successfully.\nArguments: ${JSON.stringify(args, null, 2)}`,
        durationMs,
        terminalLogs: [`[composio] Executed ${toolName}`]
      };
  }
}
