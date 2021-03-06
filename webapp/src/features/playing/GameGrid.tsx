import classnames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { calcBoardSize } from 'utils/calcCellSize';
import {
  CellType,
  IBlankCell,
  ICell,
  IHintCell,
  INumberCell,
} from '../../models/cellModels';
import { RootState } from '../../store/store';
import BlankCell from './BlankCell';
import './Cell.scss';
import styles from './GameGrid.module.scss';
import HintCell from './HintCell';
import NumberCell from './NumberCell';

const GameGrid: React.FC = () => {
  const { game, zoomLevel } = useSelector((state: RootState) => state.game);
  const { columnCount, rowCount } = game;

  const renderCell = (cell: ICell, index: number) => {
    if (cell.type === CellType.BlankCell) {
      return <BlankCell cell={cell as IBlankCell} index={index} key={index} />;
    } else if (cell.type === CellType.HintCell) {
      return <HintCell cell={cell as IHintCell} index={index} key={index} />;
    } else {
      // type == Number
      return (
        <NumberCell cell={cell as INumberCell} index={index} key={index} />
      );
    }
  };

  const renderGrid = () => {
    return (
      <div
        className={classnames(styles.grid)}
        style={{
          gridTemplateColumns: `repeat(${game!.columnCount}, 1fr)`,
          gridTemplateRows: `repeat(${game!.rowCount}, 1fr)`,
        }}>
        {game.cells.map((cell, i) => renderCell(cell, i))}
      </div>
    );
  };

  return (
    <div className={classnames(styles.gameBackground)}>
      <div
        className={classnames(styles.gridContainer)}
        style={calcBoardSize(columnCount, rowCount, zoomLevel)}>
        {renderGrid()}
      </div>
    </div>
  );
};

export default GameGrid;
