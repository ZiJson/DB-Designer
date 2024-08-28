export type STRING = {
  type: FieldTypes.STRING;
};

export type BOOLEAN = {
  type: FieldTypes.BOOLEAN;
};

export type INT = {
  type: FieldTypes.INT;
};

export type BIGINT = {
  type: FieldTypes.BIGINT;
};

export type FLOAT = {
  type: FieldTypes.FLOAT;
};

export type DECIMAL = {
  type: FieldTypes.DECIMAL;
};

export type DATETIME = {
  type: FieldTypes.DATETIME;
};

export type JSON = {
  type: FieldTypes.JSON;
};

export type BYTES = {
  type: FieldTypes.BYTES;
};

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
