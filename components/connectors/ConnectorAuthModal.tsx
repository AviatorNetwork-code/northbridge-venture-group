"use client";

import { useEffect, useState } from "react";
import { getConnectorById } from "@/lib/connectors/connector-catalog";
import { mockNeoConnectorApi } from "@/lib/neo/connector-api";
import { useConnectors } from "@/components/connectors/ConnectorProvider";
import { IconClose } from "@/components/operations/icons";

type AuthStep = "sign-in" | "permissions" | "health-check" | "connected";

export default function ConnectorAuthModal() {
  const { authConnectorId, setAuthConnectorId, refresh } = useConnectors();
  const [step, setStep] = useState<AuthStep>("sign-in");
  const [isProcessing, setIsProcessing] = useState(false);

  const connector = authConnectorId ? getConnectorById(authConnectorId) : null;

  useEffect(() => {
    if (authConnectorId) {
      setStep("sign-in");
      setIsProcessing(false);
    }
  }, [authConnectorId]);

  if (!authConnectorId || !connector) return null;

  const close = () => {
    setAuthConnectorId(null);
    setStep("sign-in");
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    setStep("health-check");
    await mockNeoConnectorApi.completeAuthorization(authConnectorId);
    refresh();
    setStep("connected");
    setIsProcessing(false);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close authorization"
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Connect ${connector.name}`}
        className="fixed inset-x-4 top-1/2 z-[70] mx-auto max-w-md -translate-y-1/2 rounded-2xl border border-white/10 bg-charcoal p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: connector.logoColor }}
            >
              {connector.logoInitials}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-red">Connect</p>
              <h2 className="text-lg font-semibold text-white">{connector.name}</h2>
              <p className="text-xs text-silver">via {connector.provider}</p>
            </div>
          </div>
          <button type="button" onClick={close} className="rounded-md p-2 text-silver hover:text-white">
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {step === "sign-in" ? (
            <>
              <p className="text-sm text-silver">
                Sign in to {connector.provider} to connect {connector.name} with your Northbridge workforce.
              </p>
              <button
                type="button"
                onClick={() => setStep("permissions")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10"
              >
                Sign in with {connector.provider}
              </button>
            </>
          ) : null}

          {step === "permissions" ? (
            <>
              <p className="text-sm text-silver">
                Northbridge Digital Workforce requests the following permissions:
              </p>
              <ul className="space-y-2 rounded-lg border border-white/10 bg-black/30 p-3">
                {connector.permissions.map((permission) => (
                  <li key={permission} className="flex items-center gap-2 text-sm text-silver">
                    <span className="text-emerald-400">✓</span>
                    {permission}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleApprove}
                  className="flex-1 rounded-xl bg-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-hover"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-silver hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : null}

          {step === "health-check" ? (
            <div className="rounded-lg border border-white/10 bg-black/30 p-4 text-center">
              <p className="text-sm font-medium text-white">Running connector health check...</p>
              <p className="mt-1 text-xs text-silver">
                {isProcessing ? "Verifying permissions and sync" : "Almost ready"}
              </p>
            </div>
          ) : null}

          {step === "connected" ? (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="text-sm font-semibold text-emerald-300">Connected</p>
              <p className="mt-1 text-sm text-silver">
                {connector.name} is ready. Your Operations Center has been updated.
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-4 w-full rounded-xl bg-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-hover"
              >
                Done
              </button>
            </div>
          ) : null}
        </div>

        <p className="mt-4 text-[11px] text-stone">
          Mock authorization — future OAuth will use the same flow.
        </p>
      </div>
    </>
  );
}
