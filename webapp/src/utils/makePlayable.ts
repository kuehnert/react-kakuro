import { IListGame } from 'features/list/listSlice';
import { CellType, IGameData, PuzzleStates } from 'store/gameSlice';
import { doMakeHintCells, doFillHintsFromSolution } from './hintCells';

function makePlayable(input: IListGame): IGameData {
  // convert each digit of cell string to proper cell
  const cells = input.cellString.split('').map((char, index) => {
    if (+char >= 1 && +char <= 9) {
      return {
        index,
        type: CellType.NumberCell,
        guess: 0,
        solution: +char,
        pencilMarks: [],
      };
    } else {
      return { index, type: CellType.BlankCell };
    }
  });

  // make hint cells
  const newPuzzle: IGameData = {
    ...input,
    cells,
    state: PuzzleStates.Solved,
    hintCount: -1,
  };

  doMakeHintCells(newPuzzle);
  doFillHintsFromSolution(newPuzzle);

  // JSON.stringify(newPuzzle, null, 4);
  return newPuzzle;
}

export default makePlayable;
