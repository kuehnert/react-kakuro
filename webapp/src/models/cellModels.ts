export enum Difficulty {
  Easy = 0,
  Medium = 1,
  MediumPlus = 2,
  Hard = 3,
  VeryHard = 4,
}

export enum CellType {
  BlankCell = 'blankCell',
  HintCell = 'hintCell',
  NumberCell = 'numberCell',
}

export enum PuzzleStates {
  Raw = 0,
  Valid = 1,
  Solved = 2,
}

export interface ICell {
  index: number;
  type: CellType;
}

export interface IBlankCell extends ICell {
  type: CellType.BlankCell;
}

export interface ICombination {
  digits: number[];
  excluded: boolean;
  impossible: boolean;
}

export interface IHint {
  index: number; // index of this cell
  sumSolved: number; // hint for this cell
  sumGuessed: number; // sumSolved of guessed cells
  count: number;
  cellIndexes: number[];
  usedDigits: number[];
  combinations: ICombination[]; // [combination][digit]
}

export interface IHintCell extends ICell {
  type: CellType.HintCell;
  hints: (IHint | null)[];
}

export interface INumberCell extends ICell {
  type: CellType.NumberCell;
  pencilMarks: number[];
  guess: number;
  solution: number;
}

export type IBaseGame = {
  _id?: string;
  name: string;
  columnCount: number;
  rowCount: number;
  level: Difficulty;
};

export interface IServerGameData extends IBaseGame {
  state: PuzzleStates;
  cellString: string;
}

export interface IHintMap {
  [index: number]: number;
}

export interface IGameData extends IBaseGame {
  state: PuzzleStates;
  cells: ICell[];
  hintCount: number;
  missingCells: number;
  hintMaps: IHintMap[];
}

export interface IGuess {
  index: number;
  guess: number;
}

export interface IToggleCombinationParams {
  hintIndex: number;
  direction: number;
  combinationIndex: number;
}

/*
export interface IDesignCell {
  type: CellType;
  index: number;
  // hintHorizontal?: number;
  // hintVertical?: number;
  hints: (IHint | null)[];
  solution?: number;
}
*/

