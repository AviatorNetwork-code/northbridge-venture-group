"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import FounderLearningControls from "@/components/home/FounderLearningControls";
import {
  appendConsentAudit,
  createDefaultFounderLearningSettings,
  isFounderIdentity,
  resolveLearningEligible,
  updateLearningConsentFromSettings,
  type FounderLearningSettings,
} from "@/lib/nordi/conversation-learning-consent";
import { touchMemory } from "@/lib/nordi/conversation-memory";
import { getNordiStorage } from "@/lib/nordi/storage";

export default function PrivacySettingsPanel() {
  const storage = getNordiStorage();
  const [loaded, setLoaded] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [isFounder, setIsFounder] = useState(false);
  const [founderSettings, setFounderSettings] = useState<FounderLearningSettings>(
    createDefaultFounderLearningSettings(),
  );

  useEffect(() => {
    const memory = storage.load();
    if (!memory) {
      setLoaded(true);
      return;
    }

    setEnabled(resolveLearningEligible(memory.conversationLearningConsent, memory.founderLearningSettings));
    const founder = Boolean(memory.founderSession) || isFounderIdentity(memory.identity);
    setIsFounder(founder);
    setFounderSettings(memory.founderLearningSettings ?? createDefaultFounderLearningSettings());
    setLoaded(true);
  }, [storage]);

  const persist = useCallback(
    (
      nextEnabled: boolean,
      nextFounderSettings: FounderLearningSettings,
      nextFounderSession: boolean,
    ) => {
      const memory = storage.load();
      if (!memory) return;

      const { consent, audit } = updateLearningConsentFromSettings(
        memory.conversationLearningConsent,
        nextEnabled,
      );

      const nextMemory = touchMemory({
        ...memory,
        conversationLearningConsent: consent,
        learningEligible: resolveLearningEligible(consent, nextFounderSettings),
        founderSession: nextFounderSession,
        founderLearningSettings: nextFounderSession ? nextFounderSettings : memory.founderLearningSettings,
        consentAuditLog: appendConsentAudit(memory.consentAuditLog, audit),
      });

      storage.save(nextMemory);
    },
    [storage],
  );

  const handleToggle = (nextEnabled: boolean) => {
    setEnabled(nextEnabled);
    persist(nextEnabled, founderSettings, isFounder);
  };

  const handleFounderSettingsChange = (nextSettings: FounderLearningSettings) => {
    setFounderSettings(nextSettings);
    const memory = storage.load();
    const nextEnabled = resolveLearningEligible(memory?.conversationLearningConsent, nextSettings);
    setEnabled(nextEnabled);
    persist(nextEnabled, nextSettings, true);
  };

  if (!loaded) {
    return <p className="text-sm text-silver">Loading privacy settings…</p>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-black/30 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-red">Conversation Learning</h2>

        <label className="mt-4 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => handleToggle(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-black/40 text-red focus:ring-red/40"
          />
          <span className="text-sm leading-relaxed text-white">
            Allow my conversations to be analyzed to improve Nordi and future AI assistants.
          </span>
        </label>

        <p className="mt-3 text-sm leading-relaxed text-silver">
          When enabled, Northbridge may analyze your conversations to improve conversation quality
          and future AI capabilities.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-stone">
          You can disable this at any time. Changing this setting affects future learning eligibility
          only.
        </p>
      </section>

      {isFounder ? (
        <FounderLearningControls settings={founderSettings} onChange={handleFounderSettingsChange} />
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-red px-6 text-sm font-semibold text-white transition-colors hover:bg-red-hover"
        >
          Back to Nordi
        </Link>
        <Link
          href="/privacy"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/5"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
