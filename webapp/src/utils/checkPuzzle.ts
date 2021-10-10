import { CellType, IGameData, IHintCell, INumberCell } from 'store/gameSlice';

export function checkPuzzle(puzzle: IGameData) {
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

export function checkGuessesCorrect({ cells }: IGameData): boolean {
  return cells
    .filter(c => c.type === CellType.NumberCell)
    .every(c => (c as INumberCell).guess === (c as INumberCell).solution);
}

export function checkAllSolved({ cells }: IGameData): boolean {
  return cells
    .filter(c => c.type === CellType.NumberCell)
    .every(c => (c as INumberCell).solution > 0);
}
