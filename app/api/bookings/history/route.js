// app/api/bookings/history/route.js
import { NextResponse } from "next/server";
import { mysqlPool as pool } from "@/utils/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "user_id is required" }, { status: 400 });
  }

  const connection = await pool.getConnection();

  try {
    // ==================== UPCOMING ====================
    const [upcoming] = await connection.query(
      `
      SELECT 
        b.id AS id,
        m.title AS movie_title,
        m.poster_url,
        DATE_FORMAT(s.start_time, '%W, %b %e, %Y') AS date,
        DATE_FORMAT(s.start_time, '%h:%i %p') AS time,
        c.name AS cinema,
        sc.name AS hall,
        GROUP_CONCAT(CONCAT(se.row_label, se.seat_number) SEPARATOR ', ') AS seats,
        b.total_amount
      FROM bookings b
      JOIN showtimes s ON b.showtime_id = s.id
      JOIN movies m ON s.movie_id = m.id
      JOIN screens sc ON s.screen_id = sc.id
      JOIN cinemas c ON sc.cinema_id = c.id
      LEFT JOIN seat_reservations sr ON b.id = sr.booking_id
      LEFT JOIN seats se ON sr.seat_id = se.id
      WHERE b.user_id = ? 
        AND b.status = 'confirmed'
        AND s.start_time > NOW()
      GROUP BY b.id
      ORDER BY s.start_time ASC
      `,
      [userId],
    );

    const [past] = await connection.query(
      `
      SELECT 
        b.id AS id,
        m.title AS movie_title,
        m.poster_url,
        DATE_FORMAT(s.start_time, '%b %e, %Y') AS date,
        c.name AS cinema,
        GROUP_CONCAT(CONCAT(se.row_label, se.seat_number) SEPARATOR ', ') AS seats,
        b.total_amount AS total_spent
      FROM bookings b
      JOIN showtimes s ON b.showtime_id = s.id
      JOIN movies m ON s.movie_id = m.id
      JOIN screens sc ON s.screen_id = sc.id
      JOIN cinemas c ON sc.cinema_id = c.id
      LEFT JOIN seat_reservations sr ON b.id = sr.booking_id
      LEFT JOIN seats se ON sr.seat_id = se.id
      WHERE b.user_id = ? 
        AND b.status = 'confirmed'
        AND s.start_time < NOW()
      GROUP BY b.id
      ORDER BY s.start_time DESC
      LIMIT 15
      `,
      [userId],
    );

    return NextResponse.json({
      upcoming,
      past,
    });
  } catch (error) {
    console.error("Booking History Error:", error);
    return NextResponse.json(
      { error: "Failed to load booking history" },
      { status: 500 },
    );
  } finally {
    connection.release();
  }
}
