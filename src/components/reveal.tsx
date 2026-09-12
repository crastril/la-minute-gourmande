"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Révèle son contenu quand il entre dans le viewport.
 * Le style vit dans l'utilitaire CSS `apparition` (globals.css).
 */
export function Reveal({
  children,
  delai = 0,
  className = "",
  as: Balise = "div",
}: {
  children: React.ReactNode;
  delai?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Navigateur sans IntersectionObserver : on révèle sans passer par l'état,
    // pour ne pas déclencher un rendu en cascade depuis l'effet.
    if (typeof IntersectionObserver === "undefined") {
      element.dataset.visible = "true";
      return;
    }

    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          setVisible(true);
          observateur.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    observateur.observe(element);
    return () => observateur.disconnect();
  }, []);

  return (
    <Balise
      // @ts-expect-error — ref polymorphe sur un jeu de balises restreint et sûr
      ref={ref}
      data-visible={visible}
      style={{ transitionDelay: `${delai}ms` }}
      className={`apparition ${className}`}
    >
      {children}
    </Balise>
  );
}
