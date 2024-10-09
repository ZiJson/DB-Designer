import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface Props {
  children: React.ReactNode;
  droppableId: string;
}
function Droppable({ droppableId, children }: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: droppableId,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}

export default Droppable;
