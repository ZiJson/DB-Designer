export type Connection = {
  id: number;
  NodeIds: [number, number];
};

export type FieldNode = {
  id: number;
  tableId: number;
  fieldId: number;
  coordinates: {
    x: number;
    y: number;
  };
};
