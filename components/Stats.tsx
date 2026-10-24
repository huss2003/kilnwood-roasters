"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const stats = [
  { value: 12, suffix: "kg", label: "Maximum batch size, so every roast gets full attention." },
  { value: 48, suffix: "h", label: "From cooling tray to courier. Usually less." },
  { value: 5, suffix: "", label: "Partner farms this season, each one visited in person." },
  { value: 92, suffix: "%", label: "Of Brew Club members who stay past their third bag." },
];

export default function Stats() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".stat__num").forEach((el) => {
        const target = Number(el.dataset.value);
        const o = { v: 0 };
        gsap.to(o, {
          v: target,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => (el.textContent = String(Math.round(o.v))),
        });
      });
      gsap.from(".stat", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });
    },
    { scope: root }
  );

  return (
    <section className="section" ref={root} style={{ paddingTop: 40 }}>
      <div className="stats">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat__value">
              <span className="stat__num" data-value={s.value}>0</span>
              {s.suffix && <sup>{s.suffix}</sup>}
            </div>
            <p className="stat__label">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
