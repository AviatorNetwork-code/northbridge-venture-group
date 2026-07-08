"use client";

import { useEffect, useRef, useState } from "react";
import CatMessageContent from "@/components/cat/CatMessageContent";
import { typingPauseForChar, typingSpeedForMessage } from "@/lib/nordi/thinking-states";

type CatTypewriterProps = {
  text: string;
  animate: boolean;
  messageId?: string;
  speed?: number;
  onDone?: () => void;
  onProgress?: () => void;
};

export default function CatTypewriter({
  text,
  animate,
  messageId = "default",
  speed,
  onDone,
  onProgress,
}: CatTypewriterProps) {
  const [count, setCount] = useState(() => (animate ? 0 : text.length));
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  const onProgressRef = useRef(onProgress);

  onDoneRef.current = onDone;
  onProgressRef.current = onProgress;

  useEffect(() => {
    if (!animate) {
      setCount(text.length);
      return;
    }

    doneRef.current = false;
    setCount(0);

    const baseSpeed = speed ?? typingSpeedForMessage(messageId);
    let index = 0;
    let timeoutId = 0;

    const tick = () => {
      index += 1;
      setCount(index);
      onProgressRef.current?.();

      if (index >= text.length) {
        if (!doneRef.current) {
          doneRef.current = true;
          onDoneRef.current?.();
        }
        return;
      }

      const char = text[index - 1] ?? "";
      const pause = typingPauseForChar(char, messageId, index);
      timeoutId = window.setTimeout(tick, baseSpeed + pause);
    };

    timeoutId = window.setTimeout(tick, baseSpeed);

    return () => window.clearTimeout(timeoutId);
  }, [text, animate, speed, messageId]);

  const isTyping = animate && count < text.length;

  return <CatMessageContent content={text.slice(0, count)} caret={isTyping} />;
}
