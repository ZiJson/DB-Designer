export type Relation = {
  start: {
    tableId: string;
    fieldId: string;
  };
  end: {
    tableId: string;
    fieldId: string;
  };
};
