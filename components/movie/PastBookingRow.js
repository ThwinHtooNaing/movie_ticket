import styles from "./PastBookingRow.module.css";

export default function PastBookingRow({ booking, onViewReceipt, onDelete }) {
  return (
    <div className={styles.row}>
      <div className={styles.movieInfo}>
        <img src={booking.poster_url} alt={booking.movie_title} />
        <div>
          <h4>{booking.movie_title}</h4>
          <p>
            {booking.cinema} • {booking.seats}
          </p>
        </div>
      </div>

      <div className={styles.meta}>
        <span>{booking.date}</span>
        <span className={styles.price}>${booking.total_spent}</span>
      </div>

      <div className={styles.actions}>
        <button onClick={onViewReceipt} className={styles.receiptBtn}>
          Receipt
        </button>
        <button onClick={onDelete} className={styles.rebookBtn}>
          Delete
        </button>
      </div>
    </div>
  );
}
