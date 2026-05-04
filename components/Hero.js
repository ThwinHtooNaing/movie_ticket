import Link from "next/link";
import styles from "./Hero.module.css";
import { getHeroMovie } from "@/utils/test";

export default async function Hero() {


  const movie = await getHeroMovie();

  if (!movie) {
    return (
      <section className={styles.hero}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <p className={styles.tag}>COMING SOON</p>
          <h1>No Movies Showing Right Now</h1>
          <p className={styles.desc}>Please check back later.</p>
        </div>
      </section>
    );
  }

  const rating = movie.avg_rating
    ? parseFloat(movie.avg_rating).toFixed(1)
    : "0.0";

  return (
    <section
      className={styles.hero}
    >
      <div className={styles.overlay} />
      <img
        src={movie.poster_url}
        alt={movie.title}
        className={styles.background}
      />

      <div className={styles.content}>
        <div className={styles.tag}>
          NOW SHOWING ★ <span>{rating}</span> Rating
        </div>

        <h1>{movie.title}</h1>

        <p className={styles.desc}>
          {movie.description ||
            `${movie.title} is now playing in cinemas across Bangkok.`}
        </p>

        <div className={styles.buttons}>
          <Link href={`/movies/${movie.id}`} className={styles.primary}>
            🎟 Book Ticket
          </Link>

        </div>
      </div>
    </section>
  );
}
