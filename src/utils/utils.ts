import type { CellState, GameConfig } from "../types/game";

const NEIGHBORS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const;

export function initializeBoard(gameConfig: GameConfig): CellState[][] {
  return Array.from({ length: gameConfig.rows }, () => {
    return Array.from({ length: gameConfig.columns }, () => ({
      isBomb: false,
      adjacentBombs: 0,
      isRevealed: false,
      isFlagged: false,
    }));
  });
}

export function addBombsExcluding(
  cells: CellState[][],
  bombs: number,
  excludeRow: number,
  excludeColumn: number,
) {
  if (bombs < 0 || bombs >= cells.length * cells[0].length) {
    throw new Error(
      `invalid inputs: ${bombs} bombs for ${cells.length} rows and ${cells[0].length} columns`,
    );
  }

  const rows = cells.length;
  const columns = cells[0].length;
  let remainingBombs = bombs;
  while (remainingBombs > 0) {
    const row = Math.floor(Math.random() * rows);
    const column = Math.floor(Math.random() * columns);
    if (
      !cells[row][column].isBomb &&
      !(row === excludeRow && column === excludeColumn)
    ) {
      cells[row][column].isBomb = true;
      remainingBombs--;
    }
  }

  calculateAdjacentBombs(cells);
}

function isValidCell(
  cells: CellState[][],
  row: number,
  column: number,
): boolean {
  return (
    row >= 0 && row < cells.length && column >= 0 && column < cells[0].length
  );
}

function calculateAdjacentBombs(cells: CellState[][]) {
  for (let row = 0; row < cells.length; row++) {
    for (let column = 0; column < cells[0].length; column++) {
      if (cells[row][column].isBomb) {
        NEIGHBORS.forEach(([y, x]) => {
          const neighborRow = row + y;
          const neighborColumn = column + x;
          if (
            isValidCell(cells, neighborRow, neighborColumn) &&
            !cells[neighborRow][neighborColumn].isBomb
          ) {
            cells[neighborRow][neighborColumn].adjacentBombs++;
          }
        });
      }
    }
  }
}

export function revealCell(cells: CellState[][], row: number, column: number) {
  const cell = cells[row][column];
  if (cell.isRevealed || cell.isBomb || cell.isFlagged) {
    return;
  }
  cell.isRevealed = true;
  if (cell.adjacentBombs === 0) {
    NEIGHBORS.forEach(([y, x]) => {
      const neighborRow = row + y;
      const neighborColumn = column + x;
      if (isValidCell(cells, neighborRow, neighborColumn)) {
        revealCell(cells, neighborRow, neighborColumn);
      }
    });
  }
}

export function revealAllBombs(cells: CellState[][]): void {
  cells.forEach((row) => {
    row.forEach((cell) => {
      if (cell.isBomb) {
        cell.isRevealed = true;
      }
    });
  });
}

export function isWinGame(cells: CellState[][]): boolean {
  return cells.every((row) =>
    row.every((cell) => cell.isBomb || cell.isRevealed),
  );
}
