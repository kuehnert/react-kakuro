import { IListGame } from 'features/list/listSlice';
import {
  CellType,
  IGameData,
  INumberCell,
  PuzzleStates,
} from 'models/cellModels';
import doCountMissingCells from './doCountMissingCells';
import { doMakeHintCells } from './hintCells';

function makePlayable(input: IListGame): IGameData {
  // convert each digit of cell string to proper cell
  const cells = input.cellString.split('').map((char, index) => {
    if (+char >= 1 && +char <= 9) {
      const nCell: INumberCell = {
        index,
        type: CellType.NumberCell,
        guess: 0,
        solution: +char,
        pencilMarks: [],
      };
      return nCell;
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
    missingCells: doCountMissingCells(cells),
    hintMaps: [{}, {}],
  };

  doMakeHintCells(newPuzzle, true);
  return newPuzzle;
}

export default makePlayable;
