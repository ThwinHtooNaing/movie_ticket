import { NextResponse } from "next/server";
import { mysqlPool as db } from "@/utils/db";

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        r.id,
        r.movie_id,
        r.rating,
        r.review_text,
        r.created_at,
        COALESCE(u.name, 'Anonymous') AS user_name
      FROM movie_reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.movie_id = ? AND r.is_approved = TRUE
      ORDER BY r.created_at DESC
      `,
      [id],
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  const { id } =  await params;

  try {
    const body = await req.json();
    const { rating, review_text } = body;

    if (!rating || !review_text) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user_id = null;

    const [result] = await db.query(
      `
      INSERT INTO movie_reviews (movie_id, user_id, rating, review_text)
      VALUES (?, ?, ?, ?)
      `,
      [id, user_id, rating, review_text],
    );

    const [rows] = await db.query(
      `
      SELECT 
        r.id,
        r.movie_id,
        r.rating,
        r.review_text,
        r.created_at,
        'Anonymous' AS user_name
      FROM movie_reviews r
      WHERE r.id = ?
      `,
      [result.insertId],
    );

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error(err);

    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "You already reviewed this movie" },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
