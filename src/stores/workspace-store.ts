import { createStore, StateCreator } from "zustand/vanilla";
import { type Connection, type FieldNode } from "@/types/Connection";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { CanvasStore, createCanvasStore } from "./CanvasStore.ts";
import { createTableStore, TableStore } from "./TableStore.ts";

export type WorkspaceState = {
  lines: Connection[];
  nodes: FieldNode[];
  connectingNode: null | number;
  isDashboardOpen: boolean;
};

export type WorkspaceActions = {
  setIsDashboardOpen: (isDashboardOpen: boolean) => void;
};

export type WorkspaceStore = WorkspaceState &
  CanvasStore &
  TableStore &
  WorkspaceActions;

export const defaultInitState: WorkspaceState = {
  lines: [],
  nodes: [],
  connectingNode: null,
  isDashboardOpen: false,
};

export const createWorkspaceStore = (
  initState: WorkspaceState = defaultInitState,
) => {
  return createStore<WorkspaceStore>()(
    devtools(
      // persist(
      immer((...args) => ({
        ...initState,
        ...createCanvasStore(...args),
        ...createTableStore(...args),
        setIsDashboardOpen: (isDashboardOpen) => {
          args[0]((state) => {
            state.isDashboardOpen = isDashboardOpen;
          });
        },
      })),
      //   {
      //     name: "workspace-store",
      //   },
      // ),
    ),
  );
};

export type ImmerStateCreator<T extends Partial<WorkspaceStore>> = StateCreator<
  WorkspaceStore,
  [["zustand/immer", never], never],
  [],
  T
>;
