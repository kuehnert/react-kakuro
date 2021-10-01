import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import designReducer from './designSlice';
import userReducer from './userSlice';

export const rootReducer = combineReducers({
  game: gameReducer,
  design: designReducer,
  user: userReducer,
});

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
export type AppDispatch = typeof store.dispatch;

export default store;
