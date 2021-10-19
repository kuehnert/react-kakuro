import { CellType, ICell, IGameData, IHint, IHintCell } from 'store/gameSlice';
import { getGroupForCell } from './pencilmarks';

export function delta(puzzle: IGameData, direction: number): number {
  return direction === 0 ? 1 : puzzle.columnCount;
}

export function doCountMissingHints(puzzle: IGameData) {
  const reducer = (prev: number, curr: ICell) => {
    if (curr.type !== CellType.HintCell) {
      return prev;
    } else {
      const hCell = curr as IHintCell;
      return (
        prev +
        (hCell.hints[0]?.sumSolved === -1 ? 1 : 0) +
        (hCell.hints[1]?.sumSolved === -1 ? 1 : 0)
      );
    }
  };

  return puzzle.cells.reduce(reducer, 0);
}

const makeHints = (across: boolean, down: boolean): Array<IHint | null> => {
  const hints = new Array<IHint | null>(2);
  if (across) {
    hints[0] = {
      sumSolved: -1,
      sumGuessed: -1,
      count: -1,
      cellIndexes: [],
      usedDigits: [],
      combinations: [],
    };
  }

  if (down) {
    hints[1] = {
      sumSolved: -1,
      sumGuessed: -1,
      count: -1,
      cellIndexes: [],
      usedDigits: [],
      combinations: [],
    };
  }

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
        // (cell as IHintCell).hints = null;
      }
    }
  }

  puzzle.hintCount = hintCount;
  // console.log('puzzle:', JSON.stringify(puzzle));
}

export function doFillHintsFromSolution(puzzle: IGameData) {
  const { cells, hintMaps } = puzzle;

  cells
    .filter(c => c.type === CellType.HintCell)
    .forEach(c => {
      const hintCell = c as IHintCell;

      [0, 1].forEach(dir => {
        if (hintCell.hints[dir]) {
          const group = getGroupForCell(puzzle, hintCell.index + delta(puzzle, dir), dir);
          hintCell.hints[dir] = {
            ...group,
            sumGuessed: 0,
            sumSolved: group.sumGuessed,
          };
          group.cellIndexes.forEach(i => {
            hintMaps[dir][i] = c.index;
          });
        }
      });
    });
}
