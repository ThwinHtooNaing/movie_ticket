// app/api/bookings/route.js
import { NextResponse } from "next/server";
import { mysqlPool as pool } from "@/utils/db";

export async function POST(request) {
  try {
    const {
      user_id = null,
      showtime_id,
      selected_seats = [],
      guest_name = null,
      guest_email = null,
      guest_phone = null,
    } = await request.json();

    // Validation
    if (!showtime_id || !selected_seats.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Guest validation (only if not logged in)
    if (!user_id && (!guest_email || !guest_phone)) {
      return NextResponse.json(
        { error: "Email and phone number are required for guest booking" },
        { status: 400 },
      );
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const bookingId = BigInt(Date.now()) * 10000n + BigInt(Math.floor(Math.random() * 10000));

      // Calculate total amount
      let totalAmount = 0;
      const seatReservations = [];

      for (const seat of selected_seats) {
        const [priceRows] = await connection.query(
          `SELECT price FROM showtime_pricing 
           WHERE showtime_id = ? AND seat_class = ?`,
          [showtime_id, seat.seat_class],
          
        );

        const price = parseFloat(priceRows[0]?.price) || 0;
        totalAmount += price;
        const seatReservationId =
          BigInt(Date.now()) * 100000n +
          BigInt(Math.floor(Math.random() * 100000));

        seatReservations.push({
          id: seatReservationId,
          seat_id: seat.id,
          price_paid: price,
        });
      }

      // Create Booking
      const [bookingResult] = await connection.query(
        `INSERT INTO bookings 
         (id,user_id, showtime_id, total_amount, status, guest_name, guest_email, guest_phone) 
         VALUES (?,?, ?, ?, 'confirmed', ?, ?, ?)`,
        [
          bookingId,
          user_id,
          showtime_id,
          totalAmount,
          guest_name,
          guest_email,
          guest_phone,
        ],
      );


      // Create Seat Reservations
      for (const res of seatReservations) {
        await connection.query(
          `INSERT INTO seat_reservations 
           (id, booking_id, showtime_id, seat_id, price_paid) 
           VALUES (?, ?, ?, ?, ?)`,
          [res.id,bookingId, showtime_id, res.seat_id, res.price_paid],
        );
      }

      // Create Payment Record
      await connection.query(
        `INSERT INTO payments (booking_id, amount, status, paid_at) 
         VALUES (?, ?, 'completed', NOW())`,
        [bookingId, totalAmount],
      );

      await connection.commit();

      return NextResponse.json({
        success: true,
        booking_id: bookingId.toString(),
        total_amount: totalAmount,
        message: "Booking confirmed successfully",
      });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Booking API Error:", error);
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 },
    );
  }
}
