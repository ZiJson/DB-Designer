import {
  Features,
  Footer,
  GetStartBtn,
  Logo,
  PreviewImg,
  Title,
} from "./components";

const Page = () => {
  return (
    <div className="bg-background p-5 py-[10rem] pb-0 dark:bg-black">
      <Logo />
      <Title.Title />
      <Title.Subtitle />
      <GetStartBtn />
      <PreviewImg />
      <Features />
      <Footer />
    </div>
  );
};

export default Page;
