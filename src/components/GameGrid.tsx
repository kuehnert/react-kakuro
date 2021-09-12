/* eslint-disable react-hooks/exhaustive-deps */
import classnames from 'classnames';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CellType,
  fetchGame,
  IBlankCell,
  ICell,
  IHintCell,
  INumberCell,
} from '../store/gameSlice';
import { RootState } from '../store/store';
import styles from './GameGrid.module.scss';
import BlankCell from './BlankCell';
import HintCell from './HintCell';
import NumberCell from './NumberCell';

const GameGrid: React.FC = () => {
  const game = useSelector((state: RootState) => state.game.game);
  const dispatch = useDispatch();

  const renderCell = (cell: ICell, index: number) => {
    if (cell.type === CellType.Blank) {
      return <BlankCell cell={cell as IBlankCell} index={index} />;
    } else if (cell.type === CellType.Hint) {
      return <HintCell cell={cell as IHintCell} index={index} />;
    } else {
      // type == Number
      return <NumberCell cell={cell as INumberCell} index={index} />;
    }
  };

  const renderGrid = () => {
    if (!game) {
      return;
    }

    return (
      <div className={styles.grid}>
        {game.cells.map((cell, i) => renderCell(cell, i))}
      </div>
    );
  };

  useEffect(() => {
    if (game == null) {
      dispatch(fetchGame());
    }
  }, []);

  return (
    <article className={classnames('main', styles.gamegrid)}>
      <p>GameGrid</p>
      {renderGrid()}
    </article>
  );
};

export default GameGrid;
