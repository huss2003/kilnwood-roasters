"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { Emblem, Arrow } from "./Emblem";
import Magnetic from "./Magnetic";
import Heat from "./Heat";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const safe = contextSafe!;
      const split = SplitText.create(".hero__title", {
        type: "lines,chars",
        mask: "lines",
        linesClass: "line-mask",
      });
      gsap.set(split.chars, { yPercent: 110 });
      gsap.set([".hero__lede", ".hero__ctas > *", ".hero__bottom .eyebrow"], { y: 30, opacity: 0 });
      gsap.set(".hero__emblem", { scale: 0, rotate: -120 });
      gsap.set(".hero__rule", { scaleX: 0 });
      gsap.set(".hero__scroll", { opacity: 0 });

      const intro = safe(() => {
        const tl = gsap.timeline();
        tl.to(split.chars, {
          yPercent: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.022,
        })
          .to(".hero__rule", { scaleX: 1, duration: 1.2, ease: "expo.inOut" }, 0.3)
          .to(".hero__emblem", { scale: 1, rotate: 0, duration: 1.4, ease: "expo.out" }, 0.4)
          .to(
            [".hero__bottom .eyebrow", ".hero__lede", ".hero__ctas > *"],
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.08 },
            0.6
          )
          .to(".hero__scroll", { opacity: 1, duration: 1 }, 1);
      });
      window.addEventListener("kw:loaded", intro, { once: true });

      // After the intro: scrolling away closes the kiln back into an arch.
      const closeKiln = safe(() => {
        const W = window.innerWidth;
        const H = window.innerHeight;
        const side = W * 0.05;
        const r = (W - side * 2) / 2;
        gsap.fromTo(
          ".hero__bg",
          { clipPath: "inset(0px 0px 0px 0px round 0px 0px 0px 0px)" },
          {
            clipPath: `inset(0px ${side}px ${H * 0.12}px ${side}px round ${r}px ${r}px 0px 0px)`,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          }
        );
        gsap.to(".hero__bg canvas", {
          scale: 1.12,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
      window.addEventListener("kw:revealed", closeKiln, { once: true });

      // continuous emblem spin, accelerated by scroll velocity
      const spin = gsap.to(".emblem-ring", {
        rotate: 360,
        transformOrigin: "50% 50%",
        duration: 18,
        repeat: -1,
        ease: "none",
      });
      ScrollTrigger.create({
        onUpdate: (self) => {
          const v = Math.min(Math.abs(self.getVelocity()) / 300, 6);
          gsap.to(spin, { timeScale: 1 + v, duration: 0.3, overwrite: true });
          gsap.to(spin, { timeScale: 1, duration: 1.2, delay: 0.3 });
        },
      });

      // scroll-out: title drifts up and fades, glow drifts
      gsap.to(".hero__title", {
        yPercent: -18,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });

      return () => {
        window.removeEventListener("kw:loaded", intro);
        window.removeEventListener("kw:revealed", closeKiln);
        split.revert();
      };
    },
    { scope: root }
  );

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__bg">
        <Heat />
      </div>
      <Emblem className="hero__emblem" />
      <h1 className="hero__title">
        Roasted slow. Poured with <em>intent.</em>
      </h1>
      <div style={{ position: "relative", zIndex: 1, marginTop: 48 }}>
        <div
          className="hero__rule"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: "var(--cream-faint)",
            transformOrigin: "left",
          }}
        />
        <div className="hero__bottom" style={{ marginTop: 0, borderTop: 0 }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 12 }}>
              Est. 2026 · Small-batch roastery
            </p>
            <p className="hero__lede">
              Single-origin beans from farms we know by name, roasted in twelve-kilo batches and
              on your doorstep within 48 hours of leaving the drum.
            </p>
          </div>
          <div className="hero__ctas">
            <Magnetic>
              <a href="#origins" className="btn btn--ember" data-cursor="Taste">
                <span className="btn__label">Explore the beans</span>
                <Arrow className="btn__arrow" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#process" className="btn btn--ghost">
                <span className="btn__label">How we roast</span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
      <div className="hero__scroll" aria-hidden="true">
        <span className="eyebrow">Scroll</span>
        <i />
      </div>
    </section>
  );
}
