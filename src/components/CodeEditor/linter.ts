import { schemaToDmmf } from "@/actions/dmmf";
import { Diagnostic, linter, lintGutter } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import { DMMF } from "@prisma/generator-helper";
import { on } from "events";
import { toast } from "sonner";

// Define a type for our custom lint result
interface CustomLintResult {
  from: number;
  to: number;
  message: string;
  severity: "info" | "warning" | "error";
}

// Custom linter function
export const prismaLinter =
  (
    callback: (dmmf: DMMF.Document) => void,
    onError: (error: string[]) => void,
    setDatasource: (datasource: string) => void,
    onChange: (value: string) => void,
  ) =>
  async (view: EditorView) => {
    const diagnostics: Diagnostic[] = [];
    const text = view.state.doc.toString();
    const datasource = text.split("model")[0];
    setDatasource(datasource);
    onChange(text);
    const addDiagnostic = (result: CustomLintResult) => {
      diagnostics.push({
        from: result.from,
        to: result.to,
        severity: result.severity,
        message: result.message,
      });
    };

    const { dmmf, error } = await schemaToDmmf(text);
    onError([]);
    if (error) {
      const errors = splitPrismaErrors(error);
      onError(errors.map((error) => error.message));
      errors.forEach((error) => {
        addDiagnostic({
          ...getLineIndices(text, error.lineNumber),
          severity: "error",
          message: error.message,
        });
        toast.error(error.message, {
          duration: 5000,
          cancel: {
            label: "Cancel",
            onClick: () => {},
          },
        });
      });
    } else {
      callback(dmmf as DMMF.Document);
    }
    return diagnostics;
  };

function splitPrismaErrors(rawError: string): {
  message: string;
  lineNumber: number;
}[] {
  // Remove terminal color codes and escape sequences
  const cleanedError = rawError
    .replace(/\[\d+m/g, "") // Remove [31m, [1m escape sequences
    .replace(/\[([0-9;]+)m/g, "") // Remove other terminal color codes
    .replace(/\u001b/g, ""); // Remove \u001b

  const errorLines = cleanedError.split("\n");
  // Parse error lines to create diagnostics
  return errorLines.reduce(
    (acc: { message: string; lineNumber: number }[], line, index) => {
      if (line.includes("error:")) {
        const message = line.split("error:")[1];
        const lineNumber = +errorLines[index + 1].split("schema.prisma:")[1];
        acc.push({ message, lineNumber });
      }
      return acc;
    },
    [],
  );
}

function getLineIndices(text: string, lineNumber: number) {
  // Split the text into an array of lines
  const lines = text.split("\n");

  // Ensure the line number is within the valid range
  if (lineNumber < 1 || lineNumber > lines.length) {
    throw new Error("Invalid line number");
  }

  // Find the starting index of the requested line
  let fromIndex = 0;
  for (let i = 0; i < lineNumber - 1; i++) {
    fromIndex += lines[i].length + 1; // +1 for the newline character
  }

  // Calculate the ending index (exclusive) of the line
  const toIndex = fromIndex + lines[lineNumber - 1].length;

  return { from: fromIndex, to: toIndex };
}
