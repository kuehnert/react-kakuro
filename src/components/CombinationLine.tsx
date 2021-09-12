/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
// import classnames from 'classnames';
// import styles from './HintCell.module.scss';
import styles from './CombinationLine.module.scss';

const CombinationLine: React.FC = () => {
  const { combinations, sumHorizontal, countHorizontal } = useSelector(
    (state: RootState) => state.game
  );

  const renderPossibility = (a: number[]) => {
    return <span className={styles.possibility}>{a.join('')}</span>;
  };

  const renderPossibilities = (a: number[][]) => {
    return <span>{a.map(b => renderPossibility(b))}</span>;
  };

  if (!sumHorizontal && !countHorizontal) {
    return null;
  }

  const possibilities = combinations![countHorizontal!][sumHorizontal!];

  return (
    <div>
      <span>{sumHorizontal}:</span>
      {renderPossibilities(possibilities)}
    </div>
  );
};

export default CombinationLine;
