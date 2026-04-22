import { NextResponse } from "next/server";
import { mysqlPool as pool } from "@/utils/db";

export async function GET(request, { params }) {
    const {id} = await params;
    try {

        if (!id) {
        return NextResponse.json(
            { error: "movieId is required" },
            { status: 400 }
        );
        }

        const [rows] = await pool.query(
        `
        SELECT 
            c.id AS cinema_id,
            c.name AS cinema_name,
            c.district,
            c.logo_url,
            c.cover_url,
            m.language,

            s.id AS screen_id,
            s.name AS screen_name,

            st.id AS showtime_id,
            st.start_time,
            st.end_time,
            st.status

        FROM showtimes st
        JOIN screens s ON st.screen_id = s.id
        JOIN cinemas c ON s.cinema_id = c.id
        JOIN movies m ON st.movie_id = m.id

        WHERE st.movie_id = ?
        AND st.status = 'scheduled'

        ORDER BY c.name, s.name, st.start_time
        `,
        [id]
        );

        return NextResponse.json(rows);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
        );
    }
}
