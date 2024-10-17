import { ImmerStateCreator } from "../workspace-store";
import { Coordinates } from "@dnd-kit/core/dist/types";

type CanvasState = {
  scale: number;
  position: Coordinates;
};

type CanvasActions = {
  setScale: (scale: number) => void;
  setCanvasPosition: (position: Coordinates) => void;
  resizeCanvas: (modelName?: string) => void;
};

export type CanvasStore = CanvasState & CanvasActions;

const defaultInitState: CanvasState = {
  scale: 1,
  position: { x: 0, y: 0 },
};

export const createCanvasStore: ImmerStateCreator<CanvasStore> = (
  set,
  get,
) => ({
  ...defaultInitState,
  setScale: (scale: number) =>
    set((state) => {
      state.scale = scale;
    }),
  setCanvasPosition: (position: Coordinates) =>
    set((state) => {
      state.position = position;
    }),
  resizeCanvas: (modelName?: string) => {
    set((state) => {
      const { positions, scale: canvasScale, models } = get();

      if (typeof document === "undefined") return;

      const windowHeight = document.documentElement.clientHeight;
      const windowWidth = document.documentElement.clientWidth;

      const relevantPositions: Coordinates[] = Object.entries(positions)
        .filter(
          ([key, coor]) =>
            models.some((model) => model.name === key) &&
            (key === modelName || !modelName) &&
            coor,
        )
        .map(([key, coor]) => {
          const el = document.getElementById(key);
          const { width = 0, height = 0 } = el?.getBoundingClientRect() || {};
          return [
            coor as Coordinates,
            {
              x: coor!.x + width / canvasScale,
              y: coor!.y + height / canvasScale,
            },
          ];
        })
        .flat();

      if (relevantPositions.length === 0) {
        state.scale = 1;
        state.position = { x: 0, y: 0 };
        return;
      }

      const xCoords = relevantPositions.map((coord) => coord.x);
      const yCoords = relevantPositions.map((coord) => coord.y);

      const rect = {
        left: Math.min(...xCoords),
        top: Math.min(...yCoords),
        right: Math.max(...xCoords),
        bottom: Math.max(...yCoords),
      };

      const rectWidth = rect.right - rect.left;
      const rectHeight = rect.bottom - rect.top;

      const newScale = Math.min(
        (windowWidth * 0.9) / rectWidth,
        (windowHeight * 0.9) / rectHeight,
        1,
      );

      const newPosition: Coordinates = {
        x: (windowWidth - (rect.left + rect.right) * newScale) / 2,
        y: (windowHeight - (rect.top + rect.bottom) * newScale) / 2,
      };

      state.scale = newScale;
      state.position = newPosition;
    });
  },
});
