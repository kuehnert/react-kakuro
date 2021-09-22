import { CellType, IGameData, INumberCell } from 'store/gameSlice';
import getHints from './getHints';
import { ICombinations } from './makeCombinations';

function makePencilmarks(game: IGameData, combinations: ICombinations) {
  game.cells.forEach((cell, index) => {
    if (cell.type !== CellType.Number) {
      return;
    }

    const nCell = cell as INumberCell;
    if (nCell.guess > 0) {
      return;
    }

    // Filter out impossible combinations
    const hints = getHints(game, index);

    // Get possible digits
    const hComb = Array.from(
      new Set(combinations[hints[0].count][hints[0].sum].flat())
    );
    const vComb = Array.from(
      new Set(combinations[hints[1].count][hints[1].sum].flat())
    );

    const used = [...hints[0].used, ...hints[1].used];
    const poss = hComb
      .filter(e => vComb.includes(e) && !used.includes(e))
      .sort();

    nCell.pencilMarks = poss;
  });
}

export default makePencilmarks;
