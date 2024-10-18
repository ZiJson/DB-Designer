"use client";
import { Coordinates } from "@dnd-kit/core/dist/types";
import Path, { Svg } from "react-svg-path";
import { Badge } from "../ui/badge";

interface Props {
  p1: Coordinates;
  p2: Coordinates;
  mode: CONNECT_MODE;
  title?: string;
}
const ConnectLine = ({ p1, p2, mode, title }: Props) => {
  const strokeWidth = 4;
  const deltaX = p2.x - p1.x;
  const deltaY = p2.y - p1.y;
  const width = Math.max(Math.abs(deltaX), strokeWidth);
  const height = Math.max(Math.abs(deltaY), strokeWidth);

  const minLength = 50;
  const path = getPath[mode](p1, p2);
  const viewBox = `0 ${-strokeWidth / 2}  ${
    width + strokeWidth / 2 + (mode === CONNECT_MODE.SAME_SIDE ? minLength : 0)
  } ${height + strokeWidth}`;

  const positionStyle = {
    top: Math.min(p1.y, p2.y),
    left: Math.min(p1.x, p2.x),
  };
  return (
    <>
      <Svg
        width={width +
          strokeWidth +
          (mode === CONNECT_MODE.SAME_SIDE ? minLength : 0)}
        height={height + strokeWidth}
        viewBox={viewBox}
        className={`absolute -z-10 text-primary/60 drop-shadow-2xl ${
          mode === CONNECT_MODE.STRAIGHT ? "z-10" : ""
        }`}
        style={positionStyle}
      >
        {path.toComponent({
          fill: "none",
          stroke: "currentColor",
          strokeWidth,
          strokeLinecap: "round",
          strokeDasharray: mode === CONNECT_MODE.STRAIGHT ? "5,10" : "",
        })}
      </Svg>
      {title && (
        <Badge
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-lg text-xs`}
          style={{
            top: positionStyle.top + height / 2,
            left: mode === CONNECT_MODE.SAME_SIDE
              ? positionStyle.left + width + minLength
              : positionStyle.left + width / 2,
          }}
        >
          {title}
        </Badge>
      )}
    </>
  );
};

export enum CONNECT_MODE {
  SAME_SIDE = 0,
  OPPOSITE_SIDE = 1,
  STRAIGHT = 2,
}
export default ConnectLine;

const getPath: Record<
  CONNECT_MODE,
  (start: Coordinates, end: Coordinates) => any
> = {
  [CONNECT_MODE.SAME_SIDE]: (start: Coordinates, end: Coordinates) => {
    const strokeWidth = 4;
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const width = Math.max(Math.abs(deltaX), strokeWidth);
    const height = Math.max(Math.abs(deltaY), strokeWidth);

    const radius = Math.min(40, height / 2, width);

    const startPoint = [0, deltaX * deltaY > 0 ? 0 : height];
    const endPoint = [width, deltaX * deltaY < 0 ? 0 : height];
    const minLength = 50;
    return new Path()
      .M(startPoint[0], startPoint[1])
      .L(endPoint[0] + minLength - radius, startPoint[1])
      .Q(
        endPoint[0] + minLength,
        startPoint[1],
        endPoint[0] + minLength,
        startPoint[1] + radius * Math.sign(deltaX * deltaY),
      )
      .L(
        endPoint[0] + minLength,
        endPoint[1] - radius * Math.sign(deltaX * deltaY),
      )
      .Q(
        endPoint[0] + minLength,
        endPoint[1],
        endPoint[0] + minLength - radius,
        endPoint[1],
      )
      .L(endPoint[0], endPoint[1]);
  },
  [CONNECT_MODE.OPPOSITE_SIDE]: (start: Coordinates, end: Coordinates) => {
    const strokeWidth = 4;
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const width = Math.max(Math.abs(deltaX), strokeWidth);
    const height = Math.max(Math.abs(deltaY), strokeWidth);

    const radius = Math.min(40, height / 2, width);

    const startPoint = [deltaX < 0 ? width : 0, deltaY < 0 ? height : 0];
    const endPoint = [deltaX < 0 ? 0 : width, deltaY < 0 ? 0 : height];

    return new Path()
      .M(startPoint[0], startPoint[1])
      .L(width / 2 - radius * Math.sign(deltaX), startPoint[1])
      .Q(
        width / 2,
        startPoint[1],
        width / 2,
        startPoint[1] + radius * Math.sign(deltaY),
      )
      .L(width / 2, endPoint[1] - radius * Math.sign(deltaY))
      .Q(
        width / 2,
        endPoint[1],
        width / 2 + radius * Math.sign(deltaX),
        endPoint[1],
      )
      .L(endPoint[0], endPoint[1]);
  },
  [CONNECT_MODE.STRAIGHT]: (start: Coordinates, end: Coordinates) => {
    const strokeWidth = 4;
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const width = Math.max(Math.abs(deltaX), strokeWidth);
    const height = Math.max(Math.abs(deltaY), strokeWidth);
    const startPoint = [deltaX < 0 ? width : 0, deltaY < 0 ? height : 0];
    const endPoint = [deltaX < 0 ? 0 : width, deltaY < 0 ? 0 : height];
    return new Path()
      .M(startPoint[0], startPoint[1])
      .L(endPoint[0], endPoint[1]);
  },
};
