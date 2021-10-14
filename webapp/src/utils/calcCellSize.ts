export function calcBoardSize(columnCount: number, rowCount: number, zoomLevel: number) {
  return { width: `${(columnCount) * zoomLevel * 10}px`, height: `${(rowCount) * zoomLevel * 10}px` };
}

export function calcCellSize(zoomLevel: number) {
  return { width: `${zoomLevel * 10}px`, height: `${zoomLevel * 10}px` };
}

export function calcGuessFontSize(zoomLevel: number) {
  return { fontSize: `${zoomLevel / 1.4}rem` };
}

export function calcHintFontSize(zoomLevel: number) {
  return { fontSize: `${zoomLevel / 3.5}rem` };
}

export function calcPencilMarkFontSize(zoomLevel: number) {
  return { fontSize: `${zoomLevel / 4.0}rem`, lineHeight: `${zoomLevel / 4.0}rem` };
}
