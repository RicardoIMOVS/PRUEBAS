"use client";

import { useEffect, useRef } from "react";
import "./earthScene.css";

export default function EarthScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!containerRef.current) return;

      const mod = await import("@/lib/earth/world/Word");
      const World = mod.default;

      if (!mounted) return;

      worldRef.current = new World({
        dom: containerRef.current,
      });
    }

    init();

    return () => {
      mounted = false;
      worldRef.current?.destroy?.();
      worldRef.current = null;
    };
  }, []);

  return (
    <div className="earth-root">
      <div id="html2canvas" className="css3d-wapper">
        <div className="fire-div"></div>
      </div>

      <div
        ref={containerRef}
        id="earth-canvas"
        className="earth-canvas"
      />
    </div>
  );
}