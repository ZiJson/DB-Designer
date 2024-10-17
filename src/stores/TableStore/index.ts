import { ImmerStateCreator } from "../workspace-store";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { DMMF } from "@prisma/generator-helper";
import { Files } from "lucide-react";

export type MutableDeep<T> = {
  -readonly [P in keyof T]: MutableDeep<T[P]>;
};

type TableState = {
  models: MutableDeep<DMMF.Model>[];
  positions: Record<string, Coordinates | null>;
};

type TableActions = {
  updateTablePosition: (tableName: string, position: Coordinates) => void;
  refreshTables: (models: DMMF.Document["datamodel"]["models"]) => void;
  addNewTable: () => void;
  addNewField: (tableName: string) => void;
  removeTable: (tableName: string) => void;
  removeField: (tableName: string, fieldName: string) => void;
  updateModelName: (tableName: string, name: string) => void;
  updateFieldName: (tableName: string, fieldName: string, name: string) => void;
  updateModelField: (
    tableName: string,
    fieldName: string,
    field: MutableDeep<DMMF.Field>,
  ) => void;
};

export type TableStore = TableState & TableActions;

const defaultInitState: TableState = {
  models: [
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
  positions: {},
};

const defaultField: MutableDeep<DMMF.Field> = {
  name: "_",
  kind: "scalar",
  isList: false,
  isRequired: true,
  isUnique: false,
  isId: false,
  isReadOnly: false,
  hasDefaultValue: false,
  type: "",
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
      state.positions[tableName] = position;
    });
  },
  addNewTable: () => {
    set((state) => {
      state.models.push({
        ...defaultModel,
        name: `Table${state.models.length + 1}`,
        fields: [
          {
            ...defaultField,
            name: "id",
            isId: true,
            type: "Int",
          },
        ],
      });
    });
  },
  removeTable(modelName) {
    set((state) => {
      state.models = state.models.filter((model) => model.name !== modelName);
      state.positions[modelName] = null;
      state.models = state.models.map((model) => {
        model.fields = model.fields.filter((field) => field.type !== modelName);
        return model;
      });
    });
  },
  removeField(tableName, fieldName) {
    set((state) => {
      state.models = state.models.map((model) => {
        if (model.name === tableName) {
          model.fields = model.fields.filter(
            (field) => field.name !== fieldName,
          );
        }
        return model;
      });
    });
  },
  refreshTables(models) {
    set((state) => {
      state.models = models as MutableDeep<DMMF.Model>[];
    });
  },
  updateModelName(tableName, name) {
    set((state) => {
      state.models = state.models.map((model) => {
        if (model.name === tableName) {
          model.name = name;
          model.fields = model.fields.map((field) => {
            if (field.kind === "object") {
              field.relationName = field.relationName?.replace(tableName, name);
            }
            return field;
          });
        }
        model.fields = model.fields.map((field) => {
          if (field.type === tableName && field.kind === "object") {
            field.type = name;
            field.relationName = field.relationName?.replace(tableName, name);
          }
          return field;
        });
        return model;
      });
      const tempPosition = get().positions[tableName]!;
      state.positions[name] = tempPosition;
      state.positions[tableName] = null;
    });
  },
  updateFieldName(tableName, fieldName, name) {
    set((state) => {
      state.models = state.models.map((model) => {
        if (model.name === tableName) {
          model.fields = model.fields.map((f) => {
            if (f.name === fieldName) {
              f.name = name;
            }
            return f;
          });
        }
        model.fields = model.fields.map((field) => {
          if (
            field.type === tableName &&
            field.kind === "object" &&
            field.relationToFields?.includes(fieldName)
          ) {
            field.relationToFields = field.relationToFields?.map((field) => {
              if (field === fieldName) {
                return name;
              }
              return field;
            });
          }
          return field;
        });
        return model;
      });
    });
  },
  updateModelField(tableName, fieldName, field) {
    set((state) => {
      state.models = state.models.map((model) => {
        if (model.name === tableName) {
          model.fields = model.fields.map((f) => {
            if (f.name === fieldName) {
              return field;
            }
            return f;
          });
        }
        return model;
      });
    });
  },
  addNewField(tableName) {
    set((state) => {
      state.models = state.models.map((model) => {
        if (model.name === tableName) {
          model.fields.push(defaultField);
        }
        return model;
      });
    });
  },
});
