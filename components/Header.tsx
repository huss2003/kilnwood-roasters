"use client";

import { useEffect, useRef, useState } from "react";
import { Mark, Arrow } from "./Emblem";
import Magnetic from "./Magnetic";

const links = [
  { href: "#origins", label: "Origins" },
  { href: "#process", label: "The roast" },
  { href: "#club", label: "Brew Club" },
  { href: "#visit", label: "Visit" },
];

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(y > last.current && y > 300 && !open);
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    if (open) window.__lenis?.stop();
    else if (!document.body.classList.contains("is-loading")) window.__lenis?.start();
  }, [open]);

  return (
    <>
      <header className={`header ${hidden ? "is-hidden" : ""} ${solid && !open ? "is-solid" : ""}`}>
        <a href="#top" className="logo" aria-label="Kilnwood Roasters home">
          <Mark />
          Kilnwood
        </a>
        <nav className="header__nav" aria-label="Main">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="header__right">
          <Magnetic>
            <a href="#club" className="btn btn--ember">
              <span className="btn__label">Order beans</span>
              <Arrow className="btn__arrow" />
            </a>
          </Magnetic>
          <button
            className={`menu-btn ${open ? "is-open" : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <div className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <span className="eyebrow">hello@kilnwood.example · Fictional brand</span>
      </div>
    </>
  );
}
