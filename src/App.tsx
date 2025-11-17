import { useEffect, useState } from "react";
import { Board } from "./components/Board/Board";
import { GameDifficulty, type CellState } from "./types/game";
import { GameStatus } from "./types/game";
import {
  addBombsExcluding,
  initializeBoard,
  isWinGame,
  revealAllBombs,
  revealCell,
} from "./utils/utils";
import { GameOverModal } from "./components/Modal/GameOverModal";
import { SettingsModal } from "./components/Modal/SettingsModal";

function getGameConfig(difficulty: GameDifficulty) {
  if (difficulty === GameDifficulty.BEGINNER) {
    return { rows: 9, columns: 9, bombs: 10 };
  } else if (difficulty === GameDifficulty.INTERMEDIATE) {
    return { rows: 16, columns: 16, bombs: 40 };
  } else {
    return { rows: 16, columns: 30, bombs: 99 };
  }
}

function App() {
  const [difficulty, setDifficulty] = useState(GameDifficulty.BEGINNER);
  const gameConfig = getGameConfig(difficulty);
  const [cells, setCells] = useState<CellState[][]>(
    initializeBoard(gameConfig),
  );
  const [timer, setTimer] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>(
    GameStatus.NOT_STARTED,
  );
  const [showSettings, setShowSettings] = useState(false);

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

  useEffect(() => {
    if (localStorage.getItem("virus-sweeper-first-visit") === null) {
      setShowSettings(true);
      localStorage.setItem("virus-sweeper-first-visit", "true");
    }
  }, []);

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
      revealAllBombs(updated);
      setGameStatus(GameStatus.LOST);
    } else {
      revealCell(updated, row, column);
      if (isWinGame(updated)) {
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

  function handleRestart(difficulty?: GameDifficulty) {
    if (difficulty) {
      setCells(initializeBoard(getGameConfig(difficulty)));
    } else {
      setCells(initializeBoard(gameConfig));
    }
    setTimer(0);
    setGameStatus(GameStatus.NOT_STARTED);
  }

  function handleDifficultyChange(newDifficulty: GameDifficulty) {
    if (newDifficulty !== difficulty) {
      setDifficulty(newDifficulty);
      handleRestart(newDifficulty);
    }
    setShowSettings(false);
  }

  return (
    <>
      <h1>Virus Sweeper</h1>
      <div className="game-container">
        <div className="status-bar">
          <div className="status-item">
            <div className="icon">🦠 {remainingBombs}</div>
            <div className="label">Viruses</div>
          </div>
          <div className="status-item">
            <div className="icon">⏱️ {timer}</div>
            <div className="label">Timer</div>
          </div>
          <button
            className="status-item clickable"
            onClick={() => handleRestart()}
          >
            <div className="icon">🔄</div>
            <div className="label">Restart</div>
          </button>
          <button
            className="status-item clickable"
            onClick={() => setShowSettings(true)}
          >
            <div className="icon">⚙️</div>
            <div className="label">Menu</div>
          </button>
        </div>
        <Board
          cells={cells}
          onCellClick={handleCellClick}
          onCellLongPress={handleCellLongPress}
        />
      </div>
      <GameOverModal
        isOpen={isGameOver}
        gameStatus={gameStatus}
        timer={timer}
        onClose={() => handleRestart()}
      />
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
      />
    </>
  );
}

export default App;
