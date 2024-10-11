"use client";
import DrawingBoard from "@/components/DrawingBoard";
import CodeEditor from "@/components/CodeEditor";
import Widget from "@/components/WidgetContainer/Widget";
import { DndContext, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import WidgetContainer from "@/components/WidgetContainer";
import NoCodeEditor from "@/components/NoCodeEditor";

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
          <Widget widgetId="codeEditor">
            <CodeEditor />
          </Widget>
          <Widget widgetId="noCodeEditor">
            <NoCodeEditor />
          </Widget>
        </WidgetContainer>
        <div className="absolute right-[50%] top-5 flex translate-x-[50%] gap-3"></div>
      </div>
    </DndContext>
  );
};

export default Page;
