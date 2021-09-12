import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from './store';
import axios from 'axios';
import makeCombinations, { ICombinations } from '../helpers/makeCombinations';

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
  columnCount: number;
  cells: ICell[];
}

export interface IGuess {
  index: number;
  guess: number;
}

/* State */
type GameSliceState = {
  game?: IGameData;
  combinations?: ICombinations;
  selectedIndex?: number;
  hintHorizontal?: number;
  sumHorizontal?: number;
  countHorizontal?: number;
};

const initialState: GameSliceState = {};

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

      // Find corresponding hint cell horizontally
      while (state.game?.cells[currentIndex].type === CellType.Number) {
        currentIndex--;
      }

      state.hintHorizontal = currentIndex;
      state.sumHorizontal = (
        state.game?.cells[currentIndex] as IHintCell
      ).hintHorizontal;

      // Find count of cells for this hint
      currentIndex = action.payload;
      while ((currentIndex+1) % state.game!.columnCount !== 0 && state.game?.cells[currentIndex + 1].type === CellType.Number) {
        currentIndex++;
      }

      state.countHorizontal = currentIndex - state.hintHorizontal;
    },
    setGuess(state, action: PayloadAction<IGuess>) {
      const { index, guess } = action.payload;
      const newGame: IGameData = JSON.parse(JSON.stringify(state.game));
      const currentCell: INumberCell = newGame.cells[index] as INumberCell;
      if (currentCell.type === CellType.Number) {
        currentCell.guess = guess;
        state.game = newGame;
      }
    },
    autoPencil(state, action: PayloadAction) {
      console.log('autoPencil Not Implemented Yet!');
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
