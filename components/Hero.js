import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* <div className={styles.overlay}></div> */}

      <div className={styles.content}>
        <p className={styles.tag}>
          PREMIERE EXCLUSIVE ★ <span>9.8</span> Rating
        </p>

        <h1>The Dark Knight</h1>

        <p className={styles.desc}>
          Batman battles a sadistic anarchist who pushes him to the breaking
          point to prove that Gotham’s heroes are just one bad day away from
          becoming monsters.
        </p>

        <div className={styles.buttons}>
          <button className={styles.primary}>🎟 Book Ticket</button>
          <button className={styles.secondary}>▶ Watch Trailer</button>
        </div>
      </div>
    </section>
  );
}
