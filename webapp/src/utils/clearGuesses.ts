import { CellType, IGameData, IHintCell, INumberCell } from 'models/cellModels';

export const clearGuesses = (game: IGameData): IGameData => {
  const newGame: IGameData = JSON.parse(JSON.stringify(game));

  newGame.cells
    .filter(c => c.type === CellType.NumberCell)
    .forEach(c => {
      (c as INumberCell).guess = 0;
      (c as INumberCell).pencilMarks = [];
    });

  newGame.cells
    .filter(c => c.type === CellType.HintCell)
    .forEach(c => {
      const hints = (c as IHintCell).hints;
      hints.forEach(hint => {
        if (hint) {
          hint.sumGuessed = 0;
          hint.usedDigits = [];
          hint.combinations.forEach(c => {
            c.excluded = false;
            c.impossible = false;
          });
        }
      });
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
