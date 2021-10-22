import { CellType, IGameData, INumberCell } from 'models/cellModels';

export const clearGuesses = (game: IGameData): IGameData => {
  const newGame: IGameData = JSON.parse(JSON.stringify(game));

  newGame.cells
    .filter(c => c.type === CellType.NumberCell)
    .forEach(c => {
      (c as INumberCell).guess = 0;
      (c as INumberCell).pencilMarks = [];
    });

  return newGame;
};

export const doClearPencilMarks = (game: IGameData): IGameData => {
  const newGame: IGameData = JSON.parse(JSON.stringify(game));

  newGame.cells
    .filter(c => c.type === CellType.NumberCell)
    .forEach(c => {
      (c as INumberCell).pencilMarks = [];
    });

  return newGame;
};
