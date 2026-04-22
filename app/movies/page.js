import MoviesSection from "@/components/MoviesSection";
import styles from "./MoviesPage.module.css";

export default async function MoviesPage() {
  const res = await fetch("http://localhost:3000/api/movies?page=1&limit=8", {
    next: { revalidate: 10 },
  });

  const data = await res.json();

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>All Movies</h1>
        <p className={styles.subtitle}>
          Explore the latest cinematic masterpieces.
        </p>
      </div>

      {/* Reusable component */}
      <MoviesSection initialData={data} />
    </div>
  );
}
