import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AlertType {
  severity: string;
  summary: string;
  detail?: string;
}

type GlobalSliceState = {
  alerts: {
    [key: string]: AlertType;
  };
  pageTitle: string | null;
  isFetching: boolean;
  notFound: string | null;
};

const initialState = {
  alerts: {},
  pageTitle: null,
  isFetching: false,
  notFound: null,
};

export const alertSlice = createSlice({
  name: 'alerts',
  initialState: initialState as GlobalSliceState,
  reducers: {
    clearAlert(state, action: PayloadAction<string>) {
      delete state.alerts[action.payload];
    },
    setAlert(state, action: PayloadAction<AlertType>) {
      const alert = action.payload;
      state.alerts[alert.severity] = alert;
      state.isFetching = false;
    },
    setNotFound(state, action: PayloadAction<string | null>) {
      state.notFound = action.payload;
    },
    setErrorAlert(state, action: PayloadAction<string>) {
      const alert = { severity: 'error', summary: action.payload };
      state.alerts[alert.severity] = alert;
      state.isFetching = false;
    },
    setSuccessAlert(state, action: PayloadAction<string>) {
      const alert = { severity: 'success', summary: action.payload };
      state.alerts[alert.severity] = alert;
      state.isFetching = false;
    },
    setIsFetching(state, action: PayloadAction<boolean>) {
      state.isFetching = action.payload;
    },
    setPageTitle(state, action: PayloadAction<string>) {
      state.pageTitle = action.payload;
      document.title = action.payload;
    },
  },
});

export const {
  clearAlert,
  setAlert,
  setErrorAlert,
  setSuccessAlert,
  setIsFetching,
  setPageTitle,
  setNotFound,
} = alertSlice.actions;

export default alertSlice.reducer;
