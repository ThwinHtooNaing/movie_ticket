// components/movie/SeatMap.jsx
import styles from "./SeatMap.module.css";

export default function SeatMap({ seats, selectedSeats, onToggleSeat }) {
  // Group seats by row
  const rows = {};
  seats.forEach((seat) => {
    if (!rows[seat.row_label]) rows[seat.row_label] = [];
    rows[seat.row_label].push(seat);
  });

  // Same color generation as SeatLegend
  const getColorFromClass = (seatClass) => {
    if (!seatClass) return "#555";
    const str = seatClass.toUpperCase();
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 88%, 62%)`;
  };

  return (
    <div className={styles.map}>
      <div className={styles.screen}>SCREEN</div>

      {Object.keys(rows).map((rowLabel) => (
        <div key={rowLabel} className={styles.row}>
          <span className={styles.rowLabel}>{rowLabel}</span>
          <div className={styles.seats}>
            {rows[rowLabel].map((seat) => {
              const isSelected = selectedSeats.some((s) => s.id === seat.id);
              const isReserved = seat.status === "reserved";

              const seatColor = getColorFromClass(seat.seat_class);

              return (
                <button
                  key={seat.id}
                  className={`${styles.seat} 
                    ${isSelected ? styles.selected : ""}
                    ${isReserved ? styles.reserved : ""}
                  `}
                  style={{
                    borderColor: seatColor,
                    backgroundColor: isSelected
                      ? "#facc15"
                      : seat.seat_class?.toUpperCase() === "REGULAR"
                        ? "#222"
                        : "#1a1a1a",
                  }}
                  onClick={() => onToggleSeat(seat)}
                  disabled={isReserved}
                >
                  {seat.seat_number}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
