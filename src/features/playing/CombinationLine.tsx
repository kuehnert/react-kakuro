/* eslint-disable react-hooks/exhaustive-deps */
import getCombinations from 'helpers/getCombinations';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styles from './CombinationLine.module.scss';

const CombinationLine: React.FC = () => {
  const { combinations, hints } = useSelector((state: RootState) => state.game);
  const [possibilities, setPossibilities] = useState<number[][][]>([[], []]);

  const renderDigit = (d: number, direction: number) => {
    if (hints[direction].used.includes(d)) {
      return <span className={styles.highlight}>{d}</span>;
    } else {
      return <span>{d}</span>;
    }
  };

  const renderPossibility = (a: number[], index: number, direction: number) => {
    return (
      <span className={styles.possibility} key={index}>
        {a.map(d => renderDigit(d, direction))}
      </span>
    );
  };

  const renderPossibilities = (a: number[][], direction: number) => {
    return <span>{a.map((b, i) => renderPossibility(b, i, direction))}</span>;
  };

  const renderLine = (direction: number) => (
    <>
      <span className={styles.sum}>{hints[direction].sum}:</span>
      {renderPossibilities(possibilities[direction], direction)}
    </>
  );

  useEffect(() => {
    if (hints[0].index > -1) {
      setPossibilities([
        getCombinations(hints[0], combinations!),
        getCombinations(hints[1], combinations!),
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hints]);

  return (
    <div className={styles.combinations}>
      <div className={styles.text}>
        <div>{hints && renderLine(0)}</div>
        <div>{hints && renderLine(1)}</div>
      </div>
    </div>
  );
};

export default CombinationLine;
