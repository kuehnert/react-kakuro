import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import kakuroApi from 'api/kakuroApi';
import { setErrorAlert, setSuccessAlert } from 'features/alerts/alertSlice';
import { AppThunk } from 'store/store';
import { IBaseGame } from '../../store/gameSlice';

export interface IListGame extends IBaseGame {
  cellString: string;
  createdAt: Date;
  _id: string;
}

type ListSliceState = {
  list: IListGame[];
  choice?: IListGame;
};

const initialState: ListSliceState = {
  list: [],
};

export const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    fetchListSuccess: (state, action: PayloadAction<IListGame[]>) => {
      state.list = action.payload;
    },
    setChoiceID: (state, action: PayloadAction<IListGame>) => {
      state.choice = action.payload;
    },
  },
});

export const { fetchListSuccess, setChoiceID } = listSlice.actions;

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

  dispatch(setSuccessAlert('Puzzles wurden geladen.'));
  dispatch(fetchListSuccess(list));
};
