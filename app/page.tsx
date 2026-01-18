"use client";

import { useEffect, useRef, useState } from "react";
import HomeClient from "./ui/home-client";

export default function HomePage() {
  const [debugInfo, setDebugInfo] = useState({
    scrollY: 0,
    scrollTop: 0,
    locked: false
  });
  const scrollYRef = useRef(0);
  const bodyStyleRef = useRef({
    overflow: "",
    position: "",
    top: "",
    width: "",
    overscrollBehavior: ""
  });

  useEffect(() => {
    const body = document.body;
    scrollYRef.current = window.scrollY;
    bodyStyleRef.current = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overscrollBehavior: body.style.overscrollBehavior
    };
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.width = "100%";
    body.style.top = `-${scrollYRef.current}px`;
    body.style.overscrollBehavior = "none";
    setDebugInfo((prev) => ({ ...prev, locked: true }));

    return () => {
      const previous = bodyStyleRef.current;
      body.style.overflow = previous.overflow;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.overscrollBehavior = previous.overscrollBehavior;
      window.scrollTo(0, scrollYRef.current);
      setDebugInfo((prev) => ({ ...prev, locked: false }));
    };
  }, []);

  useEffect(() => {
    const showDebug =
      process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_SHOW_DEBUG === "1";
    if (!showDebug) return;
    const update = () => {
      setDebugInfo((prev) => ({
        ...prev,
        scrollY: window.scrollY,
        scrollTop: document.documentElement.scrollTop
      }));
    };
    update();
    const interval = window.setInterval(update, 200);
    return () => window.clearInterval(interval);
  }, []);

  const showDebug =
    process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_SHOW_DEBUG === "1";

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden overflow-x-hidden overscroll-none touch-none">
      {showDebug ? (
        <div className="px-4 pt-2 text-[10px] text-white/50">
          scrollY: {debugInfo.scrollY} · scrollTop: {debugInfo.scrollTop} · locked:{" "}
          {debugInfo.locked ? "true" : "false"}
        </div>
      ) : null}
      <HomeClient />
    </div>
  );
}
