import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setErrorAlert, setSuccessAlert } from 'features/alerts/alertSlice';
import checkPuzzle from 'helpers/checkPuzzle';
import doMakeHintCells from 'helpers/doMakeHintCells';
import solvePuzzle from 'helpers/solvePuzzle';
import { CellType, IBaseGame, IGameData, StateType } from './gameSlice';
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
    state: StateType.Raw,
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
      state = initialState;
    },
    setDesignGame: (state, action) => {
      state.puzzle = action.payload;
    },
    updateCell: (state, action) => {
      const newCell = action.payload;
      state.puzzle.cells[newCell.index] = newCell;
    },
    makeHintCells: state => {
      doMakeHintCells(state.puzzle);
    },
    solveGameSuccess: (state, action: PayloadAction<IGameData>) => {
      state.puzzle = action.payload;
      state.puzzle.state = StateType.Solved;
    },
    checkGameSuccess: (state, action: PayloadAction<boolean>) => {
      state.puzzle.state = StateType.Valid;
    },
  },
});

export const {
  checkGameSuccess,
  clearDesignGame,
  setActiveStep,
  setBaseGame,
  setDesignGame,
  makeHintCells,
  solveGameSuccess,
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
  } else {
    dispatch(setSuccessAlert('Puzzle solved.'));
    dispatch(solveGameSuccess(result.solution!));
  }
};
