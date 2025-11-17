import { GameDifficulty } from "../../types/game";
import { Modal } from "./Modal";
import styles from "./SettingsModal.module.css";
import type { SettingsModalProps } from "./types";

export function SettingsModal({
  isOpen,
  onClose,
  difficulty,
  onDifficultyChange,
}: SettingsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <h2 className={styles.title}>Virus Sweeper</h2>
        <p className={styles.story}>
          Viruses 🦠 have entered the bloodstream 🩸. You are a B Cell trained
          to identify 💉 and tag infected cells before the infection spreads.
        </p>

        <div className={styles.section}>
          <h3 className={styles.subtitle}>How to Play</h3>
          <p className={styles.text}>Tap to reveal a cell.</p>
          <p className={styles.text}>Hold to tag a cell as infected.</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.subtitle}>Difficulty</h3>
          <div className={styles.options}>
            <button
              className={`${styles.option} ${difficulty === GameDifficulty.BEGINNER ? styles.active : ""}`}
              onClick={() => onDifficultyChange(GameDifficulty.BEGINNER)}
            >
              Beginner: 9×9 with 10 viruses
            </button>

            <button
              className={`${styles.option} ${difficulty === GameDifficulty.INTERMEDIATE ? styles.active : ""}`}
              onClick={() => onDifficultyChange(GameDifficulty.INTERMEDIATE)}
            >
              Intermediate: 16×16 with 40 viruses
            </button>

            <button
              className={`${styles.option} ${difficulty === GameDifficulty.EXPERT ? styles.active : ""}`}
              onClick={() => onDifficultyChange(GameDifficulty.EXPERT)}
            >
              Expert: 16×30 with 99 viruses
            </button>
          </div>
        </div>

        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}
