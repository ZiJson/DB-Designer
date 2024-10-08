import { Completion, CompletionSource } from "@codemirror/autocomplete";

export const prismaCompletion: CompletionSource = (context) => {
  // 匹配光標前的單詞，包括 @ 符號
  const word = context.matchBefore(/[\w@]*/);
  console.log(word?.text);

  // 如果沒有匹配到或匹配內容為空且沒有顯式補全，返回 null
  if (!word || (word.from === word.to && !context.explicit)) return null;

  // 如果匹配到的單詞是 '@'，則顯示所有 attribute 提示
  if (word.text === "@") {
    return {
      from: word.from,
      options: prismaCompletionItems.filter((item) => item.type === "field"), // 只顯示 attributes
    };
  }

  // 否則返回所有補全選項
  return {
    from: word.from,
    options: prismaCompletionItems,
  };
};

export const prismaCompletionItems: Completion[] = [
  // Keywords
  { label: "model", type: "keyword" },
  { label: "datasource", type: "keyword" },
  { label: "generator", type: "keyword" },
  { label: "enum", type: "keyword" },
  { label: "type", type: "keyword" },

  // Types
  { label: "String", type: "type" },
  { label: "Int", type: "type" },
  { label: "Boolean", type: "type" },
  { label: "DateTime", type: "type" },
  { label: "Float", type: "type" },
  { label: "Json", type: "type" },

  // Field attributes
  { label: "relation", type: "property" },
  { label: "id", type: "property" },
  { label: "unique", type: "property" },
  { label: "default", type: "property" },
  { label: "map", type: "property" },
  { label: "updatedAt", type: "property" },

  // Built-in attributes for fields
  { label: "@id", type: "field" },
  { label: "@default", type: "field" },
  { label: "@unique", type: "field" },
  { label: "@relation", type: "field" },
  { label: "@map", type: "field" },
];
