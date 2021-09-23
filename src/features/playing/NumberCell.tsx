/* eslint-disable react-hooks/exhaustive-deps */
import classnames from 'classnames';
import React from 'react';
import { useDispatch } from 'react-redux';
import { INumberCell, setSelectedIndex } from '../../store/gameSlice';
import styles from './NumberCell.module.scss';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';

export interface Props {
  cell: INumberCell;
  index: number;
}

const NumberCell: React.FC<Props> = ({ cell, index }) => {
  const selectedIndex = useSelector(
    (state: RootState) => state.game.selectedIndex
  );
  const dispatch = useDispatch();

  const handleClick = (event: React.MouseEvent) => {
    dispatch(setSelectedIndex(index));
  };

  return (
    <div
      className={classnames('gamecell', styles.number, {
        selected: index === selectedIndex,
      })}
      onClick={handleClick}>
      {cell.guess > 0 && (
        <div className={classnames(styles.guess)}>{cell.guess}</div>
      )}
      {!cell.guess && cell.pencilMarks?.length > 0 && (
        <div className={classnames(styles.pencilMarks)}>{cell.pencilMarks.join('')}</div>
      )}
    </div>
  );
};

export default NumberCell;
