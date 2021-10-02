import { CellType, ICell, IGameData, IHintCell } from 'store/gameSlice';

function doMakeHintCells(puzzle: IGameData) {
  // no hint cells in last cell
  for (
    let index = 0;
    index < puzzle.cells.length - 1;
    index++
  ) {
    const cell: ICell = puzzle.cells[index];

    if (cell.type === CellType.BlankCell) {
      const nextColumn = index + 1;
      const nextRow = index + puzzle.columnCount;

      if (puzzle.cells[nextColumn].type === CellType.NumberCell) {
        cell.type = CellType.HintCell;
        (cell as IHintCell).hintHorizontal = -1;
      }

      if (
        nextRow < puzzle.cells.length &&
        puzzle.cells[nextRow].type === CellType.NumberCell
      ) {
        cell.type = CellType.HintCell;
        (cell as IHintCell).hintVertical = -1;
      }
    }
  }
}

export default doMakeHintCells;
