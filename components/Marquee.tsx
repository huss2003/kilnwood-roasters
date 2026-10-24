"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Star } from "./Emblem";

const words = ["Huila, Colombia", "Sidama, Ethiopia", "Chikmagalur, India", "Nyeri, Kenya", "Cerrado, Brazil"];

export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = root.current!.querySelector(".marquee__track") as HTMLElement;
      const half = track.scrollWidth / 2;
      let dir = 1;
      const loop = gsap.to(track, {
        x: -half,
        duration: 38,
        ease: "none",
        repeat: -1,
        modifiers: { x: gsap.utils.unitize((x) => parseFloat(x) % half) },
      });

      ScrollTrigger.create({
        onUpdate: (self) => {
          if (self.direction !== dir) {
            dir = self.direction;
            gsap.to(loop, { timeScale: dir, duration: 0.6, overwrite: true });
          }
          const v = Math.min(Math.abs(self.getVelocity()) / 250, 8);
          gsap.to(loop, { timeScale: dir * (1 + v), duration: 0.2, overwrite: true });
          gsap.to(loop, { timeScale: dir, duration: 1, delay: 0.2 });
        },
      });
    },
    { scope: root }
  );

  const row = (key: string) =>
    words.map((w, i) => (
      <span className="marquee__item" key={key + i}>
        {w}
        <Star />
      </span>
    ));

  return (
    <div className="marquee" ref={root} aria-label="Our origins">
      <div className="marquee__track">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
