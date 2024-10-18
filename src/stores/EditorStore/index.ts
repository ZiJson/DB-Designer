import { ImmerStateCreator } from "../workspace-store";
import { EditorView, ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { redo, undo } from "@codemirror/commands";

type EditorState = {
  history: string[];
  currentIndex: number;
};

type EditorActions = {
  setEditorView: (view: EditorView) => void;
  updateContent: (content: string) => void;
  undo: () => void;
  redo: () => void;
};

export type EditorStore = EditorState & EditorActions;

// 使用一个可变引用来存储 EditorView
let editorViewRef: EditorView | null = null;

const defaultInitState: EditorState = {
  history: [],
  currentIndex: 0,
};

export const createEditorStore: ImmerStateCreator<EditorStore> = (
  set,
  get,
) => ({
  ...defaultInitState,
  setEditorView: (view: EditorView) => {
    editorViewRef = view;
  },
  updateContent: (content: string) =>
    set((state) => {
      if (content !== state.history[state.currentIndex]) {
        state.history = state.history.slice(0, state.currentIndex + 1);
        state.history.push(content);
        state.currentIndex = state.history.length - 1;
      }
    }),
  undo: () => {
    if (editorViewRef) {
      undo(editorViewRef);
      set((state) => {
        if (state.currentIndex > 0) {
          state.currentIndex--;
        }
      });
    }
  },
  redo: () => {
    if (editorViewRef) {
      redo(editorViewRef);
      set((state) => {
        if (state.currentIndex < state.history.length - 1) {
          state.currentIndex++;
        }
      });
    }
  },
});
