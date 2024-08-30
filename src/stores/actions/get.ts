import { FieldNode } from "@/types/Connection";
import { StateCreator } from "zustand";
import { WorkspaceStore } from "../workspace-store";
import { Field, TableModal } from "@/types/Table";

export type WorkspaceGettingActions = {
  getNodesByTableId: (tableId: number) => FieldNode[];
  getFieldByNodeId: (nodeId: number) => Field;
  getTableByNodeId: (nodeId: number) => TableModal;
};

export const createGettingActions: StateCreator<
  WorkspaceStore,
  [],
  [],
  WorkspaceGettingActions
> = (set, get) => ({
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
});
