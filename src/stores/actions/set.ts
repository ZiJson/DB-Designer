import { FieldNode } from "@/types/Connection";
import { FieldTypes } from "@/types/FieldTypes";
import { TableModal } from "@/types/Table";
import { StateCreator } from "zustand";
import { defaultField, WorkspaceStore } from "../workspace-store";
import { toast } from "sonner";

export type WorkspaceSettingActions = {
  scaling: (scale: number) => void;
  addTable: () => void;
  updateTable: (table: TableModal) => void;
  removeTable: (id: number) => void;
  updateNode: (id: number, coordinates: { x: number; y: number }) => void;
  setConnectingNode: (id: null | number) => void;
  addLine: (nodeId1: number, nodeId2: number) => void;
  addField: (tableId: number, name: string, fieldType: FieldTypes) => void;
  addNode: (tableId: number, fieldId: number) => void;
  setIsDashboardOpen: (isDashboardOpen: boolean) => void;
};

export const createSettingActions: StateCreator<
  WorkspaceStore,
  [],
  [],
  WorkspaceSettingActions
> = (set, get) => ({
  scaling: (scale: number) => set((state) => ({ ...state, canvas: { scale } })),
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
                ...defaultField,
                name: "id",
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
    if (!get().validateRelation(nodeId1, nodeId2)) return;
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
                ...defaultField,
                id: table.fields.length + 1,
                name,
                type: fieldType,
              },
            ],
          };
        }
        return table;
      }),
    })),
  updateTable: (table: TableModal) => {
    set((state) => ({
      tables: state.tables.map((t) => {
        if (t.id === table.id) {
          return table;
        }
        return t;
      }),
    }));
  },
  setIsDashboardOpen: (isDashboardOpen: boolean) =>
    set((state) => ({ isDashboardOpen })),
});
