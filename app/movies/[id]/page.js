// app/movies/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MovieHero from "@/components/movie/MovieHero";
import TabSwitcher from "@/components/movie/TabSwitcher";
import InformationTab from "@/components/movie/InformationTab";
import ShowtimesTab from "@/components/movie/ShowtimesTab";
import ReviewsTab from "@/components/movie/ReviewsTab";
import styles from "./MovieDetail.module.css";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("information");

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(`/api/movies/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Movie not found");
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [id]);

  if (loading)
    return <div className={styles.loading}>Loading movie details...</div>;
  if (!movie) return <div className={styles.error}>Movie not found</div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <MovieHero movie={movie} />
        <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className={styles.tabContent}>
          {activeTab === "information" && <InformationTab movie={movie} />}
          {activeTab === "showtimes" && <ShowtimesTab movie={movie} />}
          {activeTab === "reviews" && <ReviewsTab movieId={id} />}
        </div>
      </div>
    </div>
  );
}
