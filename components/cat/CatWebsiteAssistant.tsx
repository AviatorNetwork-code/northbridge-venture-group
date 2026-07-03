"use client";

import { useCallback, useState } from "react";
import CatLauncher from "@/components/cat/CatLauncher";
import CatPanel from "@/components/cat/CatPanel";
import { trackCatEvent } from "@/lib/cat/analytics";

export default function CatWebsiteAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      trackCatEvent(next ? "cat_opened" : "cat_closed");
      return next;
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) {
        trackCatEvent("cat_closed");
      }
      return false;
    });
  }, []);

  return (
    <>
      <CatLauncher isOpen={isOpen} onToggle={handleToggle} />
      <div id="northbridge-cat-panel">
        <CatPanel isOpen={isOpen} onClose={handleClose} />
      </div>
    </>
  );
}
