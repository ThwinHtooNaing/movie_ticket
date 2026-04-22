import styles from "./BookingSummary.module.css";
import { useRouter } from "next/navigation";

export default function BookingSummary({ movie, selectedShowtime }) {
  const router = useRouter();

  return (
    <div className={styles.summary}>
      <h3 className={styles.summaryTitle}>Booking Summary</h3>

      <div className={styles.info}>
        <div className={styles.row}>
          <span className={styles.label}>Movie</span>
          <span className={styles.value}>{movie.title}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Cinema</span>
          <span className={styles.value}>{selectedShowtime.cinema_name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Hall</span>
          <span className={styles.value}>{selectedShowtime.screen_name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Date</span>
          <span className={styles.value}>
            {new Date(selectedShowtime.start_time).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Time</span>
          <span className={styles.value}>
            {new Date(selectedShowtime.start_time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <button
        className={styles.bookBtn}
        onClick={() =>
          router.push(
            `/movies/${movie.id}/booking/${selectedShowtime.showtime_id}/seats`,
          )
        }
      >
        Continue to Seat Selection →
      </button>
    </div>
  );
}
