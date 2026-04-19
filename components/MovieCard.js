"use client";

import Link from "next/link";
import styles from "./MovieCard.module.css";

export default function MovieCard({ movie }) {
  const rating = Number(movie.average_rating) || 0;
  const ratingStars = Math.floor(rating / 2); // 10 → 5 stars

  console.log(movie);

  return (
    <Link href={`/movies/${movie.id}`} className={styles.link}>
      <div className={styles.card}>
        {/* Poster */}
        <div className={styles.posterWrapper}>
          <img
            src={movie.poster_url || "/placeholder-poster.jpg"}
            alt={movie.title}
            className={styles.posterImage}
          />

          {/* Hover overlay */}
          <div className={styles.overlay}>
            <div className={styles.overlayBtn}>
              SEE MORE <span>→</span>
            </div>
          </div>

        </div>

        {/* Content */}
        <div className={styles.content}>
          <h3 className={styles.title}>{movie.title}</h3>

          <div className={styles.infoRow}>
            <p className={styles.meta}>
              {movie.genre} • {movie.duration ? `${movie.duration} min` : "—"}
            </p>

            <div className={styles.rating}>
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < ratingStars ? "" : styles.empty}>
                    ★
                  </span>
                ))}
              </div>

              <span className={styles.ratingValue}>
                {rating ? rating.toFixed(1) : ""}
              </span>
            </div>
          </div>

          
          {<p className={styles.reviews}>{movie.total_reviews} reviews</p>}


        </div>
      </div>
    </Link>
  );
}
