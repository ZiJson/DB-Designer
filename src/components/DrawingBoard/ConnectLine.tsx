"use client";
import { Coordinates } from "@dnd-kit/core/dist/types";
import Path, { Svg } from "react-svg-path";

interface Props {
  p1: Coordinates;
  p2: Coordinates;
  strokeColor?: string;
  mode: CONNECT_MODE;
}
const ConnectLine = ({
  p1,
  p2,
  strokeColor = "rgb(100 116 139)",
  mode,
}: Props) => {
  const strokeWidth = 4;
  const deltaX = p2.x - p1.x;
  const deltaY = p2.y - p1.y;
  const width = Math.max(Math.abs(deltaX), strokeWidth);
  const height = Math.max(Math.abs(deltaY), strokeWidth);

  const minLength = 50;
  const path = getPath[mode](p1, p2);
  const viewBox = `0 0 ${width + minLength + 4} ${height}`;

  const positionStyle = {
    top: Math.min(p1.y, p2.y) - strokeWidth / 2,
    left: Math.min(p1.x, p2.x),
  };
  return (
    <Svg
      width={width + minLength + 4}
      height={height + strokeWidth}
      viewBox={viewBox}
      className={`absolute ${
        mode === CONNECT_MODE.STRAIGHT ? "z-10" : "-z-10"
      }`}
      style={positionStyle}
    >
      {path.toComponent({
        fill: "none",
        stroke: strokeColor,
        strokeWidth,
        strokeLinecap: "round",
        strokeDasharray: mode === CONNECT_MODE.STRAIGHT ? "5,10" : "",
      })}
    </Svg>
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

    const radius = Math.min(20, height / 2, width);

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

    const radius = Math.min(20, height / 2, width);

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
