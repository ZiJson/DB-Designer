import { Coordinates } from "@dnd-kit/core/dist/types";
import { DMMF } from "@prisma/generator-helper";

export type EnumValue = {
  name: string;
  dbName?: string | null;
};

export type EnumDefinition = {
  name: string;
  values: EnumValue[];
  dbName?: string | null;
};

export enum ScalarTypes {
  STRING = "String",
  BOOLEAN = "Boolean",
  INT = "Int",
  BIGINT = "BigInt",
  FLOAT = "Float",
  DECIMAL = "Decimal",
  DATETIME = "DateTime",
  JSON = "Json",
  BYTES = "Bytes",
}

export enum FieldAttributes {
  IS_LIST = "isList",
  IS_REQUIRED = "isRequired",
  IS_UNIQUE = "isUnique",
  IS_ID = "isId",
  IS_READ_ONLY = "isReadOnly",
  HAS_DEFAULT_VALUE = "hasDefaultValue",
}

export type ModelField = {
  name: string;
  kind: "scalar" | "enum" | "object";
  type: ScalarTypes | string;
  default?: any;
  relationName?: string;
  relationFromFields?: string[];
  relationToFields?: string[];
  isGenerated?: boolean;
  isUpdatedAt?: boolean;
} & { [key in FieldAttributes]: boolean };

export type Model = {
  name: string;
  dbName?: string | null;
  fields: ModelField[];
  primaryKey?: string | null;
  uniqueFields: string[];
  uniqueIndexes: string[];
  isGenerated?: boolean;
} & { position: Coordinates };

export type DatabaseSchema = {
  enums: EnumDefinition[];
  models: Model[];
};
