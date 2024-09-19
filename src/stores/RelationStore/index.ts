import { Relation } from "@/types/Relation";
import { ImmerStateCreator } from "../workspace-store";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { start } from "repl";
import { toast } from "sonner";

type RelationState = {
  relations: Relation[];
  connectingNode: {
    tableId: string;
    fieldId: string;
  } | null;
};

type RelationActions = {
  addRelation: (relation: Relation) => void;
  removeRelation: (tableId: string, fieldId?: string) => void;
  getNodePosition: (tableId: string, fieldId: string) => Coordinates;
  setConnectingNode: (tableId: string, fieldId: string) => void;
  clearConnectingNode: () => void;
  getAllNodes: () => {
    tableId: string;
    fieldId: string;
    coordinates: Coordinates;
  }[];
};

export type RelationStore = RelationState & RelationActions;

const defaultInitState: RelationState = {
  relations: [],
  connectingNode: null,
};

export const createRelationStore: ImmerStateCreator<RelationStore> = (
  set,
  get,
) => ({
  ...defaultInitState,
  addRelation: (relation: Relation) => {
    if (relation.start.tableId === relation.end.tableId) {
      toast.error("You can't create relation to the same table");
      return;
    }
    const startField = get()
      .tables.find((table) => table.id === relation.start.tableId)
      ?.fields.find((field) => field.id === relation.start.fieldId);
    const endField = get()
      .tables.find((table) => table.id === relation.end.tableId)
      ?.fields.find((field) => field.id === relation.end.fieldId);
    if (!startField || !endField) {
      toast.error("Field not found");
      return;
    }
    if (startField.type !== endField.type) {
      toast.error("Field types are different");
      return;
    }
    if (
      startField.relations.some(
        (r) =>
          r.tableId === relation.end.tableId &&
          r.fieldId === relation.end.fieldId,
      )
    ) {
      toast.error("Relation is exist");
      return;
    }
    set((state) => {
      state.relations.push(relation);
    });
    get().addFieldRelation(
      relation.start.tableId,
      relation.start.fieldId,
      relation.end.tableId,
      relation.end.fieldId,
    );
  },
  getNodePosition: (tableId: string, fieldId: string) => {
    const table = get().tables.find((table) => table.id === tableId);
    if (!table) return { x: 0, y: 0 };
    const transform = table.transform;
    let fieldIndex = 0;
    for (const field of table.fields) {
      if (field.id === fieldId) {
        break;
      }
      fieldIndex += field.relations.length;
      fieldIndex++;
    }
    return {
      x: table.position.x + transform.x + 144,
      y: table.position.y + transform.y + 53 + fieldIndex * 33,
    };
  },
  setConnectingNode: (tableId: string, fieldId: string) =>
    set((state) => {
      state.connectingNode = { tableId, fieldId };
    }),
  clearConnectingNode: () =>
    set((state) => {
      state.connectingNode = null;
    }),
  getAllNodes: () => {
    const nodes: {
      tableId: string;
      fieldId: string;
      coordinates: Coordinates;
    }[] = [];
    const tables = get().tables;
    tables.forEach((table) => {
      table.fields.forEach((field) => {
        nodes.push({
          tableId: table.id,
          fieldId: field.id,
          coordinates: get().getNodePosition(table.id, field.id),
        });
      });
    });
    return nodes;
  },
  removeRelation: (tableId: string, fieldId?: string) =>
    set((state) => {
      if (fieldId) {
        state.relations = state.relations.filter(
          (r) =>
            !(
              (r.start.tableId === tableId && r.start.fieldId === fieldId) ||
              (r.end.tableId === tableId && r.end.fieldId === fieldId)
            ),
        );
      } else {
        state.relations = state.relations.filter(
          (r) => !(r.start.tableId === tableId || r.end.tableId === tableId),
        );
      }
    }),
});
