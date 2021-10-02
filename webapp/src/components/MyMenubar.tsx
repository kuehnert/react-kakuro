import myHistory from 'myHistory';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import React from 'react';
import { RootState } from 'store/store';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'store/userSlice';
import styles from './MyMenubar.module.scss';

const MyMenubar: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.users);

  const startItem = (
    <div className={styles.startItem}>
      <h3>Mr K.'s Kakuro</h3>
    </div>
  );

  const menuItems = [
    {
      label: 'Menu',
      icon: 'mdi mdi-hamburger',
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

  return <Menubar model={menuItems} start={startItem} end={endItem} />;
};

export default MyMenubar;
