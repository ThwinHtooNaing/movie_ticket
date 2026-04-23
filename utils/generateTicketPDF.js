// utils/generateTicketPDF.js
import jsPDF from "jspdf";
import QRCode from "qrcode";

/**
 * Generates and downloads a professional PDF ticket
 * @param {Object} booking - Booking data from localStorage
 * @param {Array} selectedSeats - Array of selected seat objects
 * @param {string} bookingId - Unique booking ID
 */
export const generateTicketPDF = async (booking, selectedSeats, bookingId) => {
  if (!booking) {
    alert("No booking data available");
    return;
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Background
  doc.setFillColor(17, 17, 17);
  doc.rect(0, 0, 210, 297, "F");

  // Header - Cinema Noir
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(250, 204, 21); // Yellow
  doc.text("CINEMA NOIR", 105, 28, { align: "center" });

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("BOOKING CONFIRMATION", 105, 42, { align: "center" });

  // Movie Poster (left side)
  if (booking.poster_url) {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = booking.poster_url;

      await new Promise((resolve) => {
        img.onload = () => {
          doc.addImage(img, "JPEG", 20, 55, 55, 82);
          resolve();
        };
      });
    } catch (e) {
      console.warn("Poster failed to load in PDF");
    }
  }

  // Movie Title
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text(booking.movieTitle || "Movie Title", 85, 72);

  // Booking Details
  doc.setFontSize(12);
  doc.setTextColor(200, 200, 200);

  doc.text(`Date: ${booking.date || "N/A"}`, 85, 92);
  doc.text(`Time: ${booking.time || "N/A"}`, 85, 102);
  doc.text(`Cinema: ${booking.cinema || "N/A"}`, 85, 112);

  const seatsText = selectedSeats
    .map((s) => `${s.row_label}${s.seat_number}`)
    .join(", ");

  doc.text(`Seats: ${seatsText}`, 85, 122);

  // QR Code (centered)
  try {
    const qrDataUrl = await QRCode.toDataURL(bookingId, {
      width: 180,
      margin: 2,
    });
    doc.addImage(qrDataUrl, "PNG", 75, 145, 60, 60);
  } catch (err) {
    console.error("QR Code generation failed", err);
  }

  // Transaction ID
  doc.setFontSize(11);
  doc.setTextColor(180, 180, 180);
  doc.text("TRANSACTION ID", 105, 220, { align: "center" });

  doc.setFontSize(15);
  doc.setTextColor(250, 204, 21);
  doc.text(bookingId, 105, 230, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("Present this QR code at cinema entrance for scanning", 105, 245, {
    align: "center",
  });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("Thank you for choosing Cinema Noir", 105, 280, { align: "center" });

  // Save the PDF with proper filename
  const fileName = `CinemaNoir_${(booking.movieTitle || "Ticket").replace(/[^a-zA-Z0-9]/g, "_")}_${bookingId}.pdf`;
  doc.save(fileName);
};
