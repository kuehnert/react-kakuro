import classnames from 'classnames';
import React, { useState } from 'react';
import { Direction, IDesignCell, updateCell } from '../../store/designSlice';
import styles from './DesignCell.module.scss';
import { RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { CellType } from 'store/gameSlice';
import HintDialog from './HintDialog';
import '../playing/Cell.scss'
import '../playing/HintCell.scss'

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
  const [direction, setDirection] = useState<Direction>(Direction.Both);

  const hide = () => {
    setDialogVisible(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (activeStep === 1) {
      // Toggle between blank and number cell
      const newCell = {
        ...cell,
        type: cell.type === CellType.BlankCell ? CellType.NumberCell : CellType.BlankCell,
      };
      dispatch(updateCell(newCell));
    } else if (activeStep === 2 && cell.type !== CellType.NumberCell) {
      // Show dialog to pick hint value
      // Find out if the hint is vertical or horizontal
      if (
        cell.index + 1 < puzzle.cells.length &&
        puzzle.cells[cell.index + 1].type === CellType.NumberCell
      ) {
        setDirection(Direction.Horizontal);
      }
      if (
        cell.index + puzzle.columnCount < puzzle.cells.length &&
        puzzle.cells[cell.index + puzzle.columnCount].type === CellType.NumberCell
      ) {
        setDirection(Direction.Vertical);
      }

      setDialogVisible(true);
    }
  };

  return (
    <>
      <div
        className={classnames(styles.designCell, cell.type)}
        onClick={handleClick}>
        <div className="horizontalHint">{cell.hintHorizontal}</div>
        <div className="verticalHint">{cell.hintVertical}</div>
      </div>
      <HintDialog cell={cell} visible={dialogVisible} onHide={hide} direction={direction} />
    </>
  );
};

export default DesignCell;
