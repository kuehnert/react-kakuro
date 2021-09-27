import myHistory from 'myHistory';
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

  return <Menubar model={menuItems} start={<h3>Mr K.'s Kakuro</h3>} />;
};

export default MyMenu;
