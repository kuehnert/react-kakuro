import { createSlice } from '@reduxjs/toolkit';
import { CellType, IGameData } from './gameSlice';

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
    name: 'Unbenanntes Puzzle',
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
    setName: (state, action) => {
      state.puzzle.name = action.payload;
    },
    setColumnCount: (state, action) => {
      state.puzzle.columnCount = action.payload;
      state.puzzle.cells = createGrid(
        state.puzzle.columnCount,
        state.puzzle.rowCount
      );
    },
    setPuzzle: (state, action) => {
      state.puzzle = action.payload;
    },
    setRowCount: (state, action) => {
      state.puzzle.rowCount = action.payload;
      state.puzzle.cells = createGrid(
        state.puzzle.columnCount,
        state.puzzle.rowCount
      );
    },
    updateCell: (state, action) => {
      const newCell = action.payload;
      state.puzzle.cells[newCell.index] = newCell;
    },
  },
});

export const {
  setActiveStep,
  setName,
  setColumnCount,
  setPuzzle,
  setRowCount,
  updateCell,
} = designSlice.actions;

export default designSlice.reducer;
