import { Relation } from "@/types/Relation";
import { ImmerStateCreator } from "../workspace-store";
import { Coordinates } from "@dnd-kit/core/dist/types";

type RelationState = {
  relations: Relation[];
};

type RelationActions = {
  addRelation: (relation: Relation) => void;
  getNodePosition: (tableId: number, fieldId: number) => Coordinates;
};

export type RelationStore = RelationState & RelationActions;

const defaultInitState: RelationState = {
  relations: [
    { start: { tableId: 1, fieldId: 1 }, end: { tableId: 0, fieldId: 1 } },
  ],
};

export const createRelationStore: ImmerStateCreator<RelationStore> = (
  set,
  get,
) => ({
  ...defaultInitState,
  addRelation: (relation: Relation) =>
    set((state) => {
      state.relations.push(relation);
    }),
  getNodePosition: (tableId: number, fieldId: number) => {
    // const table = get().tables.find((table) => table.id === tableId);
    // if (!table) return { x: 0, y: 0 };
    // const fieldIndex = table.fields.findIndex((field) => field.id === fieldId);
    // return {
    //   x: table.position.x + 144,
    //   y: table.position.y + 53 + (fieldIndex + 1) * 33,
    // };
    const node = document.getElementById(`${tableId}-${fieldId}`);
    if (!node) return { x: 0, y: 0 };
    const rect = node.getBoundingClientRect();
    const canvasPosition = get().position;
    return {
      x: rect.left - canvasPosition.x,
      y: rect.top - canvasPosition.y,
    };
  },
});
