import { type BoardProps } from "../../types/game";
import { Cell } from "../Cell/Cell";
import styles from "./Board.module.css";

export function Board({ cells, onCellClick, onCellLongPress }: BoardProps) {
  const columns = cells[0]?.length || 0;

  return (
    <div
      className={styles.board}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
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
