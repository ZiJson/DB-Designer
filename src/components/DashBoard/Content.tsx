import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import * as Editor from "./Editor";

const Content = () => {
  const tables = useWorkspaceStore((state) => state.tables);
  return (
    <div>
      <h1>Content</h1>
      <div className="grid grid-cols-1 gap-4">
        {tables.map((table) => (
          <Editor.Table key={table.id} table={table} />
        ))}
      </div>
    </div>
  );
};

export default Content;
