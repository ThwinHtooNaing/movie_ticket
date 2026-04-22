import styles from "./ProgressStepper.module.css";

export default function ProgressStepper({ currentStep = 2 }) {
  const steps = ["MOVIE", "SEATS", "PAYMENT"];

  return (
    <div className={styles.stepper}>
      {steps.map((step, i) => (
        <div key={step} className={styles.step}>
          <div
            className={`${styles.circle} ${i + 1 <= currentStep ? styles.active : ""}`}
          >
            {i + 1}
          </div>
          <span className={styles.label}>{step}</span>
          {i < steps.length - 1 && (
            <div
              className={`${styles.line} ${i < currentStep - 1 ? styles.lineYellow : ""}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
