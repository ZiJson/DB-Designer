export type BasicType = {
  name: string;
};
export type STRING = {
  name: FieldTypes.STRING;
} & BasicType;

export type BOOLEAN = {
  name: FieldTypes.BOOLEAN;
} & BasicType;

export type INT = {
  name: FieldTypes.INT;
} & BasicType;

export type BIGINT = {
  name: FieldTypes.BIGINT;
} & BasicType;

export type FLOAT = {
  name: FieldTypes.FLOAT;
} & BasicType;

export type DECIMAL = {
  name: FieldTypes.DECIMAL;
} & BasicType;

export type DATETIME = {
  name: FieldTypes.DATETIME;
} & BasicType;

export type JSON = {
  name: FieldTypes.JSON;
} & BasicType;

export type BYTES = {
  name: FieldTypes.BYTES;
} & BasicType;

export type FiledTypes =
  | STRING
  | BOOLEAN
  | INT
  | BIGINT
  | FLOAT
  | DECIMAL
  | DATETIME
  | JSON
  | BYTES;

export enum FieldTypes {
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
