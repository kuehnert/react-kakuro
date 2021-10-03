import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import kakuroApi from 'api/kakuroApi';
import { setErrorAlert, setSuccessAlert } from 'features/alerts/alertSlice';
import checkPuzzle from 'utils/checkPuzzle';
import doMakeHintCells from 'utils/doMakeHintCells';
import solvePuzzle from 'utils/solvePuzzle';
import myHistory from 'myHistory';
import authHeader from 'utils/authHeader';
import { CellType, IBaseGame, IGameData, PuzzleStates } from './gameSlice';
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
  activeStep: 3,
  puzzle: {
    name: 'Unnamed',
    level: 4,
    columnCount: 10,
    rowCount: 10,
    cells: createGrid(10, 10),
    state: PuzzleStates.Raw,
  },
};

export const designSlice = createSlice({
  name: 'design',
  initialState,
  reducers: {
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },
    setBaseGame: (state, action: PayloadAction<IBaseGame>) => {
      state.puzzle = { ...state.puzzle, ...action.payload };
      state.puzzle.cells = createGrid(
        state.puzzle.columnCount,
        state.puzzle.rowCount
      );
    },
    clearDesignGame: state => {
      state = JSON.parse(JSON.stringify(initialState));
    },
    setDesignGame: (state, action) => {
      state.puzzle = action.payload;
    },
    updateCell: (state, action) => {
      const newCell = action.payload;
      state.puzzle.cells[newCell.index] = newCell;
      state.puzzle.state = PuzzleStates.Raw;
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
    checkGameSuccess: (state, action: PayloadAction<boolean>) => {
      state.puzzle.state = PuzzleStates.Valid;
    },
    createGameSuccess: (state, action: PayloadAction<IGameData>) => {
      state = JSON.parse(JSON.stringify(initialState));
      myHistory.push('/');
    },
  },
});

export const {
  checkGameSuccess,
  clearDesignGame,
  createGameSuccess,
  setActiveStep,
  setBaseGame,
  setDesignGame,
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
    dispatch(checkGameSuccess(isValid));
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
  status: number;
  statusText: string;
}

export const createGame =
  (values: IGameData): AppThunk =>
  async (dispatch: any) => {
    // dispatch(submitting());
    let puzzle;
    try {
      const response = await kakuroApi.post('/puzzles', values, {
        headers: authHeader(),
      });
      puzzle = response.data;
    } catch (error) {
      console.log('error:', JSON.stringify(error));
      dispatch(
        setErrorAlert(
          `Error trying to save puzzle: ${(error as Error).message}`
        )
      );
      return;
    }

    dispatch(createGameSuccess(puzzle));
    dispatch(setSuccessAlert('Puzzle erzeugt.'));
  };
