"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create(".manifesto__text", { type: "words", wordsClass: "word" });
      gsap.to(split.words, {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: ".manifesto__text",
          start: "top 80%",
          end: "bottom 45%",
          scrub: true,
        },
      });
      gsap.from(".manifesto__aside > *", {
        y: 24,
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
    <section className="section manifesto" ref={root}>
      <div className="manifesto__aside">
        <span className="eyebrow">(01) — Why we roast</span>
        <p>A tiny drum, a long cooling tray, and the patience to taste every batch before it ships.</p>
      </div>
      <p className="manifesto__text">
        We think great coffee is mostly about <em>restraint.</em> Buy from growers who care, roast just
        long enough to let the bean speak, and get it to you while it still smells like the
        roastery. Nothing sits in a warehouse. Nothing gets burnt to hide what it is. Just honest
        cups, every <em>single morning.</em>
      </p>
    </section>
  );
}
