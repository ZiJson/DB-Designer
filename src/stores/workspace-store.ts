import { createStore } from "zustand/vanilla";
import { Field, ToggleType, type TableModal } from "@/types/Table";
import { type Connection, type FieldNode } from "@/types/Connection";
import { type CanvasState } from "@/types/Canvas";
import { FieldTypes } from "@/types/FieldTypes";
import { createSettingActions, WorkspaceSettingActions } from "./actions/set";
import { createGettingActions, WorkspaceGettingActions } from "./actions/get";
import { createToolActions, WorkspaceToolActions } from "./actions/tool";

export type WorkspaceState = {
  canvas: CanvasState;
  tables: TableModal[];
  lines: Connection[];
  nodes: FieldNode[];
  connectingNode: null | number;
  isDashboardOpen: boolean;
};

export type WorkspaceActions = {
  scaling: (scale: number) => void;
  addTable: () => void;
  updateTable: (table: TableModal) => void;
  removeTable: (id: number) => void;
  updateNode: (id: number, coordinates: { x: number; y: number }) => void;
  setConnectingNode: (id: null | number) => void;
  addLine: (nodeId1: number, nodeId2: number) => void;
  addField: (tableId: number, name: string, fieldType: FieldTypes) => void;
  addNode: (tableId: number, fieldId: number) => void;
  getNodesByTableId: (tableId: number) => FieldNode[];
  setIsDashboardOpen: (isDashboardOpen: boolean) => void;
};

export type WorkspaceStore = WorkspaceState &
  WorkspaceSettingActions &
  WorkspaceGettingActions &
  WorkspaceToolActions;

export const defaultInitState: WorkspaceState = {
  canvas: {
    scale: 1,
  },
  tables: [],
  lines: [],
  nodes: [],
  connectingNode: null,
  isDashboardOpen: false,
};

export const defaultField: Field = {
  id: 1,
  name: "",
  type: FieldTypes.INT,
  [ToggleType.Nullable]: false,
  [ToggleType.Unique]: false,
  [ToggleType.Array]: false,
  [ToggleType.PrimaryKey]: false,
  defaultValue: null,
};

export const createWorkspaceStore = (
  initState: WorkspaceState = defaultInitState,
) => {
  return createStore<WorkspaceStore>()((...args) => ({
    ...initState,
    ...createSettingActions(...args),
    ...createGettingActions(...args),
    ...createToolActions(...args),
  }));
};
