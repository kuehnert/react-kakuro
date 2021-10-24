import { CellType, IGameData, IHintCell, INumberCell } from 'models/cellModels';

/** obsolete? */
export default function generateHints(game: IGameData, index: number) {
  const hints = [
    { index: -1, sumSolved: -1, count: -1, used: new Array<number>() },
    { index: -1, sumSolved: -1, count: -1, used: new Array<number>() },
  ];

  if (!index) {
    return hints;
  }

  let hIndex = index;

  // Find corresponding hint cell horizontally
  while (game.cells[hIndex].type === CellType.NumberCell) {
    const cell = game.cells[hIndex] as INumberCell;
    if (cell.guess > 0) {
      hints[0].used.push(cell.guess);
    }
    hIndex--;
  }

  hints[0].index = hIndex;
  hints[0].sumSolved =
    (game.cells[hIndex] as IHintCell).hints[0]?.sumSolved! || -1;

  // Find count of cells for this hint
  hIndex = index;
  while (
    (hIndex + 1) % game.columnCount !== 0 &&
    game.cells[hIndex + 1].type === CellType.NumberCell
  ) {
    hIndex++;
    const cell = game.cells[hIndex] as INumberCell;
    if (cell.guess > 0) {
      hints[0].used.push(cell.guess);
    }
  }

  hints[0].count = hIndex - hints[0].index;

  // Find corresponding hint cell vertically
  let vIndex = index;
  while (game.cells[vIndex].type === CellType.NumberCell) {
    const cell = game.cells[vIndex] as INumberCell;
    if (cell.guess > 0) {
      hints[1].used.push(cell.guess);
    }
    vIndex -= game.columnCount;
  }

  hints[1].index = vIndex;
  hints[1].sumSolved =
    (game.cells[vIndex] as IHintCell).hints[1]?.sumSolved || -1;

  // Find count of cells for this hint
  vIndex = index;
  let nextRow = vIndex + game.columnCount;
  while (
    nextRow < game.cells.length &&
    game.cells[nextRow].type === CellType.NumberCell
  ) {
    vIndex = nextRow;
    const cell = game.cells[vIndex] as INumberCell;
    if (cell.guess > 0) {
      hints[1].used.push(cell.guess);
    }
    nextRow = vIndex + game.columnCount;
  }

  const count = (vIndex - hints[1].index) / game.columnCount;
  hints[1].count = count;

  return hints;
}
