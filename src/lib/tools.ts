import { CONNECT_MODE } from "@/components/DrawingBoard/ConnectLine";
import { Coordinates } from "@dnd-kit/core/dist/types";

export const getConnectMode = (p1: Coordinates, p2: Coordinates) => {
  let newP1 = { ...p1 },
    newP2 = { ...p2 };
  const mode =
    Math.abs(p1.x - p2.x) > 200
      ? CONNECT_MODE.OPPOSITE_SIDE
      : CONNECT_MODE.SAME_SIDE;
  if (mode === CONNECT_MODE.OPPOSITE_SIDE) {
    if (p1.x > p2.x) {
      newP1.x = p1.x - 144;
    } else {
      newP2.x = p2.x - 144;
    }
  }
  return {
    p1: newP1,
    p2: newP2,
    mode,
  };
};

export const getCloserPoint = (
  mousePosition: Coordinates,
  points: Coordinates[],
  distance: number = 50,
) => {
  let minDistance = Infinity;
  let minIndex = 0;
  points.forEach((point, index) => {
    const distance = getDistance(mousePosition, point);
    if (distance < minDistance) {
      minDistance = distance;
      minIndex = index;
    }
  });
  return minDistance < distance ? minIndex : null;
};

const getDistance = (p1: Coordinates, p2: Coordinates) => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const getToggleValue = (group: { [key: string]: boolean }) => {
  return Object.keys(group).filter((key) => group[key]);
};

export const insertAt = <T>(array: T[], index: number, item: T): T[] => {
  if (index < 0 || index > array.length) {
    throw new Error("Index out of bounds");
  }
  return [...array.slice(0, index), item, ...array.slice(index)];
};
