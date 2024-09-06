import { TableModal } from "@/types/Table";
import { ImmerStateCreator } from "../workspace-store";

type TableState = {
  tables: TableModal[];
};

type TableActions = {
  addNewTable: () => void;
};

export type TableStore = TableState & TableActions;

const defaultInitState: TableState = {
  tables: [],
};

export const createTableStore: ImmerStateCreator<TableStore> = (set) => ({
  ...defaultInitState,
  addNewTable: () => {
    set((state) => {
      state.tables.push({
        id: state.tables.length + 1,
        name: `Table ${state.tables.length + 1}`,
      });
    });
  },
});
