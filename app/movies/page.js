import MoviesSection from "@/components/MoviesSection";
import styles from "./MoviesPage.module.css";

export default async function MoviesPage() {

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>All Movies</h1>
        <p className={styles.subtitle}>
          Explore the latest cinematic masterpieces.
        </p>
      </div>

      {/* Reusable component */}
      <MoviesSection initialData={null} />
    </div>
  );
}
