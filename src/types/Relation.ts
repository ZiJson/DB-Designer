export type Relation = {
  start: {
    tableId: number;
    fieldId: number;
  };
  end: {
    tableId: number;
    fieldId: number;
  };
};
