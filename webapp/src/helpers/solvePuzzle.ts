import { CellType, IGameData, INumberCell } from 'store/gameSlice';
import { ICombinations } from './combinations';
import makePencilmarks, { singlePencilmarksToGuess } from './makePencilmarks';

let solutions: IGameData[];

function logBoard(game: IGameData) {
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
      nCell.pencilMarks.forEach(p => {
        nCell.guess = p;
        // console.log(`Cell no. ${index}: Guessing ${p}...`);

        makePencilmarks(game);
        _solvePuzzle(game, index + 1);
        nCell.guess = -1;
        makePencilmarks(game);
      });
    }
  }
}

/**
 * Solves the entered puzzle. First version is a brute-force to see how long it takes :D
 * @param original the game to be solved
 * @param combinations all possible combinations
 * @returns the solved game
 */
function solvePuzzle(original: IGameData, combinations: ICombinations) {
  // create copy of entered game
  const game: IGameData = JSON.parse(JSON.stringify(original));
  // create initial pencil marks
  makePencilmarks(game);
  singlePencilmarksToGuess(game);
  solutions = new Array<IGameData>();
  _solvePuzzle(game, 0);
  console.log(`Found ${solutions.length}:`);
  solutions.forEach(s => logBoard(s));

  if (solutions.length === 0) {
    console.log('Puzzle invalid; no solution.');
    return { error: 'Puzzle invalid; no solution.' };
  } else if (solutions.length > 1) {
    console.log('Puzzle invalid; more than one solution.');
    return {
      error: `Puzzle invalid; more than one solution (${solutions.length}).`,
    };
  } else {
    console.log('solutions[0]:', JSON.stringify(solutions[0], null, 4));

    return { solution: solutions[0] };
  }
}

export default solvePuzzle;
