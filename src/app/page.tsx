"use client";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { Button } from "@/components/ui/button";
import DashBoard from "@/components/DashBoard";
import DrawingBoard from "@/components/DrawingBoard";
import { generatePrismaSchema } from "@/lib/generatePrismaSchema";
import { TableModal } from "@/types/Table";
const Page = () => {
  const addNewTable = useWorkspaceStore((state) => state.addNewTable);
  const clearAll = useWorkspaceStore((state) => state.clearAll);

  const tables = useWorkspaceStore((state) => state.tables);

  const onGenerate = async (tables: TableModal[]) => {
    const schema = await generatePrismaSchema(tables);
    console.log("🚀 ~ onGenerate ~ schema:\n", schema);
  };

  return (
    <div>
      <DrawingBoard />
      <DashBoard />
      <div className="absolute right-[50%] top-5 flex translate-x-[50%] gap-3">
        <Button onClick={addNewTable}>New Table</Button>
        <Button onClick={clearAll} variant="destructive">
          Reset
        </Button>
        <Button onClick={() => onGenerate(tables)}>Generate</Button>
      </div>
    </div>
  );
};

export default Page;
