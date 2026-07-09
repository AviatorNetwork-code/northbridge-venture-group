export {
  INTERACTION_MODALITIES,
  type InteractionModality,
  type InteractionModalityDecision,
  type InteractionModalityInput,
} from "./types.js";

export { resolveInteractionModality } from "./resolveModality.js";

export {
  composeInteractionTurn,
  type ComposeInteractionTurnInput,
  type InteractionEnvelope,
} from "./composeInteractionTurn.js";
