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
  let newPM = nCell.pencilMarks || [];
  const hints = getHints(game, index);
  const hComb = getCombinations(hints[0]);
  const vComb = getCombinations(hints[1]);
  const used = [...hints[0].used, ...hints[1].used];

  // if no current pencil marks, find possible ones
  if (newPM.length === 0) {
    // Get possible digits
    const hDigits = Array.from(new Set(hComb.flat()));
    const vDigits = Array.from(new Set(vComb.flat()));
    newPM = hDigits
      .filter(e => vDigits.includes(e) && !used.includes(e))
      .sort();
  } else {
    // only possible if pencil marks have been set once already
    // i.e. if neighbours have correct marks

    // if cell part of a twin across or down
    // check which marks are possible
    if (
      hints[0].count === 2 &&
      index + 1 < game.cells.length &&
      game.cells[index + 1].type === CellType.NumberCell &&
      (game.cells[index + 1] as INumberCell).guess === 0
    ) {
      const neighbour = game.cells[index + 1] as INumberCell;

      newPM = newPM.filter(p => {
        return neighbour.pencilMarks.includes(hints[0].sum - p);
      });
    }

    // check for twin down
    if (
      hints[1].count === 2 &&
      index + game.columnCount < game.cells.length &&
      game.cells[index + game.columnCount].type === CellType.NumberCell &&
      (game.cells[index + game.columnCount] as INumberCell).guess === 0
    ) {
      const neighbour = game.cells[index + game.columnCount] as INumberCell;

      newPM = newPM.filter(p => {
        return neighbour.pencilMarks.includes(hints[1].sum - p);
      });
    }
  }

  nCell.pencilMarks = newPM;
}

export function makePencilmarks(game: IGameData) {
  game.cells.forEach((cell, index) => {
    if (cell.type === CellType.NumberCell) {
      makePencilmarksForCell(cell as INumberCell, index, game);
    }
  });
}
