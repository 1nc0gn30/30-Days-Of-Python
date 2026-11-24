import type { Lesson } from "../data/curriculum";
import { DAY_EXERCISES } from "../data/exercises";

interface ErrorGuide {
  pattern: RegExp;
  name: string;
  explanation: string;
  fix: string;
}

const ERROR_GUIDES: ErrorGuide[] = [
  {
    pattern: /indentationerror|indent/i,
    name: "IndentationError",
    explanation:
      "Python uses consistent leading spaces (4 spaces per level) instead of curly braces to group code blocks under `if`, `for`, `while`, `def`, and `class`.",
    fix: "Make sure every line inside a block has the exact same 4-space indent, and don't mix tabs and spaces.",
  },
  {
    pattern: /syntaxerror|syntax|colon/i,
    name: "SyntaxError",
    explanation:
      "Python couldn't parse a statement — usually from a missing colon (`:`), unclosed quote/parenthesis, or using `=` instead of `==` in a condition.",
    fix: "Check the line reported in the error AND the line immediately above it for unclosed `()`, `[]`, quotes, or missing `:`.",
  },
  {
    pattern: /nameerror|not defined/i,
    name: "NameError",
    explanation:
      "You referenced a variable or function name before defining it, or misspelled its capitalization (Python is case-sensitive).",
    fix: "Verify the exact spelling and ensure the variable is assigned before the line that reads it.",
  },
  {
    pattern: /typeerror|concatenate|unsupported operand/i,
    name: "TypeError",
    explanation:
      "An operation received incompatible types (for example, adding a `str` and an `int`, or trying to modify an immutable tuple).",
    fix: "Inspect values with `type(x)` and convert explicitly (`str(x)`, `int(x)`) or use an f-string like `f\"Age: {age}\"`.",
  },
  {
    pattern: /keyerror/i,
    name: "KeyError",
    explanation: "You looked up a dictionary key with `d[key]` that doesn't exist in that dictionary.",
    fix: "Use `d.get(key, default)` or wrap the lookup in `try ... except KeyError:`.",
  },
  {
    pattern: /indexerror|out of range/i,
    name: "IndexError",
    explanation: "Your index went past the start or end of a list/string. Remember Python lists start at index `0` and end at `len(items) - 1`.",
    fix: "Check `len(items)` or use negative indexing (`items[-1]` for the last element).",
  },
  {
    pattern: /zerodivisionerror|divide by zero/i,
    name: "ZeroDivisionError",
    explanation: "You divided or took modulo by `0`.",
    fix: "Guard with `if divisor != 0:` or catch `ZeroDivisionError` in a `try/except` block.",
  },
];

function extractCodeBlocks(markdown: string): string[] {
  const blocks: string[] = [];
  const regex = /```(?:python|bash)?\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(markdown)) !== null) {
    blocks.push(m[1].trim());
  }
  return blocks;
}

function extractSections(markdown: string): { heading: string; body: string }[] {
  const parts = markdown.split(/^##\s+/m).slice(1);
  return parts.map((chunk) => {
    const [firstLine, ...rest] = chunk.split("\n");
    return {
      heading: firstLine.trim(),
      body: rest.join("\n").trim(),
    };
  });
}

export function generateLocalTutorReply(question: string, lesson: Lesson): string {
  const q = question.trim();
  const lower = q.toLowerCase();
  const exercise = DAY_EXERCISES[lesson.id];
  const sections = extractSections(lesson.content);
  const codeBlocks = extractCodeBlocks(lesson.content);

  // 1. Specific Python error diagnostics
  for (const guide of ERROR_GUIDES) {
    if (guide.pattern.test(q)) {
      return [
        `### Debugging \`${guide.name}\``,
        guide.explanation,
        "",
        `**How to fix it:** ${guide.fix}`,
        "",
        exercise
          ? `For **Day ${lesson.id} (${lesson.title})**, try comparing your snippet against the starter code in the Practice Lab.`
          : "",
      ]
        .filter(Boolean)
        .join("\n");
    }
  }

  // 2. Solution / example request
  if (/\b(solution|answer|solve|show me|example code)\b/i.test(lower) && exercise) {
    return [
      `Here is a working reference solution for **Day ${lesson.id}: ${lesson.title}**:`,
      "",
      "```python",
      exercise.solutionCode,
      "```",
      "",
      `**Why it works:** It covers ${exercise.concepts.map((c) => `\`${c}\``).join(", ")}. Paste or click **Load Solution** in the Practice Lab and tweak the values to see how the output changes.`,
    ].join("\n");
  }

  // 3. Hint / task / stuck request
  if (/\b(hint|stuck|task|exercise|help|start)\b/i.test(lower) && exercise) {
    return [
      `### Hint for Day ${lesson.id}: ${lesson.title}`,
      exercise.checkHint,
      "",
      `**Key building blocks:** ${exercise.concepts.map((c) => `\`${c}\``).join(" · ")}`,
      "",
      "Try running the starter code in the **Practice Lab** first, then modify one line at a time so you can immediately verify what changed.",
    ].join("\n");
  }

  // 4. Pitfalls / mistakes / gotchas
  if (/\b(pitfall|mistake|gotcha|avoid|wrong|careful)\b/i.test(lower)) {
    const pitfallLine = lesson.content.match(/###\s*(?:⚠️|💡)[^\n]*\n([\s\S]*?)(?:\n###|\n---|$)/);
    if (pitfallLine) {
      return [
        `### Watch Out on Day ${lesson.id} (${lesson.title})`,
        pitfallLine[1].trim(),
        "",
        "Run small experiments in the Practice Lab to verify edge cases before marking the day complete.",
      ].join("\n");
    }
  }

  // 5. Keyword match against lesson sections
  const queryWords = lower
    .replace(/[^a-z0-9_\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !["what", "how", "does", "why", "can", "you", "the", "for", "this", "with", "explain", "about"].includes(w));

  let bestSection: { heading: string; body: string; score: number } | null = null;
  for (const sec of sections) {
    const haystack = `${sec.heading} ${sec.body}`.toLowerCase();
    let score = 0;
    for (const w of queryWords) {
      if (sec.heading.toLowerCase().includes(w)) score += 3;
      else if (haystack.includes(w)) score += 1;
    }
    if (score > 0 && (!bestSection || score > bestSection.score)) {
      bestSection = { ...sec, score };
    }
  }

  if (bestSection) {
    const excerpt = bestSection.body.split("\n---")[0].trim();
    return [
      `### ${bestSection.heading} (Day ${lesson.id})`,
      excerpt,
      "",
      "Want a hint for today's task, a common pitfall, or a reference solution? Ask or tap one of the quick prompts below.",
    ].join("\n");
  }

  // 6. General grounded lesson summary & syntax overview
  const firstCode = codeBlocks[0] || exercise?.starterCode || "";
  return [
    `### Day ${lesson.id}: ${lesson.title}`,
    lesson.summary,
    "",
    exercise ? `**Core concepts:** ${exercise.concepts.map((c) => `\`${c}\``).join(", ")}` : "",
    firstCode ? "\n```python\n" + firstCode + "\n```" : "",
    "",
    exercise ? `**Today's task:** ${exercise.checkHint}` : "",
    "",
    "_Local Python Tutor is running offline in your browser. Ask about a specific concept, paste an error message, or add an optional Gemini API key in Settings for open-ended AI answers._",
  ]
    .filter(Boolean)
    .join("\n");
}

export function getQuickPrompts(lesson: Lesson): string[] {
  return [
    `Explain ${lesson.title} simply`,
    "Give me a hint for today's task",
    "What is a common pitfall here?",
    "Show me a working example",
  ];
}
