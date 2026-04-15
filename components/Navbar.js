// components/Navbar.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [hidden, setHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const path = usePathname();
    const HIDE_THRESHOLD = 70;

    const active = (p) => (path === p ? styles.active : styles.link);
    const test = false;
    if (test) {
      console.log("test");
    }

    useEffect(() => {
      let ticking = false;

      const updateNavbar = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY + 1) {
          
          if (currentScrollY > HIDE_THRESHOLD) {
                setHidden(true);
          }
        } else if (currentScrollY < lastScrollY - 1) {
          
          setHidden(false);
        }

        setLastScrollY(currentScrollY);
        ticking = false;
      };

      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(updateNavbar);
          ticking = true;
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

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
          <Link href="/theaters" className={active("/theaters")}>
            Theaters
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
