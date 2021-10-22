export enum Direction {
  Horizontal = 0,
  Vertical = 1,
  Both = 2,
}

export enum DesignStepsEnum {
  SetSize = 0,
  DrawGrid = 1,
  InsertHints = 2,
  CheckPuzzle = 3,
}

export const designSteps = [
  { label: 'Set Size' },
  { label: 'Draw Grid' },
  { label: 'Insert Hints' },
  { label: 'Check Puzzle' },
];
