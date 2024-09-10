import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { Bolt, ListPlus } from "lucide-react";
import * as Sheet from "../Sheets";

interface DrawerProps {
  tableId: string;
}
const Drawer = ({ tableId }: DrawerProps) => {
  const setIsDashboardOpen = useWorkspaceStore(
    (state) => state.setIsDashboardOpen,
  );
  return (
    <div className="group absolute left-1 top-full -z-10 flex h-fit w-full -translate-y-full items-center gap-1 pt-1 transition-all group-hover:translate-y-0">
      <Sheet.AddField tableId={tableId}>
        <ListPlus className="h-8 w-8 rounded-full border-2 border-slate-500 bg-white p-1 transition-all hover:scale-105 hover:bg-slate-200" />
      </Sheet.AddField>
      <Bolt
        className="h-8 w-8 rounded-full border-2 border-slate-500 bg-white p-1 transition-all hover:scale-105 hover:bg-slate-200"
        onClick={() => setIsDashboardOpen(true)}
      />
    </div>
  );
};

export default Drawer;
