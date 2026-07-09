import type { Metadata } from "next";
import {
  ModuleContainer,
  ModuleHeader,
} from "@/components/operations/ModuleUI";
import ConversationLearningCenter from "@/components/operations/ConversationLearningCenter";

export const metadata: Metadata = {
  title: "Conversation Learning | AI Operations Center",
  robots: { index: false, follow: false },
};

export default function ConversationLearningPage() {
  return (
    <ModuleContainer>
      <ModuleHeader
        eyebrow="CAT Learning"
        title="Conversation Learning Center"
        description="Review Nordi conversations locally, approve reusable lessons, and manually promote engineering tasks. Nothing changes production behavior automatically."
      />
      <ConversationLearningCenter />
    </ModuleContainer>
  );
}
