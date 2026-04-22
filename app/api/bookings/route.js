// app/api/bookings/route.js
import { NextResponse } from "next/server";
import { mysqlPool as pool } from "@/utils/db";

export async function POST(request) {
  try {
    const { user_id, showtime_id, selected_seats } = await request.json();

    if (!showtime_id || !selected_seats?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      let totalAmount = 0;
      const seatReservations = [];

      for (const seat of selected_seats) {
        const [priceRows] = await connection.query(
          `SELECT price FROM showtime_pricing 
           WHERE showtime_id = ? AND seat_class = ?`,
          [showtime_id, seat.seat_class],
        );

        const price = priceRows[0]?.price || 0;
        totalAmount += price;

        seatReservations.push({
          seat_id: seat.id,
          price_paid: price,
        });
      }

      const [bookingResult] = await connection.query(
        `INSERT INTO bookings (user_id, showtime_id, total_amount, status) 
         VALUES (?, ?, ?, 'pending')`,
        [user_id, showtime_id, totalAmount],
      );

      const bookingId = bookingResult.insertId;

      for (const res of seatReservations) {
        await connection.query(
          `INSERT INTO seat_reservations (booking_id, showtime_id, seat_id, price_paid) 
           VALUES (?, ?, ?, ?)`,
          [bookingId, showtime_id, res.seat_id, res.price_paid],
        );
      }

      await connection.commit();

      return NextResponse.json({
        success: true,
        booking_id: bookingId,
        total_amount: totalAmount,
        message: "Booking created successfully",
      });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 },
    );
  }
}
