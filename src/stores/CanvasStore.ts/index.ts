import { ImmerStateCreator } from "../workspace-store";
import { Coordinates } from "@dnd-kit/core/dist/types";

type CanvasState = {
  scale: number;
  position: Coordinates;
};

type CanvasActions = {
  setScale: (scale: number) => void;
  setCanvasPosition: (position: Coordinates) => void;
};

export type CanvasStore = CanvasState & CanvasActions;

const defaultInitState: CanvasState = {
  scale: 1,
  position: { x: 0, y: 0 },
};

export const createCanvasStore: ImmerStateCreator<CanvasStore> = (set) => ({
  ...defaultInitState,
  setScale: (scale: number) =>
    set((state) => {
      state.scale = scale;
    }),
  setCanvasPosition: (position: Coordinates) =>
    set((state) => {
      state.position = position;
    }),
});
