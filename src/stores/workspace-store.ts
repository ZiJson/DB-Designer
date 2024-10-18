import { createStore, StateCreator } from "zustand/vanilla";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { CanvasStore, createCanvasStore } from "./CanvasStore";
import { createTableStore, TableStore } from "./TableStore";
import { createWidgetStore, WidgetStore } from "./WidgetStore";

export type WorkspaceState = {};

export type WorkspaceActions = {};

export type WorkspaceStore = WorkspaceState &
  WorkspaceActions &
  CanvasStore &
  TableStore &
  WidgetStore 

export const defaultInitState: WorkspaceState = {};
export const createWorkspaceStore = (
  initState: WorkspaceState = defaultInitState,
) => {
  return createStore<WorkspaceStore>()(
    devtools(
      persist(
        immer((...args) => ({
          ...initState,
          ...createCanvasStore(...args),
          ...createTableStore(...args),
          ...createWidgetStore(...args),
        })),
        {
          name: "workspace-store",
        },
      ),
    ),
  );
};

export type ImmerStateCreator<T extends Partial<WorkspaceStore>> = StateCreator<
  WorkspaceStore,
  [["zustand/immer", never], never],
  [],
  T
>;
