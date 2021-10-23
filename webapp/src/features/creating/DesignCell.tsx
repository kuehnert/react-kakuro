import classnames from 'classnames';
import { CellType, ICell, IHintCell, INumberCell } from 'models/cellModels';
import { DesignStepsEnum } from 'models/designModels';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCell } from '../../store/designSlice';
import { RootState } from '../../store/store';
import '../playing/Cell.scss';
import '../playing/HintCell.scss';
import styles from './DesignCell.module.scss';
import HintDialog from './HintDialog';

export interface Props {
  cell: ICell;
  index: number;
}

const DesignCell: React.FC<Props> = ({ cell, index }) => {
  const { activeStep } = useSelector((state: RootState) => state.design);
  const dispatch = useDispatch();
  const [dialogVisible, setDialogVisible] = useState(false);
  const debugMode = true;

  const hide = () => {
    setDialogVisible(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (activeStep === DesignStepsEnum.DrawGrid) {
      // Toggle between blank and number cell
      const newCell = {
        ...cell,
        type:
          cell.type === CellType.NumberCell
            ? CellType.BlankCell
            : CellType.NumberCell,
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

  const numberCell =
    cell.type === CellType.NumberCell ? (cell as INumberCell) : null;
  const hintCell = cell.type === CellType.HintCell ? (cell as IHintCell) : null;
  const pm = numberCell ? (cell as INumberCell).pencilMarks?.join('') : null;

  return (
    <>
      <div
        className={classnames(styles.designCell, cell.type)}
        onClick={handleClick}>
        {hintCell && (
          <>
            <div className='horizontalHint'>
              {renderHint(hintCell.hints[0]?.sumSolved)}
            </div>
            <div className='verticalHint'>
              {renderHint(hintCell.hints[1]?.sumSolved)}
            </div>
          </>
        )}
        {numberCell && <div className={styles.solution}>{numberCell.solution}</div>}
        {pm && <div className={styles.pencilmarks}>{pm}</div>}
        {debugMode && <div className={styles.debug}>{cell.index}</div>}
      </div>

      {activeStep === DesignStepsEnum.InsertHints && hintCell && (
        <HintDialog
          cell={hintCell}
          visible={dialogVisible}
          onHide={hide}
          across={hintCell.hints[0] != null}
          down={hintCell.hints[1] != null}
        />
      )}
    </>
  );
};

export default DesignCell;
