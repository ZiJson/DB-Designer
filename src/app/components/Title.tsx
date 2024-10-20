const Title = () => (
  <div className="mx-auto max-w-screen-lg text-center text-4xl font-bold text-primary md:text-6xl">
    Complex to Simple:
    <br />
    Build
    <span className="bg-gradient-to-r from-[#f3a55d] to-[#c4529e] bg-clip-text px-2 text-transparent">
      Prisma
    </span>
    Schemas Visually
  </div>
);

const Subtitle = () => (
  <div className="mx-auto mt-8 max-w-screen-md text-center text-xl font-medium text-muted-foreground">
    Build Prisma schemas your way drag-and-drop for simplicity or dive into code
    when needed. A flexible, intuitive tool for every developer.
  </div>
);

export default { Title, Subtitle };
