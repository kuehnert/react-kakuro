import {
  CellType,
  IGameData,
  INumberCell,
  IServerGameData,
} from 'store/gameSlice';

function preparePuzzle(game: IGameData): IServerGameData {
  const cellString = game.cells
    .map(cell =>
      cell.type !== CellType.NumberCell ? 0 : (cell as INumberCell).solution
    )
    .join('');

  const { cells, ...newGame } = game;
  const newServerGame = { ...newGame, cellString } as IServerGameData;

  return newServerGame;
}

export default preparePuzzle;
