import { StateCreator } from "zustand";
import { WorkspaceStore } from "../workspace-store";
import { toast } from "sonner";

export type WorkspaceToolActions = {
  validateRelation: (nodeId1: number, nodeId2: number) => boolean;
};

export const createToolActions: StateCreator<
  WorkspaceStore,
  [],
  [],
  WorkspaceToolActions
> = (set, get) => ({
  validateRelation: (nodeId1: number, nodeId2: number) => {
    const isRelationExists = get().lines.find((line) => {
      return line.NodeIds.includes(nodeId1) && line.NodeIds.includes(nodeId2);
    });
    if (isRelationExists) {
      toast.error("Relation already exists");
      return false;
    }
    const table1 = get().getTableByNodeId(nodeId1);
    const table2 = get().getTableByNodeId(nodeId2);
    if (table1?.id === table2?.id) {
      toast.error("Cannot connect fields from the same table");
      return false;
    }
    const field1 = get().getFieldByNodeId(nodeId1);
    const field2 = get().getFieldByNodeId(nodeId2);
    if (field1.type !== field2.type) {
      toast.error("Cannot connect fields of different types");
      return false;
    }
    return true;
  },
});
