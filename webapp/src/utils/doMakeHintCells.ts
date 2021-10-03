import { CellType, ICell, IGameData, IHintCell } from 'store/gameSlice';

function doMakeHintCells(puzzle: IGameData) {
  const { cells } = puzzle;

  // no hint cells in last cell
  for (let index = 0; index < cells.length - 1; index++) {
    const cell: ICell = cells[index];
    const nextColumn = index + 1;
    const nextRow = index + puzzle.columnCount;

    if (cell.type === CellType.BlankCell) {
      if (cells[nextColumn].type === CellType.NumberCell) {
        cell.type = CellType.HintCell;
        (cell as IHintCell).hintHorizontal = -1;
      }

      if (
        nextRow < cells.length &&
        cells[nextRow].type === CellType.NumberCell
      ) {
        cell.type = CellType.HintCell;
        (cell as IHintCell).hintVertical = -1;
      }
    } else if (cell.type === CellType.HintCell) {
      // check if hint cell is no longer a hint cell
      if (
        cells[nextColumn].type !== CellType.NumberCell &&
        cells[nextRow].type !== CellType.NumberCell
      ) {
        cell.type = CellType.BlankCell;
      }
    }
  }
}

export default doMakeHintCells;
