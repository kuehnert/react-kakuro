import { IHint } from 'store/gameSlice';
import combinations from './combinations';

interface IGetCombinationsParams {
  sumSolved: number; count: number;
};

/**
 *
 * @param hints the computed hints for a particular cell
 * @param combinations all combinations
 */
export default function getCombinations(
  { sumSolved, count }: IGetCombinationsParams,
) {
  let combs = combinations[count][sumSolved];

  // only select those combinations which contain every used digit
  // TODO do this when new number guessed
  // combs = combs.filter(c => hints.usedDigits.every(h => c.includes(h)));

  return combs;
}
