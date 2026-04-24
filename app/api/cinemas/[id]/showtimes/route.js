import { NextResponse } from "next/server";
import { mysqlPool as pool } from "@/utils/db";

export async function GET(request, { params }) {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    if (!id || !date) {
      return Response.json({ error: "Missing parameters" }, { status: 400 });
    }
    try {
      const [rows] = await pool.execute(
        `SELECT 
         m.id as movie_id,
         m.title,
         m.poster_url,
         m.genre,
         s.name as screen_name,
         st.id as showtime_id,
         TIME_FORMAT(st.start_time, '%H:%i') as start_time,
         'EN/TH' as language
       FROM showtimes st
       JOIN movies m ON st.movie_id = m.id
       JOIN screens s ON st.screen_id = s.id
       JOIN cinemas c ON s.cinema_id = c.id
       WHERE c.id = ? 
         AND DATE(st.start_time) = ?
       ORDER BY m.title, s.name, st.start_time`,
        [id, date],
      );

      // Group by movie → then by screen
      const moviesMap = {};

      rows.forEach((row) => {
        if (!moviesMap[row.movie_id]) {
          moviesMap[row.movie_id] = {
            id: row.movie_id,
            title: row.title,
            poster_url: row.poster_url,
            genre: row.genre,
            showtimes: [],
          };
        }

        let screen = moviesMap[row.movie_id].showtimes.find(
          (sc) => sc.screen_name === row.screen_name,
        );

        if (!screen) {
          screen = {
            screen_name: row.screen_name,
            language: row.language,
            format: row.format,
            times: [],
          };
          moviesMap[row.movie_id].showtimes.push(screen);
        }

        screen.times.push({
          time: row.start_time,
          showtime_id: row.showtime_id,
        });
      });

      return Response.json({ movies: Object.values(moviesMap) });
    } catch (error) {
      console.error("Database error:", error);
      return Response.json(
        { error: "Failed to fetch showtimes" },
        { status: 500 },
      );
    }
}