"use client";

import { useEffect, useRef, useState } from "react";
import CatMessageContent from "@/components/cat/CatMessageContent";

type CatTypewriterProps = {
  text: string;
  animate: boolean;
  speed?: number;
  onDone?: () => void;
  onProgress?: () => void;
};

export default function CatTypewriter({
  text,
  animate,
  speed = 16,
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

    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setCount(index);
      onProgressRef.current?.();

      if (index >= text.length) {
        window.clearInterval(interval);
        if (!doneRef.current) {
          doneRef.current = true;
          onDoneRef.current?.();
        }
      }
    }, speed);

    return () => window.clearInterval(interval);
  }, [text, animate, speed]);

  const isTyping = animate && count < text.length;

  return <CatMessageContent content={text.slice(0, count)} caret={isTyping} />;
}
