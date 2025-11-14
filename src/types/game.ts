export interface BoardProps {
  cells: CellState[][];
  onCellClick: (row: number, column: number) => void;
  onCellLongPress: (row: number, column: number) => void;
}

export interface CellState {
  isBomb: boolean;
  adjacentBombs: number;
  isRevealed: boolean;
  isFlagged: boolean;
}

export interface CellProps extends CellState {
  onCellClick: () => void;
  onCellLongPress: () => void;
}

export interface GameConfig {
  rows: number;
  columns: number;
  bombs: number;
}

export enum GameStatus {
  NOT_STARTED = "not-started",
  PLAYING = "playing",
  WON = "won",
  LOST = "lost",
}
