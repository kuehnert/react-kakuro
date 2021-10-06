import { CellType, ICell, IGameData, IHintCell } from 'store/gameSlice';
import { getColumnForCell, getRowForCell } from './pencilmarks';

export function doCountMissingHints(puzzle: IGameData) {
  const reducer = (prev: number, curr: ICell) => {
    if (curr.type !== CellType.HintCell) {
      return prev;
    } else {
      const hCell = curr as IHintCell;
      return (
        prev +
        (hCell.hintHorizontal === -1 ? 1 : 0) +
        (hCell.hintVertical === -1 ? 1 : 0)
      );
    }
  };

  return puzzle.cells.reduce(reducer, 0);
}

export function doMakeHintCells(puzzle: IGameData) {
  const { cells } = puzzle;
  let hintCount = 0;

  // no hint cells in last cell
  for (let index = 0; index < cells.length - 1; index++) {
    const cell: ICell = cells[index];
    const nextColumn = index + 1;
    const nextRow = index + puzzle.columnCount;

    if (cell.type === CellType.BlankCell) {
      if (cells[nextColumn].type === CellType.NumberCell) {
        cell.type = CellType.HintCell;
        (cell as IHintCell).hintHorizontal = -1;
        hintCount += 1;
      }

      if (
        nextRow < cells.length &&
        cells[nextRow].type === CellType.NumberCell
      ) {
        cell.type = CellType.HintCell;
        (cell as IHintCell).hintVertical = -1;
        hintCount += 1;
      }
    } else if (cell.type === CellType.HintCell) {
      const hCell = cell as IHintCell;
      let isHint = false;

      if (cells[nextColumn].type === CellType.NumberCell) {
        if (hCell.hintHorizontal === -1) {
          hintCount += 1;
        }

        isHint = true;
      }

      if (
        nextRow < cells.length &&
        cells[nextRow].type === CellType.NumberCell
      ) {
        if (hCell.hintVertical === -1) {
          hintCount += 1;
        }

        isHint = true;
      }

      // check if hint cell is no longer a hint cell
      if (!isHint) {
        cell.type = CellType.BlankCell;
      }
    }
  }

  puzzle.hintCount = hintCount;
  // console.log('puzzle:', JSON.stringify(puzzle));
}

export function doFillHintsFromSolution(puzzle: IGameData) {
  const { cells } = puzzle;

  cells
    .filter(c => c.type === CellType.HintCell)
    .forEach(c => {
      const hintCell = c as IHintCell;

      if (hintCell.hintHorizontal === -1) {
        const rowGroup = getRowForCell(puzzle, hintCell.index + 1);
        hintCell.hintHorizontal = rowGroup.sumSolved;
      }

      if (hintCell.hintVertical === -1) {
        const columnGroup = getColumnForCell(
          puzzle,
          hintCell.index + puzzle.columnCount
        );
        hintCell.hintVertical = columnGroup.sumSolved;
      }
    });
}
