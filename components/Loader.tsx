"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

const COLS = 5;

export default function Loader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const headerKids = document.querySelectorAll(".header > *");
      document.body.classList.add("is-loading");

      const finish = () => {
        document.body.classList.remove("is-loading");
        window.__lenis?.start();
        el.style.display = "none";
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.dispatchEvent(new Event("kw:loaded"));
        finish();
        return;
      }

      const split = SplitText.create(".intro__word", { type: "chars", mask: "chars" });
      const arch = el.querySelector(".intro__arch") as SVGPathElement;
      const len = arch.getTotalLength();
      const pct = el.querySelector(".intro__pct") as HTMLElement;
      const bar = el.querySelector(".intro__line span") as HTMLElement;
      const progress = { v: 0 };
      const render = () => {
        pct.textContent = String(Math.round(progress.v)).padStart(3, "0");
        gsap.set(bar, { scaleX: progress.v / 100 });
      };

      gsap.set(arch, { strokeDasharray: len, strokeDashoffset: len });
      gsap.set(".intro__bean", { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(".intro__crease", { opacity: 0 });
      gsap.set(split.chars, { yPercent: 115 });
      gsap.set(".intro__meta", { opacity: 0, y: 12 });
      gsap.set(headerKids, { opacity: 0, y: -18 });

      // Phase 1 — build the mark and wordmark while assets load
      gsap
        .timeline()
        .to(".intro__meta", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.07 }, 0)
        .to(arch, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, 0.1)
        .to(".intro__bean", { scale: 1, duration: 0.9, ease: "back.out(1.8)" }, 0.95)
        .to(".intro__crease", { opacity: 1, duration: 0.4 }, 1.45)
        .to(split.chars, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.05 }, 0.45)
        .to(progress, { v: 82, duration: 1.9, ease: "power2.out", onUpdate: render }, 0.15);

      const minTime = new Promise((r) => setTimeout(r, 2100));
      const pageLoad = new Promise((r) => {
        if (document.readyState === "complete") r(null);
        else window.addEventListener("load", () => r(null), { once: true });
      });
      const fonts = document.fonts ? document.fonts.ready : Promise.resolve();

      let cancelled = false;
      Promise.all([minTime, pageLoad, fonts]).then(() => {
        if (cancelled) return;

        // Phase 2 — finish, clear the stage, lift the curtains
        gsap
          .timeline({
            onComplete: () => {
              finish();
              split.revert();
            },
          })
          .to(progress, { v: 100, duration: 0.55, ease: "power2.inOut", onUpdate: render })
          .to(split.chars, { yPercent: -115, duration: 0.75, ease: "expo.in", stagger: 0.03 }, "+=0.1")
          .to(".intro__mark", { scale: 0.7, opacity: 0, duration: 0.6, ease: "expo.in" }, "<0.1")
          .to(".intro__meta", { opacity: 0, y: -10, duration: 0.45, ease: "power2.in" }, "<")
          .addLabel("reveal")
          .to(
            ".intro__cols--top .intro__col",
            { yPercent: -100, duration: 1.15, ease: "expo.inOut", stagger: { each: 0.07, from: "center" } },
            "reveal"
          )
          .to(
            ".intro__cols--under .intro__col",
            { yPercent: -100, duration: 1.15, ease: "expo.inOut", stagger: { each: 0.07, from: "center" } },
            "reveal+=0.16"
          )
          .fromTo(
            ".hero",
            { scale: 1.12, filter: "blur(10px)" },
            { scale: 1, filter: "blur(0px)", duration: 1.8, ease: "expo.out", clearProps: "transform,filter" },
            "reveal+=0.3"
          )
          .add(() => window.dispatchEvent(new Event("kw:loaded")), "reveal+=0.5")
          .to(headerKids, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.08, clearProps: "transform" }, "reveal+=0.8");
      });

      return () => {
        cancelled = true;
      };
    },
    { scope: root }
  );

  const cols = (layer: string) =>
    Array.from({ length: COLS }, (_, i) => <div className="intro__col" key={layer + i} />);

  return (
    <div className="intro" ref={root} aria-hidden="true">
      <div className="intro__cols intro__cols--under">{cols("u")}</div>
      <div className="intro__cols intro__cols--top">{cols("t")}</div>
      <div className="intro__content">
        <div className="intro__row">
          <span className="eyebrow intro__meta">Kilnwood Roasters</span>
          <span className="eyebrow intro__meta">Warming the drum</span>
        </div>
        <div className="intro__center">
          <svg viewBox="0 0 32 32" className="intro__mark">
            <path className="intro__arch" d="M4 28V14a12 12 0 0 1 24 0v14" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <g transform="rotate(-18 16 19)">
              <ellipse className="intro__bean" cx="16" cy="19" rx="5" ry="7" fill="currentColor" />
            </g>
            <path
              className="intro__crease"
              d="M14.2 13.2c2.4 2 1.2 5.2 0.4 6.4s-1.6 4.6 1.4 6.6"
              fill="none"
              stroke="var(--espresso)"
              strokeWidth="1.1"
            />
          </svg>
          <div className="intro__word">
            Kiln<em>wood</em>
          </div>
        </div>
        <div className="intro__row">
          <span className="eyebrow intro__meta">Small-batch · Est. 2026</span>
          <div className="intro__line intro__meta"><span /></div>
          <span className="eyebrow intro__meta intro__pct">000</span>
        </div>
      </div>
    </div>
  );
}
