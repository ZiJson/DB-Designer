import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import * as Editor from "./Editor";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { TableModal } from "@/types/Table";
import TableCard from "./TableCard.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const Content = () => {
  const tables = useWorkspaceStore((state) => state.tables);
  const activeTableId = useWorkspaceStore((state) => state.activeTableId);
  const isDashboardOpen = useWorkspaceStore((state) => state.isDashboardOpen);
  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            className={`${
              activeTableId === table.id ? "max-h-[100%]" : "max-h-[3rem]"
            } cursor-pointer overflow-hidden transition-all duration-300 ease-in-out hover:shadow-md`}
          >
            {activeTableId === table.id ? (
              <Editor.Table table={table} />
            ) : (
              <CardHeader className="p-0">
                <CardTitle className="relative flex min-h-[2.8rem] items-center gap-2 overflow-hidden">
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className={`absolute top-0 flex h-full w-full items-center justify-center transition-all duration-300 ease-in-out ${
                            !isDashboardOpen ? "left-0" : "-left-full"
                          }`}
                        >
                          {table.name[0]}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={55}>
                        <p>{table.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div
                    className={`absolute top-0 flex h-full w-full items-center justify-start pl-6 transition-all duration-300 ease-in-out ${
                      isDashboardOpen ? "left-0" : "left-full"
                    }`}
                  >
                    {table.name}
                  </div>
                </CardTitle>
              </CardHeader>
            )}
          </TableCard>
        ))}
      </div>
    </div>
  );
};

export default Content;
