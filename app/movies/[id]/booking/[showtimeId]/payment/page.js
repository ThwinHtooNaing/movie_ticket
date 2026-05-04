// app/movies/[id]/booking/[showtimeId]/payment/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProgressStepper from "@/components/movie/ProgressStepper";
import styles from "./PaymentPage.module.css";
import Toast from "@/components/ui/Toast";

export default function PaymentPage() {
  const { id: movieId, showtimeId } = useParams();
  const router = useRouter();

  const [bookingData, setBookingData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [paymentMethod, setPaymentMethod] = useState("qr");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [showQR, setShowQR] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);


  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    const saved = localStorage.getItem("currentBooking");
    if (saved) {
      const data = JSON.parse(saved);
      setBookingData(data.booking);
      setSelectedSeats(data.selectedSeats || []);
    } else {
      router.push(`/movies/${movieId}`);
    }
  }, [movieId, router]);

  useEffect(() => {
    if (timeLeft <= 0) {
      localStorage.removeItem("currentBooking");
      alert("Session expired. Please try again.");
      router.push(`/movies/${movieId}`);
      return;
    }

    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, movieId, router]);

  const totalPrice = selectedSeats.reduce((sum, seat) => {
    return sum + (parseFloat(seat.price) || 0);
  }, 0);


  const submitBooking = async (isFromQR = false) => {
    if (!formData.email || !formData.phone) {
      alert("Please fill in Email and Phone Number");
      return;
    }

    setIsProcessing(true);

    try {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const currentUserId = isLoggedIn ? localStorage.getItem("userId") : null;

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUserId ? currentUserId : null,
          showtime_id: showtimeId,
          selected_seats: selectedSeats,
          guest_email: formData.email,
          guest_phone: formData.phone,
          guest_name: formData.name || null,
        }),
      });

      const result = await res.json();

      if (result.success) {

        if (isFromQR) {
          
          setTimeout(() => {
            setShowQR(false);
            router.push(`/bookings/success?bookingId=${result.booking_id}`);
          }, 3000);
          return
        }

        router.push(`/bookings/success?bookingId=${result.booking_id}`);
      } else {
        setShowQR(false);
        alert("Payment failed: " + result.error);
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (!formData.cardNumber || !formData.expiry || !formData.cvv) {
      alert("Please fill in all card details");
      return;
    }
    submitBooking(false);
  };

  const generateQR = () => {
    if (!formData.email || !formData.phone) {
      alert("Please fill in Email and Phone Number");
      return;
    }
    setShowQR(true);
    submitBooking(true);
    
  };

  const handleCancel = () => {
    if (confirm("Cancel booking? All progress will be lost.")) {
      localStorage.removeItem("currentBooking");
      router.push("/movies");
    }
  };

  if (!bookingData)
    return <div className={styles.loading}>Loading checkout...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <ProgressStepper currentStep={3} />

        <div className={styles.main}>
          {/* Left - Order Summary (your original) */}
          <div className={styles.orderSummary}>
            <div className={styles.movieCard}>
              <img
                src={bookingData.poster_url || "/placeholder.jpg"}
                alt={bookingData.movieTitle}
                className={styles.poster}
              />
              <div>
                <h2 className={styles.movieTitle}>{bookingData.movieTitle}</h2>
                <div className={styles.timer}>
                  Session ends in{" "}
                  <span className={styles.time}>
                    {Math.floor(timeLeft / 60)}:
                    {(timeLeft % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.details}>
              <div className={styles.row}>
                <span>Date</span>
                <span>{bookingData.date}</span>
              </div>
              <div className={styles.row}>
                <span>Time</span>
                <span>{bookingData.time}</span>
              </div>
              <div className={styles.row}>
                <span>Seats</span>
                <span>
                  {selectedSeats
                    .map((s) => `${s.row_label}${s.seat_number}`)
                    .join(", ")}
                </span>
              </div>
              <div className={styles.row}>
                <span>Location</span>
                <span>{bookingData.cinema}</span>
              </div>
            </div>

            <div className={styles.pricing}>
              <h3>Pricing Breakdown</h3>
              <div className={styles.breakdown}>
                <div className={styles.line}>
                  <span>Tickets (x{selectedSeats.length})</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className={styles.total}>
                <span>Total Amount</span>
                <span className={styles.totalAmount}>
                  ${totalPrice.toFixed(2)} THB
                </span>
              </div>
            </div>
          </div>

          {/* Right - Payment (your original + QR) */}
          <div className={styles.paymentSection}>
            <h2>Payment Method</h2>
            <p className={styles.subtitle}>Secure your booking now.</p>

            {/* Thai QR Payment */}
            <div
              className={`${styles.paymentOption} ${paymentMethod === "qr" ? styles.active : ""}`}
              onClick={() => setPaymentMethod("qr")}
            >
              <div>📱</div>
              <div>
                <strong>Thai QR Payment (PromptPay)</strong>
                <p>Scan with your banking app</p>
              </div>
            </div>

            {/* Credit Card */}
            <div
              className={`${styles.paymentOption} ${paymentMethod === "card" ? styles.active : ""}`}
              onClick={() => setPaymentMethod("card")}
            >
              <div>💳</div>
              <div>
                <strong>Credit / Debit Card</strong>
                <p>Visa, Mastercard, JCB</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className={styles.contactInfo}>
              <h3>Contact Information</h3>
              <input
                type="email"
                name="email"
                placeholder="Email address *"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone number *"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>

            {/* Card Details - your original */}
            {paymentMethod === "card" && (
              <div className={styles.cardDetails}>
                <h4>Card Information</h4>

                <div className={styles.inputGroup}>
                  <label>Card Number</label>
                  <input
                    type="text"
                    maxLength="19"
                    value={formData.cardNumber || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      const formatted = value.replace(/(\d{4})(?=\d)/g, "$1-");
                      setFormData({ ...formData, cardNumber: formatted });
                    }}
                    placeholder="1234 5678 9012 3456"
                    className={styles.cardInput}
                  />
                </div>

                <div className={styles.rowInputs}>
                  <div className={styles.inputGroup}>
                    <label>Expiry Date (MM/YY)</label>
                    <input
                      type="text"
                      maxLength="5"
                      value={formData.expiry || ""}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length > 2) {
                          value = value.slice(0, 2) + "/" + value.slice(2, 4);
                        }
                        setFormData({ ...formData, expiry: value });
                      }}
                      placeholder="12/28"
                      className={styles.expiryInput}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>CVV / Security Code</label>
                    <input
                      type="text"
                      maxLength="4"
                      value={formData.cvv || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cvv: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      placeholder="123"
                      className={styles.cvvInput}
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={paymentMethod === "qr" ? generateQR : handlePayment}
              className={styles.payButton}
              disabled={isProcessing}
            >
              {isProcessing
                ? "Processing..."
                : paymentMethod === "qr"
                  ? "Generate Thai QR Code"
                  : "Pay Now Securely"}
            </button>

            <button onClick={handleCancel} className={styles.cancelBtn}>
              Cancel Booking
            </button>
          </div>
        </div>

        {/* Thai QR Overlay */}
        {showQR && (
          <div className={styles.qrOverlay}>
            <div className={styles.qrModal}>
              <h3>Scan to Pay with Thai QR</h3>
              <p className={styles.qrAmount}>฿{totalPrice.toFixed(2)}</p>

              <div className={styles.qrCode}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=THAIQR|PAY|${totalPrice}|CINEMANOIR|${showtimeId}`}
                  alt="Thai QR Code"
                />
              </div>

              <p className={styles.qrInstruction}>
                Open your banking app and scan this QR code
              </p>
              <p className={styles.qrTimer}>
                Expires in {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </p>

              <button
                onClick={() => setShowQR(false)}
                className={styles.closeQr}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
