import styles from "./TabSwitcher.module.css";

export default function TabSwitcher({ activeTab, setActiveTab }) {
  return (
    <div className={styles.tabs}>
      <button
        className={`${styles.tab} ${activeTab === "information" ? styles.active : ""}`}
        onClick={() => setActiveTab("information")}
      >
        Information
      </button>
      <button
        className={`${styles.tab} ${activeTab === "showtimes" ? styles.active : ""}`}
        onClick={() => setActiveTab("showtimes")}
      >
        Showtimes
      </button>
      <button
        className={`${styles.tab} ${activeTab === "reviews" ? styles.active : ""}`}
        onClick={() => setActiveTab("reviews")}
      >
        Reviews
      </button>
    </div>
  );
}
