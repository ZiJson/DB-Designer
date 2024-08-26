import { createRef } from "react";
import { createStore } from "zustand/vanilla";
import { type TableModal } from "@/types/Table";
import { type Connection, type FieldNode } from "@/types/Connection";
import { type CanvasState } from "@/types/Canvas";

export type WorkspaceState = {
  canvas: CanvasState;
  tables: TableModal[];
  lines: Connection[];
  nodes: FieldNode[];
  connectingNode: null | number;
};

export type WorkspaceActions = {
  scaling: (scale: number) => void;
  addTable: () => void;
  removeTable: (id: number) => void;
  updateNode: (id: number, coordinates: { x: number; y: number }) => void;
  setConnectingNode: (id: null | number) => void;
  addLine: (nodeId1: number, nodeId2: number) => void;
};

export type WorkspaceStore = WorkspaceState & WorkspaceActions;

export const defaultInitState: WorkspaceState = {
  canvas: {
    scale: 1,
  },
  tables: [],
  lines: [],
  nodes: [],
  connectingNode: null,
};

export const createWorkspaceStore = (
  initState: WorkspaceState = defaultInitState
) => {
  return createStore<WorkspaceStore>()((set) => ({
    ...initState,
    scaling: (scale: number) =>
      set((state) => ({ ...state, canvas: { scale } })),
    addTable: () =>
      set((state) => ({
        tables: [
          ...state.tables,
          {
            id: state.tables.length + 1,
            name: `table ${state.tables.length + 1}`,
            fields: [
              {
                name: "id",
                type: { name: "INT" },
                nullable: false,
                unique: true,
              },
            ],
          },
        ],
        nodes: [
          ...state.nodes,
          {
            id: state.nodes.length + 1,
            tableId: state.tables.length + 1,
            fieldId: 1,
            coordinates: { x: 0, y: 0 },
          },
        ],
      })),
    removeTable: (id: number) => {
      set((state) => {
        const nodeIds = state.nodes
          .filter((node) => node.tableId === id)
          .map((node) => node.id);
        console.log(nodeIds);
        return {
          tables: state.tables.filter((table) => table.id !== id),
          lines: state.lines.filter(
            (line) =>
              !nodeIds.includes(line.NodeIds[0]) &&
              !nodeIds.includes(line.NodeIds[1])
          ),
        };
      });
    },
    updateNode: (id: number, coordinates: { x: number; y: number }) =>
      set((state) => {
        const newNodes = state.nodes.map((node) => {
          if (node.id === id) {
            return { ...node, coordinates };
          }
          return node;
        });
        return { nodes: newNodes };
      }),
    setConnectingNode: (id: null | number) => {
      set((state) => ({ connectingNode: id }));
    },
    addLine: (nodeId1: number, nodeId2: number) =>
      set((state) => ({
        lines: [
          ...state.lines,
          { id: state.lines.length + 1, NodeIds: [nodeId1, nodeId2] },
        ],
      })),
  }));
};
