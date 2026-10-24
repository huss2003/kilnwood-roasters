"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });

    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest("[data-cursor]") as HTMLElement | null;
      const link = (e.target as HTMLElement).closest("a, button");
      if (t) {
        el.textContent = t.dataset.cursor || "";
        gsap.to(el, { width: 84, height: 84, duration: 0.4, ease: "power3" });
      } else if (link) {
        el.textContent = "";
        gsap.to(el, { width: 40, height: 40, duration: 0.4, ease: "power3" });
      } else {
        el.textContent = "";
        gsap.to(el, { width: 12, height: 12, duration: 0.4, ease: "power3" });
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  return <div className="cursor" ref={ref} aria-hidden="true" />;
}
