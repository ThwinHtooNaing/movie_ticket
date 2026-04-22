// app/movies/[id]/booking/[showtimeId]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BookingHero from "@/components/movie/BookingHero";
import ShowtimeSelector from "@/components/movie/ShowTimeSelector";
import BookingSummary from "@/components/movie/BookingSummary";
import styles from "./BookingPage.module.css";

export default function BookingPage() {
  const { id: movieId, showtimeId } = useParams();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch movie details
        const movieRes = await fetch(`/api/movies/${movieId}`);
        const movieData = await movieRes.json();
        setMovie(movieData);

        // Fetch all showtimes for this movie
        const showRes = await fetch(`/api/movies/${movieId}/showtimes`);
        const showData = await showRes.json();
        setShowtimes(showData);

        // Find the currently selected showtime
        const current = showData.find(
          (s) => String(s.showtime_id) === showtimeId,
        );
        setSelectedShowtime(current);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [movieId, showtimeId]);

  if (loading || !movie || !selectedShowtime) {
    return <div className={styles.loading}>Loading booking...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.background}>
        <div className={styles.cinemaCover}>
          <img
            src={selectedShowtime.cover_url}
            alt={selectedShowtime.cinema_name}
            width={600}
            height={280}
            className={styles.cinemaImage}
          />
          <div className={styles.cinemaNameOverlay}>
            {selectedShowtime.cinema_name}
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <BookingHero movie={movie} selectedShowtime={selectedShowtime} />

        <div className={styles.mainContent}>
          <ShowtimeSelector
            movie={movie}
            showtimes={showtimes}
            selectedShowtimeId={showtimeId}
          />

          <BookingSummary movie={movie} selectedShowtime={selectedShowtime} />
        </div>
      </div>
    </div>
  );
}
