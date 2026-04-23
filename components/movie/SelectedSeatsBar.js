import styles from "./SelectedSeatsBar.module.css";

export default function SelectedSeatsBar({
  selectedSeats,
  totalPrice,
  onProceed,
}) {
  const hasSelectedSeats = selectedSeats.length > 0;
  const finalPrice = Number(totalPrice) || 0;

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <span className={styles.label}>SELECTED SEATS</span>
        <div className={styles.seatsList}>
          {selectedSeats.length > 0 ? (
            selectedSeats.map((seat) => (
              <span key={seat.id} className={styles.seatTag}>
                {seat.row_label}
                {seat.seat_number}
              </span>
            ))
          ) : (
            <span className={styles.noSeats}>No seats selected yet</span>
          )}
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.total}>
          <span className={styles.totalLabel}>TOTAL PRICE {' '}</span>
          <span className={styles.price}>{finalPrice.toFixed(2)} THB</span>
        </div>

        {/* Show button ONLY when at least one seat is selected */}
        {hasSelectedSeats && (
          <button onClick={onProceed} className={styles.checkoutBtn}>
            Proceed to Checkout
          </button>
        )}
      </div>
    </div>
  );
}
