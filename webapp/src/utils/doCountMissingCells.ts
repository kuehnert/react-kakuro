import { CellType, ICell, INumberCell } from 'models/cellModels';

function doCountMissingCells(cells: ICell[]): number {
  return cells.filter(c => c.type === CellType.NumberCell && (c as INumberCell).guess === 0).length;
}

export default doCountMissingCells;
