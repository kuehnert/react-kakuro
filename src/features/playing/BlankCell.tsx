/* eslint-disable react-hooks/exhaustive-deps */
import classnames from 'classnames';
import React from 'react';
import { IBlankCell } from '../../store/gameSlice';
import styles from './BlankCell.module.scss';

export interface Props {
  cell: IBlankCell;
  index: number;
}

const BlankCell: React.FC<Props> = ({ cell, index }) => {
  return <div className={classnames('gamecell', styles.blank)}></div>;
};

export default BlankCell;
