/* eslint-disable react-hooks/exhaustive-deps */
import getCombinations from 'helpers/getCombinations';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import styles from './CombinationLine.module.scss';

const CombinationLine: React.FC = () => {
  const { combinations, hints } = useSelector((state: RootState) => state.game);

  const renderDigit = (d: number, direction: number) => {
    if (hints[direction].used.includes(d)) {
      return <span className={styles.highlight}>{d}</span>;
    } else {
      return <span>{d}</span>;
    }
  };

  const renderPossibility = (a: number[], direction: number) => {
    return (
      <span className={styles.possibility} key={a.join('')}>
        {a.map(d => renderDigit(d, direction))}
      </span>
    );
  };

  const renderPossibilities = (a: number[][], direction: number) => {
    return <span>{a.map(b => renderPossibility(b, direction))}</span>;
  };

  if (hints[0].index === -1) {
    return null;
  }

  const renderLine = (direction: number) => (
    <div className=''>
      <span>{hints[direction].sum}:</span>
      {renderPossibilities(possibilities[direction], direction)}
    </div>
  );

  const possibilities = [getCombinations(hints[0], combinations!), getCombinations(hints[1], combinations!)];

  return (
    <div className={styles.combinations}>
      {renderLine(0)}
      {renderLine(1)}
    </div>
  );
};

export default CombinationLine;
