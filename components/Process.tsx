"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const steps = [
  {
    title: "Source",
    time: "Months ahead",
    body: "We cup samples from growers we visit in person, and pay well above market for lots that taste like where they came from.",
  },
  {
    title: "Roast",
    time: "12 minutes",
    body: "Twelve-kilo batches on a slow-heating drum. Every profile is logged, so your next bag tastes like your last one.",
  },
  {
    title: "Rest",
    time: "24 hours",
    body: "Beans de-gas overnight on wooden trays, then get cupped one more time. If a batch doesn't sing, it doesn't ship.",
  },
  {
    title: "Ship",
    time: "Within 48 hours",
    body: "Packed in valve bags and handed to the courier the next morning. Fresh coffee, not warehouse coffee.",
  },
];

export default function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 861px)", () => {
        const items = gsap.utils.toArray<HTMLElement>(".step");
        const num = root.current!.querySelector(".process__num-inner") as HTMLElement;
        const n = items.length;
        let current = -1;
        const setActive = (i: number) => {
          if (i === current) return;
          current = i;
          items.forEach((el, j) => el.classList.toggle("is-active", j === i));
          gsap.to(num, { yPercent: (-100 / n) * i, duration: 0.8, ease: "expo.out" });
        };
        setActive(0);

        gsap.to(".process__line span", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + window.innerHeight * 2.4,
            pin: ".process__pin",
            scrub: true,
            onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n))),
          },
        });
      });
      gsap.from(".process__left > *", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section className="process" id="process" ref={root}>
      <div className="process__pin">
        <div className="process__left">
          <span className="eyebrow">(03) — Bean to cup</span>
          <h2>Four steps. No shortcuts.</h2>
          <div className="process__num" aria-hidden="true">
            <div className="process__num-inner">
              {steps.map((_, i) => (
                <span key={i}>0{i + 1}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="process__steps">
          <div className="process__line"><span /></div>
          {steps.map((s, i) => (
            <div className="step" key={s.title}>
              <h3>
                {s.title} <small>{String(i + 1).padStart(2, "0")} · {s.time}</small>
              </h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
