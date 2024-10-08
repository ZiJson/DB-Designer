import { Card } from "@/components/ui/card";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import Draggable from "../dnd/Draggable";

interface Props {
  side?: "left" | "right";
  children: React.ReactNode;
  className?: string;
  isExpanded?: boolean;
  expandClassName?: string;
}
const Widget = ({
  children,
  className,
  side = "left",
  expandClassName,
  isExpanded,
}: Props) => {
  const [widgetSide, setWidgetSide] = useState(side);
  const [isShowToolbar, setIsShowToolbar] = useState(false);
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!containerRef.current) return;
    const { top } = containerRef.current.getBoundingClientRect();
    const mouseY = e.clientY;
    const offsetY = mouseY - top;
    const trigger = offsetY < 40;
    setIsShowToolbar(trigger);
  };
  return (
    <div
      className={`fixed bottom-8 left-8 z-10 h-1/3 rounded-lg transition-all duration-500 ease-out ${className} z-30`}
      onMouseLeave={() => setIsShowToolbar(false)}
    >
      <Draggable draggableId="widget" className="h-full w-full">
        <Card
          className="no-scrollbar h-full w-full overflow-auto shadow-2xl"
          ref={containerRef}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseMove={onMouseMove}
        >
          {children}
        </Card>
        <Card
          className={`absolute bottom-0 left-1/2 -z-10 -translate-x-1/2 rounded-b-xl bg-primary/70 transition-all ${isShowToolbar ? "h-[calc(100%_+_2rem)] w-[102%]" : "h-full w-full"}`}
        />
      </Draggable>
    </div>
  );
};

export default Widget;
