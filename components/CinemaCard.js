// components/CinemaCard.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./CinemaCard.module.css";

export default function CinemaCard({ cinema }) {
  return (
    <Link href={`/cinemas/${cinema.id}`} className={styles.card}>
      <div className={styles.cardInner}>
        {/* Image */}
        <div className={styles.imageWrapper}>
          <img
            src={cinema.logo_url}
            alt={cinema.name}
            className={styles.image}
            sizes="(max-width: 768px) 50vw, 33vw"
          />

        </div>

        {/* Content */}
        <div className={styles.content}>
          <h3 className={styles.name}>{cinema.name}</h3>
          <p className={styles.location}>{cinema.address},{' '}{cinema.district}
          </p>

          {/* View Showtimes Button */}
          <button className={styles.button}>View Showtimes</button>
        </div>
      </div>
    </Link>
  );
}
