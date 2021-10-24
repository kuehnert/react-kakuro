import { ICell } from 'models/cellModels';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import DesignCell from './DesignCell';
import styles from './DrawGrid.module.scss';

const DrawGrid: React.FC = () => {
  const { puzzle } = useSelector((state: RootState) => state.design);
  const { columnCount, cells } = puzzle;
  const { debugMode } = useSelector((state: RootState) => state.users);

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

      {debugMode && (
        <div className='debugWindow'>
          <pre>{JSON.stringify(puzzle, null, 4)}</pre>
        </div>
      )}
    </div>
  );
};

export default DrawGrid;
