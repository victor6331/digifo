"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./splash-screen.module.css";

/**
 * Splash screen animé qui ne s’affiche qu’une fois par session navigateur.
 *
 * La logique met un indicateur dans `sessionStorage` pour éviter de rejouer
 * l’animation lors des navigations internes. À la première visite, le logo
 * apparaîtra en pop au centre de l’écran, puis se déplacera légèrement
 * vers la gauche tandis que le texte “DIGIFO” apparaît lettre par lettre.
 */
export default function SplashScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasShown = sessionStorage.getItem("splashShown");
    if (!hasShown) {
      sessionStorage.setItem("splashShown", "true");
      setShow(true);
      const timeout = setTimeout(() => {
        setShow(false);
      }, 3500);
      return () => clearTimeout(timeout);
    }
  }, []);

  if (!show) return null;

  return (
    <div className={styles.overlay} data-testid="splash-screen">
      <div className={styles.container}>
        {/*
         * Le logo complet pop au centre. Une fois l’animation terminée,
         * il se décale vers la gauche pour laisser apparaître le nom.
         */}
        <div className={styles.logoWrapper}>
          <Image
            src="/logo.svg"
            alt="Logo"
            width={100}
            height={100}
            className={styles.logo}
          />
        </div>

        {/*
         * Texte “DIGIFO” affiché lettre par lettre. Les classes Tailwind
         * définissent la typographie et la couleur (font‑semibold, blanc,
         * taille 2xl et marge gauche), tandis que le module CSS anime
         * l’apparition des lettres. Chaque lettre possède un délai
         * individuel pour un effet fluide.
         */}
        <div
          className={`${styles.nameWrapper} font-semibold text-white text-2xl ml-2.5`}
          aria-label="DIGIFO"
        >
          {Array.from("DIGIFO").map((char, idx) => (
            <span
              key={idx}
              className={styles.letter}
              style={{ animationDelay: `${1.4 + idx * 0.15}s` }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
