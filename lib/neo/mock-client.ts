import type {
  NeoClient,
  NeoConnectionStatus,
  NeoRequest,
  NeoResponse,
  NeoSendOptions,
} from "@/lib/neo/types";
import { processCatMessage } from "@/lib/cat/engine";
import type { CatSession } from "@/lib/cat/types";

export class MockNeoClient implements NeoClient {
  readonly status: NeoConnectionStatus = "standby";

  async connect(): Promise<void> {
    return;
  }

  async disconnect(): Promise<void> {
    return;
  }

  async send(request: NeoRequest, options: NeoSendOptions): Promise<NeoResponse> {
    const session = options.session as CatSession;
    const result = processCatMessage(request.message, {
      session,
      currentModule: options.currentModule,
    });

    return {
      reply: result.reply,
      quickReplies: result.quickReplies,
      actions: result.actions?.map((action) => ({
        type: action.type,
        label: action.label,
        href: action.href,
      })),
      recommendations: result.recommendations,
      profileUpdates: result.profileUpdates,
      metadata: { source: "mock-neo", engine: "cat-rules-v1" },
    };
  }
}

export const mockNeoClient = new MockNeoClient();
