import { CONNECT_MODE } from "@/components/ConnectLine";
import { Coordinates } from "@dnd-kit/core/dist/types";

export const getConnectMode = (p1: Coordinates, p2: Coordinates) => {
  console.log(p1, p2);
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
