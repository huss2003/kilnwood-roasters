"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Arrow } from "./Emblem";
import Magnetic from "./Magnetic";

const plans = [
  { key: "fortnight", label: "Every 2 weeks", price: 720 },
  { key: "monthly", label: "Monthly", price: 760 },
  { key: "bimonthly", label: "Every 2 months", price: 790 },
];

export default function BrewClub() {
  const root = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(1);
  const [pill, setPill] = useState({ left: 4, width: 0 });

  useLayoutEffect(() => {
    const btn = toggle.current?.querySelectorAll("button")[active] as HTMLElement | undefined;
    if (btn) setPill({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [active]);

  useGSAP(
    () => {
      gsap.to(".club__visual", {
        clipPath: "inset(0% 0% 0% 0% round 28px)",
        ease: "none",
        scrollTrigger: { trigger: ".club__visual", start: "top 90%", end: "top 30%", scrub: true },
      });
      gsap.fromTo(
        ".club__cup svg",
        { scale: 1.25, rotate: -8 },
        {
          scale: 1,
          rotate: 0,
          ease: "none",
          scrollTrigger: { trigger: ".club__visual", start: "top bottom", end: "bottom top", scrub: true },
        }
      );
      gsap.to(".steam path", {
        y: -14,
        opacity: 0,
        duration: 2.4,
        ease: "sine.out",
        stagger: { each: 0.6, repeat: -1 },
      });
      gsap.from(".club__copy > *", {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".club__copy", start: "top 75%" },
      });
    },
    { scope: root }
  );

  const choose = (i: number) => {
    setActive(i);
    const el = priceRef.current;
    if (!el) return;
    const o = { v: Number(el.dataset.v || plans[active].price) };
    gsap.to(o, {
      v: plans[i].price,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = "₹" + Math.round(o.v);
        el.dataset.v = String(o.v);
      },
    });
  };

  return (
    <section className="section club" id="club" ref={root}>
      <div className="club__visual" data-cursor="Brew">
        <div className="club__cup">
          <svg viewBox="0 0 200 200" aria-hidden="true">
            <g className="steam" fill="none" stroke="var(--cream)" strokeWidth="3" strokeLinecap="round" opacity="0.7">
              <path d="M80 60c-8-10 8-18 0-30" />
              <path d="M100 56c-8-10 8-18 0-30" />
              <path d="M120 60c-8-10 8-18 0-30" />
            </g>
            <path d="M48 80h104v40a52 52 0 0 1-104 0z" fill="var(--cream)" />
            <path d="M152 92h10a18 18 0 0 1 0 36h-14" fill="none" stroke="var(--cream)" strokeWidth="8" />
            <ellipse cx="100" cy="80" rx="52" ry="8" fill="#3a2214" />
            <ellipse cx="100" cy="186" rx="70" ry="6" fill="rgba(0,0,0,0.35)" />
          </svg>
        </div>
      </div>
      <div className="club__copy">
        <span className="eyebrow">(04) — The Brew Club</span>
        <h2>
          Fresh bags, <em>on repeat.</em>
        </h2>
        <p>
          A rotating single-origin, picked by our roasters and shipped on your schedule. Pause,
          skip or switch beans whenever you like. Free shipping on every delivery.
        </p>
        <div className="toggle" ref={toggle} role="tablist" aria-label="Delivery frequency">
          <span className="toggle__pill" style={{ left: pill.left, width: pill.width }} />
          {plans.map((p, i) => (
            <button
              key={p.key}
              role="tab"
              aria-selected={active === i}
              className={active === i ? "is-active" : ""}
              onClick={() => choose(i)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="club__price">
          <strong ref={priceRef} data-v={plans[1].price}>₹{plans[1].price}</strong>
          <span>/ bag · 250g</span>
        </div>
        <ul className="club__list">
          <li>Roasted to order, shipped within 48 hours</li>
          <li>Tasting card with every bag</li>
          <li>Pause or cancel anytime</li>
        </ul>
        <Magnetic>
          <a href="#visit" className="btn btn--ember">
            <span className="btn__label">Join the club</span>
            <Arrow className="btn__arrow" />
          </a>
        </Magnetic>
      </div>
    </section>
  );
}
