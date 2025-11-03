import { type BoardProps } from "../../types/game";
import { Cell } from "../Cell/Cell";
import styles from "./Board.module.css";

export function Board({ cells, onCellClick, onCellLongPress }: BoardProps) {
  return (
    <div
      className={styles.board}
      style={{ gridTemplateColumns: `repeat(${cells[0].length}, 1fr)` }}
    >
      {cells.map((rowOfCells, row) =>
        rowOfCells.map((cellState, column) => (
          <Cell
            key={`${row},${column}`}
            onCellClick={() => onCellClick(row, column)}
            onCellLongPress={() => onCellLongPress(row, column)}
            {...cellState}
          />
        )),
      )}
    </div>
  );
}
