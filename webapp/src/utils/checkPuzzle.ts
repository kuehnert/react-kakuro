import { CellType, IGameData, IHintCell, INumberCell } from 'models/cellModels';

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

      if (hc.hints[0]?.sumSolved) {
        sumHorizontal += hc.hints[0]?.sumSolved;
      }

      if (hc.hints[1]?.sumSolved) {
        sumVertical += hc.hints[1]?.sumSolved;
      }

      return (
        (!hc.hints[0]?.sumSolved || hc.hints[0]?.sumSolved > -1) &&
        (!hc.hints[1]?.sumSolved || hc.hints[1]?.sumSolved > -1)
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
