import { DMMF } from "@prisma/generator-helper";

type MutableDeep<T> = {
  -readonly [P in keyof T]: MutableDeep<T[P]>;
};

export type DmmfModel = MutableDeep<DMMF.Model>;

export type DmmfField = MutableDeep<DMMF.Field>;

let defaultInitState: DmmfModel = {
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
};

defaultInitState.fields[1].kind = "object";
