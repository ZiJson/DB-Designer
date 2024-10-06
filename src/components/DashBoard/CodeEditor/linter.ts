import { schemaToDmmf } from "@/serverActions/dmmf";
import { linter, lintGutter, Diagnostic } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import { DMMF } from "@prisma/generator-helper";

// Define a type for our custom lint result
interface CustomLintResult {
  from: number;
  to: number;
  message: string;
  severity: "info" | "warning" | "error";
}

// Custom linter function
export const prismaLinter =
  (callback: (dmmf: DMMF.Document) => void) => async (view: EditorView) => {
    const diagnostics: Diagnostic[] = [];
    const text = view.state.doc.toString();
    const addDiagnostic = (result: CustomLintResult) => {
      diagnostics.push({
        from: result.from,
        to: result.to,
        severity: result.severity,
        message: result.message,
      });
    };

    const { success, dmmf, error } = await schemaToDmmf(text);
    if (!success) {
      const errors = splitPrismaErrors(error as string);
      errors.forEach((error) => {
        addDiagnostic({
          ...getLineIndices(text, error.lineNumber),
          severity: "error",
          message: error.message,
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
    .trim();

  const errorLines = cleanedError.split("\n");

  // Parse error lines to create diagnostics
  return errorLines.reduce(
    (acc: { message: string; lineNumber: number }[], line, index) => {
      if (line.includes("\u001b\u001berror\u001b: \u001b")) {
        const message = line.split("\u001b\u001berror\u001b: \u001b")[1].trim();
        const lineNumber = +errorLines[index + 1]
          .split(":")[1]
          .split("\u001b")[0];
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
