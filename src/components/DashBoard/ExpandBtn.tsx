import { ChevronLast } from "lucide-react";

interface Props {
  isExpanded: boolean;
  toggleDashboard: () => void;
}
const ExpandBtn = ({ isExpanded, toggleDashboard }: Props) => (
  <div
    className="absolute left-full top-[50%] z-10 flex h-20 w-8 translate-y-[-50%] cursor-pointer items-center justify-center rounded-r-lg bg-gray-50/70 shadow-lg transition-all hover:shadow-xl"
    onClick={(e) => {
      e.stopPropagation();
      toggleDashboard();
    }}
  >
    <ChevronLast
      className={`${isExpanded ? "rotate-180" : ""} transition-all`}
    />
  </div>
);

export default ExpandBtn;
