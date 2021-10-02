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
  setGuess,
} from '../../store/gameSlice';
import { RootState } from '../../store/store';
import BlankCell from './BlankCell';
import './Cell.scss';
import styles from './GameGrid.module.scss';
import HintCell from './HintCell';
import NumberCell from './NumberCell';

const GameGrid: React.FC = () => {
  const { game, selectedIndex } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  const handleKeyPress = (event: any) => {
    if (!selectedIndex) {
      // do nothing if no cell selected
      return;
    }

    if (event.key >= '0' && event.key <= '9') {
      dispatch(setGuess({ index: selectedIndex, guess: +event.key }));
    } else if (event.key === 'Delete') {
      dispatch(setGuess({ index: selectedIndex, guess: 0 }));
    } else {
      console.log('Key pressed:', event.key);
    }
  };

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
    if (!game) {
      return;
    }

    return (
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${game!.columnCount}, 1fr)`,
          gridTemplateRows: `repeat(${game!.rowCount}, 1fr)`,
        }}>
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
    <div className={classnames('main', styles.gameBackground)}>
      <div className={styles.gamegrid} onKeyDown={handleKeyPress} tabIndex={-1}>
        {renderGrid()}
      </div>
    </div>
  );
};

export default GameGrid;
