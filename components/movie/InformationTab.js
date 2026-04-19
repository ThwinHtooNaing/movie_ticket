import styles from "./InformationTab.module.css";

export default function InformationTab({ movie }) {
  return (
    <div className={styles.information}>
      <h2 className={styles.sectionTitle}>Cast</h2>
      <div className={styles.castGrid}>
        {movie.cast.map((person, i) => (
          <div key={i} className={styles.castCard}>
            <div className={styles.photo}>
              {person.photo_url ? (
                <img src={person.photo_url} alt={person.name} />
              ) : (
                <div className={styles.placeholder}>👤</div>
              )}
            </div>
            <p className={styles.name}>{person.name}</p>
            <p className={styles.character}>{person.character_name}</p>
          </div>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Crew</h2>
      <div className={styles.crewList}>
        {movie.crew.map((person, i) => (
          <div key={i} className={styles.castCard}>
            <div className={styles.photo}>
              {person.photo_url ? (
                <img src={person.photo_url} alt={person.name} />
              ) : (
                <div className={styles.placeholder}>👤</div>
              )}
            </div>
            <p className={styles.name}>{person.name}</p>
            <p className={styles.role}>{person.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
