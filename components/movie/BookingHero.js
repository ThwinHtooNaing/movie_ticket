import Image from "next/image";
import styles from "./BookingHero.module.css";

export default function BookingHero({ movie, selectedShowtime }) {
  console.log("BookingHero received:", { movie, selectedShowtime });
  return (
    <div className={styles.hero}>
      {/* Left: Movie Poster */}
      <div className={styles.poster}>
        <img
          src={movie.poster_url}
          alt={movie.title}
          width={380}
          height={560}
          className={styles.posterImage}
        />
      </div>

      {/* Right: Title + Info */}
      <div className={styles.content}>
        <div className={styles.badges}>
          <span className={styles.badge}>{movie.genre || "Action"}</span>
        </div>

        <h1 className={styles.title}>{movie.title}</h1>

        <div className={styles.meta}>
          <span>★ {movie.avg_rating || "8.5"}</span>
          <span>⏱ {movie.duration} mins</span>
          <span>🔊 {selectedShowtime.language || "EN/TH"}</span>
        </div>

        <p className={styles.description}>
          {movie.description || "In a decaying metropolis where memories are traded as currency, a rogue data-broker discovers an encrypted file that could shatter the city's virtual reality foundation."}
        </p>

        {/* Cinema Cover Photo */}
        {/* {selectedShowtime.cover_url && (
          <div className={styles.cinemaCover}>
            <img
              src={selectedShowtime.cover_url}
              alt={selectedShowtime.cinema_name}
              width={600}
              height={280}
              className={styles.cinemaImage}
            />
            <div className={styles.cinemaNameOverlay}>
              {selectedShowtime.cinema_name}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
