import { FiledTypes } from "./FieldTypes";

export type TableModal = {
  id: number;
  name: string | null;
  fields: Field[];
};

export type Field = {
  id: number;
  name: string;
  defaultValue: string | null;
} & FiledTypes &
  FieldToggle;

export type FieldToggle = {
  [K in ToggleType]: boolean;
};

export enum ToggleType {
  PrimaryKey = "primaryKey",
  Nullable = "nullable",
  Unique = "unique",
  Array = "toArray",
}
