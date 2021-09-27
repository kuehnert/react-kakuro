import { IHintValues } from 'store/gameSlice';
import { ICombinations } from './makeCombinations';

/**
 *
 * @param hints the computed hints for a particular cell
 * @param combinations all combinations
 */
export default function getCombinations(
  hints: IHintValues,
  combinations: ICombinations
) {
  let combs = combinations[hints.count][hints.sum];

  // only select those combinations which contain every used digit
  combs = combs.filter(c => hints.used.every(h => c.includes(h)));

  return combs;
}
