/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  BlankCell,
  Cell,
  CellType,
  HintCell,
  IGameData,
  NumberCell,
  Row,
} from '../data/GameData';
import styles from './GameCell.module.scss';
import classnames from 'classnames';

export interface Props {
  cell: Cell;
}

const GameCell: React.FC<Props> = ({ cell }) => {
  const renderBlankCell = (cell: Cell) => {
    return <div className={classnames(styles.gamecell, styles.blank)}></div>;
  };

  const renderHintCell = (cell: HintCell) => {
    return (
      <div className={classnames(styles.gamecell, styles.hint)}>
        <div className={styles.horizontalHint}>{cell.hintHorizontal}</div>
        <div className={styles.verticalHint}>{cell.hintVertical}</div>
      </div>
    );
  };

  const renderNumberCell = (cell: NumberCell) => {
    console.log('cell', cell);

    return (
      <div className={classnames(styles.gamecell, styles.number)}>
        <div className={classnames(styles.guess)}>{cell.guess}</div>
      </div>
    );
  };

  if (cell.type === CellType.Blank) {
    return renderBlankCell(cell);
  } else if (cell.type === CellType.Hint) {
    return renderHintCell(cell as HintCell);
  } else {
    // type == Number
    return renderNumberCell(cell as NumberCell);
  }
};

export default GameCell;
