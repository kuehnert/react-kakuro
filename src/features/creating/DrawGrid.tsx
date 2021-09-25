import { Card } from 'primereact/card';
import React from 'react';
import { useSelector } from 'react-redux';
import { IDesignCell } from 'store/designSlice';
import { RootState } from '../../store/store';
import DesignCell from './DesignCell';
import styles from './DrawGrid.module.scss';

const DrawGrid: React.FC = () => {
  const {
    puzzle: { columnCount, cells },
  } = useSelector((state: RootState) => state.design);

  return (
    <Card title='Grid'>
      <div className={styles.gameBackground}>
        <div
          className={styles.grid}
          style={{
            gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          }}>
          {cells.map((c, i) => (
            <DesignCell key={i} index={i} cell={c as IDesignCell} />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default DrawGrid;
