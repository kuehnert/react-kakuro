import CombinationLine from './CombinationLine';
import React from 'react';
import Controls from './Controls';
import GameGrid from './GameGrid';

const PlayGame: React.FC = () => {
  return (
    <>
      <div className='content'>
        <GameGrid />
        <Controls />
      </div>

      <CombinationLine />
    </>
  );
};

export default PlayGame;
