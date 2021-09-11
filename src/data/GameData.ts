enum Difficulty {
  Easy = 0,
  Medium = 0,
  MediumPlus = 0,
  Hard = 0,
  VeryHard = 0,
}

enum CellType {
  Blank = 0,
  Hint = 1,
  Number = 2,
}

interface Cell {
  type: CellType;
}

interface BlankCell extends Cell {
  type: CellType.Blank;
}

interface HintCell extends Cell {
  type: CellType.Hint;
  hintHorizontal: number;
  hintVertical: number;
}

interface NumberCell extends Cell {
  type: CellType.Number;
  pencilMarks: boolean[];
  guess: number;
  solution: number;
}

interface Row {
  cells: Cell[];
}

export interface IGameData {
  name: string;
  level: Difficulty;
  grid: Row[];
}
