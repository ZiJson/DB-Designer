import React from "react";
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { prismaCompletion } from "./mention";
import { linter, lintGutter, Diagnostic } from "@codemirror/lint";
import { autocompletion } from "@codemirror/autocomplete";
import { prismaLinter } from "./linter";
import { DMMF } from "@prisma/generator-helper";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";

function CodeEditor() {
  const [value, setValue] = React.useState(defaultValue);
  const refreshTables = useWorkspaceStore((state) => state.refreshTables);
  const onSuccess = (dmmf: DMMF.Document) => {
    refreshTables(dmmf.datamodel.models);
  };

  return (
    <CodeMirror
      value={value}
      extensions={[
        prismaLang,
        linter(prismaLinter(onSuccess)),
        lintGutter({}),
        autocompletion({ override: [prismaCompletion] }),
      ]}
    />
  );
}
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

// const prismaLang = StreamLanguage.define({
//   token: (stream) => {
//     if (stream.match(/model|datasource|generator|enum/)) return "keyword"; // 关键字
//     if (
//       stream.match(/@id|@default|@unique|@relation|@map|@updatedAt|@createdAt/)
//     )
//       return "attribute"; // 装饰器/注解
//     if (stream.match(/\b(String|Int|Float|Boolean|DateTime|Json|Bytes)\b/))
//       return "type"; // 数据类型
//     if (stream.match(/"[^"]*"/)) return "string"; // 字符串
//     if (stream.match(/\b\d+(\.\d+)?\b/)) return "number"; // 数字
//     if (stream.match(/[=]/)) return "operator"; // 操作符
//     if (
//       stream.match(
//         /\b(env|provider|url|client|shadowDatabaseUrl|relationMode)\b/,
//       )
//     )
//       return "variableName"; // 变量名称
//     if (stream.match(/\b(true|false|null)\b/)) return "constant"; // 布尔常量
//     if (stream.match(/[{}[\]()]/)) return "bracket"; // 括号
//     if (stream.match(/\/\/.*/)) return "comment"; // 单行注释
//     if (stream.match(/\/\*[^]*?\*\//)) return "comment"; // 多行注释
//     stream.next();
//     return null; // 其他默认无高亮
//   },
// });

const defaultValue = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id      Int      @id @default(autoincrement())
  posts   Post[]
  profile Profile?
}

model Profile {
  id     Int  @id @default(autoincrement())
  user   User @relation(fields: [userId], references: [id])
  userId Int  @unique // relation scalar field (used in the  attribute above)
}

model Post {
  id         Int @id @default(autoincrement())
  author     User       @relation(fields: [authorId], references: [id])
  authorId   Int // relation scalar field  (used in the attribute above)
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  posts Post[]
}`;
