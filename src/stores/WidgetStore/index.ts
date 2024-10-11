import { get } from "http";
import { ImmerStateCreator } from "../workspace-store";
import CodeEditor from "@/components/CodeEditor";

type Position = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};
type WidgetItem = {
  side: "left" | "right";
  isExpanded: boolean;
  position: Position;
  hide: boolean;
  isShowToolbar: boolean;
};

type WidgetState = {
  rightSpace: string | null;
  leftSpace: string | null;
  widgets: {
    [key: string]: WidgetItem;
  };
};

type WidgetActions = {
  setWidgetSide: (widgetId: string, side: "left" | "right") => void;
  toggletIsExpanded: (widgetId: string) => void;
  setWidgetPosition: (widgetId: string, position: Position | null) => void;
  toggleWidgetHide: (widgetId: string) => void;
  setIsShowToolbar: (widgetId: string, isShowToolbar: boolean) => void;
};

export type WidgetStore = WidgetState & WidgetActions;

const defaultWidget: WidgetItem = {
  side: "left",
  isExpanded: false,
  position: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hide: true,
  isShowToolbar: false,
};

const defaultInitState: WidgetState = {
  rightSpace: null,
  leftSpace: null,
  widgets: {
    codeEditor: defaultWidget,
    noCodeEditor: { ...defaultWidget, side: "right" },
  },
};

export const createWidgetStore: ImmerStateCreator<WidgetStore> = (
  set,
  get,
) => ({
  ...defaultInitState,
  setWidgetSide: (widgetId: string, side: "left" | "right") => {
    const otherWidgetKey = Object.keys(get().widgets).find(
      (key) => key !== widgetId && get().widgets[key].side === side,
    );
    set((state) => {
      if (otherWidgetKey) {
        state.widgets[otherWidgetKey].side = side === "left" ? "right" : "left";
      }
      state.widgets[widgetId].side = side;
    });
  },
  toggletIsExpanded: (widgetId: string) => {
    set((state) => {
      state.widgets[widgetId].isExpanded = !state.widgets[widgetId].isExpanded;
    });
  },
  setWidgetPosition: (widgetId: string, position: Position | null) => {
    set((state) => {
      if (!position) return;
      state.widgets[widgetId].position = position;
    });
  },
  toggleWidgetHide: (widgetId: string) => {
    const widget = get().widgets[widgetId];
    const otherWidgetKey = Object.keys(get().widgets).find(
      (key) => key !== widgetId && get().widgets[key].side === widget.side,
    );
    set((state) => {
      if (otherWidgetKey) {
        state.widgets[otherWidgetKey].side =
          widget.side === "left" ? "right" : "left";
      }
      state.widgets[widgetId].isShowToolbar = false;
      state.widgets[widgetId].hide = !state.widgets[widgetId].hide;
    });
  },
  setIsShowToolbar: (widgetId: string, isShowToolbar: boolean) => {
    set((state) => {
      state.widgets[widgetId].isShowToolbar = isShowToolbar;
    });
  },
});
