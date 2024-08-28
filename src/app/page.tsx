"use client";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { Button } from "@/components/ui/button";
import DashBoard from "@/components/DashBoard";
import DrawingBoard from "@/components/DrawingBoard";

const Page = () => {
  const addTable = useWorkspaceStore((state) => state.addTable);
  return (
    <div>
      <DrawingBoard />
      <DashBoard />
      <Button
        onClick={addTable}
        className="absolute right-[50%] top-5 translate-x-[50%]"
      >
        New Table
      </Button>
    </div>
  );
};

export default Page;
