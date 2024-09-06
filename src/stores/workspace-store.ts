import { createStore, StateCreator } from "zustand/vanilla";
import { Field, ToggleType, type TableModal } from "@/types/Table";
import { type Connection, type FieldNode } from "@/types/Connection";
import { type CanvasState } from "@/types/Canvas";
import { FieldTypes } from "@/types/FieldTypes";
import { devtools, persist } from "zustand/middleware";
import { createSettingActions, WorkspaceSettingActions } from "./actions/set";
import { createGettingActions, WorkspaceGettingActions } from "./actions/get";
import { createToolActions, WorkspaceToolActions } from "./actions/tool";
import { immer } from "zustand/middleware/immer";
import { CanvasStore, createCanvasStore } from "./CanvasStore.ts";
import { TableStore } from "./TableStore.ts";

export type WorkspaceState = {
  canvas: CanvasState;
  tables: TableModal[];
  lines: Connection[];
  nodes: FieldNode[];
  connectingNode: null | number;
  isDashboardOpen: boolean;
};

export type WorkspaceStore = WorkspaceState &
  CanvasStore &
  TableStore &
  WorkspaceSettingActions &
  WorkspaceGettingActions &
  WorkspaceToolActions;

export const defaultInitState: WorkspaceState = {
  canvas: {
    scale: 1,
    position: { x: 0, y: 0 },
  },
  tables: [],
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
      persist(
        immer((...args) => ({
          ...initState,
          ...createCanvasStore(...args),
          ...createSettingActions(...args),
          ...createGettingActions(...args),
          ...createToolActions(...args),
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
