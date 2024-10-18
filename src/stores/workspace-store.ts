import { createStore, StateCreator } from "zustand/vanilla";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { CanvasStore, createCanvasStore } from "./CanvasStore";
import { createTableStore, TableStore } from "./TableStore";
import { createWidgetStore, WidgetStore } from "./WidgetStore";
import { EditorState } from "@uiw/react-codemirror";
import { createEditorStore, EditorStore } from "./EditorStore";

export type WorkspaceState = {};

export type WorkspaceActions = {};

export type WorkspaceStore = WorkspaceState &
  WorkspaceActions &
  CanvasStore &
  TableStore &
  WidgetStore &
  EditorStore;

export const defaultInitState: WorkspaceState = {};
export const createWorkspaceStore = (
  initState: WorkspaceState = defaultInitState,
) => {
  return createStore<WorkspaceStore>()(
    devtools(
      persist(
        immer((...args) => ({
          ...initState,
          ...createCanvasStore(...args),
          ...createTableStore(...args),
          ...createWidgetStore(...args),
          ...createEditorStore(...args),
        })),
        {
          name: "workspace-store",
          partialize: (state) => {
            return {
              position: state.position,
              positions: state.positions,
              scale: state.scale,
              models: state.models,
              enums: state.enums,
            };
          },
        },
      ),
    ),
  );
};

export type ImmerStateCreator<T extends Partial<WorkspaceStore>> = StateCreator<
  WorkspaceStore,
  [["zustand/immer", never], never],
  [],
  T
>;
