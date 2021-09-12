/* eslint-disable react-hooks/exhaustive-deps */
import classnames from 'classnames';
import React from 'react';
import styles from './HintCell.module.scss';
import { fetchGame, IBlankCell, IHintCell, INumberCell } from '../store/gameSlice';

export interface Props {
  cell: IHintCell;
  index: number;
}

const HintCell: React.FC<Props> = ({ cell, index }) => {
  return (
    <div className={classnames(styles.gamecell, styles.hint)}>
      <div className={styles.horizontalHint}>{cell.hintHorizontal}</div>
      <div className={styles.verticalHint}>{cell.hintVertical}</div>
    </div>
  );
};

export default HintCell;
