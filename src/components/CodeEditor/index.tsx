import React, { useRef } from "react";
import CodeMirror, {
  EditorView,
  ReactCodeMirrorProps,
  ReactCodeMirrorRef,
  ViewUpdate,
} from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { prismaCompletion } from "./mention";
import { linter, lintGutter } from "@codemirror/lint";
import { autocompletion } from "@codemirror/autocomplete";
import { prismaLinter } from "./linter";
import { DMMF } from "@prisma/generator-helper";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { useTheme } from "next-themes";
import { convertDMMFToPrismaSchema } from "@/lib/tools";

const CodeEditor = (props: ReactCodeMirrorProps) => {
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const setEditorView = useWorkspaceStore((state) => state.setEditorView);
  const updateContent = useWorkspaceStore((state) => state.updateContent);
  const schema = useWorkspaceStore(
    (state) =>
      state.datasource +
      convertDMMFToPrismaSchema({ models: state.models, enums: state.enums }),
  );

  const { theme, systemTheme } = useTheme();
  const refreshTables = useWorkspaceStore((state) => state.refreshTables);
  const updateErrors = useWorkspaceStore((state) => state.updateErrors);
  const setDatasource = useWorkspaceStore((state) => state.setDatasource);
  const onSuccess = (dmmf: DMMF.Document) => {
    refreshTables(dmmf.datamodel);
  };

  const onChange = (value: string) => {
    updateContent(value);
  };

  return (
    <div>
      <CodeMirror
        onCreateEditor={(view: EditorView) => setEditorView(view)}
        ref={editorRef}
        value={schema}
        theme={theme === "system" ? systemTheme : (theme as "light" | "dark")}
        extensions={[
          prismaLang,
          props.readOnly
            ? []
            : linter(
                prismaLinter(onSuccess, updateErrors, setDatasource, onChange),
              ),
          lintGutter({}),
          autocompletion({ override: [prismaCompletion] }),
        ]}
        {...props}
      />
    </div>
  );
};

export default CodeEditor;

export const prismaLang = StreamLanguage.define({
  token: (stream) => {
    if (stream.match(/model|datasource|generator|enum/)) return "keyword";
    if (stream.match(/@id|@default|@unique|@relation/)) return "attribute";
    if (stream.match(/ [A-Z][a-zA-Z0-9_]*/)) return "type";
    if (stream.match(/"[^"]*"/)) return "string";
    if (stream.match(/[0-9]+/)) return "number";
    if (stream.match(/[=]/)) return "operator";
    if (stream.match(/env|provider|url|client/)) return "variableName";
    if (stream.match(/true|false/)) return "constant";
    if (stream.match(/[{}[\]()]/)) return "bracket";
    if (stream.match(/\/\/.*/)) return "comment";
    stream.next();
    return null;
  },
});
