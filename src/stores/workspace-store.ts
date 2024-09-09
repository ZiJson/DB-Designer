import { createStore, StateCreator } from "zustand/vanilla";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { CanvasStore, createCanvasStore } from "./CanvasStore";
import { createTableStore, TableStore } from "./TableStore";
import { createRelationStore, RelationStore } from "./RelationStore";

export type WorkspaceState = {
  isDashboardOpen: boolean;
};

export type WorkspaceActions = {
  setIsDashboardOpen: (isDashboardOpen: boolean) => void;
};

export type WorkspaceStore = WorkspaceState &
  CanvasStore &
  TableStore &
  RelationStore &
  WorkspaceActions;

export const defaultInitState: WorkspaceState = {
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
        ...createRelationStore(...args),
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
