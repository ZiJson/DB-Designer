import { Field, TableModal } from "@/types/Table";
import { ImmerStateCreator } from "../workspace-store";
import { FieldTypes } from "@/types/FieldTypes";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { Relation } from "@/types/Relation";
import { v4 as uuidv4 } from "uuid";

type TableState = {
  tables: TableModal[];
};

type TableActions = {
  addNewTable: () => void;
  updateTable: (table: TableModal) => void;
  updateTablePosition: (tableId: string, position: Coordinates) => void;
  removeTable: (id: string) => void;
  addNewField: (tableId: string, name: string, type: FieldTypes) => void;
  updateField: (tableId: string, field: Field) => void;
  removeField: (tableId: string, fieldId: string) => void;
  updateTableTransform: (tableId: string, transform: Coordinates) => void;
  addFieldRelation: (
    tableId1: string,
    fieldId1: string,
    tableId2: string,
    fieldId2: string,
  ) => void;
};

export type TableStore = TableState & TableActions;

const defaultInitState: TableState = {
  tables: [],
};

const defaultTable: TableModal = {
  id: "",
  name: "",
  fields: [],
  position: {
    x: 0,
    y: 0,
  },
  transform: {
    x: 0,
    y: 0,
  },
};
const defaultField: Field = {
  id: "",
  name: "",
  defaultValue: null,
  type: FieldTypes.STRING,
  primaryKey: false,
  nullable: false,
  unique: false,
  toArray: false,
  relations: [],
};

export const createTableStore: ImmerStateCreator<TableStore> = (set, get) => ({
  ...defaultInitState,
  addNewTable: () => {
    const id = uuidv4();
    set((state) => {
      state.tables.push({
        ...defaultTable,
        id,
        name: `Table ${state.tables.length}`,
        position: {
          x: (-state.position.x + 100) / state.scale,
          y: (-state.position.y + 20) / state.scale,
        },
      });
    });
    get().addNewField(id, "id", FieldTypes.STRING);
  },
  updateTable: (table: TableModal) => {
    set((state) => {
      state.tables = state.tables.map((t) => {
        if (t.id === table.id) return table;
        return t;
      });
    });
  },
  updateTablePosition: (tableId: string, position: Coordinates) => {
    set((state) => {
      state.tables = state.tables.map((t) => {
        if (t.id === tableId) return { ...t, position };
        return t;
      });
    });
  },
  removeTable: (id: string) => {
    set((state) => {
      state.tables = state.tables.filter((t) => t.id !== id);
    });
    get().removeRelation(id);
  },
  addNewField: (tableId: string, name: string, type: FieldTypes) => {
    set((state) => {
      state.tables = state.tables.map((t) => {
        if (t.id === tableId)
          return {
            ...t,
            fields: [
              ...t.fields,
              {
                ...defaultField,
                id: uuidv4(),
                name,
                type,
              },
            ],
          };
        return t;
      });
    });
  },
  updateField: (tableId: string, field: Field) => {
    console.log(field);
    set((state) => {
      state.tables = state.tables.map((t) => {
        if (t.id === tableId) {
          return {
            ...t,
            fields: t.fields.map((f) => (f.id === field.id ? field : f)),
          };
        }
        return t;
      });
    });
  },
  removeField: (tableId: string, fieldId: string) => {
    set((state) => {
      state.tables = state.tables.map((t) => {
        if (t.id === tableId)
          return {
            ...t,
            fields: t.fields.filter((f) => f.id !== fieldId),
          };
        return t;
      });
    });
  },
  updateTableTransform: (tableId: string, transform: Coordinates) => {
    set((state) => {
      state.tables = state.tables.map((t) => {
        if (t.id === tableId) return { ...t, transform };
        return t;
      });
    });
  },
  addFieldRelation: (
    tableId1: string,
    fieldId1: string,
    tableId2: string,
    fieldId2: string,
  ) => {
    set((state) => {
      const table1 = state.tables.find((t) => t.id === tableId1);
      const table2 = state.tables.find((t) => t.id === tableId2);
      if (table1 && table2) {
        const field1 = table1.fields.find((f) => f.id === fieldId1);
        const field2 = table2.fields.find((f) => f.id === fieldId2);
        if (field1 && field2) {
          // 使用不可变更新方式
          field1.relations = [
            ...field1.relations,
            { tableId: tableId2, fieldId: fieldId2 },
          ];
          field2.relations = [
            ...field2.relations,
            { tableId: tableId1, fieldId: fieldId1 },
          ];
        }
      }
    });
  },
});
