/* eslint-disable react-hooks/exhaustive-deps */
import getCombinations from 'utils/getCombinations';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styles from './CombinationLine.module.scss';

const CombinationLine: React.FC = () => {
  const { hints } = useSelector((state: RootState) => state.game);
  const [possibilities, setPossibilities] = useState<number[][][]>([[], []]);

  const renderDigit = (d: number, direction: number) => {
    const key = 'd' + d + '' + direction;

    if (hints[direction].used.includes(d)) {
      return <span className={styles.highlight} key={key}>{d}</span>;
    } else {
      return <span key={key}>{d}</span>;
    }
  };

  const renderPossibility = (a: number[], index: number, direction: number) => {
    const key = 'p' + a[0] + '' + index + '' + direction;

    return (
      <span className={styles.possibility} key={key}>
        {a.map(d => renderDigit(d, direction))}
      </span>
    );
  };

  const renderPossibilities = (a: number[][], direction: number) => {
    const key = 'ps' + a[0] + '' + direction;

    return <span key={key}>{a.map((b, i) => renderPossibility(b, i, direction))}</span>;
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
        getCombinations(hints[0]),
        getCombinations(hints[1]),
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
