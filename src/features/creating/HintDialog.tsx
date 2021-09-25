import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CellType } from 'store/gameSlice';
import { Direction, IDesignCell, updateCell } from '../../store/designSlice';
import styles from './HintDialog.module.scss';

export interface Props {
  cell: IDesignCell;
  direction: Direction;
  visible: boolean;
  onHide: () => void;
}

const HintDialog: React.FC<Props> = ({ cell, direction, visible, onHide }) => {
  const [options, setOptions] = useState<number[]>([]);
  const dispatch = useDispatch();

  const handleClick = (n: number) => {
    const newCell = { ...cell, type: CellType.HintCell };
    if (direction === Direction.Horizontal) {
      newCell.hintHorizontal = n;
    } else if (direction === Direction.Vertical) {
      newCell.hintVertical = n;
    }

    dispatch(updateCell(newCell));
    onHide();
  };

  useEffect(() => {
    const numbers = Array.from({ length: 43 }, (e, i) => i + 3);
    setOptions(numbers);
  }, []);

  return (
    <Dialog
      header='Set number for hint cell'
      // style={{ width: '30vw' }}
      visible={visible}
      modal={true}
      onHide={onHide}>
      <div className={styles.buttonGrid}>
        {options.map(n => (
          <Button key={n} label={'' + n} onClick={() => handleClick(n)} />
        ))}
      </div>
    </Dialog>
  );
};

export default HintDialog;
