import { CellType, IGameData } from 'store/gameSlice';
import { getGroupForCell } from './pencilmarks';

export interface IValidatePuzzleResult {
  valid: boolean;
  message: string;
}

function validatePuzzle(puzzle: IGameData): IValidatePuzzleResult {
  const { cells } = puzzle;
  let numberCount = 0;

  // check that there is at least two groups with count > 1
  // and that there are no groups with count 1
  for (let index = 0; index < cells.length; index++) {
    const cell = cells[index];

    if (cell.type === CellType.NumberCell) {
      numberCount += 1;

      const row = getGroupForCell(puzzle, cell.index, 0);
      if (row.count === 1) {
        return {
          valid: false,
          message: 'There is at least one group across with only one cell',
        };
      }

      const column = getGroupForCell(puzzle, cell.index, 1);
      if (column.count === 1) {
        return {
          valid: false,
          message: 'There is at least one group down with only one cell',
        };
      }
    }
  }

  return numberCount < 3
    ? { valid: false, message: 'Too few number cells' }
    : { valid: true, message: 'Puzzle grid is fine' };
}

export default validatePuzzle;
