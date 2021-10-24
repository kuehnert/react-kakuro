/* eslint-disable react-hooks/exhaustive-deps */
import { setErrorAlert } from 'features/alerts/alertSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router';

export type ProtectedRouteProps = {
  isAuthenticated: boolean;
  authenticationPath: string;
} & RouteProps;

export default function ProtectedRoute({
  isAuthenticated,
  authenticationPath,
  ...routeProps
}: ProtectedRouteProps) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(setErrorAlert('You must be signed in to do this.'));
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return <Route {...routeProps} />;
  } else {
    return <Redirect to={{ pathname: authenticationPath }} />;
  }
}
