/* eslint-disable react-hooks/exhaustive-deps */
import classnames from 'classnames';
import React from 'react';
import { INumberCell } from '../store/gameSlice';
import styles from './NumberCell.module.scss';

export interface Props {
  cell: INumberCell;
  index: number;
}

const NumberCell: React.FC<Props> = ({ cell, index }) => {
  return (
    <div className={classnames(styles.gamecell, styles.number)}>
      <div className={classnames(styles.guess)}>{cell.guess}</div>
    </div>
  );
};

export default NumberCell;
