/* eslint-disable react-hooks/exhaustive-deps */
import getCombinations from 'utils/getCombinations';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styles from './CombinationLine.module.scss';

const CombinationLine: React.FC = () => {
  const { selectedIndex } = useSelector((state: RootState) => state.game);
  const [possibilities, setPossibilities] = useState<number[][][]>([[], []]);

  const renderDigit = (d: number, direction: number) => {
    const key = 'd' + d + '' + direction;

    if (hints[direction].used.includes(d)) {
      return (
        <span className={styles.highlight} key={key}>
          {d}
        </span>
      );
    } else {
      return <span key={key}>{d}</span>;
    }
  };

  const renderPossibility = (a: number[], index: number, direction: number) => {
    const key = 'p' + a[0] + '' + index + '' + direction;

    return (
      <div className={styles.possibility} key={key}>
        {a.map(d => renderDigit(d, direction))}
      </div>
    );
  };

  const renderPossibilities = (a: number[][], direction: number) => {
    const key = 'ps' + a[0] + '' + direction;

    return (
      <div key={key}>
        {a.map((b, i) => renderPossibility(b, i, direction))}
      </div>
    );
  };

  const renderLine = (direction: number) => {
    if (hints[direction].sum < 0) {
      return '\u00a0';
    } else {
      return (
        <>
          <div className={styles.sum}>
            {hints[direction].sum}
            {direction === 0 ? 'a' : 'd'}
          </div>
          {renderPossibilities(possibilities[direction], direction)}
        </>
      );
    }
  };

  useEffect(() => {
    if (hints[0].index > -1) {
      setPossibilities([getCombinations(hints[0]), getCombinations(hints[1])]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hints]);

  return (
    <div className={styles.combinations}>
      <div className={styles.column}>
        <div className={styles.text}>{renderLine(0)}</div>
      </div>
      <div className={styles.column}>
        <div className={styles.text}>{renderLine(1)}</div>
      </div>
    </div>
  );
};

export default CombinationLine;
