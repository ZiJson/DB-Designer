"use server";

import { Relation } from "@/types/Relation";
import { TableModal } from "@/types/Table";
import { produceSchema } from "@mrleebo/prisma-ast";

export const generatePrismaSchema = async (tables: TableModal[]) => {
  return `datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
    }
    
    generator client {
      provider = "prisma-client-js"
      }
      
      ${tables
        .map((table) => {
          return generateModel(table);
        })
        .join("\n")}
        `;
};

const generateModel = (table: TableModal) => {
  return `model ${table.name} {
    ${table.fields
      .map((field) => {
        return `${field.name} ${field.type}${field.toArray ? "[]" : field.nullable && !field.primaryKey ? "?" : ""} ${
          field.defaultValue ? `@default(${field.defaultValue})` : ""
        } ${field.primaryKey ? "@id" : ""} ${field.unique ? "@unique" : ""}`;
      })
      .join("\n  ")}
        }`;
};
