import {
  CellType,
  IGameData,
  IHint,
  IHintCell,
  INumberCell,
} from 'models/cellModels';
import doSetGuess from './doSetGuess';
import getCombinations from './getCombinations';
import { delta } from './hintCells';

export function getGroupForCell(
  puzzle: IGameData,
  index: number,
  direction: number
): IHint {
  const { cells } = puzzle;
  const d = delta(puzzle, direction);
  let x = index - d;
  let cellIndexes = [];
  let usedDigits = [];
  let sumSolved = 0;
  let sumGuessed = 0;

  while (cells[x].type === CellType.NumberCell) {
    x -= d;
  }

  let y = x;
  while (y + d < cells.length && cells[y + d].type === CellType.NumberCell) {
    y += d;
    cellIndexes.push(y);
    const nCell = cells[y] as INumberCell;

    if (nCell.guess) {
      usedDigits.push(nCell.guess);
      sumGuessed += nCell.guess;
    }

    if (nCell.solution > 0) {
      sumSolved += nCell.solution;
    }
  }

  const count = (y - x) / d;
  const combinations =
    sumGuessed > 0 ? getCombinations({ sumSolved, count }) : [];

  const hint: IHint = {
    index: x,
    count,
    sumSolved,
    sumGuessed,
    cellIndexes,
    usedDigits,
    combinations,
  };

  return hint;
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
        // guessNumber(game, cell.index, cell.pencilMarks[0]);
        doSetGuess(game, cell.index, cell.pencilMarks[0]);
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
  const hHint = (game.cells[game.hintMaps[0][index]] as IHintCell).hints[0];
  const vHint = (game.cells[game.hintMaps[1][index]] as IHintCell).hints[1];

  const used = [...hHint!.usedDigits, ...vHint!.usedDigits];
  const hComb = hHint!.combinations
    .filter(c => !c.impossible)
    .map(c => c.digits);
  const vComb = vHint!.combinations
    .filter(c => !c.impossible)
    .map(c => c.digits);

  // if no current pencil marks, find possible ones
  // Get possible digits
  const hDigits = Array.from(new Set(hComb.flat()));
  const vDigits = Array.from(new Set(vComb.flat()));
  newPM = hDigits.filter(e => vDigits.includes(e) && !used.includes(e)).sort();
  // console.log('0 newPM:', newPM);

  if ((nCell.pencilMarks || []).length > 0) {
    newPM = newPM.filter(e => nCell.pencilMarks.includes(e));
    // console.log('1 newPM:', newPM);

    // only possible if pencil marks have been set once already
    // i.e. if neighbours have correct marks

    // if cell part of a twin across or down
    // check which marks are possible
    if (
      hHint!.count === 2 &&
      index + 1 < game.cells.length &&
      game.cells[index + 1].type === CellType.NumberCell &&
      (game.cells[index + 1] as INumberCell).guess === 0
    ) {
      const neighbour = game.cells[index + 1] as INumberCell;

      newPM = newPM.filter(p => {
        return neighbour.pencilMarks.includes(hHint!.sumSolved - p);
      });
    }

    // check for twin down
    if (
      vHint!.count === 2 &&
      index + game.columnCount < game.cells.length &&
      game.cells[index + game.columnCount].type === CellType.NumberCell &&
      (game.cells[index + game.columnCount] as INumberCell).guess === 0
    ) {
      const neighbour = game.cells[index + game.columnCount] as INumberCell;

      newPM = newPM.filter(p => {
        return neighbour.pencilMarks.includes(vHint!.sumSolved - p);
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
