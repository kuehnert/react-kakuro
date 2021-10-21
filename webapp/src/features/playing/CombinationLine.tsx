/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CellType, ICombination, IHint, toggleCombination } from 'store/gameSlice';
import getHintsForCell, { ICellHInts } from 'utils/getHintsForCell';
import { RootState } from '../../store/store';
import styles from './CombinationLine.module.scss';

const CombinationLine: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedIndex, game } = useSelector((state: RootState) => state.game);
  const [cellHints, setCellHints] = useState<ICellHInts>();
  const icons = [
    <i className='mdi mdi-arrow-right' />,
    <i className='mdi mdi-arrow-down' />,
  ];
  const debugMode = false;

  const handleToggleCombination = (
    hintIndex: number,
    direction: number,
    combinationIndex: number
  ) => {
    dispatch(toggleCombination({ hintIndex, direction, combinationIndex }));
  };

  const renderDigit = (hint: IHint, combination: ICombination, d: number) => {
    if (combination.excluded || combination.impossible) {
      return <span>{d}</span>
     } else
    if (cellHints?.allUsed.includes(d)) {
      return (
        <span className={styles.usedDigit} key={d}>
          {d}
        </span>
      );
    // } else if (cellHints!.candidates.length < 5 && cellHints!.candidates.includes(d)) {
    } else if (cellHints!.candidates.includes(d)) {
      return (
        <span className={styles.candidateDigit} key={d}>
          {d}
        </span>
      );
    } else {
      return <span key={d}>{d}</span>;
    }
  };

  const renderCombination = (hint: IHint, index: number, direction: number) => {
    const combination = hint.combinations[index];
    const excluded = combination.excluded && styles.excluded;
    const impossible = combination.impossible && styles.impossible;

    return (
      <div
        className={classNames(styles.possibility, excluded, impossible)}
        key={index}
        onClick={() => handleToggleCombination(hint.index, direction, index)}>
        {combination.digits?.map(d => renderDigit(hint, combination, d))}
      </div>
    );
  };

  const renderCombinations = (hint: IHint, direction: number) => {
    return hint.combinations.map((_, i) =>
      renderCombination(hint, i, direction)
    );
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
          <div>{renderCombinations(dirHints, direction)}</div>
        </>
      );
    }
  };

  useEffect(() => {
    if (
      selectedIndex &&
      game.cells[selectedIndex].type === CellType.NumberCell
    ) {
      const ch = getHintsForCell(game, selectedIndex);
      // console.log('ch', ch);

      setCellHints(ch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, selectedIndex]);

  return (
    <>
      <div className={styles.combinations}>
        {cellHints &&
          [0, 1].map(dir => (
            <div className={styles.column} key={dir}>
              <div className={styles.text}>{renderLine(dir)}</div>
            </div>
          ))}
      </div>
      {debugMode && (<div className={styles.debug}>
        <pre>{JSON.stringify(cellHints, null, 4)}</pre>
      </div>)}
    </>
  );
};

export default CombinationLine;
