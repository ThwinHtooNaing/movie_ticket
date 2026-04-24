// app/api/hero/route.js
import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function GET() {
  try {
    const [rows] = await mysqlPool.execute(
      `SELECT 
         m.id,
         m.title,
         m.poster_url,
         m.genre,
         m.duration,
         COALESCE(AVG(r.rating), 8.5) as avg_rating
       FROM movies m
       LEFT JOIN movie_reviews r ON r.movie_id = m.id
       WHERE EXISTS (
         SELECT 1 FROM showtimes s 
         WHERE s.movie_id = m.id 
         AND s.start_time >= NOW()
       )
       GROUP BY m.id
       ORDER BY m.release_date DESC
       LIMIT 1`,
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "No movies currently showing" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      movie: rows[0],
    });
  } catch (error) {
    console.error("Hero API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch hero movie" },
      { status: 500 },
    );
  }
}
