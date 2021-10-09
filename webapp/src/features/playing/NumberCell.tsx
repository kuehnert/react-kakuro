/* eslint-disable react-hooks/exhaustive-deps */
import classnames from 'classnames';
import React from 'react';
import { useDispatch } from 'react-redux';
import { INumberCell, setSelectedIndex } from '../../store/gameSlice';
import styles from './NumberCell.module.scss';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { calcGuessFontSize } from 'utils/calcCellSize';

export interface Props {
  cell: INumberCell;
  index: number;
}

const NumberCell: React.FC<Props> = ({ cell, index }) => {
  const { selectedIndex, zoomLevel, markWrong } = useSelector(
    (state: RootState) => state.game
  );
  const dispatch = useDispatch();
  const guessFontSize = calcGuessFontSize(zoomLevel);

  const handleClick = (event: React.MouseEvent) => {
    dispatch(setSelectedIndex(index));
  };

  const wrongGuess =
    markWrong && cell.solution > 0 && cell.guess !== cell.solution;

  return (
    <div
      className={classnames('gamecell', styles.number, {
        selected: index === selectedIndex,
      })}
      onClick={handleClick}>
      {cell.guess > 0 && (
        <div
          className={classnames(styles.guess, { wrongGuess })}
          style={guessFontSize}>
          {cell.guess}
        </div>
      )}
      {!cell.guess && cell.pencilMarks?.length > 0 && (
        <div className={classnames(styles.pencilMarks)}>
          {cell.pencilMarks.join('')}
        </div>
      )}
    </div>
  );
};

export default NumberCell;
