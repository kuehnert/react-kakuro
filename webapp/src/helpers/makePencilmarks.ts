import { CellType, IGameData, INumberCell } from 'store/gameSlice';
import getCombinations from './getCombinations';
import getHints from './getHints';

export function singlePencilmarksToGuess(game: IGameData) {
  game!.cells.forEach(c => {
    if (c.type === CellType.NumberCell) {
      const cell = c as INumberCell;
      if (cell.pencilMarks?.length === 1) {
        cell.guess = cell.pencilMarks[0];
      }
    }
  });
}

export function makePencilmarksForCell(nCell: INumberCell, index: number, game: IGameData) {
  if (nCell.guess > 0) {
    return;
  }

  // Filter out impossible combinations
  const hints = getHints(game, index);
  const hComb = getCombinations(hints[0]);
  const vComb = getCombinations(hints[1]);
  // Get possible digits
  const hDigits = Array.from(new Set(hComb.flat()));
  const vDigits = Array.from(new Set(vComb.flat()));

  const used = [...hints[0].used, ...hints[1].used];
  const poss = hDigits
    .filter(e => vDigits.includes(e) && !used.includes(e))
    .sort();

  nCell.pencilMarks = poss;
}

export function makePencilmarks(game: IGameData) {
  game.cells.forEach((cell, index) => {
    if (cell.type === CellType.NumberCell) {
      makePencilmarksForCell(cell as INumberCell, index, game)
    }
  });
}

export default makePencilmarks;
