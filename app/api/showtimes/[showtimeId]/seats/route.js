// app/api/showtimes/[showtimeId]/seats/route.js
import { NextResponse } from "next/server";
import { mysqlPool as pool } from "@/utils/db";

export async function GET(request, { params }) {
  const { showtimeId } = await params;

  if (!showtimeId) {
    return NextResponse.json(
      { error: "showtimeId is required" },
      { status: 400 },
    );
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        s.id,
        s.screen_id,
        s.row_label,
        s.seat_number,
        s.seat_class,
        COALESCE(sr.id, 0) as reservation_id,  -- 0 means available
        CASE 
          WHEN sr.id IS NOT NULL THEN 'reserved' 
          ELSE 'available' 
        END as status,
        sp.price
      FROM seats s
      JOIN screens scr ON s.screen_id = scr.id
      JOIN showtimes st ON scr.id = st.screen_id
      LEFT JOIN seat_reservations sr ON s.id = sr.seat_id AND sr.showtime_id = st.id
      LEFT JOIN showtime_pricing sp ON st.id = sp.showtime_id AND s.seat_class = sp.seat_class
      WHERE st.id = ?
      ORDER BY s.row_label, s.seat_number;
      `,
      [showtimeId],
    );
    
    // Also return showtime basic info
    const [showtimeRows] = await pool.query(
      `
      SELECT 
        st.id as showtime_id,
        st.start_time,
        c.name as cinema_name,
        scr.name as screen_name,
        m.title as movie_title
      FROM showtimes st
      JOIN screens scr ON st.screen_id = scr.id
      JOIN cinemas c ON scr.cinema_id = c.id
      JOIN movies m ON st.movie_id = m.id
      WHERE st.id = ?
      `,
      [showtimeId],
    );

    return NextResponse.json({
      showtime: showtimeRows[0],
      seats: rows,
    });
  } catch (error) {
    console.error("Seats API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
