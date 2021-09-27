import { CellType, Difficulty, IGameData } from './GameData';

const game: IGameData = {
  name: 'Sample Easy',
  level: Difficulty.Easy,
  rows: [
    {
      cells: [
        {
          type: CellType.BlankCell,
        },
        {
          type: CellType.BlankCell,
        },
        {
          type: CellType.BlankCell,
        },
        {
          type: CellType.BlankCell,
        },
        {
          type: CellType.BlankCell,
        },
        {
          type: CellType.BlankCell,
        },
      ],
    },
  ],
};

console.log(game);

const s = JSON.stringify(game, null, 4)
console.log(s);
s
