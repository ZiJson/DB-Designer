import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
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
  const schema = useWorkspaceStore((state) =>
    state.datasource+convertDMMFToPrismaSchema({ models: state.models, enums: state.enums }),
  );

  const { theme, systemTheme } = useTheme();
  const refreshTables = useWorkspaceStore((state) => state.refreshTables);
  const updateErrors = useWorkspaceStore((state) => state.updateErrors);
  const setDatasource = useWorkspaceStore((state) => state.setDatasource);
  const onSuccess = (dmmf: DMMF.Document) => {
    refreshTables(dmmf.datamodel);
  };
  return (
    <CodeMirror
      {...props}
      value={schema}
      theme={theme === "system" ? systemTheme : (theme as "light" | "dark")}
      extensions={[
        prismaLang,
        linter(prismaLinter(onSuccess, updateErrors, setDatasource)),
        lintGutter({}),
        autocompletion({ override: [prismaCompletion] }),
      ]}
    />
  );
};
export default CodeEditor;

const prismaLang = StreamLanguage.define({
  token: (stream) => {
    if (stream.match(/model|datasource|generator|enum/)) return "keyword"; // 关键字
    if (stream.match(/@id|@default|@unique|@relation/)) return "attribute"; // 装饰器
    if (stream.match(/ [A-Z][a-zA-Z0-9_]*/)) return "type"; // 数据类型或模型名称
    if (stream.match(/"[^"]*"/)) return "string"; // 字符串
    if (stream.match(/[0-9]+/)) return "number"; // 数字
    if (stream.match(/[=]/)) return "operator"; // 操作符
    if (stream.match(/env|provider|url|client/)) return "variableName"; // 变量名称
    if (stream.match(/true|false/)) return "constant"; // 布尔常量
    if (stream.match(/[{}[\]()]/)) return "bracket"; // 括号
    if (stream.match(/\/\/.*/)) return "comment"; // 注释
    stream.next();
    return null; // 其他默认无高亮
  },
});
