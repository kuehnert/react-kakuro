import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CellType } from 'store/gameSlice';
import { IDesignCell, updateCell } from '../../store/designSlice';
import styles from './HintDialog.module.scss';

export interface Props {
  cell: IDesignCell;
  across: boolean;
  down: boolean;
  visible: boolean;
  onHide: () => void;
}

const HintDialog: React.FC<Props> = ({
  cell,
  across,
  down,
  visible,
  onHide,
}) => {
  const [options, setOptions] = useState<number[]>([]);
  const dispatch = useDispatch();

  const handleClick = (n: number, acrossHint: boolean) => {
    const newCell = { ...cell, type: CellType.HintCell };
    if (acrossHint) {
      newCell.hintHorizontal = n;
    } else {
      newCell.hintVertical = n;
    }

    dispatch(updateCell(newCell));
    if (!acrossHint || !down) {
      onHide();
    }
  };

  const renderButtons = (across: boolean) => {
    return (
      <div className=''>
        <div className='label'>{across ? 'Hint Across' : 'Hint Down'}</div>
        <div className={styles.buttonGrid}>
          {options.map(n => (
            <Button
              key={n}
              label={'' + n}
              onClick={() => handleClick(n, across)}
              disabled={n < 3}
            />
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    // const numbers = Array.from({ length: 43 }, (e, i) => i + 3);
    const numbers = Array.from({ length: 45 }, (e, i) => i + 1);
    setOptions(numbers);
  }, []);

  return (
    <Dialog
      header='Set number(s) for hint cell'
      style={{ width: '30vw' }}
      visible={visible}
      modal={true}
      onHide={onHide}>
      {across && renderButtons(true)}
      {down && renderButtons(false)}
    </Dialog>
  );
};

export default HintDialog;
