/* eslint-disable react-hooks/exhaustive-deps */
import classnames from 'classnames';
import React from 'react';
import { IHintCell } from '../../store/gameSlice';
import './HintCell.scss';

export interface Props {
  cell: IHintCell;
  index: number;
}

const HintCell: React.FC<Props> = ({ cell, index }) => {
  return (
    <div className={classnames('gamecell', 'hintCell')}>
      <div className='horizontalHint'>{cell.hintHorizontal}</div>
      <div className='verticalHint'>{cell.hintVertical}</div>
    </div>
  );
};

export default HintCell;
