import classnames from 'classnames';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CellType } from 'store/gameSlice';
import { IDesignCell, updateCell } from '../../store/designSlice';
import { RootState } from '../../store/store';
import '../playing/Cell.scss';
import '../playing/HintCell.scss';
import styles from './DesignCell.module.scss';
import HintDialog from './HintDialog';

export interface Props {
  cell: IDesignCell;
  index: number;
}

const DesignCell: React.FC<Props> = ({ cell, index }) => {
  const { activeStep } = useSelector((state: RootState) => state.design);
  const dispatch = useDispatch();
  const [dialogVisible, setDialogVisible] = useState(false);

  const hide = () => {
    setDialogVisible(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (activeStep === 1) {
      // Toggle between blank and number cell
      const newCell = {
        ...cell,
        type:
          cell.type === CellType.BlankCell
            ? CellType.NumberCell
            : CellType.BlankCell,
      };
      dispatch(updateCell(newCell));
    } else if (activeStep === 2 && cell.type === CellType.HintCell) {
      // Show dialog to pick hint value
      setDialogVisible(true);
    }
  };

  const renderHint = (value: number | undefined) => {
    if (value) {
      const hintStr = value > 0 ? value : '?';
      const hintClass = value > 0 ? '' : styles.hintMissing;
      return <div className={hintClass}>{hintStr}</div>;
    } else {
      return null;
    }
  };

  return (
    <>
      <div
        className={classnames(styles.designCell, cell.type)}
        onClick={handleClick}>
        {/* <div className={styles.index}>{cell.index}</div> */}
        <div className='horizontalHint'>{renderHint(cell.hintHorizontal)}</div>
        <div className='verticalHint'>{renderHint(cell.hintVertical)}</div>
        <div className={styles.solution}>{renderHint(cell.solution)}</div>
      </div>
      <HintDialog
        cell={cell}
        visible={dialogVisible}
        onHide={hide}
        across={cell.hintHorizontal != null}
        down={cell.hintVertical != null}
      />
    </>
  );
};

export default DesignCell;
