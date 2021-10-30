import {
  CellType,
  ICell,
  IGameData,
  IHint,
  IHintCell,
  INumberCell,
} from 'models/cellModels';
import getCombinations from './getCombinations';
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

const makeHints = (index: number, counts: number[]): Array<IHint | null> => {
  const [across, down] = counts;
  const hints = new Array<IHint | null>(2);

  if (across > 0) {
    hints[0] = {
      index,
      sumSolved: -1,
      sumGuessed: 0,
      count: across,
      cellIndexes: [],
      usedDigits: [],
      combinations: [],
    };
  }

  if (down > 0) {
    hints[1] = {
      index,
      sumSolved: -1,
      sumGuessed: 0,
      count: down,
      cellIndexes: [],
      usedDigits: [],
      combinations: [],
    };
  }

  return hints;
};

export function doMakeHintCells(puzzle: IGameData, solutionKnown = false) {
  const { cells, hintMaps } = puzzle;
  let hintCount = 0;

  // no hint cells in last two cells
  for (let index = 0; index < cells.length - 2; index++) {
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

      // it's a hint cell unless both counts are zero
      const isHint = counts.join('') !== '00';

      if (isHint) {
        const hCell = cell as IHintCell;

        // make hints unless already present & valid
        let needsNew0 = false;
        if (counts[0] > 0) {
          needsNew0 =
            !hCell.hints ||
            !hCell.hints[0] ||
            hCell.hints[0].count !== counts[0];
        }

        let needsNew1 = false;
        if (counts[1] > 0) {
          needsNew1 =
            !hCell.hints ||
            !hCell.hints[1] ||
            hCell.hints[1].count !== counts[1];
        }

        // don't overwrite existing hint
        if (needsNew0 || needsNew1) {
          hCell.hints = makeHints(index, counts);
        }
        hintCount += (counts[0] > 0 ? 1 : 0) + (counts[1] > 0 ? 1 : 0);
      } else {
        cell.type = CellType.BlankCell;
        delete (cell as any).hints; // = null;
      }
    }
  }

  // populate hintMaps
  cells
    .filter(c => c.type === CellType.HintCell)
    .forEach(c => {
      const hintCell = c as IHintCell;

      [0, 1].forEach(direction => {
        if (hintCell.hints[direction]) {
          const group = getGroupForCell(
            puzzle,
            hintCell.index + delta(puzzle, direction),
            direction
          );

          const sumSolved = solutionKnown
            ? group.sumSolved
            : hintCell.hints[direction]?.sumSolved || 0;

          const combinations =
            sumSolved > 0
              ? getCombinations({ sumSolved, count: group.count })
              : [];
          const hint: IHint = {
            ...group,
            sumSolved,
            sumGuessed: 0,
            usedDigits: [],
            combinations,
          };

          hintCell.hints[direction] = hint;

          // populate hint map
          group.cellIndexes.forEach(i => {
            hintMaps[direction][i] = c.index;
          });
        }
      });
    });

  cells
    .filter(c => c.type === CellType.NumberCell)
    .forEach(c => {
      const numberCell = c as INumberCell;
      numberCell.guess = 0;
      numberCell.pencilMarks = [];
      // numberCell.solution = 0;
    });

  puzzle.hintCount = hintCount;
}
