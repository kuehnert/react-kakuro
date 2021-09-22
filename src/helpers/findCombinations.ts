import { CellType, IGameData, IHintCell } from 'store/gameSlice';

export default function findCombinations(game: IGameData, index: number) {
  const hints = [
    { index: -1, sum: -1, count: -1 },
    { index: -1, sum: -1, count: -1 },
  ];
  let hIndex = index;

  // Find corresponding hint cell horizontally
  while (game.cells[hIndex].type === CellType.Number) {
    hIndex--;
  }

  hints[0].index = hIndex;
  hints[0].sum = (game.cells[hIndex] as IHintCell).hintHorizontal! || -1;

  // Find count of cells for this hint
  hIndex = index;
  while (
    (hIndex + 1) % game.columnCount !== 0 &&
    game.cells[hIndex + 1].type === CellType.Number
  ) {
    hIndex++;
  }

  hints[0].count = hIndex - hints[0].index;

  // Find corresponding hint cell vertically
  let vIndex = index;
  while (game.cells[vIndex].type === CellType.Number) {
    vIndex -= game.columnCount;
  }

  hints[1].index = vIndex;
  hints[1].sum = (game.cells[vIndex] as IHintCell).hintVertical! || -1;

  // Find count of cells for this hint
  vIndex = index;
  let nextRow = vIndex + game.columnCount;
  while (
    nextRow < game.cells.length &&
    game.cells[nextRow].type === CellType.Number
  ) {
    vIndex = nextRow;
    nextRow = vIndex + game.columnCount;
  }

  const count = (vIndex - hints[1].index) / game.columnCount;
  hints[1].count = count;

  return hints;
}
