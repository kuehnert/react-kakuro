import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import kakuroApi from 'api/kakuroApi';
import { setSuccessAlert, setWarningAlert } from 'features/alerts/alertSlice';
import authHeader from 'utils/authHeader';
import { checkGuessesCorrect } from 'utils/checkPuzzle';
import { clearGuesses, doClearPencilMarks } from 'utils/clearGuesses';
import doCountMissingCells from 'utils/doCountMissingCells';
// import getHints from 'utils/getHints';
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

export interface IHint {
  sumSolved: number;              // hint for this cell
  sumGuessed: number;        // sumSolved of guessed cells
  count: number;
  cellIndexes: number[];
  usedDigits: number[];
  combinations: number[][]; // [combination][digit]
}

export interface IHintCell extends ICell {
  type: CellType.HintCell;
  hints: (IHint | null)[];
}

export interface INumberCell extends ICell {
  type: CellType.NumberCell;
  pencilMarks: number[];
  guess: number;
  solution: number;
}

export type IBaseGame = {
  _id?: string;
  name: string;
  columnCount: number;
  rowCount: number;
  level: Difficulty;
};

export interface IServerGameData extends IBaseGame {
  state: PuzzleStates;
  cellString: string;
}

export interface IHintMap {
  [index: number]: number;
};

export interface IGameData extends IBaseGame {
  state: PuzzleStates;
  cells: ICell[];
  hintCount: number;
  missingCells: number;
  hintMaps: IHintMap[];
}

export interface IGuess {
  index: number;
  guess: number;
}

/* State */
export type GameSliceState = {
  zoomLevel: number;
  game: IGameData;
  selectedIndex?: number;
  markWrong: boolean;
  undoStack: string[];
  redoStack: string[];
};

const ZOOM_MIN = 3;
const ZOOM_MAX = 10;

const initialState: GameSliceState = {
  zoomLevel: 6,
  game: {
    state: -1,
    cells: [],
    columnCount: -1,
    rowCount: -1,
    name: 'Dummy',
    level: -1,
    hintCount: -1,
    missingCells: -1,
    hintMaps: [{}, {}],
  },
  markWrong: JSON.parse(localStorage.getItem('kakuro-markWrong') || 'false'),
  undoStack: [],
  redoStack: [],
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameState(state, action: PayloadAction<IGameData>) {
      state.game = action.payload;
      // state.hints = getHints(state.game, state.selectedIndex!);
      state.undoStack = [];
      state.redoStack = [];
    },
    setCurrentGameSuccess(state, action: PayloadAction<IGameData>) {
      state.undoStack = [];
      state.redoStack = [];
      state.game = action.payload;
      state.game.missingCells = doCountMissingCells(state.game.cells);
      delete state.selectedIndex;
      // state.hints = DEFAULT_HINTS;
      const currentGame = JSON.stringify(state.game);
      console.log('currentGame:', currentGame);

      localStorage.setItem('currentGame', currentGame);
    },
    setSelectedIndex(state, action: PayloadAction<number>) {
      let newIndex = action.payload;
      state.selectedIndex = newIndex;
      // state.hints = getHints(state.game!, newIndex);
    },
    increaseZoom(state, action: PayloadAction<number>) {
      const delta = action.payload;

      if (delta === 0) {
        state.zoomLevel = initialState.zoomLevel;
      } else {
        const newValue = state.zoomLevel + delta;
        if (newValue >= ZOOM_MIN && newValue <= ZOOM_MAX) {
          state.zoomLevel = newValue;
        }
      }
    },
    setGuessSuccess(
      state,
      action: PayloadAction<{ newGame: IGameData; newMissingCells: number; }>
    ) {
      state.undoStack.push(JSON.stringify(state.game));
      state.redoStack = [];
      const { newGame, newMissingCells } = action.payload;
      state.game = newGame;
      state.game.missingCells = newMissingCells;
      // state.hints = getHints(newGame, state.selectedIndex!);
      localStorage.setItem('currentGame', JSON.stringify(state.game));
    },
    togglePencilMark(state, action: PayloadAction<IGuess>) {
      state.undoStack.push(JSON.stringify(state.game));
      state.redoStack = [];
      const { index, guess } = action.payload;
      const newGame: IGameData = JSON.parse(JSON.stringify(state.game));
      const currentCell: INumberCell = newGame.cells[index] as INumberCell;

      if (currentCell.type === CellType.NumberCell) {
        const index = currentCell.pencilMarks.indexOf(guess);

        if (guess === 0) {
          currentCell.pencilMarks = [];
        } else if (index < 0) {
          // add new pencil mark
          currentCell.pencilMarks.push(guess);
          currentCell.pencilMarks.sort();
        } else {
          // remove existing pencil mark
          currentCell.pencilMarks.splice(index, 1);
        }
        state.game = newGame;
        localStorage.setItem('currentGame', JSON.stringify(state.game));
      }
    },
    resetGame(state) {
      state.undoStack.push(JSON.stringify(state.game));
      state.redoStack = [];
      state.game = clearGuesses(state.game);
      state.game.missingCells = doCountMissingCells(state.game.cells);
      // state.hints = getHints(state.game, state.selectedIndex!);
    },
    toggleMarkWrong(state) {
      state.markWrong = !state.markWrong;
      localStorage.setItem('kakuro-markWrong', JSON.stringify(state.markWrong));
    },
    clearPencilMarks(state) {
      state.undoStack.push(JSON.stringify(state.game));
      state.redoStack = [];
      state.game = doClearPencilMarks(state.game);
    },
    autoPencil(state) {
      state.undoStack.push(JSON.stringify(state.game));
      // set guesses where there is only one pencil mark option
      singlePencilmarksToGuess(state.game!);

      // calculate pencil marks
      makePencilmarks(state.game!);

      state.game.missingCells = doCountMissingCells(state.game.cells);
    },
    undo(state) {
      const oldGameString = state.undoStack.pop();
      const game = JSON.parse(oldGameString!);
      state.redoStack.push(JSON.stringify(state.game));
      state.game = game;
      // state.hints = getHints(state.game, state.selectedIndex!);
    },
    redo(state) {
      const oldGameString = state.redoStack.pop();
      const game = JSON.parse(oldGameString!);
      state.undoStack.push(JSON.stringify(state.game));
      state.game = game;
      // state.hints = getHints(state.game, state.selectedIndex!);
    },
  },
});

export const {
  clearPencilMarks,
  increaseZoom,
  setGameState,
  setSelectedIndex,
  setCurrentGameSuccess,
  setGuessSuccess,
  autoPencil,
  resetGame,
  togglePencilMark,
  toggleMarkWrong,
  redo,
  undo,
} = gameSlice.actions;

export default gameSlice.reducer;

export const setCurrentGame =
  (game: IGameData): AppThunk =>
    async (dispatch: any) => {
      localStorage.removeItem('currentGame');

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
      const { game } = getState().game;
      const newGame: IGameData = JSON.parse(JSON.stringify(game));
      const currentCell = newGame.cells[index] as INumberCell;
      let newMissingCells;

      if (currentCell.type === CellType.NumberCell) {
        if (currentCell.guess === 0 && guess !== 0) {
          newMissingCells = game.missingCells - 1;
        } else if (currentCell.guess > 0 && guess === 0) {
          newMissingCells = game.missingCells + 1;
        } else {
          newMissingCells = game.missingCells;
        }

        currentCell.guess = guess;
        // remove guess from pencil marks
        // too much help
        // makePencilmarks(newGame);

        if (newMissingCells === 0) {
          if (checkGuessesCorrect(newGame)) {
            if (game._id && getState().users.user) {
              try {
                await kakuroApi.post(
                  '/users/solved',
                  { id: game._id },
                  {
                    headers: authHeader(),
                  }
                );
              } catch (error) {
                console.error(error);
              }
            }

            dispatch(setSuccessAlert('Puzzle solved. Congratulations!'));
          } else {
            dispatch(setWarningAlert('There are still mistakes in the puzzle'));
          }
        }

        dispatch(setGuessSuccess({ newGame, newMissingCells }));
      }
    };
