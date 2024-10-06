import { NextRequest, NextResponse } from "next/server";
import { getDMMF } from "@prisma/internals";

// export async function GET(req: NextRequest) {
//   try {
//     // Load and parse the Prisma schema file
//     const schemaPath = path.join(process.cwd(), "prisma/schema.prisma");
//     const schema = fs.readFileSync(schemaPath, "utf-8");

//     // Parse schema using getDMMF from @prisma/internals
//     const dmmf = await getDMMF({ datamodel: schema });

//     return NextResponse.json({ models: dmmf.datamodel.models });
//   } catch (error) {
//     console.error("Error parsing schema:", error);
//     return new NextResponse("Error parsing schema", { status: 500 });
//   }
// }

export async function POST(req: NextRequest) {
  try {
    const { schema } = await req.json();
    if (!schema) {
      return new NextResponse("Schema string is required", { status: 400 });
    }

    const dmmf = await getDMMF({ datamodel: schema });
    return NextResponse.json({ models: dmmf });
  } catch (error) {
    console.error("Error parsing schema:", error);
    return new NextResponse("Error parsing schema", { status: 500 });
  }
}
