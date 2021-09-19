/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import styles from './CombinationLine.module.scss';

const CombinationLine: React.FC = () => {
  const { combinations, hints } = useSelector((state: RootState) => state.game);

  const renderPossibility = (a: number[]) => {
    return (
      <span className={styles.possibility} key={a.join('')}>
        {a.join('')}
      </span>
    );
  };

  const renderPossibilities = (a: number[][]) => {
    return <span>{a.map(b => renderPossibility(b))}</span>;
  };

  if (hints[0].index === -1) {
    return null;
  }

  const possibilitiesH = combinations![hints[0].count!][hints[0].sum!];
  const possibilitiesV = combinations![hints[1].count!][hints[1].sum!];

  return (
    <div className={styles.combinations}>
      <div className=''>
        <span>{hints[0].sum}:</span>
        {renderPossibilities(possibilitiesH)}
      </div>
      <div className=''>
        <span>{hints[1].sum}:</span>
        {renderPossibilities(possibilitiesV)}
      </div>
    </div>
  );
};

export default CombinationLine;
