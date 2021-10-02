import { CellType, IGameData, INumberCell } from 'store/gameSlice';
import {
  makePencilmarks,
  getRowForCell,
  singlePencilmarksToGuess,
  getColumnForCell,
} from './pencilmarks';

let solutions: IGameData[];

export function guessNumber(game: IGameData, index: number, guess: number) {
  (game.cells[index] as INumberCell).guess = guess;
  getRowForCell(game, index).cellIndexes.forEach(i => {
    const nCell = game.cells[i] as INumberCell;
    nCell.pencilMarks = nCell.pencilMarks.filter(pm => pm !== guess);
  });

  getColumnForCell(game, index).cellIndexes.forEach(i => {
    const nCell = game.cells[i] as INumberCell;
    nCell.pencilMarks = nCell.pencilMarks.filter(pm => pm !== guess);
  });
}

function logBoard(game: IGameData) {
  console.log(
    'Board',
    JSON.stringify(
      game.cells
        .filter(c => c.type === CellType.NumberCell)
        .map(c => (c as INumberCell).guess)
    )
  );
}

function logSolution(game: IGameData) {
  console.log(
    'Solution',
    JSON.stringify(
      game.cells
        .filter(c => c.type === CellType.NumberCell)
        .map(c => (c as INumberCell).solution)
    )
  );
}

function _solvePuzzle(game: IGameData, index: number) {
  if (index >= game.cells.length) {
    // found a solution
    const solvedGame: IGameData = JSON.parse(JSON.stringify(game));
    solvedGame.cells.forEach(c => {
      if (c.type === CellType.NumberCell) {
        const nc = c as INumberCell;
        nc.solution = nc.guess;
        nc.guess = 0;
        nc.pencilMarks = [];
      }
    });
    solutions.push(solvedGame);
  } else {
    const cell = game.cells[index];

    if (cell.type !== CellType.NumberCell || (cell as INumberCell).guess > 0) {
      // if cell is not a number cell or if there is a guess in it already
      _solvePuzzle(game, index + 1);
    } else {
      // Try all options for current cell's pencil marks
      // and solve rest of puzzle recursively
      const nCell: INumberCell = cell as INumberCell;
      const rowData = getRowForCell(game, cell.index);
      const columnData = getColumnForCell(game, cell.index);

      nCell.pencilMarks.forEach(p => {
        // TODO: check if pencil mark is valid option
        // this should not happen
        if (
          rowData.usedDigits.includes(p) ||
          columnData.usedDigits.includes(p)
        ) {
          return;
        }

        if (
          (rowData.usedDigits.length === rowData.count - 1 &&
            rowData.sum + p !== rowData.hint) ||
          (columnData.usedDigits.length === columnData.count - 1 &&
            columnData.sum + p !== columnData.hint)
        ) {
          // only one digit missing, check if p is the missing number
          return;
        }

        nCell.guess = p;
        console.log(`Cell no. ${index}: Guessing ${p}...`);

        const tempGame: IGameData = JSON.parse(JSON.stringify(game));
        makePencilmarks(tempGame);
        singlePencilmarksToGuess(tempGame);
        logBoard(tempGame);
        _solvePuzzle(tempGame, index + 1);
        nCell.guess = -1;
      });
    }
  }
}

export interface ISolvePuzzleResult {
  error?: string;
  solution?: IGameData;
}

/**
 * Solves the entered puzzle. First version is a brute-force to see how long it takes :D
 * @param original the game to be solved
 * @param combinations all possible combinations
 * @returns the solved game
 */
function solvePuzzle(original: IGameData): ISolvePuzzleResult {
  // create copy of entered game
  const game: IGameData = JSON.parse(JSON.stringify(original));
  // create initial pencil marks
  logBoard(game);
  makePencilmarks(game);
  while (singlePencilmarksToGuess(game)) {}

  solutions = new Array<IGameData>();
  _solvePuzzle(game, 0);
  console.log(`Found ${solutions.length}:`);
  // solutions.forEach((s) => logSolution(s));

  if (solutions.length === 0) {
    console.log('Puzzle invalid; no solution.');
    return { error: 'Puzzle invalid; no solution.' };
  } else if (solutions.length > 1) {
    console.log('Puzzle invalid; more than one solution.');
    return {
      error: `Puzzle invalid; more than one solution (${solutions.length}).`,
    };
  } else {
    console.log('solution:', logSolution(solutions[0]));

    return { solution: solutions[0] };
  }
}

export default solvePuzzle;
