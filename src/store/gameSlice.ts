import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import getHints from 'helpers/getHints';
import makePencilmarks from 'helpers/makePencilmarks';
import makeCombinations, { ICombinations } from '../helpers/makeCombinations';
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
  Blank = 0,
  Hint = 1,
  Number = 2,
}

export interface ICell {
  type: CellType;
}

export interface IBlankCell extends ICell {
  type: CellType.Blank;
}

export interface IHintCell extends ICell {
  type: CellType.Hint;
  hintHorizontal?: number;
  hintVertical?: number;
}

export interface INumberCell extends ICell {
  type: CellType.Number;
  pencilMarks: number[];
  guess: number;
  solution: number;
}

export interface IGameData {
  name: string;
  level: Difficulty;
  columnCount: number;
  cells: ICell[];
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
  game?: IGameData;
  combinations?: ICombinations;
  selectedIndex?: number;
  hints: IHintValues[];
};

const initialState: GameSliceState = {
  hints: [
    { index: -1, sum: -1, count: -1, used: new Array<number>() },
    { index: -1, sum: -1, count: -1, used: new Array<number>() },
  ],
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    fetchGameSuccess(state, action: PayloadAction<IGameData>) {
      state.game = action.payload;
    },
    fetchCombinations(state, action: PayloadAction) {
      state.combinations = makeCombinations();
    },
    setSelectedIndex(state, action: PayloadAction<number>) {
      let currentIndex = action.payload;
      state.selectedIndex = currentIndex;
      state.hints = getHints(state.game!, currentIndex);
    },
    setGuess(state, action: PayloadAction<IGuess>) {
      const { index, guess } = action.payload;
      const newGame: IGameData = JSON.parse(JSON.stringify(state.game));
      const currentCell: INumberCell = newGame.cells[index] as INumberCell;
      if (currentCell.type === CellType.Number) {
        currentCell.guess = +guess;
        state.game = newGame;
      }
      state.hints = getHints(state.game!, index);
    },
    autoPencil(state, action: PayloadAction) {
      makePencilmarks(state.game!, state.combinations!);
    },
  },
});

export const {
  fetchGameSuccess,
  fetchCombinations,
  setSelectedIndex,
  setGuess,
  autoPencil,
} = gameSlice.actions;

export default gameSlice.reducer;

export const fetchGame = (): AppThunk => async (dispatch: any) => {
  let game;
  try {
    const response = await axios.get('puzzles/sample.json', {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    game = response.data;
  } catch (error) {
    // TODO: Show error
    // dispatch(setErrorAlert(`error fetching downloads`));
    return;
  }

  dispatch(fetchGameSuccess(game));
};
