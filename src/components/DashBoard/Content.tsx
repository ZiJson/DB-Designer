import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import * as Editor from "./Editor";
import { shallow } from "zustand/shallow";

const Content = () => {
  const tableIds = useWorkspaceStore(
    (state) => state.tables.map((t) => t.id),
    shallow,
  );
  console.log(123);
  return (
    <div>
      <h1>Content</h1>
      <div className="grid grid-cols-1 gap-4">
        {tableIds.map((id) => (
          <Editor.Table key={id} tableId={id} />
        ))}
      </div>
    </div>
  );
};

export default Content;
