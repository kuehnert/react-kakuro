import myHistory from 'myHistory';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import React from 'react';
import { RootState } from 'store/store';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'store/userSlice';

const MyMenu: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const menuItems = [
    {
      label: 'Menu',
      icon: 'mdi mdi-dots-horizontal',
      command: () => myHistory.push('/'),
    },
    {
      label: 'Design Puzzle',
      icon: 'mdi mdi-pencil',
      command: () => myHistory.push('/create'),
      disabled: user == null,
    },
    {
      label: 'Play Puzzle',
      icon: 'mdi mdi-play',
      command: () => myHistory.push('/play'),
    },
  ];

  const endItem = user ? (
    <Button
      label={`Sign Out ${user.name}`}
      icon='mdi mdi-logout'
      onClick={() => dispatch(logout())}
    />
  ) : (
    <Button
      label='Sign Up/Sign In'
      icon='mdi mdi-login'
      onClick={() => myHistory.push('/signin')}
    />
  );

  return (
    <Menubar model={menuItems} start={<h3>Mr K.'s Kakuro</h3>} end={endItem} />
  );
};

export default MyMenu;
