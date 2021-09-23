/* eslint-disable react-hooks/exhaustive-deps */
import classnames from 'classnames';
import React from 'react';
import { IHintCell } from '../../store/gameSlice';
import styles from './HintCell.module.scss';

export interface Props {
  cell: IHintCell;
  index: number;
}

const HintCell: React.FC<Props> = ({ cell, index }) => {
  return (
    <div className={classnames('gamecell', styles.hint)}>
      <div className={styles.horizontalHint}>{cell.hintHorizontal}</div>
      <div className={styles.verticalHint}>{cell.hintVertical}</div>
    </div>
  );
};

export default HintCell;
