// components/movie/UpcomingBookingCard.jsx
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import styles from "./UpcomingBookingCard.module.css";

export default function UpcomingBookingCard({ booking, onViewTicket }) {
  return (
    <div className={styles.card}>
      <div className={styles.posterWrapper}>
        <img
          src={booking.poster_url}
          alt={booking.movie_title}
          onError={(e) => (e.target.src = "/placeholder-poster.jpg")}
        />
        <div className={styles.badge}>{booking.format}</div>
      </div>

      <div className={styles.content}>
        <h3>{booking.movie_title}</h3>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <Calendar size={16} />
            <span>{booking.date}</span>
          </div>
          <div className={styles.metaItem}>
            <Clock size={16} />
            <span>{booking.time}</span>
          </div>
          <div className={styles.metaItem}>
            <MapPin size={16} />
            <span>
              {booking.cinema} • {booking.hall}
            </span>
          </div>
          <div className={styles.metaItem}>
            <Ticket size={16} />
            <span>{booking.seats}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={onViewTicket} className={styles.viewBtn}>
            View Ticket
          </button>
          <button className={styles.shareBtn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
