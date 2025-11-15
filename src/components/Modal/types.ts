import type { ReactNode } from "react";
import type { GameDifficulty, GameStatus } from "../../types/game";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export interface GameOverProps {
  isOpen: boolean;
  onClose: () => void;
  gameStatus: GameStatus;
  timer: number;
}

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  difficulty: GameDifficulty;
  onDifficultyChange: (difficulty: GameDifficulty) => void;
}
