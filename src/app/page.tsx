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
        <div className="absolute right-[50%] top-5 flex translate-x-[50%] gap-3"></div>
      </div>
    </DndContext>
  );
};

export default Page;
