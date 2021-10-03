import { IGameData } from 'store/gameSlice';

function checkPuzzle(puzzle: IGameData) {
  // TODO: Which clever checks should we implement?
  // * do all hint cells have all necessary hints?
  // * are the sums possible?
  // * are the values of rows and columns correct?
  return true;
}

export default checkPuzzle;
