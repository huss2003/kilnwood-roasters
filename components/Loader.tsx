"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Loader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      document.body.classList.add("is-loading");
      const counter = { v: 0 };
      const num = root.current!.querySelector(".loader__count") as HTMLElement;
      const bar = root.current!.querySelector(".loader__bar span") as HTMLElement;

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.classList.remove("is-loading");
          window.__lenis?.start();
          window.dispatchEvent(new Event("kw:loaded"));
          if (root.current) root.current.style.display = "none";
        },
      });

      tl.to(counter, {
        v: 100,
        duration: 1.9,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = Math.round(counter.v);
          num.textContent = String(v).padStart(3, "0");
          bar.style.width = v + "%";
        },
      })
        .to(".loader__inner", { yPercent: -20, opacity: 0, duration: 0.5, ease: "power2.in" })
        .to(root.current, {
          clipPath: "inset(0 0 100% 0)",
          duration: 1,
          ease: "expo.inOut",
        }, "-=0.15");
    },
    { scope: root }
  );

  return (
    <div className="loader" ref={root} style={{ clipPath: "inset(0 0 0% 0)" }} aria-hidden="true">
      <div className="loader__inner" style={{ display: "contents" }}>
        <div className="loader__top">
          <span className="eyebrow" style={{ color: "inherit" }}>Kilnwood Roasters</span>
          <span className="eyebrow" style={{ color: "inherit" }}>Warming the drum…</span>
        </div>
        <div>
          <div className="loader__count">000</div>
          <div className="loader__bar"><span /></div>
        </div>
      </div>
    </div>
  );
}
