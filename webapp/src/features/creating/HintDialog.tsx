import classNames from 'classnames';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CellType } from 'store/gameSlice';
import { RootState } from 'store/store';
import combinations from 'utils/combinations';
import { getRowForCell } from 'utils/pencilmarks';
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
  const { puzzle } = useSelector((state: RootState) => state.design);
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
    const groupData = getRowForCell(
      puzzle,
      cell.index + (across ? 1 : puzzle.columnCount),
      across
    );
    const combs = Object.keys(combinations[groupData.count]).map(e => +e);
    const minSum = Math.min(...combs);
    const maxSum = Math.max(...combs);

    return (
      <div className=''>
        <div className={styles.label}>{across ? 'Across' : 'Down'}</div>
        <div className={styles.buttonGrid}>
          {options.map(n => (
            <Button
              key={n}
              label={n < minSum || n > maxSum ? '' : '' + n}
              onClick={() => handleClick(n, across)}
              disabled={n < minSum || n > maxSum}
              className={classNames(
                'p-button-rounded',
                styles.button,
                across ? 'p-button-success' : 'p-button-info'
              )}
            />
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    // const numbers = Array.from({ length: 43 }, (e, i) => i + 3);
    const numbers = Array.from({ length: 46 }, (e, i) => i);
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
