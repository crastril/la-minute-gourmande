/**
 * Pictogrammes au trait, dans l'esprit des icônes cerclées de l'affiche
 * (cupcake, burger, gobelet). Tracés en `currentColor`.
 */

type Props = { className?: string };

const trait = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function IconeTelephone({ className = "" }: Props) {
  return (
    <svg {...trait} className={className}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}

export function IconeEmail({ className = "" }: Props) {
  return (
    <svg {...trait} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function IconeAdresse({ className = "" }: Props) {
  return (
    <svg {...trait} className={className}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function IconeInstagram({ className = "" }: Props) {
  return (
    <svg {...trait} className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function IconeSmartphone({ className = "" }: Props) {
  return (
    <svg {...trait} className={className}>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M10.5 18.5h3" />
    </svg>
  );
}

export function IconeToque({ className = "" }: Props) {
  return (
    <svg {...trait} className={className}>
      <path d="M7 17.5h10v3.5H7z" />
      <path d="M7 17.5c-2.5-1-4-3-4-5.5A4 4 0 0 1 8.5 8.6a4 4 0 0 1 7 0A4 4 0 0 1 21 12c0 2.5-1.5 4.5-4 5.5" />
    </svg>
  );
}

export function IconeSac({ className = "" }: Props) {
  return (
    <svg {...trait} className={className}>
      <path d="M5 8h14l-1 13H6z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  );
}

export function IconeCroissant({ className = "" }: Props) {
  return (
    <svg {...trait} className={className}>
      <path d="M3 15c2-5.5 5.5-8.5 9-8.5s7 3 9 8.5" />
      <path d="M6.5 14c1.2-2.8 3.2-4.3 5.5-4.3s4.3 1.5 5.5 4.3" />
      <path d="m3 15 3.5 2.5M21 15l-3.5 2.5" />
      <path d="m9.5 10.3.8 4.2M14.5 10.3l-.8 4.2" />
    </svg>
  );
}

export function IconeSandwich({ className = "" }: Props) {
  return (
    <svg {...trait} className={className}>
      <path d="M3 10.5C3 7.5 7 5 12 5s9 2.5 9 5.5z" />
      <path d="M3 13.5c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0" />
      <path d="M4 16.5h16l-1 3H5z" />
    </svg>
  );
}

export function IconeCupcake({ className = "" }: Props) {
  return (
    <svg {...trait} className={className}>
      <path d="M6 12h12l-1.5 8.5h-9z" />
      <path d="M5.5 12a3.5 3.5 0 0 1 1.8-6.4A4.6 4.6 0 0 1 16.7 5.6 3.5 3.5 0 0 1 18.5 12" />
      <path d="m10 12 .5 8.5M14 12l-.5 8.5" />
    </svg>
  );
}

export function IconeBurger({ className = "" }: Props) {
  return (
    <svg {...trait} className={className}>
      <path d="M4 11c0-3.5 3.6-6 8-6s8 2.5 8 6z" />
      <path d="M3.5 14h17" />
      <path d="M5 17h14v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" />
    </svg>
  );
}

export function IconeGobelet({ className = "" }: Props) {
  return (
    <svg {...trait} className={className}>
      <path d="M6.5 8h11l-1.5 13h-8z" />
      <path d="M5.5 6h13v2h-13z" />
      <path d="m13 6 2-4h3" />
    </svg>
  );
}

export function IconeGlace({ className = "" }: Props) {
  return (
    <svg {...trait} className={className}>
      <path d="M7.2 11.5A4.8 4.8 0 0 1 12 6.7a4.8 4.8 0 0 1 4.8 4.8" />
      <path d="M9.4 7.4A3.2 3.2 0 0 1 12 2.5a3.2 3.2 0 0 1 2.6 4.9" />
      <path d="M6.8 11.5h10.4L12 22z" />
      <path d="m9.5 14.5 4 2.5M14.5 14.5l-4 2.5" />
    </svg>
  );
}
