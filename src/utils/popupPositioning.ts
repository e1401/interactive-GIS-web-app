import type { Position } from '../types';

interface PopupDimensions {
  width: number;
  height: number;
}

interface ViewportSize {
  width: number;
  height: number;
}

export const calculatePopupPosition = (
  clickPosition: Position,
  popupDimensions: PopupDimensions,
  viewportSize: ViewportSize
): Position => {
  const { x: clickX, y: clickY } = clickPosition;
  const { width: popupWidth, height: popupHeight } = popupDimensions;
  const { width: mapWidth, height: mapHeight } = viewportSize;

  let x: number;
  let y: number;

  // Horizontal positioning: check if there's room on the right
  if (clickX + popupWidth <= mapWidth) {
    // Room on right, place popup at click point
    x = clickX;
  } else {
    // No room on right, place popup to the left of click
    x = clickX - popupWidth;
    // If that goes off left edge, clamp it
    if (x < 0) {
      x = 0;
    }
  }

  // Vertical positioning: check if there's room below
  if (clickY + popupHeight <= mapHeight) {
    // Room below, place popup at click point
    y = clickY;
  } else {
    // No room below, place popup above click
    y = clickY - popupHeight;
    // If that goes off top edge, clamp it
    if (y < 0) {
      y = 0;
    }
  }

  return { x, y };
};
