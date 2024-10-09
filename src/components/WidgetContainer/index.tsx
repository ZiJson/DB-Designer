import { DragOverlay, Modifier } from "@dnd-kit/core";
import Droppable from "../dnd/Droppable";
import { Fragment } from "react";
import { Card } from "../ui/card";
import Draggable from "../dnd/Draggable";

const WidgetContainer = ({ children }: { children: React.ReactNode }) => {
  //   const snapToGrid: Modifier = (args) => {
  //     const { transform, windowRect, draggingNodeRect } = args;
  //     console.log((draggingNodeRect?.left || 0) + transform.x);
  //     const isleft =
  //       (draggingNodeRect?.left || 0) + transform.x <
  //       (windowRect?.width || 0) / 2;
  //     console.log(isleft);
  //     return {
  //       ...transform,
  //       x: isleft ? 0 : windowRect?.width,
  //       y: 0,
  //     };
  //   };
  return (
    <Fragment>
      {children}
      {/* <DragOverlay
        className="h-2 w-2 border border-primary transition-all duration-300 ease-out"
        dropAnimation={null}
        // zIndex={0}
        modifiers={[snapToGrid]}
      ></DragOverlay> */}
    </Fragment>
  );
};

export default WidgetContainer;
