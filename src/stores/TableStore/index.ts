import { ImmerStateCreator } from "../workspace-store";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { DMMF } from "@prisma/generator-helper";

export type MutableDeep<T> = {
  -readonly [P in keyof T]: MutableDeep<T[P]>;
};

type TableState = {
  models: MutableDeep<DMMF.Model>[];
  positions: Map<string, Coordinates>;
};

type TableActions = {
  getTablePosition: (tableName: string) => Coordinates; //Position
  updateTablePosition: (tableName: string, position: Coordinates) => void;
  refreshTables: (models: DMMF.Document["datamodel"]["models"]) => void;
  addNewTable: () => void;
  removeTable: (tableName: string) => void;
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
  getTablePosition(tableName) {
    const position = get().positions.get(tableName);
    if (!position) {
      set((state) => {
        state.positions.set(tableName, { x: 0, y: 0 });
      });
      return { x: 0, y: 0 };
    } else {
      return position;
    }
  },
  updateTablePosition(tableName, position) {
    set((state) => {
      state.positions.set(tableName, position);
    });
  },
  addNewTable: () => {
    set((state) => {
      state.models.push({
        ...defaultModel,
        name: `Table ${state.models.length + 1}`,
      });
    });
  },
  removeTable(modelName) {
    set((state) => {
      state.models = state.models.filter((model) => model.name !== modelName);
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
            console.log(field.relationName);
          }
          return field;
        });
        return model;
      });
      const tempPosition = get().positions.get(tableName)!;
      state.positions.set(name, tempPosition);
      state.positions.delete(tableName);
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
});
