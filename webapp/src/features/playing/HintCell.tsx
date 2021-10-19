/* eslint-disable react-hooks/exhaustive-deps */
import classnames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { calcCellSize, calcHintFontSize } from 'utils/calcCellSize';
import { IHintCell } from '../../store/gameSlice';
import './HintCell.scss';

export interface Props {
  cell: IHintCell;
  index: number;
}

const HintCell: React.FC<Props> = ({ cell, index }) => {
  const { zoomLevel } = useSelector((state: RootState) => state.game);
  const style = calcCellSize(zoomLevel);
  const fontSize = calcHintFontSize(zoomLevel);

  return (
    <div className={classnames('gamecell', 'hintCell')} style={style}>
      <div className='horizontalHint' style={fontSize}>
        {cell.hints[0]?.sumSolved}
      </div>
      <div className='verticalHint' style={fontSize}>
        {cell.hints[1]?.sumSolved}
      </div>
    </div>
  );
};

export default HintCell;
