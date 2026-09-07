"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import NordyLauncher from "@/components/marketing/NordyLauncher";
import type { NordyEntryPath } from "@/lib/nordy";
import { trackAnalytics } from "@/lib/nordy";

export { openNordyHref } from "@/lib/nordy/routes";

function parseEntryPath(value: string | null): NordyEntryPath {
  if (value === "ENGINEERING_AI") return "ENGINEERING_AI";
  if (value === "DIGITAL") return "DIGITAL";
  if (value === "EXPLORE") return "EXPLORE";
  return "GENERAL";
}

export function useNordyLauncherControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const openNordy = useCallback(
    (entryPath: NordyEntryPath = "GENERAL") => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      params.set("nordy", "open");
      params.set("entry", entryPath);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { openNordy };
}

export default function NordyHost() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [entryPath, setEntryPath] = useState<NordyEntryPath>("GENERAL");

  useEffect(() => {
    const shouldOpen = searchParams?.get("nordy") === "open";
    const path = parseEntryPath(searchParams?.get("entry") ?? null);
    setOpen(Boolean(shouldOpen));
    setEntryPath(path);
  }, [searchParams]);

  const onClose = useCallback(() => {
    setOpen(false);
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.delete("nordy");
    params.delete("entry");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (pathname === "/") {
      trackAnalytics("homepage_view");
    }
  }, [pathname]);

  return <NordyLauncher open={open} entryPath={entryPath} onClose={onClose} />;
}
