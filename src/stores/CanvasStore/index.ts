import { ImmerStateCreator } from "../workspace-store";
import { Coordinates } from "@dnd-kit/core/dist/types";

type CanvasState = {
  scale: number;
  position: Coordinates;
};

type CanvasActions = {
  setScale: (scale: number) => void;
  setCanvasPosition: (position: Coordinates) => void;
  resizeCanvas: () => void;
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
  resizeCanvas: () => {
    set((state) => {
      const canvasScale = get().scale;
      const positions = Array.from(get().positions.entries())
        .map(([key, coor]) => {
          const el =
            typeof document !== "undefined"
              ? document.getElementById(key)
              : null;
          const { width, height } = el?.getBoundingClientRect() || {
            width: 0,
            height: 0,
          };
          return [
            coor,
            {
              x: coor.x + width / canvasScale,
              y: coor.y + height / canvasScale,
            },
          ];
        })
        .flat();
      const windowHeight =
        typeof document !== "undefined"
          ? document.documentElement.clientHeight
          : 0;
      const windowWidth =
        typeof document !== "undefined"
          ? document.documentElement.clientWidth
          : 0;

      const rect = {
        left: Math.min(...positions.map((coord) => coord.x)),
        top: Math.min(...positions.map((coord) => coord.y)),
        right: Math.max(...positions.map((coord) => coord.x)),
        bottom: Math.max(...positions.map((coord) => coord.y)),
      };
      const rectWidth = rect.right - rect.left;
      const rectHeight = rect.bottom - rect.top;
      const newScale =
        positions.length > 0
          ? Math.min(
              (windowWidth * 0.9) / rectWidth,
              (windowHeight * 0.9) / rectHeight,
              1,
            )
          : 1;
      const newPosition: Coordinates = {
        x: (windowWidth - (rect.left + rect.right) * newScale) / 2,
        y: (windowHeight - (rect.top + rect.bottom) * newScale) / 2,
      };
      // console.log(newPosition, newScale);
      state.scale = newScale;

      state.position = newPosition;
      console.log("resizeCanvas");
    });
  },
});
