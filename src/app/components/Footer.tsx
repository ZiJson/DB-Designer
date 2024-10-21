import Image from "next/image";
import logo from "@/images/prismatrix.png";

const Footer = () => {
  return (
    <footer className="mt-[15rem] w-full">
      <div className="flex items-center justify-center gap-1 text-xl font-bold">
        <Image src={logo} alt="logo" className="h-6 w-6"></Image>
        Prismatrix
      </div>
      <div className="p-4 text-center">Copyright © 2024 ZiJson</div>
    </footer>
  );
};

export default Footer;
