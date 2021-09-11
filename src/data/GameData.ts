export enum Difficulty {
  Easy = 0,
  Medium = 1,
  MediumPlus = 2,
  Hard = 3,
  VeryHard = 4,
}

export enum CellType {
  Blank = 0,
  Hint = 1,
  Number = 2,
}

export interface Cell {
  type: CellType;
}

export interface BlankCell extends Cell {
  type: CellType.Blank;
}

export interface HintCell extends Cell {
  type: CellType.Hint;
  hintHorizontal?: number;
  hintVertical?: number;
}

export interface NumberCell extends Cell {
  type: CellType.Number;
  pencilMarks: boolean[];
  guess: number;
  solution: number;
}

export interface Row {
  cells: Cell[];
}

export interface IGameData {
  name: string;
  level: Difficulty;
  rows: Row[];
}
