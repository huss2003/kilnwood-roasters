# Kilnwood Roasters

A motion-heavy, single-page website for **Kilnwood Roasters**, a fictional small-batch coffee roastery. Built as a front-end design showcase.

## Stack

- **Next.js** (App Router, TypeScript)
- **GSAP** with ScrollTrigger and SplitText for all motion
- **Lenis** for smooth scrolling, synced to the GSAP ticker
- Google Fonts: Fraunces (display serif), Manrope (UI), JetBrains Mono (labels)

## Motion inventory

| Section | Technique |
| --- | --- |
| Loader | Counter + progress bar, clip-path wipe out |
| Hero | Masked per-character reveal, rotating badge that speeds up with scroll velocity, scroll-out parallax |
| Origins marquee | Infinite loop that reverses with scroll direction and accelerates with velocity |
| Manifesto | Word-by-word opacity scrubbed to scroll |
| Origins | Pinned horizontal scroll with progress bar and per-card tilt (containerAnimation) |
| Process | Pinned timeline, scrubbed progress line, rolling step number |
| Stats | Count-up on enter |
| Brew Club | Clip-path image reveal, animated steam, price tween on plan toggle |
| Footer | Scrubbed character rise on the oversized wordmark |
| Global | Custom cursor with labels, magnetic buttons, hide-on-scroll header, film grain |

Respects `prefers-reduced-motion`.

## Run locally

```bash
npm install
npm run dev
```

All brand names, products, prices and copy are invented.
