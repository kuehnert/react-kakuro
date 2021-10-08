import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import getHints from 'utils/getHints';
import { makePencilmarks, singlePencilmarksToGuess } from 'utils/pencilmarks';
import { AppThunk } from './store';

/* Types */
export enum Difficulty {
  Easy = 0,
  Medium = 1,
  MediumPlus = 2,
  Hard = 3,
  VeryHard = 4,
}

export enum CellType {
  BlankCell = 'blankCell',
  HintCell = 'hintCell',
  NumberCell = 'numberCell',
}

export enum PuzzleStates {
  Raw = 0,
  Valid = 1,
  Solved = 2,
}

export interface ICell {
  index: number;
  type: CellType;
}

export interface IBlankCell extends ICell {
  type: CellType.BlankCell;
}

export interface IHintCell extends ICell {
  type: CellType.HintCell;
  hintHorizontal?: number;
  hintVertical?: number;
}

export interface INumberCell extends ICell {
  type: CellType.NumberCell;
  pencilMarks: number[];
  guess: number;
  solution: number;
}

export type IBaseGame = {
  name: string;
  columnCount: number;
  rowCount: number;
  level: Difficulty;
};

export interface IServerGameData extends IBaseGame {
  state: PuzzleStates;
  cellString: string;
}

export interface IGameData extends IBaseGame {
  state: PuzzleStates;
  cells: ICell[];
  hintCount: number;
}

export interface IGuess {
  index: number;
  guess: number;
}

export interface IHintValues {
  index: number;
  sum: number;
  count: number;
  used: number[];
}

/* State */
type GameSliceState = {
  zoomLevel: number;
  game: IGameData;
  selectedIndex?: number;
  hints: IHintValues[];
};

const initialState: GameSliceState = {
  zoomLevel: 1,
  game: {
    state: -1,
    cells: [],
    columnCount: -1,
    rowCount: -1,
    name: 'Dummy',
    level: -1,
    hintCount: -1,
  },
  hints: [
    { index: -1, sum: -1, count: -1, used: new Array<number>() },
    { index: -1, sum: -1, count: -1, used: new Array<number>() },
  ],
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentGameSuccess(state, action: PayloadAction<IGameData>) {
      state.game = action.payload;
    },
    fetchGameSuccess(state, action: PayloadAction<IGameData>) {
      state.game = { ...action.payload };
      // create pencilmarks for all number cells
      state.game.cells
        .filter(c => c.type === CellType.NumberCell)
        .forEach(cell => {
          const nCell = cell as INumberCell;
          if (!nCell.guess) {
            nCell.guess = 0;
          }
          if (!nCell.pencilMarks) {
            nCell.pencilMarks = [];
          }
        });
    },
    setSelectedIndex(state, action: PayloadAction<number>) {
      let currentIndex = action.payload;
      state.selectedIndex = currentIndex;
      state.hints = getHints(state.game!, currentIndex);
    },
    increaseZoom(state) {
      state.zoomLevel += 1;
    },
    decreaseZoom(state) {
      state.zoomLevel -= 1;
    },
    setGuess(state, action: PayloadAction<IGuess>) {
      const { index, guess } = action.payload;
      const newGame: IGameData = JSON.parse(JSON.stringify(state.game));
      const currentCell: INumberCell = newGame.cells[index] as INumberCell;
      if (currentCell.type === CellType.NumberCell) {
        currentCell.guess = guess;
        // if (guess === 0) {
        //   makePencilmarksForCell(currentCell, index, newGame);
        // }
        state.game = newGame;
      }
      state.hints = getHints(state.game!, index);
    },
    togglePencilMark(state, action: PayloadAction<IGuess>) {
      const { index, guess } = action.payload;
      const newGame: IGameData = JSON.parse(JSON.stringify(state.game));
      const currentCell: INumberCell = newGame.cells[index] as INumberCell;

      if (currentCell.type === CellType.NumberCell) {
        const index = currentCell.pencilMarks.indexOf(guess);

        if (index < 0) {
          currentCell.pencilMarks.push(guess);
          currentCell.pencilMarks.sort();
        } else {
          currentCell.pencilMarks.splice(index, 1);
        }
        state.game = newGame;
      }
    },
    autoPencil(state, action: PayloadAction) {
      // set guesses where there is only one pencil mark option
      singlePencilmarksToGuess(state.game!);

      // calculate pencil marks
      makePencilmarks(state.game!);
    },
  },
});

export const {
  fetchGameSuccess,
  increaseZoom,
  decreaseZoom,
  setSelectedIndex,
  setCurrentGameSuccess,
  setGuess,
  autoPencil,
  togglePencilMark,
} = gameSlice.actions;

export default gameSlice.reducer;

export const setCurrentGame =
  (game: IGameData): AppThunk =>
  async (dispatch: any) => {
    const newGame: IGameData = JSON.parse(JSON.stringify(game));

    // create pencilmarks for all number cells
    newGame.cells
      .filter(c => c.type === CellType.NumberCell)
      .forEach(cell => {
        const nCell = cell as INumberCell;
        if (!nCell.guess) {
          nCell.guess = 0;
        }
        if (!nCell.pencilMarks) {
          nCell.pencilMarks = [];
        }
      });

    dispatch(setCurrentGameSuccess(newGame));
  };
