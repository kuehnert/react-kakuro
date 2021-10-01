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
  const { activeStep, puzzle } = useSelector(
    (state: RootState) => state.design
  );
  const dispatch = useDispatch();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [across, setAcross] = useState<boolean>(false);
  const [down, setDown] = useState<boolean>(false);

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
    } else if (activeStep === 2 && cell.type !== CellType.NumberCell) {
      // Show dialog to pick hint value
      // Find out if the hint is vertical or horizontal
      setAcross(
        cell.index + 1 < puzzle.cells.length &&
          puzzle.cells[cell.index + 1].type === CellType.NumberCell
      );

      setDown(
        cell.index + puzzle.columnCount < puzzle.cells.length &&
          puzzle.cells[cell.index + puzzle.columnCount].type ===
            CellType.NumberCell
      );

      (across || down) && setDialogVisible(true);
    }
  };

  return (
    <>
      <div
        className={classnames(styles.designCell, cell.type)}
        onClick={handleClick}>
        <div className='horizontalHint'>{cell.hintHorizontal}</div>
        <div className='verticalHint'>{cell.hintVertical}</div>
      </div>
      <HintDialog
        cell={cell}
        visible={dialogVisible}
        onHide={hide}
        across={across}
        down={down}
      />
    </>
  );
};

export default DesignCell;
