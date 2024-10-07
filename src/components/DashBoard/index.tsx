import { memo, useState } from "react";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";

const DashBoard = () => {
  const isDashboardOpen = useWorkspaceStore((state) => state.isDashboardOpen);
  const setIsDashboardOpen = useWorkspaceStore(
    (state) => state.setIsDashboardOpen,
  );
  const setActiveTableId = useWorkspaceStore((state) => state.setActiveTableId);
  return (
    <div
      className={`fixed left-0 top-[50%] h-[calc(100vh-64px)] translate-y-[-50%] rounded-r-lg bg-gray-50/80 shadow-xl ${isDashboardOpen ? "w-96" : "w-20"} p-4 transition-all duration-300 ease-in-out`}
      onClick={() => setActiveTableId(null)}
    ></div>
  );
};

export default DashBoard;
