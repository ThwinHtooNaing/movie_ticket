"use client";

import { useState, useEffect, useRef } from "react";
import MovieCard from "./MovieCard";
import styles from "./MoviesSection.module.css";

export default function MoviesSection({
  initialData = null,
  initialGenre = null,
  title = null,
}) {
  const [movies, setMovies] = useState(initialData?.data || []);
  const [pagination, setPagination] = useState(
    initialData?.pagination || { total: 0, loaded: 0 },
  );
  const [limit, setLimit] = useState(8);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [loading, setLoading] = useState(false);

  const genres = ["Action", "Sci-Fi", "Drama", "Horror", "Crime"];

  const fetchMovies = async () => {
    setLoading(true);

    let url = `/api/movies?page=1&limit=${limit}`;
    if (selectedGenre) url += `&genre=${selectedGenre}`;

    try {
      const res = await fetch(url);
      const json = await res.json();

      setMovies(json.data ?? []);
      setPagination(json.pagination ?? { total: 0, loaded: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchMovies();
  }, [limit, selectedGenre]);

  const handleLoadMore = () => {
    setLimit((prev) => prev + 8);
  };

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    setLimit(8);
    // setMovies([]);
  };

  const isAllGenres = selectedGenre === null;

  return (
    <div className={styles.moviesSection}>
      {title && <h2 className={styles.title}>{title}</h2>}

      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.genres}>
          <button
            onClick={() => handleGenreClick(null)}
            className={`${styles.genreBtn} ${isAllGenres ? styles.active : ""}`}
          >
            All Genres
          </button>

          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreClick(genre)}
              className={`${styles.genreBtn} ${
                selectedGenre === genre ? styles.active : ""
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && <p className={styles.loading}>Loading movies...</p>}

      {/* Grid */}
      <div className={styles.moviesGrid}>
        {!loading &&
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>

      {/* Bottom */}

      {!loading && movies && movies.length === 0 && (
        <p className={styles.noResults}>No movies found for this genre.</p>
      )}

      {!loading && pagination.total > 0 && (
        <div className={styles.bottomSection}>
          <div className={styles.paginationText}>
            <span>Showing</span>
            <span className={styles.highlight}>
              {pagination.loaded} of {pagination.total}
            </span>
            <span>Premiers</span>
          </div>

          <div className={styles.divider}></div>

          {pagination.loaded < pagination.total ? (
            <button className={styles.loadMore} onClick={handleLoadMore}>
              Load More Titles
            </button>
          ) : (
            <p className={styles.endText}>You’ve reached the end of list</p>
          )}
        </div>
      )}
    </div>
  );
}
