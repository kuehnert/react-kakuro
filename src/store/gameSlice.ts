import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from './store';
import axios from 'axios';

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
  pencilMarks: boolean[];
  guess: number;
  solution: number;
}

export interface IGameData {
  name: string;
  level: Difficulty;
  cells: ICell[];
}

/* State */
type GameSliceState = {
  game?: IGameData;
};

const initialState: GameSliceState = {};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    fetchGameSuccess(state, action: PayloadAction<IGameData>) {
      state.game = action.payload;
    },
  },
});

export const { fetchGameSuccess } = gameSlice.actions;

export default gameSlice.reducer;

export const fetchGame = (): AppThunk => async (dispatch: any) => {
  let game;
  try {
    const response = await axios.get('/puzzles/sample.json', {
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
