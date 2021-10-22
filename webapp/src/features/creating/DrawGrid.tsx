import { ICell } from 'models/cellModels';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import DesignCell from './DesignCell';
import styles from './DrawGrid.module.scss';

const DrawGrid: React.FC = () => {
  const {
    puzzle: { columnCount, cells },
  } = useSelector((state: RootState) => state.design);

  return (
    <div>
      <div className={styles.gameBackground}>
        <div
          className={styles.grid}
          style={{
            gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          }}>
          {cells.map((c, i) => (
            <DesignCell key={i} index={i} cell={c as ICell} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrawGrid;
