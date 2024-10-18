import { CONNECT_MODE } from "@/components/DrawingBoard/ConnectLine";
import { MutableDeep } from "@/stores/TableStore";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { DMMF } from "@prisma/generator-helper";

export const getConnectMode = (p1: Coordinates, p2: Coordinates) => {
  let newP1 = { ...p1 },
    newP2 = { ...p2 };
  const mode =
    Math.abs(p1.x - p2.x) > 200
      ? CONNECT_MODE.OPPOSITE_SIDE
      : CONNECT_MODE.SAME_SIDE;
  if (mode === CONNECT_MODE.OPPOSITE_SIDE) {
    if (p1.x > p2.x) {
      newP1.x = p1.x - 144;
    } else {
      newP2.x = p2.x - 144;
    }
  }
  return {
    p1: newP1,
    p2: newP2,
    mode,
  };
};

export const getCloserPoint = (
  mousePosition: Coordinates,
  points: Coordinates[],
  distance: number = 50,
) => {
  let minDistance = Infinity;
  let minIndex = 0;
  points.forEach((point, index) => {
    const distance = getDistance(mousePosition, point);
    if (distance < minDistance) {
      minDistance = distance;
      minIndex = index;
    }
  });
  return minDistance < distance ? minIndex : null;
};

const getDistance = (p1: Coordinates, p2: Coordinates) => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const getToggleValue = (group: { [key: string]: boolean }) => {
  return Object.keys(group).filter((key) => group[key]);
};

export const insertAt = <T>(array: T[], index: number, item: T): T[] => {
  if (index < 0 || index > array.length) {
    throw new Error("Index out of bounds");
  }
  return [...array.slice(0, index), item, ...array.slice(index)];
};

export function convertDMMFToPrismaSchema(datamodel: {
  models: MutableDeep<DMMF.Model[]>;
  enums: MutableDeep<DMMF.DatamodelEnum[]>;
}): string {
  let schema = "";
  const { models, enums } = datamodel;

  for (const model of models) {
    schema += `model ${model.name}`;
    if (model.dbName) {
      schema += ` @map("${model.dbName}")`;
    }
    schema += " {\n";

    for (const field of model.fields) {
      let fieldDefinition = `\t${field.name} \t ${field.type}`;

      // Check if the field is a list
      if (field.isList) {
        fieldDefinition += "[]";
      }

      // If the field is optional, append the "?" indicator
      fieldDefinition += field.isRequired ? "" : "?";

      const attributes: string[] = [];

      // Add attributes like @id, @unique, etc.
      if (field.isId) attributes.push(`@id`);
      if (field.isUnique) attributes.push(`@unique`);

      // Add default value handling
      if (field.hasDefaultValue && field.default !== undefined) {
        const defaultValue =
          typeof field.default === "object" && field.default !== null
            ? `${(field.default as { name: string }).name}()` // TODO: default type handling
            : field.default;
        attributes.push(`@default(${defaultValue})`);
      }

      // Add relation handling
      if (field.relationName) {
        let relationAttribute = `@relation(`;
        const relFields: string[] = [];
        if (field.relationFromFields && field.relationFromFields.length > 0)
          relFields.push(`fields: [${field.relationFromFields.join(", ")}]`);
        if (field.relationToFields && field.relationToFields.length > 0)
          relFields.push(`references: [${field.relationToFields.join(", ")}]`);
        if (relFields.length > 0) {
          relationAttribute += `${relFields.join(", ")}`;
          relationAttribute += ")";
          attributes.push(relationAttribute);
        }
      }

      // If any attributes are added, append them to the field definition
      if (attributes.length > 0) {
        fieldDefinition += ` ${attributes.join(" ")}`;
      }

      schema += fieldDefinition + "\n";
    }

    // Handle @@unique
    if (model.uniqueFields && model.uniqueFields.length > 0) {
      for (const uniqueFields of model.uniqueFields) {
        schema += `\t@@unique([${uniqueFields.join(", ")}])\n`;
      }
    }

    // Handle @@index
    if (model.uniqueIndexes && model.uniqueIndexes.length > 0) {
      for (const uniqueIndex of model.uniqueIndexes) {
        schema += `\t@@index([${uniqueIndex.fields.join(", ")}]${
          uniqueIndex.name ? `, name: "${uniqueIndex.name}"` : ""
        })\n`;
      }
    }

    schema += "}\n\n";
  }

  for (const enumDef of enums) {
    schema += `enum ${enumDef.name} {\n`;
    for (const value of enumDef.values) {
      schema += `\t${value.name}\n`;
    }
    schema += "}\n\n";
  }
  return schema.trim();
}
