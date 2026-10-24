// Original Kilnwood mark: a coffee bean inside a kiln arch.
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        d="M4 28V14a12 12 0 0 1 24 0v14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <ellipse cx="16" cy="19" rx="5" ry="7" fill="currentColor" transform="rotate(-18 16 19)" />
      <path
        d="M14.2 13.2c2.4 2 1.2 5.2 0.4 6.4s-1.6 4.6 1.4 6.6"
        fill="none"
        stroke="var(--espresso)"
        strokeWidth="1.2"
      />
    </svg>
  );
}

// Rotating circular badge used in the hero.
export function Emblem({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <path id="kw-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
      </defs>
      <g className="emblem-ring">
        <text
          fill="var(--cream)"
          fontFamily="JetBrains Mono, monospace"
          fontSize="12.5"
          letterSpacing="5.2"
        >
          <textPath href="#kw-circle">
            ROASTED SLOW • SHIPPED FRESH • SMALL BATCH •{" "}
          </textPath>
        </text>
      </g>
      <circle cx="100" cy="100" r="46" fill="var(--ember)" />
      <g transform="translate(76 74) scale(1.5)" color="var(--espresso)">
        <path d="M4 28V14a12 12 0 0 1 24 0v14" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <ellipse cx="16" cy="19" rx="5" ry="7" fill="currentColor" transform="rotate(-18 16 19)" />
        <path
          d="M14.2 13.2c2.4 2 1.2 5.2 0.4 6.4s-1.6 4.6 1.4 6.6"
          fill="none"
          stroke="var(--ember)"
          strokeWidth="1.2"
        />
      </g>
    </svg>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z"
        fill="currentColor"
      />
    </svg>
  );
}
