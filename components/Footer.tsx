"use client";

import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
      const split = SplitText.create(".footer__word", { type: "chars" });
      gsap.from(split.chars, {
        yPercent: 100,
        ease: "none",
        stagger: 0.05,
        scrollTrigger: { trigger: ".footer__word", start: "top bottom", end: "bottom bottom", scrub: true },
      });
      gsap.from(".footer__top > *", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      return () => split.revert();
    },
    { scope: root }
  );

  return (
    <footer className="footer" id="visit" ref={root}>
      <div className="footer__top">
        <div>
          <span className="eyebrow" style={{ color: "rgba(21,16,12,0.7)" }}>(05) — Stay close</span>
          <h2 style={{ marginTop: 16 }}>First sip of every new lot.</h2>
          <form
            className="footer__form"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <input type="email" required placeholder="Your email" aria-label="Email address" disabled={sent} />
            <button type="submit">{sent ? "Thanks ✓" : "Subscribe →"}</button>
          </form>
        </div>
        <div className="footer__col">
          <h4>Roastery</h4>
          <a href="#origins">Origins</a>
          <a href="#process">The roast</a>
          <a href="#club">Brew Club</a>
          <a href="#top">Back to top</a>
        </div>
        <div className="footer__col">
          <h4>Say hello</h4>
          <a href="#visit">hello@kilnwood.example</a>
          <a href="#visit">Instagram</a>
          <a href="#visit">Wholesale</a>
          <a href="#visit">Careers</a>
        </div>
      </div>
      <div className="footer__word" aria-hidden="true">Kilnwood</div>
      <div className="footer__bottom">
        <span>© 2026 Kilnwood Roasters — a fictional brand for a design showcase.</span>
        <span>Built with Next.js · GSAP · Lenis</span>
      </div>
    </footer>
  );
}
