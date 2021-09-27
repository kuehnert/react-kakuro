import { CellType, IGameData, INumberCell } from 'store/gameSlice';
import getCombinations from './getCombinations';
import getHints from './getHints';
import { ICombinations } from './makeCombinations';

export function makePencilmarksForCell(nCell: INumberCell, index: number, game: IGameData, combinations: ICombinations) {
  if (nCell.guess > 0) {
    return;
  }

  // Filter out impossible combinations
  const hints = getHints(game, index);
  const hComb = getCombinations(hints[0], combinations);
  const vComb = getCombinations(hints[1], combinations);
  // Get possible digits
  const hDigits = Array.from(new Set(hComb.flat()));
  const vDigits = Array.from(new Set(vComb.flat()));

  const used = [...hints[0].used, ...hints[1].used];
  const poss = hDigits
    .filter(e => vDigits.includes(e) && !used.includes(e))
    .sort();

  nCell.pencilMarks = poss;
}

export function makePencilmarks(game: IGameData, combinations: ICombinations) {
  game.cells.forEach((cell, index) => {
    if (cell.type === CellType.NumberCell) {
      makePencilmarksForCell(cell as INumberCell, index, game, combinations)
    }
  });
}

export default makePencilmarks;
