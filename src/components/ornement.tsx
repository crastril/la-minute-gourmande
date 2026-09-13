/**
 * Ornements repris du logo Minute Gourmande :
 *  — l'épi posé sur un trait, sous « Gourmande » ;
 *  — le rameau de feuilles, à gauche de « MINUTE ».
 * Tracés en `currentColor` : ils prennent la couleur du texte parent.
 */

export function Epi({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 240 24" fill="none" className={className}>
      <path
        d="M2 13 C 40 11, 70 14.5, 97 12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M146 12 C 172 14.5, 202 11, 238 13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M100 12 H 141" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 106 + i * 7;
        const echelle = 1 - i * 0.1;
        return (
          <g key={i}>
            <ellipse
              cx={x}
              cy={8.6}
              rx={3.6 * echelle}
              ry={1.9 * echelle}
              transform={`rotate(-28 ${x} 8.6)`}
              fill="currentColor"
            />
            <ellipse
              cx={x}
              cy={15.4}
              rx={3.6 * echelle}
              ry={1.9 * echelle}
              transform={`rotate(28 ${x} 15.4)`}
              fill="currentColor"
            />
          </g>
        );
      })}
      <ellipse cx="143" cy="12" rx="3.2" ry="1.5" fill="currentColor" />
    </svg>
  );
}

const FEUILLES = [
  { x: 12, y: 48, angle: -120 },
  { x: 14.5, y: 40, angle: -40 },
  { x: 18, y: 32, angle: -125 },
  { x: 21.5, y: 24, angle: -45 },
  { x: 25, y: 16, angle: -130 },
  { x: 28, y: 9, angle: -55 },
];

export function Rameau({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 40 60" fill="none" className={className}>
      <path
        d="M9 58 C 14 40, 20 24, 31 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {FEUILLES.map((f) => (
        <path
          key={`${f.x}-${f.y}`}
          d="M0 0 C 3 -4.5, 9 -4.5, 12 0 C 9 4.5, 3 4.5, 0 0Z"
          fill="currentColor"
          transform={`translate(${f.x} ${f.y}) rotate(${f.angle})`}
        />
      ))}
    </svg>
  );
}
