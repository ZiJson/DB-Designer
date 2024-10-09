"use client";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { Button } from "@/components/ui/button";
import DashBoard from "@/components/DashBoard";
import DrawingBoard from "@/components/DrawingBoard";
import { TableModal } from "@/types/Table";
import CodeEditor from "@/components/CodeEditor";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { schemaToDmmf } from "@/serverActions/dmmf";
import Widget from "@/components/WidgetContainer/Widget";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import WidgetContainer from "@/components/WidgetContainer";
import Draggable from "@/components/dnd/Draggable";

const Page = () => {
  const addNewTable = useWorkspaceStore((state) => state.addNewTable);
  const { setTheme } = useTheme();
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { delay: 100, tolerance: 1000, distance: 10 },
    }),
  );
  return (
    <DndContext sensors={sensors}>
      <div className="relative flex h-full w-full">
        <DrawingBoard />
        <WidgetContainer>
          <Widget>
            <CodeEditor />
          </Widget>
        </WidgetContainer>
        <div className="absolute right-[50%] top-5 flex translate-x-[50%] gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </DndContext>
  );
};

export default Page;
