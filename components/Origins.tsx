"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const beans = [
  {
    name: "Ember Field",
    origin: "Huila, Colombia",
    notes: "Red apple, panela, milk chocolate",
    roast: "Medium",
    price: "₹780 / 250g",
    bg: "linear-gradient(160deg, #e2582b 0%, #b8401d 100%)",
  },
  {
    name: "Blue Hour",
    origin: "Sidama, Ethiopia",
    notes: "Bergamot, jasmine, ripe peach",
    roast: "Light",
    price: "₹890 / 250g",
    bg: "linear-gradient(160deg, #8fa3b8 0%, #4e6377 100%)",
  },
  {
    name: "Monsoon Hills",
    origin: "Chikmagalur, India",
    notes: "Cocoa nib, cardamom, toasted almond",
    roast: "Medium-dark",
    price: "₹690 / 250g",
    bg: "linear-gradient(160deg, #a9b48f 0%, #6c7a52 100%)",
  },
  {
    name: "Red Clay",
    origin: "Nyeri, Kenya",
    notes: "Blackcurrant, grapefruit, cane sugar",
    roast: "Light",
    price: "₹940 / 250g",
    bg: "linear-gradient(160deg, #c46a72 0%, #7c3540 100%)",
  },
  {
    name: "Slow Sunday",
    origin: "Cerrado, Brazil",
    notes: "Hazelnut, caramel, low acidity",
    roast: "Dark",
    price: "₹640 / 250g",
    bg: "linear-gradient(160deg, #d9b07a 0%, #8f6a3c 100%)",
  },
];

export default function Origins() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 861px)", () => {
        const track = root.current!.querySelector(".origins__track") as HTMLElement;
        const distance = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + distance(),
            pin: ".origins__pin",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.to(".origins__progress span", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + distance(),
            scrub: true,
          },
        });
        // bags tilt as they travel through the viewport
        gsap.utils.toArray<HTMLElement>(".bag").forEach((bag) => {
          gsap.fromTo(
            bag,
            { rotate: 8, y: 30 },
            {
              rotate: -6,
              y: -20,
              ease: "none",
              scrollTrigger: {
                trigger: bag,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });
      });
      mm.add("(max-width: 860px)", () => {
        const track = root.current!.querySelector(".origins__track") as HTMLElement;
        track.style.overflowX = "auto";
        track.style.width = "100%";
        track.style.scrollSnapType = "x mandatory";
      });
      gsap.from(".origins__head h2 .line-mask > span", {
        yPercent: 110,
        stagger: 0.1,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section className="origins" id="origins" ref={root}>
      <div className="origins__pin">
        <div className="origins__head">
          <div>
            <span className="eyebrow">(02) — This season&apos;s lots</span>
            <h2 style={{ marginTop: 16 }}>
              <span className="line-mask"><span style={{ display: "block" }}>Five farms.</span></span>
              <span className="line-mask"><span style={{ display: "block" }}><em>Five</em> moods.</span></span>
            </h2>
          </div>
          <div className="origins__progress" aria-hidden="true"><span /></div>
        </div>
        <div className="origins__track">
          {beans.map((b) => (
            <article className="bean-card" key={b.name} style={{ scrollSnapAlign: "start" }} data-cursor="View">
              <div className="bean-card__art" style={{ background: b.bg }}>
                <div className="bag">
                  <span className="bag__meta">Kilnwood · {b.roast}</span>
                  <span className="bag__name">{b.name}</span>
                  <span className="bag__meta">{b.origin}<br />250g · whole bean</span>
                </div>
              </div>
              <div className="bean-card__row">
                <h3>{b.name}</h3>
                <span className="bean-card__price">{b.price}</span>
              </div>
              <p className="bean-card__notes">{b.origin} — {b.notes}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
