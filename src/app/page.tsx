import { Features, Navigation, PreviewImg, Title } from "./components";
import Link from "next/link";
import { RainbowButton } from "@/components/ui/rainbow-button";

const Page = () => {
  return (
    <div className="bg-background py-[10rem] dark:bg-black">
      <Navigation />
      <Title.Title />
      <Title.Subtitle />
      <Link href="/playground">
        <RainbowButton className="mx-auto mt-8 block">
          Get Started
        </RainbowButton>
      </Link>
      <PreviewImg />
      <Features />
    </div>
  );
};

export default Page;
