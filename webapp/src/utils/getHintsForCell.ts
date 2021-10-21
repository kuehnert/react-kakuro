import _ from 'lodash';
import { IGameData, IHint, IHintCell } from 'store/gameSlice';

export interface ICellHInts {
  hints: IHint[];
  candidates: number[];
}

/**
 * Finds across and down hints and possible digits for cell
 * @param game
 * @param index
 */
export default function getHintsForCell(
  { cells, hintMaps }: IGameData,
  index: number
): ICellHInts {
  const hints = new Array<IHint>(2);
  const tempCandidates: number[][] = [];

  // pluck all candidates across and down from
  // possible combinations
  [0, 1].forEach(dir => {
    const hintCell = hintMaps[dir][index];
    hints[dir] = (cells[hintCell] as IHintCell).hints[dir]!;
    tempCandidates.push(
      _.uniq(
        hints[dir].combinations
          .filter(c => !c.excluded && !c.impossible)
          .map(c => c.digits)
          .flat()
          .sort()
      )
    );
  });

  // find possible digits: those that are present
  // both across and down
  const candidates = _.intersection(tempCandidates[0], tempCandidates[1]);

  // remove used digits
  const allUsed = _.union(hints[0].usedDigits, hints[1].usedDigits);
  tempCandidates[0] = _.difference(allUsed, tempCandidates[0]);
  tempCandidates[1] = _.difference(allUsed, tempCandidates[1]);

  return { hints, candidates };
}
