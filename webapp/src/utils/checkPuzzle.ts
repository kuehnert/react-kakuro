import { CellType, IGameData, IHintCell } from 'store/gameSlice';

function checkPuzzle(puzzle: IGameData) {
  const { cells } = puzzle;
  // TODO: Which clever checks should we implement?
  // * are the sums possible?
  // * are the values of rows and columns correct?

  // * do all hint cells have all necessary hints?
  return cells
    .filter(c => c.type === CellType.HintCell)
    .every(c => {
      if (c == null) {
        return true;
      }
      const hc = c as IHintCell;
      return (
        (!hc.hintHorizontal || hc.hintHorizontal > -1) &&
        (!hc.hintVertical || hc.hintVertical > -1)
      );
    });
}

export default checkPuzzle;
