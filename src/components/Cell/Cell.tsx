import { useRef } from "react";
import { type CellProps, type CellState } from "../../types/game";
import styles from "./Cell.module.css";

function getCellText({
  isBomb,
  adjacentBombs,
  isRevealed,
  isFlagged,
}: CellState) {
  if (isRevealed) {
    if (isBomb) {
      return "🦠";
    } else if (adjacentBombs > 0) {
      return adjacentBombs;
    } else {
      return "";
    }
  } else if (isFlagged) {
    return "💉";
  } else {
    return "🩸"; // + (isBomb ? "💣" : adjacentBombs);
  }
}

export function Cell({
  onCellClick,
  onCellLongPress,
  ...cellState
}: CellProps) {
  // Add these two refs (don't use them yet)
  const mouseDownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggered = useRef(false);

  const handlePressStart = () => {
    if (mouseDownTimerRef.current) {
      clearTimeout(mouseDownTimerRef.current);
    }
    longPressTriggered.current = false;
    mouseDownTimerRef.current = setTimeout(() => {
      longPressTriggered.current = true;
      onCellLongPress();
      mouseDownTimerRef.current = null;
    }, 500);
  };

  const handlePressEnd = () => {
    if (mouseDownTimerRef.current) {
      clearTimeout(mouseDownTimerRef.current);
      mouseDownTimerRef.current = null;
    }
  };

  const handleClick = () => {
    if (!longPressTriggered.current) {
      onCellClick();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handlePressStart();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handlePressEnd();
    handleClick();
  };

  return (
    <div
      className={styles.cell}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {getCellText(cellState)}
    </div>
  );
}
