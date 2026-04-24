// app/bookings/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UpcomingBookingCard from "@/components/movie/UpcomingBookingCard";
import PastBookingRow from "@/components/movie/PastBookingRow";
import styles from "./BookingsPage.module.css";

export default function BookingsPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchBookings = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await fetch(`/api/bookings/history?user_id=${userId}`);
      const data = await res.json();

      setUpcomingBookings(data.upcoming || []);
      setPastBookings(data.past || []);
    } catch (error) {
      console.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading your bookings...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.notLoggedIn}>
            <h1>Booking History</h1>
            <p>Please log in to view your upcoming and past bookings.</p>
            <button
              onClick={() => router.push("/login")}
              className={styles.loginBtn}
            >
              Log In to View Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Booking History</h1>
          <p>Manage your upcoming and past cinema experiences</p>
        </div>

        {/* UPCOMING */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Upcoming</h2>
            {upcomingBookings.length > 0 && (
              <span className={styles.activeBadge}>
                {upcomingBookings.length} Tickets Active
              </span>
            )}
          </div>

          {upcomingBookings.length > 0 ? (
            <div className={styles.upcomingGrid}>
              {upcomingBookings.map((booking) => (
                <UpcomingBookingCard
                  key={booking.id}
                  booking={booking}
                  onViewTicket={() => router.push(`/bookings/${booking.id}`)}
                />
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>You have no upcoming bookings.</p>
          )}
        </div>

        {/* PAST */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Past Bookings</h2>
          </div>

          {pastBookings.length > 0 ? (
            <div className={styles.pastList}>
              {pastBookings.map((booking) => (
                <PastBookingRow
                  key={booking.id}
                  booking={booking}
                  onViewReceipt={() => alert("Receipt feature coming soon")}
                  onRebook={() => router.push(`/movies`)}
                />
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>No past bookings found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
