import { Field, TableModal } from "@/types/Table";
import { ImmerStateCreator } from "../workspace-store";
import { FieldTypes } from "@/types/FieldTypes";
import { Coordinates } from "@dnd-kit/core/dist/types";

type TableState = {
  tables: TableModal[];
};

type TableActions = {
  addNewTable: () => void;
  updateTable: (table: TableModal) => void;
  updateTablePosition: (tableId: number, position: Coordinates) => void;
  removeTable: (id: number) => void;
  addNewField: (tableId: number, name: string, type: FieldTypes) => void;
  updateField: (tableId: number, field: Field) => void;
  removeField: (tableId: number, fieldId: number) => void;
};

export type TableStore = TableState & TableActions;

const defaultInitState: TableState = {
  tables: [],
};

const defaultTable: TableModal = {
  id: 0,
  name: "",
  fields: [],
  position: {
    x: 0,
    y: 0,
  },
};
const defaultField: Field = {
  id: 0,
  name: "",
  defaultValue: null,
  type: FieldTypes.STRING,
  primaryKey: false,
  nullable: false,
  unique: false,
  toArray: false,
};

export const createTableStore: ImmerStateCreator<TableStore> = (set, get) => ({
  ...defaultInitState,
  addNewTable: () => {
    const id = get().tables.length;
    set((state) => {
      state.tables.push({
        ...defaultTable,
        id,
        name: `Table ${state.tables.length}`,
        position: {
          x: -state.position.x + 20,
          y: -state.position.y + 20,
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
  updateTablePosition: (tableId: number, position: Coordinates) => {
    set((state) => {
      state.tables = state.tables.map((t) => {
        if (t.id === tableId) return { ...t, position };
        return t;
      });
    });
  },
  removeTable: (id: number) => {
    set((state) => {
      state.tables = state.tables.filter((t) => t.id !== id);
    });
  },
  addNewField: (tableId: number, name: string, type: FieldTypes) => {
    set((state) => {
      state.tables = state.tables.map((t) => {
        if (t.id === tableId)
          return {
            ...t,
            fields: [
              ...t.fields,
              {
                ...defaultField,
                id: t.fields.length,
                name,
                type,
              },
            ],
          };
        return t;
      });
    });
  },
  updateField: (tableId: number, field: Field) => {
    set((state) => {
      state.tables = state.tables.map((t) => {
        if (t.id === tableId)
          return {
            ...t,
            fields: t.fields.map((f) => {
              if (f.id === field.id) return field;
              return f;
            }),
          };
        return t;
      });
    });
  },
  removeField: (tableId: number, fieldId: number) => {
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
});
