import TextRevealByWord from "@/components/ui/text-reveal";
import GridCard from "./GridCard";
import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Redo, Redo2, Share2Icon, Sparkles } from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import GridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import Code from "./Code";
import UndoRedo from "./UndoRedo";
import NoCode from "./NoCode";
import WidgetDemo from "./WIdgetDemo";
import { VelocityScroll } from "@/components/ui/scroll-based-velocity";
import Linting from "./Linting";

const features = [
  {
    name: "Clean, Intuitive Interface",
    description:
      "Use drag-and-drop tables for a clear and simple way to visualize and build your database structure.",
    href: "#",
    cta: "Learn more",
    className:
      "col-span-3 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    background: (
      <GridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:linear-gradient(to_top,transparent_40%,#000_90%)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 transition-all duration-300 group-hover:scale-105",
        )}
      />
    ),
    delay: 0.3,
  },
  {
    name: "Flexible Workspace",
    description:
      "Adjustable tool windows allow smooth schema editing without interfering with your canvas.",
    href: "#",
    cta: "Learn more",
    className:
      "col-span-3 lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-4",
    background: <WidgetDemo />,
    delay: 0.25,
  },
  {
    name: "Code Editor",
    description:
      "With auto-completion and syntax highlighting, take it easy to write code.",
    href: "#",
    cta: "Learn more",
    className:
      "col-span-3 lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
    background: <Code />,
    delay: 0.35,
  },
  {
    name: "Undo & Redo",
    description:
      "Make changes confidently with full undo and redo capabilities for all actions.",
    className:
      "col-span-3 lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4  transition-all",
    href: "#",
    cta: "Learn more",
    background: <UndoRedo />,
    delay: 0.45,
  },
  {
    name: "Code Free",
    description:
      "Create schemas effortlessly with intuitive folder struct. tool, perfect for users who prefer a visual and code-free approach",
    href: "#",
    cta: "Learn more",
    className:
      "col-span-3 lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4",
    background: <NoCode />,
    delay: 0.5,
  },
  {
    name: "Built-in Linting",
    description:
      "Rely on official Prisma lint checks for safety, with detailed error messages guiding you through corrections.",
    className: "col-span-3 lg:col-span-2 lg:row-span-2",
    href: "#",
    cta: "Learn more",
    background: <Linting />,
    delay: 0.6,
  },
  {
    name: "Several Templates",
    description:
      "Choose from predefined templates or import your own schema to jumpstart your project.",
    className: "col-span-3 lg:col-span-1 lg:row-span-2",
    href: "#",
    cta: "Learn more",
    background: (
      <VelocityScroll
        text="Blog E-commerce Q&A Tasks"
        default_velocity={3}
        className="font-display mt-4 text-center text-4xl font-bold tracking-[-0.02em] text-black opacity-50 drop-shadow-sm transition-all group-hover:opacity-75 dark:text-white md:text-6xl md:leading-[4rem]"
      />
    ),
    delay: 0.7,
  },
];

const Features = () => {
  return (
    <div className="mt-36">
      <h2 className="my-2 text-center text-3xl font-bold text-primary dark:text-white">
        Ideal Visualization
      </h2>
      <p className="text-center text-lg text-muted-foreground">
        built for those who being tired of writing complex schemas
      </p>
      <BentoGrid className="mx-auto mt-12 max-w-6xl auto-rows-[10rem]">
        {features.map((feature, idx) => (
          <BentoCard key={idx} {...feature} />
        ))}
      </BentoGrid>
    </div>
  );
};

export default Features;
