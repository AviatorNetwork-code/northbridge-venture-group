"use client";

import OpsTopBar from "@/components/operations/shell/OpsTopBar";
import CatCommandCenter from "@/components/operations/widgets/CatCommandCenter";

export default function CommandView() {
  return (
    <>
      <OpsTopBar
        title="AI Command Center"
        subtitle="CAT is your operator — ask, act, explain."
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <CatCommandCenter />
      </div>
    </>
  );
}
