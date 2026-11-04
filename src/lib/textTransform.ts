export type TransformType =
  | "uppercase"
  | "lowercase"
  | "titleCase"
  | "sentenceCase"
  | "camelCase"
  | "snakeCase"
  | "kebabCase"
  | "removeExtraSpaces"
  | "removeLineBreaks"
  | "trimLines"
  | "removeDuplicates"
  | "sortLines"
  | "reverseText"
  | "sortWords"
  | "capitalizeWords";

export function transformText(text: string, type: TransformType): string {
  switch (type) {
    case "uppercase":
      return text.toUpperCase();

    case "lowercase":
      return text.toLowerCase();

    case "titleCase":
      return text.replace(
        /\b\w/g,
        (char) => char.toUpperCase()
      );

    case "sentenceCase":
      return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s+\w)/g, (char) => char.toUpperCase());

    case "capitalizeWords":
      return text.replace(/\b\w/g, (char) => char.toUpperCase());

    case "camelCase": {
      const words = text.match(/\b[\w']+\b/g) || [];
      return words
        .map((word, i) =>
          i === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("");
    }

    case "snakeCase": {
      const words = text.match(/\b[\w']+\b/g) || [];
      return words.map((w) => w.toLowerCase()).join("_");
    }

    case "kebabCase": {
      const words = text.match(/\b[\w']+\b/g) || [];
      return words.map((w) => w.toLowerCase()).join("-");
    }

    case "removeExtraSpaces":
      return text.replace(/[ \t]+/g, " ").replace(/ +\n/g, "\n").replace(/\n{3,}/g, "\n\n");

    case "removeLineBreaks":
      return text.replace(/\n+/g, " ").replace(/\s{2,}/g, " ").trim();

    case "trimLines":
      return text
        .split("\n")
        .map((line) => line.trim())
        .join("\n");

    case "removeDuplicates": {
      const lines = text.split("\n");
      const seen = new Set<string>();
      return lines
        .filter((line) => {
          if (seen.has(line.trim())) return false;
          seen.add(line.trim());
          return true;
        })
        .join("\n");
    }

    case "sortLines":
      return text
        .split("\n")
        .filter((l) => l.trim())
        .sort((a, b) => a.localeCompare(b))
        .join("\n");

    case "reverseText":
      return text.split("").reverse().join("");

    case "sortWords":
      return (text.match(/\b[\w']+\b/g) || [])
        .sort((a, b) => a.localeCompare(b))
        .join(" ");

    default:
      return text;
  }
}

export const transformOptions: { type: TransformType; label: string; icon: string }[] = [
  { type: "uppercase", label: "UPPERCASE", icon: "AA" },
  { type: "lowercase", label: "lowercase", icon: "aa" },
  { type: "titleCase", label: "Title Case", icon: "Ab" },
  { type: "sentenceCase", label: "Sentence case", icon: "Ab." },
  { type: "capitalizeWords", label: "Capitalize Each Word", icon: "AB" },
  { type: "camelCase", label: "camelCase", icon: "aB" },
  { type: "snakeCase", label: "snake_case", icon: "a_b" },
  { type: "kebabCase", label: "kebab-case", icon: "a-b" },
  { type: "removeExtraSpaces", label: "Remove Extra Spaces", icon: "␣" },
  { type: "removeLineBreaks", label: "Remove Line Breaks", icon: "↵" },
  { type: "trimLines", label: "Trim Each Line", icon: "∤" },
  { type: "removeDuplicates", label: "Remove Duplicate Lines", icon: "≠" },
  { type: "sortLines", label: "Sort Lines A→Z", icon: "↑↓" },
  { type: "reverseText", label: "Reverse Text", icon: "↔" },
  { type: "sortWords", label: "Sort Words A→Z", icon: "W↑" },
];
