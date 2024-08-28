import { FiledTypes } from "./FieldTypes";

export type TableModal = {
  id: number;
  name: string | null;
  fields: Field[];
};

export type Field = {
  name: string;
  isPrimaryKey: boolean;
  nullable: boolean;
  unique: boolean;
  isArray: boolean;
  default: string | null;
} & FiledTypes;
