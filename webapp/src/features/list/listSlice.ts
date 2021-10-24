import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import kakuroApi from 'api/kakuroApi';
import { setErrorAlert } from 'features/alerts/alertSlice';
import { IBaseGame } from 'models/cellModels';
import { AppThunk } from 'store/store';
import authHeader from 'utils/authHeader';

export interface IListGame extends IBaseGame {
  cellString: string;
  createdAt: Date;
}

type ListSliceState = {
  list: IListGame[];
  choice?: IListGame;
  solved: string[];
};

const initialState: ListSliceState = {
  list: [],
  solved: [],
};

export const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    fetchListSuccess: (state, action: PayloadAction<IListGame[]>) => {
      state.list = action.payload;
    },
    fetchSolvedSuccess: (state, action: PayloadAction<string[]>) => {
      state.solved = action.payload;
    },
    addPuzzleToList: (state, action: PayloadAction<IListGame>) => {
      state.list.push(action.payload);
    },
    setChoiceID: (state, action: PayloadAction<IListGame>) => {
      state.choice = action.payload;
    },
  },
});

export const { addPuzzleToList, fetchListSuccess, fetchSolvedSuccess, setChoiceID } =
  listSlice.actions;

export default listSlice.reducer;

export const fetchList = (): AppThunk => async (dispatch: any) => {
  let list;

  try {
    const response = await kakuroApi.get('/puzzles');
    list = response.data;
  } catch (error) {
    console.error('error:', error);
    dispatch(setErrorAlert('Puzzles konnten nicht geladen werden.'));
  }

  dispatch(fetchListSuccess(list));
};

export const fetchSolved = (): AppThunk => async (dispatch: any) => {
  let solved;

  try {
    const response = await kakuroApi.get('/users/solved', { headers: authHeader() });
    solved = response.data;
  } catch (error) {
    console.error('error:', error);
    dispatch(setErrorAlert('Liste gelöster Puzzles konnten nicht geladen werden.'));
  }

  dispatch(fetchSolvedSuccess(solved));
};

export const importPuzzle = (size: string): AppThunk => async (dispatch: any) => {
  let puzzle;

  try {
    const response = await kakuroApi.post('/puzzles/steal', { size }, { headers: authHeader() });
    puzzle = response.data;
  } catch (error) {
    console.error('error:', error);
    dispatch(setErrorAlert('Fehler beim Importieren eines Puzzles.'));
  }

  dispatch(addPuzzleToList(puzzle));
};
