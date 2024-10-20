"use client";
import { prismaLang } from "@/components/CodeEditor";
import { Card } from "@/components/ui/card";
import ReactCodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";

const Code = () => {
  const { theme, systemTheme } = useTheme();
  return (
    <div className="absolute left-1/3 top-10 mx-auto origin-top scale-75 opacity-50 blur-sm transition-all duration-500 group-hover:-translate-y-[60%] group-hover:scale-[90%] group-hover:blur-none">
      <ReactCodeMirror
        className="-z-20"
        value={schema}
        theme={theme === "system" ? systemTheme : (theme as "light" | "dark")}
        extensions={[prismaLang]}
        readOnly
        basicSetup={{ foldGutter: false, lineNumbers: false }}
      />
    </div>
  );
};

export default Code;

const schema = `
model User {
	id 	     Int @id @default(autoincrement())
	posts 	 Post[]
	profile  Profile?
}

model Post {
	id 	        Int @id @default(autoincrement())
	author 	    User @relation(fields: [authorId], references: [id])
	authorId 	Int
	categories 	Category[]
}
    
model User {
	id 	     Int @id @default(autoincrement())
	posts 	 Post[]
	profile  Profile?
}

model Post {
	id 	        Int @id @default(autoincrement())
	author 	    User @relation(fields: [authorId], references: [id])
	authorId 	Int
	categories 	Category[]
}
    
model User {
	id 	     Int @id @default(autoincrement())
	posts 	 Post[]
	profile  Profile?
}

model Post {
	id 	        Int @id @default(autoincrement())
	author 	    User @relation(fields: [authorId], references: [id])
	authorId 	Int
	categories 	Category[]
}

model User {
	id 	     Int @id @default(autoincrement())
	posts 	 Post[]
	profile  Profile?
}

model Post {
	id 	        Int @id @default(autoincrement())
	author 	    User @relation(fields: [authorId], references: [id])
	authorId 	Int
	categories 	Category[]
}

`;
