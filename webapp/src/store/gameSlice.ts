import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setSuccessAlert, setWarningAlert } from 'features/alerts/alertSlice';
import checkCorrect from 'utils/checkSolution';
import doCountMissingCells from 'utils/doCountMissingCells';
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
  markWrong: boolean;
  missingCells: number;
};

const initialState: GameSliceState = {
  zoomLevel: 3,
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
  markWrong: false,
  missingCells: -1,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentGameSuccess(state, action: PayloadAction<IGameData>) {
      state.game = action.payload;
      state.missingCells = doCountMissingCells(state.game);
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
      let newIndex = action.payload;
      state.selectedIndex = newIndex;
      state.hints = getHints(state.game!, newIndex);
    },
    increaseZoom(state, action: PayloadAction<number>) {
      const delta = action.payload;

      if (delta === 0) {
        state.zoomLevel = initialState.zoomLevel;
      } else {
        const newValue = state.zoomLevel + delta;
        if (newValue > 0 && newValue <= 10) {
          state.zoomLevel = newValue;
        }
      }
    },
    setGuessSuccess(
      state,
      action: PayloadAction<{ newGame: IGameData; newMissingCells: number }>
    ) {
      const { newGame, newMissingCells } = action.payload;
      state.game = newGame;
      state.missingCells = newMissingCells;
      state.hints = getHints(newGame, state.selectedIndex!);
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
    toggleMarkWrong(state) {
      state.markWrong = !state.markWrong;
    },
    autoPencil(state) {
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
  setSelectedIndex,
  setCurrentGameSuccess,
  setGuessSuccess,
  autoPencil,
  togglePencilMark,
  toggleMarkWrong,
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

export const setGuess =
  ({ index, guess }: IGuess): AppThunk =>
  async (dispatch, getState) => {
    const { game, missingCells } = getState().game;
    const newGame: IGameData = JSON.parse(JSON.stringify(game));
    const currentCell = newGame.cells[index] as INumberCell;
    let newMissingCells;

    if (currentCell.type === CellType.NumberCell) {
      if (currentCell.guess === 0 && guess !== 0) {
        newMissingCells = missingCells - 1;
      } else if (currentCell.guess > 0 && guess === 0) {
        newMissingCells = missingCells + 1;
      } else {
        newMissingCells = missingCells;
      }

      currentCell.guess = guess;
      // if (guess === 0) {
      //   makePencilmarksForCell(currentCell, index, newGame);
      // }
      // state.game = newGame;


      if (newMissingCells === 0) {
        if (checkCorrect(newGame)) {
          dispatch(setSuccessAlert('Puzzle solved. Congratulations!'));
        } else {
          dispatch(setWarningAlert('There are still mistakes in the puzzle'));
        }
      }

      dispatch(setGuessSuccess({ newGame, newMissingCells }));
    }
  };
