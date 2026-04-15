import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Left */}
        <div className={styles.left}>
          <h2>CINEMA NOIR</h2>
          <p>
            Elevating the cinematic experience. Every film is a premiere, every
            guest a VIP.
          </p>
        </div>

        {/* Middle */}
        <div className={styles.links}>
          <h4>Experience</h4>
          <ul>
            <li>VIP Screening</li>
            <li>IMAX Experience</li>
            <li>Private Lounge</li>
          </ul>
        </div>

        {/* Right */}
        <div className={styles.subscribe}>
          <h4>Subscribe</h4>
          <input type="email" placeholder="Email address" />
          <button>Join</button>
        </div>
      </div>

      {/* Bottom */}
      <div className={styles.bottom}>
        <p>© 2026 CINEMA NOIR</p>
        <p>Designed by Rangsit University Web Programming Class</p>
      </div>
    </footer>
  );
}
