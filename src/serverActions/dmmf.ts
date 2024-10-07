"use server";
import { getDMMF } from "@prisma/internals";

export const schemaToDmmf = async (schema: string) => {
  try {
    const dmmf = await getDMMF({ datamodel: schema });
    return { dmmf };
  } catch (error) {
    // console.error("Error parsing schema:\n", error as Error);
    return { error: (error as Error).message };
  }
};
