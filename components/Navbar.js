// components/Navbar.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const path = usePathname();

  const HIDE_THRESHOLD = 100;

  const active = (p) => (path === p ? styles.active : styles.link);

  useEffect(() => {
    let ticking = false;

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY + 5) {
        // Scrolling down → hide navbar
        if (currentScrollY > HIDE_THRESHOLD) {
          setHidden(true);
        }
      } else if (currentScrollY < lastScrollY - 5) {
        // Scrolling up → show navbar
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Dispatch custom event whenever hidden state changes
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("navbarChange", { detail: { hidden } }),
    );
  }, [hidden]);

  return (
    <nav className={`${styles.nav} ${hidden ? styles.hidden : ""}`}>
      <h1 className={styles.logo}>CINEMA NOIR</h1>

      <div className={styles.links}>
        <Link href="/" className={active("/")}>
          Home
        </Link>
        <Link href="/movies" className={active("/movies")}>
          Movies
        </Link>
        <Link href="/cinemas" className={active("/cinemas")}>
          Cinemas
        </Link>
        <Link href="/bookings" className={active("/bookings")}>
          Bookings
        </Link>
      </div>

      <div className={styles.right}>
        <input placeholder="Search Movies..." className={styles.search} />
        <div className={styles.avatar}></div>
      </div>
    </nav>
  );
}
