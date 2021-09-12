/* eslint-disable react-hooks/exhaustive-deps */
import classnames from 'classnames';
import React from 'react';
import styles from './BlankCell.module.scss';
import { fetchGame, IBlankCell, IHintCell, INumberCell } from '../store/gameSlice';

export interface Props {
  cell: IBlankCell;
  index: number;
}

const BlankCell: React.FC<Props> = ({ cell, index }) => {
  return <div className={classnames(styles.gamecell, styles.blank)}></div>;
};

export default BlankCell;
