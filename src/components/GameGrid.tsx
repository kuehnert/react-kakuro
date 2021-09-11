/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { IGameData, Row } from '../data/GameData';
import loadGame from '../data/loadGame';
import styles from './GameGrid.module.scss';
import classnames from 'classnames';
import GameCell from './GameCell';

const GameGrid: React.FC = () => {
  const [game, setGame] = useState<IGameData | null>(null);

  const renderRow = (row: Row, i: number) => {
    return (
      <React.Fragment key={i}>
        {row.cells.map((cell, i) => (
          <GameCell cell={cell} key={i} />
        ))}
      </React.Fragment>
    );
  };

  const renderGrid = () => {
    return (
      <div className={styles.grid}>{game!.rows.map((row, i) => renderRow(row, i))}</div>
    );
  };

  useEffect(() => {
    async function load() {
      const newGame = await loadGame();
      setGame(newGame);
    }

    if (game == null) {
      load();
    }
  }, []);

  return (
    <article className={classnames('main', styles.gamegrid)}>
      <p>GameGrid</p>
      {game != null && renderGrid()}
    </article>
  );
};

export default GameGrid;
