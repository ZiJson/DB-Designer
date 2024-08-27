import { createStore } from "zustand/vanilla";
import { type TableModal } from "@/types/Table";
import { type Connection, type FieldNode } from "@/types/Connection";
import { type CanvasState } from "@/types/Canvas";
import { FieldTypes } from "@/types/FieldTypes";
import { toast } from "sonner";

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
  addField: (tableId: number, name: string, fieldType: FieldTypes) => void;
  addNode: (tableId: number, fieldId: number) => void;
  getNodesByTableId: (tableId: number) => FieldNode[];
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
  initState: WorkspaceState = defaultInitState,
) => {
  return createStore<WorkspaceStore>()((set, get) => ({
    ...initState,
    scaling: (scale: number) =>
      set((state) => ({ ...state, canvas: { scale } })),
    addTable: () =>
      set((state) => {
        state.addNode(state.tables.length + 1, 1);
        return {
          tables: [
            ...state.tables,
            {
              id: state.tables.length + 1,
              name: `table ${state.tables.length + 1}`,
              fields: [
                {
                  name: "id",
                  type: { name: FieldTypes.INT },
                  nullable: false,
                  unique: true,
                },
              ],
            },
          ],
        };
      }),
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
              !nodeIds.includes(line.NodeIds[1]),
          ),
        };
      });
    },
    getNodesByTableId: (tableId: number) => {
      return get().nodes.filter((node) => node.tableId === tableId);
    },
    updateNode: (id: number, tableCoordinates: { x: number; y: number }) => {
      const nodes = get().getNodesByTableId(id);
      const nodeIds = nodes.map((node) => node.id);
      set((state) => {
        const newNodes = state.nodes.map((node, index) => {
          if (nodeIds.includes(node.id)) {
            const curNode = nodes.find((n) => n.id === node.id)!;
            const newCoordinates = {
              x: tableCoordinates.x + 144,
              y: tableCoordinates.y + 53 + (curNode.fieldId - 1) * 33,
            };
            return { ...node, coordinates: newCoordinates };
          }
          return node;
        });
        return { nodes: newNodes };
      });
    },
    setConnectingNode: (id: null | number) => {
      set((state) => ({ connectingNode: id }));
    },
    addLine: (nodeId1: number, nodeId2: number) => {
      const tableId1 = get().nodes.find((node) => node.id === nodeId1)!.tableId;
      const tableId2 = get().nodes.find((node) => node.id === nodeId2)!.tableId;
      if (tableId1 === tableId2)
        return toast.error("Cannot connect fields from the same table");
      set((state) => ({
        lines: [
          ...state.lines,
          { id: state.lines.length + 1, NodeIds: [nodeId1, nodeId2] },
        ],
      }));
    },
    addNode: (tableId: number, fieldId: number) => {
      set((state) => ({
        nodes: [
          ...state.nodes,
          {
            id: state.nodes.length + 1,
            tableId,
            fieldId,
            coordinates: { x: 0, y: 0 },
          },
        ],
      }));
    },
    addField: (tableId: number, name: string, fieldType: FieldTypes) =>
      set((state) => ({
        tables: state.tables.map((table) => {
          if (table.id === tableId) {
            state.addNode(tableId, table.fields.length + 1);
            return {
              ...table,
              fields: [
                ...table.fields,
                {
                  name: name,
                  type: { name: fieldType },
                  nullable: false,
                  unique: false,
                },
              ],
            };
          }
          return table;
        }),
      })),
  }));
};
