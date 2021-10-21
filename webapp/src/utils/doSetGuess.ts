import { IGameData, INumberCell } from 'store/gameSlice';
import getHintsForCell from './getHintsForCell';
import _ from 'lodash';

/**
 * Sets guessed digit in cell and
 * does house-keeping on remaining cells and candidates
 * @param game
 * @param index
 */
export default function doSetGuess(
  game: IGameData,
  index: number,
  guess: number
) {
  const { cells } = game;
  const cellHints = getHintsForCell(game, index);
  const currentCell = cells[index] as INumberCell;

  // if old guess present, remove it from used digits
  if (currentCell.guess > 0) {
    // console.log('Removing', guess, 'from used digits');

    [0, 1].forEach(dir =>
      _.pull(cellHints.hints[dir].usedDigits, currentCell.guess)
    );

    // TODO: add old guess to pencil marks?
  }

  currentCell.guess = guess;

  // add digits to used digits
  [0, 1].forEach(dir => {
    // const hint = cellHints.hints[dir];
    const { usedDigits, combinations } = cellHints.hints[dir];

    if (guess > 0) {
      usedDigits.push(guess);
    }

    // mark combinations as impossible if they do not contain
    // all guessed numbers
    combinations.forEach(c => {
      c.impossible = _.difference(usedDigits, c.digits).length > 0;
    });
    // combinations
    //   .filter(c => _.difference(usedDigits, c.digits).length > 0)
    //   .forEach(c => {
    //     c.impossible = true;
    //   });
  });

  // remove guess from pencil marks
  const affectedIndexes = [0, 1]
    .map(dir => cellHints.hints[dir].cellIndexes)
    .flat()
    .filter(e => e !== index);

  affectedIndexes.forEach(i => {
    const nCell = cells[i] as INumberCell;
    nCell.pencilMarks = nCell.pencilMarks.filter(d => d !== guess);
  });

  // too much help?!:
  // makePencilmarks(newGame);
}
