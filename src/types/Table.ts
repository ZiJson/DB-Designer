import { Coordinates } from "@dnd-kit/core/dist/types";
import { FiledTypes } from "./FieldTypes";

export type TableModal = {
  id: string;
  name: string;
  fields: Field[];
  position: Coordinates;
  transform: Coordinates;
};

export type Field = {
  id: string;
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
  relations: {
    tableId: string;
    fieldId: string;
    name: string;
    [ToggleType.Array]: boolean;
    [ToggleType.Nullable]: boolean;
  }[];
};
