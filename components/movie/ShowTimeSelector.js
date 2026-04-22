import Link from "next/link";
import styles from "./ShowTimeSelector.module.css";


export default function ShowtimeSelector({
  movie,
  showtimes,
  selectedShowtimeId,
}) {
  // Group by cinema
  const grouped = {};
  showtimes.forEach((st) => {
    if (!grouped[st.cinema_id]) {
      grouped[st.cinema_id] = {
        name: st.cinema_name,
        times: [],
      };
    }
    grouped[st.cinema_id].times.push(st);
  });

  return (
    <div className={styles.selector}>
      <h2 className={styles.sectionTitle}>Select Showtime</h2>
      {Object.values(grouped).map((cinema) => (
        <div key={cinema.name} className={styles.cinemaGroup}>
          <h3 className={styles.cinemaName}>{cinema.name}</h3>
          <div className={styles.times}>
            {cinema.times.map((st) => (
              <Link
                key={st.showtime_id}
                href={`/movies/${movie.id}/booking/${st.showtime_id}`}
                className={`${styles.timeBtn} ${
                  String(st.showtime_id) === selectedShowtimeId
                    ? styles.active
                    : ""
                }`}
              >
                {new Date(st.start_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
