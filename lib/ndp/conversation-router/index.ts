export type { CustomerRequest, CustomerRequestChannel } from "./types/customer-request.js";

export type {
  ConversationContext,
  OrganizationContext,
  SubscriptionContext,
  TeamContext,
  ActiveConversation,
  SubscriptionStatus,
} from "./types/conversation-context.js";

export type {
  ConversationOwnership,
  ConversationOwnershipSource,
  FutureOwnerCapability,
  FutureOwnerType,
} from "./types/ownership.js";

export type {
  ResponseEnvelope,
  ResponseEnvelopeMetadata,
  CustomerInteractionSession,
  CoordinatedResponseInput,
} from "./types/response.js";

export type {
  OrganizationContextLoader,
  OperationsIntelligenceLoader,
  SubscriptionResolver,
  TeamResolver,
  ConversationContextBuilder,
} from "./context/builders.js";
export {
  DefaultConversationContextBuilder,
} from "./context/builders.js";

export {
  InMemoryOrganizationContextLoader,
  InMemorySubscriptionResolver,
  InMemoryTeamResolver,
  createTestOrganization,
} from "./context/in-memory-loaders.js";
export type { InMemoryOrganizationRecord } from "./context/in-memory-loaders.js";

export {
  NORDI_OWNED_INTENT_TAGS,
  OPERATIONAL_INTENT_TAGS,
  DefaultNordiOwnershipEvaluator,
  findContinuityOwner,
  hasTag,
  isNordiOwnedIntent,
  isOperationalIntent,
} from "./routing/nordi-ownership.js";
export type { NordiOwnershipEvaluator } from "./routing/nordi-ownership.js";

export {
  DefaultOwnershipDecisionService,
} from "./routing/ownership-decision.js";
export type { OwnershipDecisionService } from "./routing/ownership-decision.js";

export type {
  NordiConversationHandler,
  NordiHandlerMode,
  NordiHandlerResult,
  TeamExecutionHandler,
  TeamHandlerResult,
} from "./handlers/passthrough-handlers.js";
export {
  PassthroughNordiConversationHandler,
  PassthroughTeamExecutionHandler,
} from "./handlers/passthrough-handlers.js";

/** Import from `./adapters/conversation-turn.js` when wiring conversation-engine. */
export type { NordiConversationHandler as ConversationEngineNordiHandlerType } from "./handlers/passthrough-handlers.js";

export { TeamOrchestratorExecutionHandler } from "./adapters/team-orchestrator-handler.js";
export type { TeamOrchestratorExecutionHandlerOptions } from "./adapters/team-orchestrator-handler.js";

export {
  applyOrchestratorObservability,
  createOrchestratorTelemetryHooks,
  createRequestTelemetryContext,
  safeEmitTelemetry,
  withObservabilityRuntimeDeps,
  type OrchestratorTelemetryOptions,
  type RequestTelemetryContext,
} from "./observability/index.js";

export {
  DefaultResponseCoordinator,
} from "./coordination/response-coordinator.js";
export type { ResponseCoordinator } from "./coordination/response-coordinator.js";

export {
  CommunicationRouterError,
  type CommunicationRouterErrorCode,
} from "./router/errors.js";

export {
  createCommunicationRouter,
  DefaultCommunicationRouter,
  type CommunicationRouter,
  type CommunicationRouterDependencies,
  type HandleCustomerRequestInput,
  type ResolveOrganizationCapabilitiesInput,
} from "./router/communication-router.js";
