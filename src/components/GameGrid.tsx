/* eslint-disable react-hooks/exhaustive-deps */
import classnames from 'classnames';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CellType,
  fetchCombinations,
  fetchGame,
  IBlankCell,
  ICell,
  IHintCell,
  INumberCell,
  setGuess
} from '../store/gameSlice';
import { RootState } from '../store/store';
import BlankCell from './BlankCell';
import './Cell.scss';
import CombinationLine from './CombinationLine';
import styles from './GameGrid.module.scss';
import HintCell from './HintCell';
import NumberCell from './NumberCell';

const GameGrid: React.FC = () => {
  const { combinations, game, selectedIndex, sumHorizontal, countHorizontal } =
    useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  const handleKeyPress = (event: any) => {
    if (!selectedIndex) {
      // do nothing if no cell selected
      return;
    }

    if (event.key >= '0' && event.key <= '9') {
      dispatch(setGuess({ index: selectedIndex, guess: +event.key }));
    } else if (event.key === 'Delete') {
      dispatch(setGuess({ index: selectedIndex, guess: -1 }));
    } else {
      console.log('Key pressed:', event.key);
    }
  };

  const renderCell = (cell: ICell, index: number) => {
    if (cell.type === CellType.Blank) {
      return <BlankCell cell={cell as IBlankCell} index={index} key={index} />;
    } else if (cell.type === CellType.Hint) {
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
      <div className={styles.grid}>
        {game.cells.map((cell, i) => renderCell(cell, i))}
      </div>
    );
  };

  useEffect(() => {
    if (game == null) {
      dispatch(fetchGame());
    }
    if (combinations == null) {
      dispatch(fetchCombinations());
    }
  }, []);

  return (
    <article
      className={classnames('main', styles.gamegrid)}
      onKeyDown={handleKeyPress}
      tabIndex={-1}>
      {renderGrid()}
      <CombinationLine />
    </article>
  );
};

export default GameGrid;
