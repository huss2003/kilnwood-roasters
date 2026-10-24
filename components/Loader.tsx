"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { DECK } from "@/lib/photos";

// The Tasting Deck: the wordmark splits around a small stack of photos that are
// dealt one by one; the last photo opens out to become the hero.

const tilt = [-5, 4, -3, 2.5, 0];

const preload = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });

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
        window.dispatchEvent(new Event("kw:revealed"));
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.dispatchEvent(new Event("kw:loaded"));
        finish();
        return;
      }

      const cards = gsap.utils.toArray<HTMLElement>(".deck__card");
      const imgs = cards.map((c) => c.querySelector("img")!);
      const caps = gsap.utils.toArray<HTMLElement>(".deck__caption span");
      const count = el.querySelector(".intro__count") as HTMLElement;
      const left = SplitText.create(".intro__word--l", { type: "chars" });
      const right = SplitText.create(".intro__word--r", { type: "chars" });
      const progress = { v: 0 };
      const renderCount = () => (count.textContent = String(Math.round(progress.v)).padStart(3, "0"));

      gsap.set(cards, { clipPath: "inset(100% 0% 0% 0%)", rotate: (i) => tilt[i] });
      gsap.set(imgs, { scale: 1.35 });
      gsap.set(caps, { yPercent: 110 });
      gsap.set([left.chars, right.chars], { yPercent: 45, opacity: 0, filter: "blur(10px)" });
      gsap.set(".intro__word", { opacity: 1 });
      gsap.set(".intro__meta", { opacity: 0, y: 8 });
      gsap.set(headerKids, { opacity: 0, y: -16 });

      // Phase 1 — the wordmark arrives, then the deck is dealt (accelerating).
      const deal = gsap.timeline();
      deal
        .to(".intro__meta", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.06 }, 0)
        .to(left.chars, { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 1.1, ease: "expo.out", stagger: 0.05 }, 0.1)
        .to(right.chars, { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 1.1, ease: "expo.out", stagger: 0.05 }, 0.25)
        .to(progress, { v: 100, duration: 2.3, ease: "none", onUpdate: renderCount }, 0.3);

      const beats = [0.55, 1.1, 1.55, 1.92, 2.22];
      cards.forEach((card, i) => {
        deal
          .to(card, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.out" }, beats[i])
          .to(imgs[i], { scale: 1, duration: 1.2, ease: "expo.out" }, beats[i])
          .to(caps[i], { yPercent: 0, duration: 0.55, ease: "power3.out" }, beats[i] + 0.05);
        if (i > 0) deal.to(caps[i - 1], { yPercent: -110, duration: 0.45, ease: "power3.in" }, beats[i] - 0.05);
      });

      // Never hold people on the loader: once the deal finishes, wait at most 0.7s for assets.
      const dealt = new Promise((r) => deal.eventCallback("onComplete", () => r(null)));
      const assets = Promise.all([
        Promise.all(DECK.map((d) => preload(d.src))),
        document.fonts ? document.fonts.ready : Promise.resolve(),
      ]);
      const ready = dealt.then(() => Promise.race([assets, new Promise((r) => setTimeout(r, 700))]));

      let cancelled = false;
      ready.then(() => {
        if (cancelled) return;

        // Phase 2 — the name parts, the last photo opens to full screen.
        const last = cards[cards.length - 1];
        const r = last.getBoundingClientRect();
        gsap.set(last, {
          position: "fixed",
          top: r.top,
          left: r.left,
          width: r.width,
          height: r.height,
          inset: "auto",
          rotate: 0,
          zIndex: 5,
        });

        gsap
          .timeline({ delay: 0.1, onComplete: finish })
          .to(left.chars, { xPercent: -40, opacity: 0, duration: 0.9, ease: "expo.in", stagger: { each: 0.03, from: "end" } }, 0)
          .to(right.chars, { xPercent: 40, opacity: 0, duration: 0.9, ease: "expo.in", stagger: 0.03 }, 0)
          .to([".intro__meta", caps], { opacity: 0, duration: 0.4, ease: "power2.in" }, 0)
          .to(cards.slice(0, -1), { opacity: 0, duration: 0.3 }, 0.55)
          .to(
            last,
            { top: 0, left: 0, width: "100vw", height: "100vh", borderRadius: 0, duration: 1.4, ease: "expo.inOut" },
            0.5
          )
          .to(last.querySelector(".photo-shade"), { opacity: 1, duration: 1.2, ease: "power2.inOut" }, 0.7)
          .add(() => window.dispatchEvent(new Event("kw:loaded")), 1.45)
          .to(headerKids, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.08, clearProps: "transform" }, 1.6)
          .set(el, { pointerEvents: "none" }, 1.6)
          .to(last, { opacity: 0, duration: 0.01 }, 1.95)
          .to(el, { backgroundColor: "rgba(0,0,0,0)", duration: 0.01 }, 1.95);
      });

      return () => {
        cancelled = true;
        left.revert();
        right.revert();
      };
    },
    { scope: root }
  );

  return (
    <div className="intro" ref={root} aria-hidden="true">
      <div className="intro__row">
        <span className="eyebrow intro__meta">Kilnwood Roasters</span>
        <span className="eyebrow intro__meta">Season 04 · Small batch</span>
      </div>

      <div className="intro__stage">
        <span className="intro__word intro__word--l">Kiln</span>
        <div className="deck">
          {DECK.map((d, i) => (
            <div className="deck__card" key={d.label}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.src} alt="" />
              {i === DECK.length - 1 && <div className="photo-shade" style={{ opacity: 0 }} />}
            </div>
          ))}
          <div className="deck__caption eyebrow">
            {DECK.map((d, i) => (
              <span key={d.label}>
                0{i + 1} — {d.label}
              </span>
            ))}
          </div>
        </div>
        <span className="intro__word intro__word--r">wood</span>
      </div>

      <div className="intro__row">
        <span className="eyebrow intro__meta">Setting the table</span>
        <span className="intro__count intro__meta">000</span>
      </div>
    </div>
  );
}
