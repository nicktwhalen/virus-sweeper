import { useEffect, useState } from "react";
import { Board } from "./components/Board/Board";
import type { CellState, GameConfig } from "./types/game";
import { GameStatus } from "./types/game";
import {
  addBombsExcluding,
  initializeBoard,
  isWinGame,
  revealAllBombs,
  revealCell,
} from "./utils/utils";

const gameConfig: GameConfig = { rows: 9, columns: 9, bombs: 10 };

function App() {
  const [cells, setCells] = useState<CellState[][]>(
    initializeBoard(gameConfig),
  );
  const [timer, setTimer] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>(
    GameStatus.NOT_STARTED,
  );

  const remainingBombs =
    gameConfig.bombs - cells.flat().filter((cell) => cell.isFlagged).length;

  const isGameOver =
    gameStatus === GameStatus.WON || gameStatus === GameStatus.LOST;

  useEffect(() => {
    if (gameStatus === GameStatus.PLAYING) {
      const intervalId = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [gameStatus]);

  function getCellsClone(): CellState[][] {
    return cells.map((rowOfCells) =>
      rowOfCells.map((cellState) => ({ ...cellState })),
    );
  }

  function handleCellClick(row: number, column: number) {
    if (isGameOver) {
      return;
    }

    const cell = cells[row][column];
    if (cell.isRevealed || cell.isFlagged) {
      return;
    }

    const updated = getCellsClone();

    if (gameStatus === GameStatus.NOT_STARTED) {
      setGameStatus(GameStatus.PLAYING);
      addBombsExcluding(updated, gameConfig.bombs, row, column);
    }

    if (updated[row][column].isBomb) {
      console.log("you clicked a bomb. game over.");
      revealAllBombs(updated);
      setGameStatus(GameStatus.LOST);
    } else {
      revealCell(updated, row, column);
      if (isWinGame(updated)) {
        console.log("you win! game over.");
        setGameStatus(GameStatus.WON);
      }
    }
    setCells(updated);
  }

  function handleCellLongPress(row: number, column: number) {
    if (isGameOver) {
      return;
    }

    const cell = cells[row][column];
    if (cell.isRevealed || (!cell.isFlagged && remainingBombs === 0)) {
      return;
    }

    const updated = getCellsClone();
    updated[row][column].isFlagged = !updated[row][column].isFlagged;
    setCells(updated);
  }

  return (
    <>
      <h1>Virus Sweeper</h1>
      <div className="stats">
        <div>Viruses Remaining: {remainingBombs}</div>
        <div>Timer: {timer}</div>
      </div>
      <Board
        cells={cells}
        onCellClick={handleCellClick}
        onCellLongPress={handleCellLongPress}
      />
    </>
  );
}

export default App;
