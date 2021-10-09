/* eslint-disable react-hooks/exhaustive-deps */
import {
  CellType,
  IGameData,
  setGuess,
  setSelectedIndex,
} from '../store/gameSlice';
import useEventListener from 'hooks/useEventListener';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';

const KeyboardListener: React.FC = () => {
  const dispatch = useDispatch();
  const { game, selectedIndex } = useSelector((state: RootState) => state.game);
  const { cells } = game as IGameData;

  const selectCell = (newIndex: number) => {
    if (
      newIndex > game.columnCount &&
      newIndex < cells.length &&
      cells[newIndex].type === CellType.NumberCell
    ) {
      dispatch(setSelectedIndex(newIndex));
    }
  };

  const handleKeyDown = useCallback(
    ({ key }) => {
      // console.log(`handleKeyDown(${key})`);

      if (!selectedIndex) {
        // do nothing if no cell selected
        return;
      }
      if (key === 'ArrowUp' && game) {
        selectCell(selectedIndex - game.columnCount);
      } else if (key === 'ArrowDown' && game) {
        selectCell(selectedIndex + game.columnCount);
      } else if (key === 'ArrowLeft' && game) {
        selectCell(selectedIndex - 1);
      } else if (key === 'ArrowRight' && game) {
        selectCell(selectedIndex + 1);
      } else if (key >= '0' && key <= '9') {
        dispatch(setGuess({ index: selectedIndex, guess: +key }));
      } else if (key === 'Delete') {
        dispatch(setGuess({ index: selectedIndex, guess: 0 }));
      } else {
        console.log('Key pressed:', key);
      }
    },
    [selectedIndex]
  );

  useEventListener('keydown', handleKeyDown);
  return <></>;
};

export default KeyboardListener;
