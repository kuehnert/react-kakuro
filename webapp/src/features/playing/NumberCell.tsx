/* eslint-disable react-hooks/exhaustive-deps */
import classnames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calcCellSize, calcGuessFontSize, calcPencilMarkFontSize } from 'utils/calcCellSize';
import { INumberCell, setSelectedIndex } from '../../store/gameSlice';
import { RootState } from '../../store/store';
import styles from './NumberCell.module.scss';

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
  const pencilMarkFontSize = calcPencilMarkFontSize(zoomLevel);

  const handleClick = (event: React.MouseEvent) => {
    dispatch(setSelectedIndex(index));
  };

  const renderPencilMarks = (pencilMarks: number[]) => {
    return pencilMarks.map(pm => (
      <div key={pm} className={styles[`digit${pm}`]} style={pencilMarkFontSize}>
        {pm}
      </div>
    ));
  };

  const cellStyle = calcCellSize(zoomLevel);

  const wrongGuess =
    markWrong && cell.solution > 0 && cell.guess !== cell.solution;

  return (
    <div
      className={classnames('gamecell', styles.number, {
        selected: index === selectedIndex,
      })}
      style={cellStyle}
      onClick={handleClick}>
      {cell.guess > 0 && (
        <div
          className={classnames(styles.guess, { wrongGuess })}
          style={guessFontSize}>
          {cell.guess}
        </div>
      )}
      {!cell.guess && cell.pencilMarks?.length > 0 && (
        <div className={classnames(styles.pencilMarks)} style={{}}>
          {renderPencilMarks(cell.pencilMarks)}
        </div>
      )}
    </div>
  );
};

export default NumberCell;
