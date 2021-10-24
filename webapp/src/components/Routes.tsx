import ProtectedRoute, { ProtectedRouteProps } from 'components/ProtectedRoute';
import CreateGame from 'features/creating/CreateGame';
import MainMenu from 'features/menu/MainMenu';
import PlayGame from 'features/playing/PlayGame';
import SignIn from 'features/users/SignIn';
import SignUp from 'features/users/SignUp';
import myHistory from 'myHistory';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import { RootState } from 'store/store';

const Routes: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.users);

  const prot: ProtectedRouteProps = {
    isAuthenticated: user != null,
    authenticationPath: '/signin',
  };

  return (
    <Router history={myHistory}>
      <Switch>
        <ProtectedRoute {...prot} path='/create' component={CreateGame} />
        <Route path='/play' component={PlayGame} />
        <Route path='/signin' component={SignIn} />
        <Route path='/signup' component={SignUp} />
        <Route path='/' component={MainMenu} />
      </Switch>
    </Router>
  );
};

export default Routes;
