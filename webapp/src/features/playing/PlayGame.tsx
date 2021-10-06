import myHistory from 'myHistory';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CellType,
  IGameData,
  setGuess,
  setSelectedIndex,
} from '../../store/gameSlice';
import { RootState } from '../../store/store';
import './Cell.scss';
import CombinationLine from './CombinationLine';
import Controls from './Controls';
import GameGrid from './GameGrid';

const PlayGame: React.FC = () => {
  const { game, selectedIndex } = useSelector((state: RootState) => state.game);
  const { cells } = game as IGameData;
  const dispatch = useDispatch();

  useEffect(() => {
    if (game.state < 0) {
      myHistory.push('/');
    }
  });

  const handleKeyPress = (event: any) => {
    if (!selectedIndex) {
      // do nothing if no cell selected
      return;
    }
    if (event.key === 'ArrowUp' && game) {
      const newSelectedIndex = selectedIndex - game.columnCount;
      if (
        newSelectedIndex > game.columnCount &&
        cells[newSelectedIndex].type === CellType.NumberCell
      ) {
        dispatch(setSelectedIndex(newSelectedIndex));
      }
    } else if (event.key === 'ArrowDown' && game) {
      const newSelectedIndex = selectedIndex + game.columnCount;
      if (
        newSelectedIndex < cells.length &&
        cells[newSelectedIndex].type === CellType.NumberCell
      ) {
        dispatch(setSelectedIndex(newSelectedIndex));
      }
    } else if (event.key === 'ArrowLeft' && game) {
      const newSelectedIndex = selectedIndex - 1;
      if (
        newSelectedIndex > game.columnCount &&
        cells[newSelectedIndex].type === CellType.NumberCell
      ) {
        dispatch(setSelectedIndex(newSelectedIndex));
      }
    } else if (event.key === 'ArrowRight' && game) {
      const newSelectedIndex = selectedIndex + 1;
      if (
        newSelectedIndex < cells.length &&
        cells[newSelectedIndex].type === CellType.NumberCell
      ) {
        dispatch(setSelectedIndex(newSelectedIndex));
      }
    } else if (event.key >= '0' && event.key <= '9') {
      dispatch(setGuess({ index: selectedIndex, guess: +event.key }));
    } else if (event.key === 'Delete') {
      dispatch(setGuess({ index: selectedIndex, guess: 0 }));
    } else {
      console.log('Key pressed:', event.key);
    }
  };

  return (
    <>
      <div className='content' onKeyDown={handleKeyPress}>
        <GameGrid />
        <Controls />
      </div>

      <CombinationLine />
    </>
  );
};

export default PlayGame;
