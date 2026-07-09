"use client";

import type { FounderLearningSettings } from "@/lib/nordi/conversation-learning-consent";

type FounderLearningControlsProps = {
  settings: FounderLearningSettings;
  onChange: (settings: FounderLearningSettings) => void;
};

const founderOptions: Array<{
  key: keyof FounderLearningSettings;
  label: string;
}> = [
  { key: "alwaysAllow", label: "Always allow my conversations" },
  {
    key: "autoSendToLearningCenter",
    label: "Automatically send completed conversations to CAT Learning Center",
  },
  { key: "markAsFounderConversation", label: "Mark conversations as Founder Conversations" },
  { key: "highPriorityLearning", label: "High-priority learning" },
  { key: "autoGenerateRegressionTests", label: "Automatically generate regression-test candidates" },
];

export default function FounderLearningControls({
  settings,
  onChange,
}: FounderLearningControlsProps) {
  return (
    <section className="mt-8 rounded-2xl border border-red/20 bg-red/5 p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-red">Founder Mode</h2>
      <p className="mt-2 text-sm leading-relaxed text-silver">
        Additional controls for founder accounts. These options are never shown to other users.
      </p>

      <ul className="mt-4 space-y-3">
        {founderOptions.map((option) => (
          <li key={option.key}>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={settings[option.key]}
                onChange={(event) =>
                  onChange({
                    ...settings,
                    [option.key]: event.target.checked,
                  })
                }
                className="mt-1 h-4 w-4 rounded border-white/20 bg-black/40 text-red focus:ring-red/40"
              />
              <span className="text-sm leading-relaxed text-white">{option.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
