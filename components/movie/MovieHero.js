"use client";

import styles from "./MovieHero.module.css";

export default function MovieHero({ movie }) {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className={styles.hero}>
      <div className={styles.poster}>
        <img
          src={movie.poster_url}
          alt={movie.title}
          width={280}
          height={420}
          className={styles.posterImage}
        />
      </div>

      <div className={styles.info}>
        <h1 className={styles.title}>{movie.title}</h1>
        <p className={styles.meta}>
          {movie.genre} • {movie.duration} mins • {movie.language}
        </p>
        <p className={styles.release}>{formatDate(movie.release_date)}</p>

        <div className={styles.ratings}>
          <div className={styles.ratingBox}>
            <span className={styles.label}>Average Rating</span>
            <span className={styles.value}>
              {Number(movie.avg_rating).toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
