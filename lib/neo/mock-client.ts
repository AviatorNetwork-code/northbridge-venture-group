import type {
  NeoClient,
  NeoConnectionStatus,
  NeoRequest,
  NeoResponse,
  NeoSendOptions,
} from "@/lib/neo/types";
import { processCatMessage } from "@/lib/cat/engine";
import { processDiscoveryMessage } from "@/lib/cat/discovery-engine";
import type { CatSession } from "@/lib/cat/types";
import type { DiscoveryProfile } from "@/lib/cat/discovery-types";

function isHomepageDiscovery(options: NeoSendOptions): boolean {
  return options.currentModule === "homepage";
}

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
    const profile = (session.businessProfile ?? {}) as DiscoveryProfile;

    if (isHomepageDiscovery(options)) {
      const result = processDiscoveryMessage(request.message, profile);

      return {
        reply: result.reply,
        profileUpdates: result.profileUpdates,
        metadata: {
          source: "mock-neo",
          engine: "cat-discovery-v1",
          triggerWebsiteAnalysis: result.triggerWebsiteAnalysis,
          showWebsiteAnalyzing: result.showWebsiteAnalyzing,
          progressiveReply: result.progressiveReply,
          thinkingContext: result.thinkingContext,
          cards: result.cards,
          humanAssistanceRequested: result.humanAssistanceRequested,
        },
      };
    }

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
