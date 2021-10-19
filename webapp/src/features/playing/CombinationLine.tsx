/* eslint-disable react-hooks/exhaustive-deps */
import getCombinations from 'utils/getCombinations';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styles from './CombinationLine.module.scss';
import { CellType, IHint, IHintCell } from 'store/gameSlice';

const CombinationLine: React.FC = () => {
  const { selectedIndex, game } = useSelector((state: RootState) => state.game);
  const [hints, setHints] = useState<(IHint | null)[]>([null, null]);

  const renderDigit = (hint: IHint, d: number) => {
    if (hint.usedDigits.includes(d)) {
      return (
        <span className={styles.highlight} key={d}>
          {d}
        </span>
      );
    } else {
      return <span key={d}>{d}</span>;
    }
  };

  const renderCombination = (hint: IHint, index: number) => {
    return (
      <div className={styles.possibility} key={index}>
        {hint.combinations[index].map(d => renderDigit(hint, d))}
      </div>
    );
  };

  const renderCombinations = (hint: IHint) => {
    return hint.combinations.map((_, i) => renderCombination(hint, i));
  };

  const renderLine = (direction: number) => {
    if (!hints[direction] || hints[direction]!.sumSolved <= 0) {
      return '\u00a0';
    } else {
      return (
        <>
          <div className={styles.sumSolved}>
            {hints[direction]?.sumSolved}
            {direction === 0 ? 'a' : 'd'}
          </div>
          <div>{renderCombinations(hints[direction]!)}</div>
        </>
      );
    }
  };

  useEffect(() => {
    if (selectedIndex && game.cells[selectedIndex].type === CellType.HintCell) {
      setHints((game.cells[selectedIndex] as IHintCell).hints);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

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
