"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import styles from "./CinemaPage.module.css";

function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function CinemaPage() {
  const { cinemaId } = useParams();
  const [cinema, setCinema] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showtimesLoading, setShowtimesLoading] = useState(false);
  const dateContainerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const dates = useMemo(() => {
    const arr = [];
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    for (let i = 0; i < 35; i++) {
      const d = new Date(today);
      d.setUTCDate(d.getUTCDate() + i);
      arr.push({
        full: d.toISOString().split("T")[0],
        display: d.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
          timeZone: "UTC",
        }),
      });
    }
    return arr;
  }, []);

  // Set default date
  useEffect(() => {
    if (dates.length > 0) setSelectedDate(dates[0].full);
  }, [dates]);

  // Fetch cinema details
  useEffect(() => {
    const fetchCinemaDetails = async () => {
      try {
        const response = await fetch(`/api/cinemas/${cinemaId}`);
        const data = await response.json();
        if (data.cinema) setCinema(data.cinema);
      } catch (error) {
        console.error("Error fetching cinema:", error);
      } finally {
        setLoading(false);
      }
    };

    if (cinemaId) fetchCinemaDetails();
  }, [cinemaId]);

  useEffect(() => {
    if (!selectedDate || !cinemaId) return;

    const fetchShowtimes = async () => {
      setShowtimesLoading(true);
      try {
        const res = await fetch(
          `/api/cinemas/${cinemaId}/showtimes?date=${selectedDate}`,
        );
        const data = await res.json();
        setMovies(data.movies || []);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
        setMovies([]);
      } finally {
        setShowtimesLoading(false);
      }
    };

    fetchShowtimes();
  }, [selectedDate, cinemaId]);

  const scrollAmount = 300;

  const handlePrev = () => {
    dateContainerRef.current?.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  };

  const handleNext = () => {
    dateContainerRef.current?.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading cinema details...</div>;
  }

  if (!cinema) {
    return <div className={styles.loading}>Cinema not found.</div>;
  }

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.cinemaCover}>
          <img
            src={cinema.cover_url || "/default-cinema-cover.jpg"}
            alt={cinema.name}
            className={styles.cinemaImage}
          />
          <div className={styles.cinemaNameOverlay}>{cinema.name}</div>
        </div>
      </div>

      <div className={styles.container}>
        {/* Date Selector */}
        <div className={styles.selectedDateHeader}>
          <div className={styles.selectedDateBox}>
            <span className={styles.selectedDate}>
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    timeZone: "UTC",
                  })
                : "Loading..."}
            </span>
          </div>

          <div className={styles.dateNav}>
            <button className={styles.arrow} onClick={handlePrev}>
              &#10094;
            </button>
            <div className={styles.dateList} ref={dateContainerRef}>
              {dates.map((d) => (
                <div
                  key={d.full}
                  className={`${styles.dateItem} ${
                    selectedDate === d.full ? styles.activeDate : ""
                  }`}
                  onClick={() => setSelectedDate(d.full)}
                >
                  {d.display}
                </div>
              ))}
            </div>
            <button className={styles.arrow} onClick={handleNext}>
              &#10095;
            </button>
          </div>
        </div>

        {/* ==================== SHOWTIMES SECTION (THE BLANK PART) ==================== */}
        <div className={styles.showtimesSection}>
          {showtimesLoading ? (
            <div className={styles.loading}>Loading showtimes...</div>
          ) : movies.length === 0 ? (
            <div className={styles.noShowtimes}>
              <span className={styles.noShowtimesIcon}>🎬</span>
              <h3>No showtimes available</h3>
              <p>Please try another date.</p>
            </div>
          ) : (
            movies.map((movie) => (
              <div key={movie.id} className={styles.movieCard}>
                {/* Movie Header */}
                <div className={styles.movieHeader}>
                  <img
                    src={movie.poster_url || "/default-poster.jpg"}
                    alt={movie.title}
                    className={styles.moviePoster}
                  />
                  <div className={styles.movieInfo}>
                    <h2 className={styles.movieTitle}>{movie.title}</h2>
                    <div className={styles.genreTags}>
                      {movie.genre.split("/").map((g, i) => (
                        <span key={i} className={styles.genreTag}>
                          {g.trim()}
                        </span>
                      ))}
                    </div>
                    <span className={styles.movieDesc}>{movie.description || "No description available."} </span>
                  </div>
                </div>

                {/* Screens + Showtimes */}
                {movie.showtimes.map((screen, index) => (
                  <div key={index} className={styles.screenRow}>
                    <div className={styles.screenInfo}>
                      <span className={styles.screenName}>
                        {screen.screen_name}
                      </span>
                      <span className={styles.soundIcon}>🔊</span>
                      <span className={styles.language}>{screen.language}</span>
                      {screen.format && (
                        <span className={styles.formatBadge}>
                          {screen.format}
                        </span>
                      )}
                    </div>

                    <div className={styles.timeSlots}>
                      {screen.times.map((t, tIndex) => (
                        <a
                          key={tIndex}
                          href={`/movies/${movie.id}/booking/${t.showtime_id}`}
                          className={`${styles.timeBtn} ${
                            tIndex === 0 ? styles.timeBtnActive : ""
                          }`}
                        >
                          {t.time}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
