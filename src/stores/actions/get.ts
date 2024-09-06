import { FieldNode } from "@/types/Connection";
import { StateCreator } from "zustand";
import { WorkspaceStore } from "../workspace-store";
import { Field, RelationField, TableModal } from "@/types/Table";
import { Coordinates } from "@dnd-kit/core/dist/types";

export type WorkspaceGettingActions = {
  getNodesByTableId: (tableId: number) => FieldNode[];
  getFieldByNodeId: (nodeId: number) => Field | RelationField;
  getTableByNodeId: (nodeId: number) => TableModal;
  getStartPosition: () => Coordinates;
};

export const createGettingActions: StateCreator<
  WorkspaceStore,
  [],
  [],
  WorkspaceGettingActions
> = (set, get, store) => ({
  getNodesByTableId: (tableId: number) => {
    return get().nodes.filter((node) => node.tableId === tableId);
  },
  getFieldByNodeId: (nodeId: number) => {
    const node = get().nodes.find((node) => node.id === nodeId)!;
    const { tableId, fieldId } = node;
    return get()
      .tables.find((table) => table.id === tableId)
      ?.fields.find((field) => field.id === fieldId)!;
  },
  getTableByNodeId: (nodeId: number) => {
    const node = get().nodes.find((node) => node.id === nodeId)!;
    const { tableId } = node;
    return get().tables.find((table) => table.id === tableId)!;
  },
  getStartPosition: () => {
    const { position, scale } = get().canvas;
    return {
      x: -position.x + 10 / scale,
      y: -position.y + 10 / scale,
    };
  },
});
