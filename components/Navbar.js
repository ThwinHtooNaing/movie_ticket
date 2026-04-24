// components/Navbar.js
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const router = useRouter();
  const path = usePathname();
  const [searchTerm, setSearchTerm] = useState("");

  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const HIDE_THRESHOLD = 100;

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        setUser({
          id: localStorage.getItem("userId"),
          name: localStorage.getItem("userName"),
          email: localStorage.getItem("userEmail"),
          img_url: localStorage.getItem("userImgUrl") || "/default.jpg",
        });
      } else {
        setUser(null);
      }
    };

    checkLoginStatus(); 
  }, [path]);

  // Scroll behavior
  useEffect(() => {
    let ticking = false;

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY + 5) {
        if (currentScrollY > HIDE_THRESHOLD) setHidden(true);
      } else if (currentScrollY < lastScrollY - 5) {
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDropdown && !e.target.closest(`.${styles.right}`)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  // Dispatch custom event whenever hidden state changes
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("navbarChange", { detail: { hidden } }),
    );
  }, [hidden]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userImgUrl");

    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    router.push("/login");
  };

  const active = (p) => (path === p ? styles.active : styles.link);

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

        {/* Avatar or Login Button */}
        {isLoggedIn && user ? (
          <div className={styles.avatarContainer}>
            <div
              className={styles.avatar}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={user.img_url}
                alt={user.name}
                onError={(e) => {
                  e.target.src = "/default.png";
                }}
              />
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className={styles.dropdown}>
                <div className={styles.userInfo}>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className={styles.loginBtn}>
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
}
