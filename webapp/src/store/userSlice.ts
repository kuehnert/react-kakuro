import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { decode } from 'jsonwebtoken';
import kakuroApi from '../api/kakuroApi';
import authHeader from '../utils/authHeader';
import { AppThunk } from './store';

export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface ISigninValues {
  email: string;
  password: string;
}

export interface ISignUpValues extends ISigninValues {
  name: string;
}

export interface IUserState {
  isLoggedIn: boolean;
  isRequesting: boolean;
  user: IUser | null;
  error: string | null;
}

export interface IUnauthorizedPayload {
  resourceType: string;
  resources: string[];
  // status: number;
  // message: string;
  response: any;
}

// TODO: check token
let user;
console.log('userSlice: loading user from storage...');
try {
  const storeduser = localStorage.getItem('user');
  user = storeduser != null ? JSON.parse(storeduser) : null;
  const token = localStorage.getItem('token');

  if (token) {
    let decoded: any = decode(token);

    if (Date.now() >= decoded.exp * 1000) {
      console.log('token expired');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      user = null;
    }
  }
} catch (error) {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  user = null;
}

const initialState: IUserState = {
  isLoggedIn: user == null ? false : true,
  isRequesting: false,
  user,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      state.isLoggedIn = action.payload != null;
      state.error = null;
      state.isRequesting = false;
    },
    logoutFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.user = null;
      state.isLoggedIn = false;
      state.isRequesting = false;
    },
    logoutSuccess(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      state.isRequesting = false;
    },
    signUpSuccess(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      state.isLoggedIn = action.payload != null;
      state.error = null;
      state.isRequesting = false;
    },
    signUpFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.user = null;
      state.isLoggedIn = false;
      state.isRequesting = false;
    },
    submitting(state) {
      state.isRequesting = true;
    },
    requestFailed(state, action: PayloadAction<IUnauthorizedPayload>) {
      console.log('action.payload:', action.payload);

      // console.log('state:', state);
      // console.log('action:', action);
      const code = action.payload.response.status;

      if (code === 401 || code === 403) {
        // Unauthorized
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
        state.isRequesting = false;
      }
    },
  },
});

export const {
  loginSuccess,
  logoutFailed,
  logoutSuccess,
  requestFailed,
  signUpFailed,
  signUpSuccess,
  submitting,
} = userSlice.actions;

export default userSlice.reducer;

export const login =
  (values: ISigninValues): AppThunk =>
  async dispatch => {
    dispatch(submitting());
    let user, token;
    try {
      const response = await kakuroApi.post('/users/login', values);
      user = response.data.user;
      token = response.data.token;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } catch ({ response }) {
      dispatch(
        requestFailed({ resourceType: 'users', resources: [], response })
      );
      // dispatch(
      //   setAlert({
      //     type: 'error',
      //     message: 'Beim Anmelden gab es einen Fehler. Bitte probieren Sie es später noch einmal.',
      //   }),
      // );
      return;
    }

    dispatch(loginSuccess(user));
    // dispatch(setAlert({ type: 'success', message: 'Sie haben sich erfolgreich angemeldet.' }));
  };

export const logout = (): AppThunk => async dispatch => {
  try {
    await kakuroApi.post('/users/logout', null, { headers: authHeader() });
  } catch ({ response }) {
    dispatch(logoutFailed(JSON.stringify(response)));
    return;
  } finally {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  dispatch(logoutSuccess());
  // dispatch(setAlert({ type: 'success', message: 'Sie haben sich erfolgreich abgemeldet.' }));
};

export const signUp =
  (values: ISignUpValues): AppThunk =>
  async dispatch => {
    dispatch(submitting());
    let user, token;
    try {
      const response = await kakuroApi.post('/users', values);
      user = response.data.user;
      token = response.data.token;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } catch ({ response }: any) {
      console.log('response:', response);
      dispatch(signUpFailed("Unable to sign up"));
      // dispatch(
      //   setAlert({
      //     type: 'error',
      //     message: 'Beim Anmelden gab es einen Fehler. Bitte probieren Sie es später noch einmal.',
      //   }),
      // );
      return;
    }

    dispatch(loginSuccess(user));
    // dispatch(setAlert({ type: 'success', message: 'Sie haben sich erfolgreich angemeldet.' }));
  };
