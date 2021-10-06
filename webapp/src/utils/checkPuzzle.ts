import { CellType, IGameData, IHintCell } from 'store/gameSlice';

function checkPuzzle(puzzle: IGameData) {
  const { cells } = puzzle;
  // TODO: Which clever checks should we implement?
  // * are the sums possible?
  let sumHorizontal = 0;
  let sumVertical = 0;

  // * are the values of rows and columns correct?

  // * do all hint cells have all necessary hints?
  const allHints = cells
    .filter(c => c.type === CellType.HintCell)
    .every(c => {
      const hc = c as IHintCell;

      if (hc.hintHorizontal) {
        sumHorizontal += hc.hintHorizontal;
      }

      if (hc.hintVertical) {
        sumVertical += hc.hintVertical;
      }

      return (
        (!hc.hintHorizontal || hc.hintHorizontal > -1) &&
        (!hc.hintVertical || hc.hintVertical > -1)
      );
    });

  if (!allHints) {
    return { valid: false, error: 'Not all hints provided.' };
  }

  if (sumHorizontal !== sumVertical) {
    return {
      valid: false,
      error: `Hints across: ${sumHorizontal}, down: ${sumVertical}. Must be equal.`,
    };
  }

  return { valid: true };
}

export default checkPuzzle;
