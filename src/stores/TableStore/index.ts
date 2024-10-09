import { ImmerStateCreator } from "../workspace-store";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { Model, ModelField, ScalarTypes } from "@/types/Database";
import { DMMF, type ReadonlyDeep } from "@prisma/generator-helper";
import { v4 as uuid } from "uuid";
import { UUID } from "crypto";

export type MutableDeep<T> = {
  -readonly [P in keyof T]: MutableDeep<T[P]>;
};

type TableState = {
  tables: MutableDeep<DMMF.Model>[];
  positions: Map<string, Coordinates>;
};

type TableActions = {
  updateTablePosition: (tableName: string, position: Coordinates) => void;
  refreshTables: (models: DMMF.Document["datamodel"]["models"]) => void;
  addNewTable: () => void;
  removeTable: (tableName: string) => void;
};

export type TableStore = TableState & TableActions;

const defaultInitState: TableState = {
  tables: [
    {
      name: "Profile",
      dbName: null,
      fields: [
        {
          name: "id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: true,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Int",
          default: {
            name: "autoincrement",
            args: [],
          },
          isGenerated: false,
          isUpdatedAt: false,
        },
        {
          name: "user",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "User",
          relationName: "ProfileToUser",
          relationFromFields: ["userId"],
          relationToFields: ["id"],
          isGenerated: false,
          isUpdatedAt: false,
        },
        {
          name: "userId",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: true,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "Int",
          isGenerated: false,
          isUpdatedAt: false,
        },
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false,
    },
    {
      name: "User",
      dbName: null,
      fields: [
        {
          name: "id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: true,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Int",
          default: {
            name: "autoincrement",
            args: [],
          },
          isGenerated: false,
          isUpdatedAt: false,
        },
        {
          name: "posts",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Post",
          relationName: "PostToUser",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false,
        },
        {
          name: "profile",
          kind: "object",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Profile",
          relationName: "ProfileToUser",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false,
        },
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false,
    },
    {
      name: "Post",
      dbName: null,
      fields: [
        {
          name: "id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: true,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Int",
          default: {
            name: "autoincrement",
            args: [],
          },
          isGenerated: false,
          isUpdatedAt: false,
        },
        {
          name: "author",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "User",
          relationName: "PostToUser",
          relationFromFields: ["authorId"],
          relationToFields: ["id"],
          isGenerated: false,
          isUpdatedAt: false,
        },
        {
          name: "authorId",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "Int",
          isGenerated: false,
          isUpdatedAt: false,
        },
        {
          name: "categories",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Category",
          relationName: "CategoryToPost",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false,
        },
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false,
    },
    {
      name: "Category",
      dbName: null,
      fields: [
        {
          name: "id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: true,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Int",
          default: {
            name: "autoincrement",
            args: [],
          },
          isGenerated: false,
          isUpdatedAt: false,
        },
        {
          name: "posts",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Post",
          relationName: "CategoryToPost",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false,
        },
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false,
    },
  ],
  positions: new Map<string, Coordinates>(),
};

const defaultField: MutableDeep<DMMF.Field> = {
  name: "id",
  kind: "scalar",
  isList: false,
  isRequired: true,
  isUnique: false,
  isId: true,
  isReadOnly: false,
  hasDefaultValue: false,
  type: "Int",
};

const defaultModel: MutableDeep<DMMF.Model> = {
  name: "",
  dbName: null,
  fields: [defaultField],
  primaryKey: null,
  uniqueFields: [],
  uniqueIndexes: [],
  isGenerated: false,
};

export const createTableStore: ImmerStateCreator<TableStore> = (
  set,
  get,
  store,
) => ({
  ...defaultInitState,
  updateTablePosition(tableName, position) {
    set((state) => {
      state.positions.set(tableName, position);
    });
  },
  addNewTable: () => {
    set((state) => {
      state.tables.push({
        ...defaultModel,
        name: `Table ${state.tables.length + 1}`,
      });
    });
  },
  removeTable(tableName) {
    set((state) => {
      state.tables = state.tables.filter((table) => table.name !== tableName);
    });
  },
  refreshTables(models) {
    set((state) => {
      state.tables = models as MutableDeep<DMMF.Model>[];
    });
  },
});
