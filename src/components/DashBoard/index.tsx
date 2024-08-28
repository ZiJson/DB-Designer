import { memo, useState } from "react";
import ExpandBtn from "./ExpandBtn";
import Content from "./Content";

const DashBoard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div
      className={`fixed left-0 top-[50%] h-[calc(100vh-64px)] w-96 translate-y-[-50%] rounded-r-lg bg-gray-50/70 shadow-xl ${isExpanded ? "translate-x-0" : "translate-x-[-97%]"} p-4 transition-all`}
    >
      {<Content />}
      <ExpandBtn isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
    </div>
  );
};

export default DashBoard;
