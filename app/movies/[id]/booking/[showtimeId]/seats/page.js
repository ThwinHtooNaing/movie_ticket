"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProgressStepper from "@/components/movie/ProgressStepper";
import SeatMap from "@/components/movie/SeatMap";
import SeatLegend from "@/components/movie/SeatLegend";
import SelectedSeatsBar from "@/components/movie/SelectedSeatsBar";
import styles from "./SeatSelection.module.css";

export default function SeatSelectionPage() {
  const { id: movieId, showtimeId } = useParams();
  const router = useRouter();

  const [movie, setMovie] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        
        const [movieRes, seatRes] = await Promise.all([
          fetch(`/api/movies/${movieId}`),
          fetch(`/api/showtimes/${showtimeId}/seats`),
        ]);

        const movieData = await movieRes.json();
        const seatData = await seatRes.json();

        setMovie(movieData);
        setShowtime(seatData.showtime);
        setSeats(seatData.seats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [movieId, showtimeId]);

  const toggleSeat = (seat) => {
    if (seat.status === "reserved") return;

    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.id === seat.id);
      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      }
      return [...prev, seat];
    });
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => {
    return sum + + (seat.price || 0);
  }, 0);

  console.log("Total price calculated:", totalPrice);

  if (loading) return <div className={styles.loading}>Loading seats...</div>;

  function handleProceed() {
    localStorage.setItem(
      "currentBooking",
      JSON.stringify({
        booking: {
          movieTitle: movie?.title,
          cinema: showtime?.cinema_name,
          date: new Date(showtime?.start_time).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          time: new Date(showtime?.start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          poster_url: movie?.poster_url,
        },
        selectedSeats: selectedSeats,
      }),
    );
    router.push(`/movies/${movieId}/booking/${showtimeId}/payment`)
  }

  return (
    <div className={styles.page}>
      <ProgressStepper currentStep={2} />

      <div className={styles.container}>
        <h1 className={styles.movieTitle}>{movie?.title}</h1>
        <p className={styles.subtitle}>
          {showtime?.cinema_name} • {showtime?.screen_name} •{" "}
          {new Date(showtime?.start_time).toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>

        <SeatMap
          seats={seats}
          selectedSeats={selectedSeats}
          onToggleSeat={toggleSeat}
        />

        <SeatLegend seats={seats} />

        <SelectedSeatsBar
          selectedSeats={selectedSeats}
          totalPrice={totalPrice}
          onProceed={handleProceed}
        />
      </div>
    </div>
  );
}
