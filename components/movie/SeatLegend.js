// components/movie/SeatLegend.jsx
import styles from "./SeatLegend.module.css";

export default function SeatLegend({ seats }) {
  if (!seats || seats.length === 0) return null;

  // Get unique seat classes (including REGULAR)
  const uniqueClasses = [
    ...new Set(seats.map((seat) => seat.seat_class?.trim()).filter(Boolean)),
  ];

  // Generate consistent color for each class
  const getColorFromClass = (seatClass) => {
    const str = (seatClass || "REGULAR").toUpperCase();
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 88%, 62%)`;
  };

  return (
    <div className={styles.legend}>
      {/* Selected & Reserved only (no "Available") */}
      <div className={styles.legendItem}>
        <div className={styles.selected} />
        <span>Selected</span>
      </div>

      <div className={styles.legendItem}>
        <div className={styles.reserved} />
        <span>Reserved</span>
      </div>

      {/* Dynamic Seat Classes - Including REGULAR */}
      {uniqueClasses.map((seatClass) => {
        const color = getColorFromClass(seatClass);

        return (
          <div key={seatClass} className={styles.classPriceCard}>
            <div
              className={styles.classBadge}
              style={{
                backgroundColor: color,
                borderColor: color,
              }}
            />
            <div className={styles.classInfo}>
              <span className={styles.className}>{seatClass}</span>
              <span className={styles.classPrice}>
                {parseFloat(
                  seats.find((s) => s.seat_class === seatClass)?.price || 0,
                )}{" "}
                THB
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
