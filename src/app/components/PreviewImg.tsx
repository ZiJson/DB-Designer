import { Card } from "@/components/ui/card";
import Image from "next/image";
import previewImageLight from "@/images/preview_light.png";
import previewImageDark from "@/images/preview_dark.png";
import ShineBorder from "@/components/ui/shine-border";

const PreviewImg = () => (
  <ShineBorder
    className="relative mx-auto mt-20 max-w-7xl overflow-hidden rounded-2xl border bg-background p-0 [mask-image:linear-gradient(to_top,transparent_5%,#000_40%)] md:shadow-2xl"
    borderRadius={16}
    borderWidth={1.8}
    color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
  >
    <Image src={previewImageLight} alt="landing" className="dark:hidden" />
    <Image src={previewImageDark} alt="landing" className="hidden dark:block" />
  </ShineBorder>
);

export default PreviewImg;
