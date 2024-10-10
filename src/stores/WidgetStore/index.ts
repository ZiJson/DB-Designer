import { ImmerStateCreator } from "../workspace-store";

type Position = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};
type WidgetItem = {
  side: "left" | "right" | null;
  isExpanded: boolean;
  position: Position;
  hide: boolean;
};

type WidgetState = {
  rightSpace: string | null;
  leftSpace: string | null;
  widgets: Map<string, WidgetItem>;
};

type WidgetActions = {};

export type WidgetStore = WidgetState & WidgetActions;

const defaultWidget: WidgetItem = {
  side: null,
  isExpanded: false,
  position: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hide: false,
};

const defaultInitState: WidgetState = {
  rightSpace: null,
  leftSpace: null,
  widgets: new Map(["codeEditor"].map((key) => [key, defaultWidget])),
};

export const createWidgetStore: ImmerStateCreator<WidgetStore> = (set) => ({
  ...defaultInitState,
});
