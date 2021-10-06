import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import kakuroApi from 'api/kakuroApi';
import { setErrorAlert, setSuccessAlert } from 'features/alerts/alertSlice';
import { addPuzzleToList, IListGame } from 'features/list/listSlice';
import authHeader from 'utils/authHeader';
import checkPuzzle from 'utils/checkPuzzle';
import { doCountMissingHints, doMakeHintCells } from 'utils/hintCells';
import preparePuzzle from 'utils/preparePuzzle';
import solvePuzzle from 'utils/solvePuzzle';
import {
  CellType,
  IBaseGame,
  IGameData,
  INumberCell, PuzzleStates
} from './gameSlice';
import { AppThunk } from './store';

export enum Direction {
  Horizontal = 0,
  Vertical = 1,
  Both = 2,
}

export interface IDesignCell {
  type: CellType;
  index: number;
  hintHorizontal?: number;
  hintVertical?: number;
  solution?: number;
}

export enum DesignStepsEnum {
  SetSize = 0,
  DrawGrid = 1,
  InsertHints = 2,
  CheckPuzzle = 3,
}

export const designSteps = [
  { label: 'Set Size' },
  { label: 'Draw Grid' },
  { label: 'Insert Hints' },
  { label: 'Check Puzzle' },
];

type DesignSliceState = {
  activeStep: number;
  puzzle: IGameData;
};

const createGrid = (columns: number, rows: number) =>
  Array.from({ length: columns * rows }, (item, index) => ({
    index,
    type: CellType.BlankCell,
  }));

const initialState: DesignSliceState = {
  activeStep: 0,
  puzzle: {
    name: 'Unnamed',
    level: 4,
    columnCount: 10,
    rowCount: 10,
    cells: createGrid(10, 10),
    state: PuzzleStates.Raw,
    hintCount: -1,
  },
};

export const designSlice = createSlice({
  name: 'design',
  initialState,
  reducers: {
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
      localStorage.setItem('puzzleState', JSON.stringify(state));
    },
    setBaseGame: (state, action: PayloadAction<IBaseGame>) => {
      state.puzzle = { ...state.puzzle, ...action.payload };
      state.puzzle.cells = createGrid(
        state.puzzle.columnCount,
        state.puzzle.rowCount
      );
    },
    clearDesignGame: () => {
      localStorage.removeItem('puzzleState');
      return initialState;
    },
    setPuzzleState: (state, action: PayloadAction<DesignSliceState>) => {
      return action.payload;
    },
    updateCell: (state, action) => {
      const newCell = action.payload;

      if (
        newCell.type === CellType.NumberCell &&
        !(newCell as INumberCell).guess
      ) {
        (newCell as INumberCell).guess = 0;
      }

      state.puzzle.cells[newCell.index] = newCell;
      state.puzzle.state = PuzzleStates.Raw;
      state.puzzle.hintCount = doCountMissingHints(state.puzzle);
    },
    makeHintCells: state => {
      doMakeHintCells(state.puzzle);
    },
    solveGameSuccess: (state, action: PayloadAction<IGameData>) => {
      state.puzzle = action.payload;
      state.puzzle.state = PuzzleStates.Solved;
    },
    solveGameFailed: state => {
      state.puzzle.state = PuzzleStates.Raw;
      state.activeStep = DesignStepsEnum.InsertHints;
    },
    checkGameSuccess: state => {
      state.puzzle.state = PuzzleStates.Valid;
    },
    createGameSuccess: () => {
      // myHistory.push('/');
      localStorage.removeItem('puzzleState');
      return initialState;
    },
  },
});

export const {
  checkGameSuccess,
  clearDesignGame,
  createGameSuccess,
  setActiveStep,
  setBaseGame,
  setPuzzleState,
  makeHintCells,
  solveGameSuccess,
  solveGameFailed,
  updateCell,
} = designSlice.actions;

export default designSlice.reducer;

export const checkGame = (): AppThunk => async (dispatch: any, getState) => {
  const { puzzle } = getState().design;
  const isValid = checkPuzzle(puzzle);

  if (isValid) {
    dispatch(setSuccessAlert('Puzzle is valid.'));
    dispatch(checkGameSuccess());
  } else {
    dispatch(setErrorAlert(`Puzzle invalid`));
  }
};

export const solveGame = (): AppThunk => async (dispatch: any, getState) => {
  const { puzzle } = getState().design;
  const result = solvePuzzle(puzzle);

  if (result.error) {
    dispatch(setErrorAlert(`Puzzle invalid: ${result.error}`));
    dispatch(solveGameFailed());
  } else {
    dispatch(setSuccessAlert('Puzzle solved.'));
    dispatch(solveGameSuccess(result.solution!));
  }
};

export interface IApiError {
  code: number;
  message: string;
}

export const createGame =
  (values: IGameData): AppThunk =>
  async (dispatch: any) => {
    // dispatch(submitting());
    let puzzle = preparePuzzle(values);
    let newPuzzle: IListGame;

    try {
      const response = await kakuroApi.post('/puzzles', puzzle, {
        headers: authHeader(),
      });
      newPuzzle = response.data;
    } catch (error) {
      console.log('error:', JSON.stringify(error, null, 4));
      dispatch(
        setErrorAlert(
          // `Error trying to save puzzle: ${(error as IApiError).message}`
          `Error: Puzzle is already in database`
        )
      );
      return;
    }

    dispatch(addPuzzleToList(newPuzzle));
    dispatch(createGameSuccess());
    dispatch(setSuccessAlert('Puzzle erzeugt.'));
  };
