"use client";
"/app/bookings/success/page.js"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { generateTicketPDF } from "@/utils/generateTicketPDF";
import styles from "./SuccessPage.module.css";

export default function SuccessPage() {
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("currentBooking");
    if (saved) {
      const data = JSON.parse(saved);
      setBooking(data.booking);
      setSelectedSeats(data.selectedSeats || []);
      
    } else {
      router.push("/movies");
    }
  }, [router]);

  const bookingId = `CN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  const handleDownloadPDF = async () => {
    if (!booking) return;
    await generateTicketPDF(booking, selectedSeats, bookingId);
  };

  const handleBackHome = () => {
    localStorage.removeItem("currentBooking");
    router.push("/movies");
  };

  if (!booking) {
    return <div className={styles.loading}>Loading confirmation...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.successIcon}>✓</div>

        <h1 className={styles.title}>Your booking is confirmed!</h1>
        <p className={styles.subtitle}>
          Your cinematic journey awaits. We&apos;ve sent a digital copy and
          receipt to your registered email.
        </p>

        <div className={styles.ticketCard}>
          <div className={styles.movieInfo}>
            <img
              src={booking.poster_url || "/placeholder-poster.jpg"}
              alt={booking.movieTitle}
              width={200}
              height={280}
              className={styles.poster}
            />
            <span className={styles.movieTitle}>{booking.movieTitle}</span>
          </div>

          <div className={styles.bookingDetails}>
            <div className={styles.row}>
              <span className={styles.legends}>DATE</span>
              <span>{booking.date}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.legends}>TIME</span>
              <span>{booking.time}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.legends}>THEATER</span>
              <span>{booking.cinema}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.legends}>SEATS</span>
              <span>
                {selectedSeats
                  .map((s) => `${s.row_label}${s.seat_number}`)
                  .join(", ")}
              </span>
            </div>
          </div>

          {/* QR Code */}
          <div className={styles.qrSection}>
            <div className={styles.qrContainer}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${bookingId}`}
                alt="Booking QR Code"
              />
            </div>
            <p className={styles.scanText}>
              PRESENT AT CINEMA ENTRANCE FOR SCANNING
            </p>
            <p className={styles.transactionId}>
              TRANSACTION ID
              <br />
              <strong>{bookingId}</strong>
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={handleDownloadPDF} className={styles.downloadBtn}>
            Download PDF Ticket
          </button>
          <button onClick={handleBackHome} className={styles.homeBtn}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
