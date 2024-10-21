import { ImmerStateCreator } from "../workspace-store";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { DMMF } from "@prisma/generator-helper";
import { Files } from "lucide-react";

export type MutableDeep<T> = {
  -readonly [P in keyof T]: MutableDeep<T[P]>;
};

export type TableState = {
  models: MutableDeep<DMMF.Model>[];
  enums: MutableDeep<DMMF.DatamodelEnum>[];
  positions: Record<string, Coordinates | null>;
  datasource: string;
};

type TableActions = {
  updateTablePosition: (tableName: string, position: Coordinates) => void;
  refreshTables: (models: DMMF.Datamodel) => void;
  addNewTable: () => void;
  addNewField: (tableName: string) => void;
  removeModel: (tableName: string) => void;
  removeField: (tableName: string, fieldName: string) => void;
  updateModelName: (tableName: string, name: string) => void;
  updateFieldName: (tableName: string, fieldName: string, name: string) => void;
  updateModelField: (
    tableName: string,
    fieldName: string,
    field: MutableDeep<DMMF.Field>,
  ) => void;
  updateEnumName: (tableName: string, name: string) => void;
  updateEnumValue: (
    tableName: string,
    valueName: string,
    value: string,
  ) => void;
  removeEnum: (tableName: string) => void;
  removeEnumValue: (tableName: string, valueName: string) => void;
  addNewEnumValue: (tableName: string) => void;
  addNewEnum: () => void;
  setDatasource: (datasource: string) => void;
  startTemplate: (template: Omit<TableState, "datasource">) => void;
};

export type TableStore = TableState & TableActions;

const defaultInitState: TableState = {
  models: [],
  enums: [],
  positions: {},
  datasource: "",
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

const defaultEnumValue: MutableDeep<DMMF.EnumValue> = {
  name: "Value",
  dbName: null,
};

const defaultEnum: MutableDeep<DMMF.DatamodelEnum> = {
  name: "Enum",
  dbName: null,
  values: [defaultEnumValue],
};

export const createTableStore: ImmerStateCreator<TableStore> = (
  set,
  get,
  store,
) => ({
  ...defaultInitState,
  setDatasource(datasource) {
    set((state) => {
      state.datasource = datasource;
    });
  },
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
  removeModel(modelName) {
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
  refreshTables({ models, enums }) {
    set((state) => {
      state.models = models as MutableDeep<DMMF.Model>[];
      state.enums = enums as MutableDeep<DMMF.DatamodelEnum>[];
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
  updateEnumName(tableName, name) {
    set((state) => {
      state.enums = state.enums.map((enumData) => {
        if (enumData.name === tableName) {
          enumData.name = name;
        }
        return enumData;
      });
      state.models = state.models.map((model) => {
        model.fields = model.fields.map((field) => {
          if (field.type === tableName && field.kind === "enum") {
            field.type = name;
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
  updateEnumValue(tableName, name, value) {
    set((state) => {
      state.enums = state.enums.map((enumData) => {
        if (enumData.name === tableName) {
          enumData.values = enumData.values.map((val) => {
            if (val.name === name) {
              val.name = value;
            }
            return val;
          });
        }
        return enumData;
      });
      state.models = state.models.map((model) => {
        model.fields = model.fields.map((field) => {
          if (
            field.type === tableName &&
            field.kind === "enum" &&
            field.default === name
          ) {
            field.default = value;
          }
          return field;
        });
        return model;
      });
    });
  },
  removeEnum(tableName) {
    set((state) => {
      state.enums = state.enums.filter(
        (enumData) => enumData.name !== tableName,
      );
      state.models = state.models.map((model) => {
        model.fields = model.fields.filter(
          (field) => !(field.kind === "enum" && field.type === tableName),
        );
        return model;
      });
    });
  },
  removeEnumValue(tableName, valueName) {
    set((state) => {
      state.enums = state.enums.map((enumData) => {
        if (enumData.name === tableName) {
          enumData.values = enumData.values.filter(
            (val) => val.name !== valueName,
          );
        }
        return enumData;
      });
      state.models = state.models.map((model) => {
        model.fields = model.fields.map((field) => {
          if (
            field.type === tableName &&
            field.kind === "enum" &&
            field.default === valueName
          ) {
            field.default = "";
            field.hasDefaultValue = false;
          }
          return field;
        });
        return model;
      });
    });
  },
  addNewEnumValue(tableName) {
    set((state) => {
      state.enums = state.enums.map((enumData) => {
        if (enumData.name === tableName) {
          enumData.values.push(defaultEnumValue);
        }
        return enumData;
      });
    });
  },
  addNewEnum() {
    set((state) => {
      state.enums.push(defaultEnum);
    });
  },
  startTemplate(template) {
    set((state) => {
      const { models, enums, positions } = template;
      state.models = models;
      state.enums = enums;
      state.positions = positions;
    });
    setTimeout(() => {
      get().resizeCanvas();
    }, 0);
  },
});
