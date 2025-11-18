import { GameStatus } from "../../types/game";
import { Modal } from "./Modal";
import styles from "./GameOverModal.module.css";
import type { GameOverProps } from "./types";

export function GameOverModal({
  isOpen,
  onClose,
  gameStatus,
  timer,
}: GameOverProps) {
  const isWon = gameStatus === GameStatus.WON;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          {isWon ? "Viruses Contained!" : "Virus Outbreak!"}
        </h2>
        <div className={styles.emoji}>{isWon ? "🎉" : "🦠"}</div>
        <div>
          <p className={styles.message}>
            {isWon
              ? "Good job. You stopped the infection."
              : "You lose. Better luck next time."}
          </p>
          <p className={styles.message}>Timer: {timer} seconds.</p>
        </div>
        <button className="primary-button" onClick={onClose}>
          Play Again
        </button>
      </div>
    </Modal>
  );
}
