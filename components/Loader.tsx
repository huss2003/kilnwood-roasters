"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// The kiln opens: an arch-shaped window into the live roast grows in stages
// (tracked as roast temperature) until it becomes the full hero.

const stages = ["Charging the drum", "Drying", "Maillard", "First crack"];

// Arch-shaped clip centred in the viewport, `w` px wide.
function arch(w: number) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const h = Math.min(w * 1.32, H);
  const t = (H - h) / 2;
  const l = (W - w) / 2;
  const r = w / 2;
  return `inset(${t}px ${l}px ${t}px ${l}px round ${r}px ${r}px 0px 0px)`;
}
const FULL = "inset(0px 0px 0px 0px round 0px 0px 0px 0px)";

export default function Loader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const bg = document.querySelector(".hero__bg") as HTMLElement | null;
      const headerKids = document.querySelectorAll(".header > *");
      document.body.classList.add("is-loading");

      const finish = () => {
        document.body.classList.remove("is-loading");
        window.__lenis?.start();
        el.style.display = "none";
        window.dispatchEvent(new Event("kw:revealed"));
      };

      if (!bg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (bg) bg.style.clipPath = FULL;
        window.dispatchEvent(new Event("kw:loaded"));
        finish();
        return;
      }

      const temp = el.querySelector(".kiln__temp-num") as HTMLElement;
      const stageEls = gsap.utils.toArray<HTMLElement>(".kiln__stage");
      const heat = { v: 0 };
      const renderTemp = () => (temp.textContent = String(Math.round(heat.v)).padStart(3, "0"));

      const W = window.innerWidth;
      const sizes = [64, Math.min(W * 0.18, 210), Math.min(W * 0.34, 400)];

      // Pre-paint state: the page is dark, the kiln is closed.
      gsap.set(bg, { clipPath: arch(0) });
      gsap.set(el, { backgroundColor: "transparent" });
      gsap.set(stageEls, { yPercent: 110 });
      gsap.set(".kiln__meta", { opacity: 0 });
      gsap.set(headerKids, { opacity: 0, y: -16 });

      const showStage = (i: number) => {
        const tl = gsap.timeline();
        if (i > 0) tl.to(stageEls[i - 1], { yPercent: -110, duration: 0.5, ease: "power3.in" });
        tl.to(stageEls[i], { yPercent: 0, duration: 0.6, ease: "power3.out" }, i > 0 ? "-=0.2" : 0);
        return tl;
      };

      // Phase 1 — heat up in three beats while the page finishes loading.
      const build = gsap.timeline();
      build
        .to(".kiln__meta", { opacity: 1, duration: 0.8, ease: "power2.out", stagger: 0.08 }, 0)
        .add(showStage(0), 0.1)
        .to(bg, { clipPath: arch(sizes[0]), duration: 0.9, ease: "expo.out" }, 0.25)
        .to(heat, { v: 95, duration: 0.9, ease: "power2.out", onUpdate: renderTemp }, 0.25)
        .add(showStage(1), 1.15)
        .to(bg, { clipPath: arch(sizes[1]), duration: 0.95, ease: "expo.inOut" }, 1.15)
        .to(heat, { v: 165, duration: 0.95, ease: "power2.inOut", onUpdate: renderTemp }, 1.15)
        .add(showStage(2), 2.2)
        .to(bg, { clipPath: arch(sizes[2]), duration: 0.95, ease: "expo.inOut" }, 2.2)
        .to(heat, { v: 196, duration: 0.95, ease: "power2.inOut", onUpdate: renderTemp }, 2.2);

      const ready = Promise.all([
        new Promise((r) => build.eventCallback("onComplete", () => r(null))),
        new Promise((r) => {
          if (document.readyState === "complete") r(null);
          else window.addEventListener("load", () => r(null), { once: true });
        }),
        document.fonts ? document.fonts.ready : Promise.resolve(),
      ]);

      let cancelled = false;
      ready.then(() => {
        if (cancelled) return;
        // Phase 2 — first crack: the kiln opens to full bleed and the page arrives.
        gsap
          .timeline({ onComplete: finish })
          .add(showStage(3))
          .to(heat, { v: 205, duration: 0.5, ease: "power2.out", onUpdate: renderTemp }, "<")
          .to(bg, { clipPath: FULL, duration: 1.35, ease: "expo.inOut" }, "+=0.15")
          .to(".hero__bg canvas", { scale: 1.15, duration: 1.8, ease: "expo.out", clearProps: "transform" }, "<")
          .to(".kiln__meta", { opacity: 0, duration: 0.5, ease: "power2.in" }, "<")
          .add(() => window.dispatchEvent(new Event("kw:loaded")), "<0.55")
          .to(headerKids, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.08, clearProps: "transform" }, "<0.3");
      });

      return () => {
        cancelled = true;
      };
    },
    { scope: root }
  );

  return (
    <div className="kiln" ref={root} aria-hidden="true">
      <div className="kiln__row">
        <span className="eyebrow kiln__meta">Kilnwood Roasters</span>
        <span className="eyebrow kiln__meta">Batch Nº 0427</span>
      </div>
      <div className="kiln__row">
        <span className="eyebrow kiln__meta kiln__stages">
          {stages.map((s) => (
            <span className="kiln__stage" key={s}>{s}</span>
          ))}
        </span>
        <span className="kiln__meta kiln__temp">
          <span className="kiln__temp-num">000</span>°C
        </span>
      </div>
    </div>
  );
}
