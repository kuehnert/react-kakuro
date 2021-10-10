export function calcCellSize(zoomLevel: number) {
  return { width: `${zoomLevel}rem` };
}

export function calcGuessFontSize(zoomLevel: number) {
  return { fontSize: `${zoomLevel / 1.5}rem` };
}

export function calcHintFontSize(zoomLevel: number) {
  return { fontSize: `${zoomLevel / 2.4 }rem` };
}

export function calcPencilMarkFontSize(zoomLevel: number) {
  return { fontSize: `${zoomLevel / 4.0}rem`, lineHeight: `${zoomLevel / 4.0}rem` };
}
