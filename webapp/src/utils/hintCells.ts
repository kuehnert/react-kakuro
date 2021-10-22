import { CellType, ICell, IGameData, IHint, IHintCell } from 'models/cellModels';
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

const makeHints = (counts: number[]): Array<IHint | null> => {
  const [across, down] = counts;
  const hints = new Array<IHint | null>(2);

  if (across > 0) {
    hints[0] = {
      index: -1,
      sumSolved: -1,
      sumGuessed: -1,
      count: across,
      cellIndexes: [],
      usedDigits: [],
      combinations: [],
    };
  }

  if (down > 0) {
    hints[1] = {
      index: -1,
      sumSolved: -1,
      sumGuessed: -1,
      count: down,
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
    let counts = [0, 0];

    if (cell.type !== CellType.NumberCell) {
      // cell must be a hint cell if there is a number to its right or down
      [0, 1].forEach(direction => {
        let next = index + delta(puzzle, direction);
        while (
          next < cells.length &&
          cells[next].type === CellType.NumberCell
        ) {
          cell.type = CellType.HintCell;
          counts[direction]++;
          next += delta(puzzle, direction);
        }
      });

      const isHint = counts.join('') !== '00';
      if (isHint) {
        (cell as IHintCell).hints = makeHints(counts);
        hintCount += (counts[0] > 0 ? 1 : 0) + (counts[1] > 0 ? 1 : 0);
      } else {
        cell.type = CellType.BlankCell;
        delete (cell as any).hints // = null;
      }
    }
  }

  puzzle.hintCount = hintCount;
}

export function doFillHintsFromSolution(puzzle: IGameData) {
  const { cells, hintMaps } = puzzle;

  cells
    .filter(c => c.type === CellType.HintCell)
    .forEach(c => {
      const hintCell = c as IHintCell;

      [0, 1].forEach(dir => {
        if (hintCell.hints[dir]) {
          const group = getGroupForCell(
            puzzle,
            hintCell.index + delta(puzzle, dir),
            dir
          );
          const hint = {
            ...group,
            // index: hintCell.index,
            sumGuessed: 0,
            sumSolved: group.sumGuessed,
          };

          // console.log('hint:', hint);
          hintCell.hints[dir] = hint;

          // populate hint map
          group.cellIndexes.forEach(i => {
            hintMaps[dir][i] = c.index;
          });
        }
      });
    });
}
