import { FieldTypes } from "@/types/FieldTypes";
import { TableModal } from "@/types/Table";
import { StateCreator } from "zustand";
import { defaultField, WorkspaceStore } from "../workspace-store";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { Connection, FieldNode } from "@/types/Connection";

export type WorkspaceSettingActions = {
  scaling: (scale: number) => void;
  setCanvasPosition: (position: Coordinates) => void;
  addTable: () => void;
  setTablePosition: (id: number, position: Coordinates) => void;
  updateTable: (table: TableModal) => void;
  removeTable: (id: number) => void;
  updateNode: (id: number, coordinates: { x: number; y: number }) => void;
  setConnectingNode: (id: null | number) => void;
  addLine: (nodeId1: number, nodeId2: number) => void;
  removeLine: (nodeId: number) => void;
  addField: (tableId: number, name: string, fieldType: FieldTypes) => void;
  addNode: (tableId: number, fieldId: number) => void;
  setIsDashboardOpen: (isDashboardOpen: boolean) => void;
  addRelationField: (
    tableId1: number,
    fieldId1: number,
    tableId2: number,
    fieldId2: number,
  ) => void;
  removeRelationField: (node: FieldNode) => void;
};

export const createSettingActions: StateCreator<
  WorkspaceStore,
  [],
  [],
  WorkspaceSettingActions
> = (set, get) => ({
  scaling: (scale: number) =>
    set((state) => ({ canvas: { ...state.canvas, scale } })),
  setCanvasPosition: (position: Coordinates) =>
    set((state) => ({ canvas: { ...state.canvas, position } })),
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
            position: get().getStartPosition(),
          },
        ],
      };
    }),
  setTablePosition: (id: number, position: Coordinates) => {
    set((state) => ({
      tables: state.tables.map((table) => {
        if (table.id === id) {
          return { ...table, position };
        }
        return table;
      }),
    }));
  },
  removeTable: (id: number) => {
    const nodeIds = get()
      .nodes.filter((node) => node.tableId === id)
      .map((node) => node.id);
    set((state) => {
      nodeIds.forEach((nodeId) => {
        state.removeLine(nodeId);
      });
      return {
        tables: state.tables.filter((table) => table.id !== id),
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
    set((state) => {
      state.addRelationField(
        state.getTableByNodeId(nodeId1).id,
        state.getFieldByNodeId(nodeId1).id,
        state.getTableByNodeId(nodeId2).id,
        state.getFieldByNodeId(nodeId2).id,
      );
      return {};
    });
  },
  removeLine: (nodeId: number) => {
    const otherNodeIds: number[] = get().lines.reduce((acc: number[], line) => {
      if (line.NodeIds.includes(nodeId)) {
        acc.push(line.NodeIds.find((id) => id !== nodeId)!);
      }
      return acc;
    }, []);
    otherNodeIds.forEach((id) => {
      get().removeRelationField(get().nodes.find((node) => node.id === id)!);
    });
    set((state) => ({
      lines: state.lines.filter((line) => !line.NodeIds.includes(nodeId)),
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
  addRelationField: (
    tableId1: number,
    fieldId1: number,
    tableId2: number,
    fieldId2: number,
  ) => {
    set((state) => {
      const table1 = state.tables.find((t) => t.id === tableId1)!;
      const table2 = state.tables.find((t) => t.id === tableId2)!;
      const field1 = table1.fields.find((f) => f.id === fieldId1)!;
      const field2 = table2.fields.find((f) => f.id === fieldId2)!;
      const re = {
        id: 10,
        name: "relation",
        relation: {
          tableId: tableId2,
          fieldId: fieldId2,
        },
        nullable: false,
        toArray: false,
      };
      const newTable1 = {
        ...table1,
        fields: [
          ...table1.fields.slice(
            0,
            table1.fields.findIndex((f) => f.id === field1.id),
          ),
          re,
          ...table1.fields.slice(
            table1.fields.findIndex((f) => f.id === field1.id),
          ),
        ],
      };
      const newTable2 = {
        ...table2,
        fields: [
          ...table2.fields,
          {
            id: 10,
            name: "relation",
            relation: {
              tableId: tableId1,
              fieldId: fieldId1,
            },
            nullable: false,
            toArray: false,
          },
        ],
      };
      return {
        tables: state.tables.map((t) => {
          if (t.id === tableId1) {
            return newTable1;
          }
          if (t.id === tableId2) {
            return newTable2;
          }
          return t;
        }),
      };
    });
  },
  removeRelationField: (node: FieldNode) => {
    console.log(node);
    const { tableId, fieldId } = node;
    const table = get().tables.find((t) => t.id === tableId)!;
    const newTable = {
      ...table,
      fields: table.fields.filter((f) => f.id !== fieldId),
    };
    set((state) => ({
      tables: state.tables.map((t) => {
        if (t.id === tableId) {
          return newTable;
        }
        return t;
      }),
    }));
  },
});
