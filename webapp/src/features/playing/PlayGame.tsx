import CombinationLine from './CombinationLine';
import React, { useEffect } from 'react';
import Controls from './Controls';
import GameGrid from './GameGrid';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import myHistory from 'myHistory';

const PlayGame: React.FC = () => {
  const game = useSelector((state: RootState) => state.game);

  useEffect(() => {
    if (!game.game) {
      myHistory.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
