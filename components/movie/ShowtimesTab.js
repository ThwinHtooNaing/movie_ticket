// components/movie/ShowtimesTab.jsx
"use client";

import { useEffect, useState, useMemo, useRef} from "react";
import styles from "./ShowtimesTab.module.css";
import ChevronDown from "@/utils/ChevronDown.js";
import Link from "next/link";


function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function ShowtimesTab({ movie }) {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openCinema, setOpenCinema] = useState(null);

  const dateContainerRef = useRef(null);

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

  // Fetch showtimes
  useEffect(() => {
    async function loadShowtimes() {
      if (!movie?.id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/movies/${movie.id}/showtimes`);
        if (res.ok) {
          const data = await res.json();
          setShowtimes(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadShowtimes();
  }, [movie?.id]);

  // Group by cinema & screen
  const groupedData = useMemo(() => {
    if (!selectedDate || !showtimes.length) return [];

    const filtered = showtimes.filter((s) =>
      s.start_time.startsWith(selectedDate),
    );

    const cinemas = {};
    filtered.forEach((row) => {
      if (!cinemas[row.cinema_id]) {
        cinemas[row.cinema_id] = {
          id: row.cinema_id,
          name: row.cinema_name,
          logo_url: row.logo_url,
          screens: {},
        };
      }
      const cinema = cinemas[row.cinema_id];

      if (!cinema.screens[row.screen_id]) {
        cinema.screens[row.screen_id] = {
          id: row.screen_id,
          format: row.screen_name,
          language: row.language || "EN/TH",
          tech: row.tech_tags || [],
          times: [],
        };
      }

      cinema.screens[row.screen_id].times.push({
        id: row.showtime_id,
        time: new Date(row.start_time),
      });
    });

    // Sort times
    Object.values(cinemas).forEach((cinema) => {
      Object.values(cinema.screens).forEach((screen) => {
        screen.times.sort((a, b) => a.time - b.time);
      });
    });

    return Object.values(cinemas);
  }, [showtimes, selectedDate]);

  // Smooth scroll for arrows
  const scrollAmount = 300;

  const handlePrev = () => {
    if (dateContainerRef.current) {
      dateContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (dateContainerRef.current) {
      dateContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading)
    return <div className={styles.loading}>Loading showtimes...</div>;

  return (
    <div className={styles.wrapper}>
      {/* Selected Date Header */}
      {/* Selected Date Header + Date Navigation - Side by Side */}
      <div className={styles.selectedDateHeader}>
        {/* Big Selected Date */}
        <div className={styles.selectedDateBox}>
          <span className={styles.selectedDate}>
            {selectedDate
              ? new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  timeZone: "UTC", // ✅ force UTC
                })
              : "Loading..."}
          </span>
        </div>

        {/* Date Navigation */}
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

      {/* Cinemas List */}
      <div className={styles.container}>
        {loading ? (
          <div className={styles.loading}>Loading showtimes...</div>
        ) : groupedData.length === 0 ? (
          <div className={styles.noShowtimes}>
            <span className={styles.noShowtimesIcon}>🎟️</span>
            <h3>No Showtimes Available</h3>
            <p>There are no showtimes for this date yet.</p>
            <p>Please try selecting another date.</p>
          </div>
        ) : (
          groupedData.map((cinema) => (
            <div key={cinema.id} className={styles.cinemaBlock}>
              {/* Cinema Header (clickable accordion) */}
              <div
                className={styles.cinemaHeader}
                onClick={() =>
                  setOpenCinema(openCinema === cinema.id ? null : cinema.id)
                }
              >
                <div className={styles.brandGroup}>
                  <div className={styles.logoBox}>
                    {cinema.logo_url ? (
                      <img src={cinema.logo_url} alt={cinema.name} />
                    ) : (
                      <span className={styles.fallback}>
                        {cinema.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h2 className={styles.cinemaName}>{cinema.name}</h2>
                </div>
                <span className={styles.chevron}>
                  <ChevronDown isOpen={openCinema === cinema.id} />
                </span>
              </div>

              {/* Expanded Content */}
              <div
                className={`${styles.collapseWrapper} ${openCinema === cinema.id ? styles.open : ""}`}
              >
                {Object.values(cinema.screens).map((screen) => (
                  <div key={screen.id} className={styles.screenRow}>
                    <div className={styles.screenMeta}>
                      <span className={styles.screenTitle}>
                        {screen.format}
                      </span>
                      <div className={styles.metaRow}>
                        <span>🔊</span>
                        {screen.language}
                      </div>
                      <div className={styles.techRow}>
                        {screen.tech.map((tag, i) => (
                          <span key={i} className={styles.badge}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Inside the timeGrid */}
                    <div className={styles.timeGrid}>
                      {screen.times.map((t, i) => (
                        <Link
                          key={t.id}
                          href={`/movies/${movie.id}/booking/${t.id}`}
                          className={
                            i === 0 ? styles.btnPrimary : styles.btnSecondary
                          }
                        >
                          {formatTime(t.time)}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
