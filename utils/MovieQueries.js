import { mysqlPool as pool } from "./db.js";

export async function getMovieById(movieId) {
  try {
      const [movieRows] = await pool.execute(
        `SELECT 
        m.id, 
        m.title, 
        m.duration, 
        m.language, 
        DATE_FORMAT(m.release_date, '%Y-%m-%d') as release_date,
        m.poster_url, 
        m.genre,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.id) as total_reviews
      FROM movies m
      LEFT JOIN movie_reviews r ON r.movie_id = m.id
      WHERE m.id = ?
      GROUP BY m.id`,
        [movieId],
      );

    if (movieRows.length === 0) return null;

    const movie = movieRows[0];

    // 2. Get Cast
    const [castRows] = await pool.execute(
      `SELECT 
         p.name,
         p.photo_url,
         mc.role,
         mc.character_name
       FROM movie_cast mc
       JOIN people p ON p.id = mc.person_id
       WHERE mc.movie_id = ?
       ORDER BY mc.role`,
      [movieId],
    );

    // 3. Get Crew
    const [crewRows] = await pool.execute(
      `SELECT 
         p.name,
         p.photo_url,
         mc.role
       FROM movie_crew mc
       JOIN people p ON p.id = mc.person_id
       WHERE mc.movie_id = ?
       ORDER BY mc.role`,
      [movieId],
    );

    // Return clean JSON object
    return {
      id: movie.id,
      title: movie.title,
      duration: movie.duration,
      language: movie.language,
      release_date: movie.release_date,
      poster_url: movie.poster_url,
      genre: movie.genre,
      avg_rating: Number(movie.avg_rating),
      total_reviews: Number(movie.total_reviews),
      cast: castRows,
      crew: crewRows,
    };
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw new Error("Failed to fetch movie");
  }
}
