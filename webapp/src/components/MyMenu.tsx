import myHistory from 'myHistory';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import React from 'react';

const MyMenu: React.FC = () => {
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
    },
    {
      label: 'Play Puzzle',
      icon: 'mdi mdi-play',
      command: () => myHistory.push('/play'),
    },
  ];

  const endItem = (
    <Button
      label='Sign Up/Sign In'
      icon='mdi mdi-login'
      onClick={() => myHistory.push('/signin')}
    />
  );

  return <Menubar model={menuItems} start={<h3>Mr K.'s Kakuro</h3>} end={endItem} />;
};

export default MyMenu;
