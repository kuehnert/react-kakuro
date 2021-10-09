import { CellType, IGameData, INumberCell } from 'store/gameSlice';

function checkCorrect({ cells }: IGameData): boolean {
  return cells
    .filter(c => c.type === CellType.NumberCell)
    .every(c => (c as INumberCell).guess === (c as INumberCell).solution);
}

export default checkCorrect;
