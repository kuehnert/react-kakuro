import { CellType, IGameData, IHintCell, INumberCell } from 'store/gameSlice';
import getCombinations from './getCombinations';
import getHints from './getHints';
import { guessNumber } from './solvePuzzle';

export function getRowForCell(
  { cells, columnCount }: IGameData,
  index: number,
  across = true
) {
  const delta = across ? 1 : columnCount;
  let x = index - delta;
  let cellIndexes = [];
  let usedDigits = [];
  let sum = 0;
  let sumSolved = 0;

  while (cells[x].type === CellType.NumberCell) {
    x -= delta;
  }

  let y = x;
  while (
    y + delta < cells.length &&
    cells[y + delta].type === CellType.NumberCell
  ) {
    y += delta;
    cellIndexes.push(y);
    const nCell = cells[y] as INumberCell;
    if (nCell.guess) {
      usedDigits.push(nCell.guess);
      sum += nCell.guess;
    }

    if (nCell.solution) {
      sumSolved += nCell.solution;
    }
  }

  const hint = across
    ? (cells[x] as IHintCell).hintHorizontal
    : (cells[x] as IHintCell).hintVertical;
  const count = (y - x) / delta;

  return { index, hint, count, sum, sumSolved, cellIndexes, usedDigits };
}

export function getColumnForCell(game: IGameData, index: number) {
  return getRowForCell(game, index, false);
}

export function guessRemovesPencilmarks(game: IGameData, index: number) {}

export function singlePencilmarksToGuess(game: IGameData): boolean {
  let setGuess = false;

  game!.cells.forEach(c => {
    if (c.type === CellType.NumberCell) {
      const cell = c as INumberCell;
      if (cell.guess === 0 && cell.pencilMarks?.length === 1) {
        if (cell.solution > 0) {
          cell.guess = cell.pencilMarks[0];
        } else {
          cell.solution = cell.pencilMarks[0];
        }
        guessNumber(game, cell.index, cell.pencilMarks[0]);
        setGuess = true;
      }
    }
  });

  return setGuess;
}

export function makePencilmarksForCell(
  nCell: INumberCell,
  index: number,
  game: IGameData
) {
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
      makePencilmarksForCell(cell as INumberCell, index, game);
    }
  });
}
