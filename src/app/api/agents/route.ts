import { INITIAL_AGENTS } from '../../../lib/initialAgents';

export async function GET() {
  return Response.json({
    agents: INITIAL_AGENTS,
    runtime: 'QUBOT v2.4 Local-First VM Engine'
  });
}
