import { CellType, ICell, IGameData, IHint, IHintCell } from 'store/gameSlice';
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

const makeHints: IHint[] = (across: boolean, down: bolean) => {
  const hints = [null, null];
  if (across) {
    hints[0] = {
      sum: -1,
      count: -1,
      cellIds: [],
      usedDigits: [],
    };
  }

  if (down) {
    hints[1] = {
      sum: -1,
      count: -1,
      cellIds: [],
      usedDigits: [],
    };
  };

  return hints;
};

export function doMakeHintCells(puzzle: IGameData) {
  const { cells } = puzzle;
  let hintCount = 0;

  // no hint cells in last cell
  for (let index = 0; index < cells.length - 1; index++) {
    const cell: ICell = cells[index];
    const nextColumn = index + 1;
    const nextRow = index + puzzle.columnCount;
    let across = false;
    let down = false;

    if (cell.type === CellType.BlankCell) {
      // cell must be a hint cell if there is a number to its right
      if (cells[nextColumn].type === CellType.NumberCell) {
        cell.type = CellType.HintCell;
        across = true;
        hintCount += 1;
      }

      // cell must be a hint cell if there is a number below
      if (
        nextRow < cells.length &&
        cells[nextRow].type === CellType.NumberCell
      ) {
        cell.type = CellType.HintCell;
        down = true;
        hintCount += 1;
      }

      (cell as IHintCell).hints = makeHints(across, down);
    } else if (cell.type === CellType.HintCell) {
      const hCell = cell as IHintCell;
      let isHint = false;

      if (cells[nextColumn].type === CellType.NumberCell) {
        if (hCell.hints[0]) {
          hintCount += 1;
        }

        isHint = true;
      }

      if (
        nextRow < cells.length &&
        cells[nextRow].type === CellType.NumberCell
      ) {
        if (hCell.hints[1]) {
          hintCount += 1;
        }

        isHint = true;
      }

      // check if hint cell is no longer a hint cell
      if (!isHint) {
        cell.type = CellType.BlankCell;
        cell.hints = null;
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

      if (hintCell.hints[0]) {
        const rowGroup = getGroupForCell(puzzle, hintCell.index + 1);
        hintCell.hints[0].sum = rowGroup.sumSolved;
      }

      if (hintCell.hints[1]) {
        const columnGroup = getGroupForCell(
          puzzle,
          hintCell.index + puzzle.columnCount, false
        );
        hintCell.hints[1].sum = columnGroup.sumSolved;
      }
    });
}
