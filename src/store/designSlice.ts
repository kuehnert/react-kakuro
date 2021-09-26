import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CellType, IBaseGame, IGameData } from './gameSlice';

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
  },
});

export const {
  clearDesignGame,
  setActiveStep,
  setBaseGame,
  setDesignGame,
  updateCell,
} = designSlice.actions;

export default designSlice.reducer;
