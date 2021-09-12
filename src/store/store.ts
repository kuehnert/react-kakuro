import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';

export const rootReducer = combineReducers({
  game: gameReducer,
});

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
export type AppDispatch = typeof store.dispatch;

export default store;
