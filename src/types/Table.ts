import { Coordinates } from "@dnd-kit/core/dist/types";
import { FiledTypes } from "./FieldTypes";

export type TableModal = {
  id: number;
  name: string;
  fields: Field[];
  position: Coordinates;
};

export type Field = {
  id: number;
  name: string;
  defaultValue: string | null;
} & FiledTypes &
  FieldToggle &
  FieldRelation;

export type FieldToggle = {
  [K in ToggleType]: boolean;
};

export enum ToggleType {
  PrimaryKey = "primaryKey",
  Nullable = "nullable",
  Unique = "unique",
  Array = "toArray",
}

export type FieldRelation = {
  relation?: {
    tableId: number;
    fieldId: number;
  };
};
