/* eslint-disable react-hooks/exhaustive-deps */
import classnames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { calcCellSize } from 'utils/calcCellSize';
import { IBlankCell } from '../../store/gameSlice';
import styles from './BlankCell.module.scss';

export interface Props {
  cell: IBlankCell;
  index: number;
}

const BlankCell: React.FC<Props> = ({ cell, index }) => {
  const { zoomLevel } = useSelector((state: RootState) => state.game);
  const style = calcCellSize(zoomLevel);

  return (
    <div className={classnames('gamecell', styles.blank)} style={style}></div>
  );
};

export default BlankCell;
