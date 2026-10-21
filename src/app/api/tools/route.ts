import { simulateToolExecution } from '../../../lib/composioTools';

export async function POST(request: Request) {
  try {
    const { toolCall } = await request.json();
    if (!toolCall) {
      return Response.json({ error: 'Missing toolCall specification' }, { status: 400 });
    }

    const result = await simulateToolExecution(toolCall);
    return Response.json(result);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
