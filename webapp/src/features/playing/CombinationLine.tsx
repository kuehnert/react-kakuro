/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styles from './CombinationLine.module.scss';
import { CellType, IHint, IHintCell } from 'store/gameSlice';
import _ from 'lodash';
import getHintsForCell, { ICellHInts } from 'utils/getHintsForCell';

const CombinationLine: React.FC = () => {
  const { selectedIndex, game } = useSelector((state: RootState) => state.game);
  const [cellHints, setCellHints] = useState<ICellHInts>();
  const icons = [
    <i className='mdi mdi-arrow-right' />,
    <i className='mdi mdi-arrow-down' />,
  ];

  const renderDigit = (hint: IHint, d: number) => {
    if (hint.usedDigits.includes(d)) {
      return (
        <span className={styles.usedDigit} key={d}>
          {d}
        </span>
      );
    } else if (!cellHints!.candidates.includes(d)) {
      return (
        <span className={styles.impossibleDigit} key={d}>
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
        {hint.combinations[index].digits?.map(d => renderDigit(hint, d))}
      </div>
    );
  };

  const renderCombinations = (hint: IHint) => {
    return hint.combinations.map((_, i) => renderCombination(hint, i));
  };

  const renderLine = (direction: number) => {
    const dirHints = cellHints!.hints[direction];

    if (dirHints.sumSolved <= 0) {
      return '\u00a0';
    } else {
      return (
        <>
          <div className={styles.sumSolved}>
            {dirHints.sumSolved}
            {icons[direction]}
          </div>
          <div>{renderCombinations(dirHints)}</div>
        </>
      );
    }
  };

  useEffect(() => {
    if (
      selectedIndex &&
      game.cells[selectedIndex].type === CellType.NumberCell
    ) {
      setCellHints(getHintsForCell(game, selectedIndex));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  return (
    <div className={styles.combinations}>
      {cellHints && [0, 1].map(dir => (
        <div className={styles.column} key={dir}>
          <div className={styles.text}>{renderLine(dir)}</div>
        </div>
      ))}
    </div>
  );
};

export default CombinationLine;
