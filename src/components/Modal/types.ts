import type { ReactNode } from "react";
import type { GameStatus } from "../../types/game";

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
