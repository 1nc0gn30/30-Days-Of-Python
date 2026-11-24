export interface SandboxResult {
  ok: boolean;
  stdout: string[];
  error?: string;
  errorLine?: number;
  variables: Record<string, string>;
  durationMs: number;
}

class PyError extends Error {
  line: number;
  pyType: string;
  constructor(pyType: string, message: string, line: number) {
    super(`${pyType}: ${message}`);
    this.pyType = pyType;
    this.line = line;
  }
}

class BreakSignal {}
class ContinueSignal {}
class ReturnSignal {
  value: unknown;
  constructor(value: unknown) {
    this.value = value;
  }
}

interface PyClassDef {
  __pyType: "class";
  name: string;
  parent: PyClassDef | null;
  attrs: Record<string, unknown>;
}

interface PyInstance {
  __pyType: "instance";
  cls: PyClassDef;
  attrs: Record<string, unknown>;
}

interface PyFunc {
  __pyType: "function";
  name: string;
  params: { name: string; defaultVal?: unknown }[];
  body: Statement[];
  closure: Scope;
  isGenerator: boolean;
}

interface PyBoundMethod {
  __pyType: "bound_method";
  self: PyInstance;
  fn: PyFunc;
}

interface PyTuple {
  __pyType: "tuple";
  items: unknown[];
}

interface PySet {
  __pyType: "set";
  items: unknown[];
}

interface PyDateTime {
  __pyType: "datetime";
  date: Date;
}

interface PyTimeDelta {
  __pyType: "timedelta";
  ms: number;
}

interface PyModule {
  __pyType: "module";
  name: string;
  exports: Record<string, unknown>;
}

class Scope {
  vars: Record<string, unknown> = {};
  parent: Scope | null;
  constructor(parent: Scope | null = null) {
    this.parent = parent;
  }
  get(name: string): { found: boolean; value: unknown } {
    if (Object.prototype.hasOwnProperty.call(this.vars, name)) {
      return { found: true, value: this.vars[name] };
    }
    if (this.parent) return this.parent.get(name);
    return { found: false, value: undefined };
  }
  set(name: string, value: unknown) {
    this.vars[name] = value;
  }
}

interface Statement {
  indent: number;
  line: number;
  text: string;
  children?: Statement[];
}

function isTuple(v: unknown): v is PyTuple {
  return typeof v === "object" && v !== null && (v as PyTuple).__pyType === "tuple";
}

function isSet(v: unknown): v is PySet {
  return typeof v === "object" && v !== null && (v as PySet).__pyType === "set";
}

function isClass(v: unknown): v is PyClassDef {
  return typeof v === "object" && v !== null && (v as PyClassDef).__pyType === "class";
}

function isInstance(v: unknown): v is PyInstance {
  return typeof v === "object" && v !== null && (v as PyInstance).__pyType === "instance";
}

function isFunc(v: unknown): v is PyFunc {
  return typeof v === "object" && v !== null && (v as PyFunc).__pyType === "function";
}

function isBoundMethod(v: unknown): v is PyBoundMethod {
  return typeof v === "object" && v !== null && (v as PyBoundMethod).__pyType === "bound_method";
}

function isDateTime(v: unknown): v is PyDateTime {
  return typeof v === "object" && v !== null && (v as PyDateTime).__pyType === "datetime";
}

function isTimeDelta(v: unknown): v is PyTimeDelta {
  return typeof v === "object" && v !== null && (v as PyTimeDelta).__pyType === "timedelta";
}

function isModule(v: unknown): v is PyModule {
  return typeof v === "object" && v !== null && (v as PyModule).__pyType === "module";
}

function isPlainDict(v: unknown): v is Record<string, unknown> {
  return (
    typeof v === "object" &&
    v !== null &&
    !Array.isArray(v) &&
    !("__pyType" in (v as Record<string, unknown>))
  );
}

function pyTypeName(v: unknown): string {
  if (v === null || v === undefined) return "NoneType";
  if (typeof v === "boolean") return "bool";
  if (typeof v === "number") return Number.isInteger(v) ? "int" : "float";
  if (typeof v === "string") return "str";
  if (Array.isArray(v)) return "list";
  if (isTuple(v)) return "tuple";
  if (isSet(v)) return "set";
  if (isInstance(v)) return v.cls.name;
  if (isClass(v)) return "type";
  if (isFunc(v) || isBoundMethod(v) || typeof v === "function") return "function";
  if (isDateTime(v)) return "datetime.datetime";
  if (isTimeDelta(v)) return "datetime.timedelta";
  if (isModule(v)) return "module";
  return "dict";
}

function pyRepr(v: unknown, topLevel = false): string {
  if (v === null || v === undefined) return "None";
  if (typeof v === "boolean") return v ? "True" : "False";
  if (typeof v === "number") {
    if (Object.is(v, -0)) return "0";
    return String(v);
  }
  if (typeof v === "string") {
    if (topLevel) return v;
    return `'${v.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
  }
  if (Array.isArray(v)) {
    return `[${v.map((x) => pyRepr(x, false)).join(", ")}]`;
  }
  if (isTuple(v)) {
    if (v.items.length === 1) return `(${pyRepr(v.items[0], false)},)`;
    return `(${v.items.map((x) => pyRepr(x, false)).join(", ")})`;
  }
  if (isSet(v)) {
    if (v.items.length === 0) return "set()";
    return `{${v.items.map((x) => pyRepr(x, false)).join(", ")}}`;
  }
  if (isDateTime(v)) {
    return v.date.toISOString().replace("T", " ").replace("Z", "");
  }
  if (isTimeDelta(v)) {
    return `${Math.floor(v.ms / 86400000)} days`;
  }
  if (isInstance(v)) {
    return `<__main__.${v.cls.name} object>`;
  }
  if (isClass(v)) {
    return `<class '${v.name}'>`;
  }
  if (isFunc(v)) {
    return `<function ${v.name}>`;
  }
  if (isModule(v)) {
    return `<module '${v.name}'>`;
  }
  if (isPlainDict(v)) {
    const entries = Object.entries(v).map(([k, val]) => `${pyRepr(k, false)}: ${pyRepr(val, false)}`);
    return `{${entries.join(", ")}}`;
  }
  return String(v);
}

function pyTruthy(v: unknown): boolean {
  if (v === null || v === undefined || v === false) return false;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") return v.length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (isTuple(v) || isSet(v)) return v.items.length > 0;
  if (isPlainDict(v)) return Object.keys(v).length > 0;
  return true;
}

function pyEquals(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a === "number" && typeof b === "number") return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => pyEquals(v, b[i]));
  }
  if (isTuple(a) && isTuple(b)) {
    return a.items.length === b.items.length && a.items.every((v, i) => pyEquals(v, b.items[i]));
  }
  if (isPlainDict(a) && isPlainDict(b)) {
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    return ka.length === kb.length && ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && pyEquals(a[k], b[k]));
  }
  return false;
}

function stripInlineComment(line: string): string {
  let quote: string | null = null;
  let triple = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote) {
      if (ch === "\\" && !triple) {
        i++;
        continue;
      }
      if (triple && line.slice(i, i + 3) === quote.repeat(3)) {
        quote = null;
        triple = false;
        i += 2;
      } else if (!triple && ch === quote) {
        quote = null;
      }
    } else {
      if (ch === "#") return line.slice(0, i);
      if (ch === '"' || ch === "'") {
        if (line.slice(i, i + 3) === ch.repeat(3)) {
          quote = ch;
          triple = true;
          i += 2;
        } else {
          quote = ch;
          triple = false;
        }
      }
    }
  }
  return line;
}

/** Join multi-line brackets/parens/braces into logical statements */
function preprocessLines(code: string): { indent: number; line: number; text: string }[] {
  const rawLines = code.replace(/\r\n/g, "\n").split("\n");
  const result: { indent: number; line: number; text: string }[] = [];

  let buffer = "";
  let bufIndent = 0;
  let bufStartLine = 1;
  let depth = 0;
  let inTriple: string | null = null;

  for (let idx = 0; idx < rawLines.length; idx++) {
    const lineNo = idx + 1;
    const raw = rawLines[idx];

    if (inTriple) {
      buffer += "\n" + raw;
      if (raw.includes(inTriple)) {
        inTriple = null;
      }
      if (!inTriple && depth === 0) {
        result.push({ indent: bufIndent, line: bufStartLine, text: buffer.trim() });
        buffer = "";
      }
      continue;
    }

    const stripped = stripInlineComment(raw);
    if (!buffer && stripped.trim() === "") continue;

    if (!buffer) {
      const m = raw.match(/^([ \t]*)/);
      const ws = m ? m[1].replace(/\t/g, "    ") : "";
      bufIndent = ws.length;
      bufStartLine = lineNo;
      buffer = stripped.trim();
    } else {
      buffer += " " + stripped.trim();
    }

    // Track bracket depth and triple quotes
    let quote: string | null = null;
    for (let i = 0; i < stripped.length; i++) {
      const ch = stripped[i];
      if (quote) {
        if (ch === "\\") {
          i++;
          continue;
        }
        if (ch === quote) quote = null;
      } else {
        if ((ch === '"' || ch === "'") && stripped.slice(i, i + 3) === ch.repeat(3)) {
          const rest = stripped.slice(i + 3);
          if (rest.includes(ch.repeat(3))) {
            i += 3 + rest.indexOf(ch.repeat(3)) + 2;
          } else {
            inTriple = ch.repeat(3);
            break;
          }
        } else if (ch === '"' || ch === "'") {
          quote = ch;
        } else if (ch === "(" || ch === "[" || ch === "{") {
          depth++;
        } else if (ch === ")" || ch === "]" || ch === "}") {
          depth = Math.max(0, depth - 1);
        }
      }
    }

    if (depth === 0 && !inTriple) {
      result.push({ indent: bufIndent, line: bufStartLine, text: buffer.trim() });
      buffer = "";
    }
  }

  if (buffer.trim()) {
    throw new PyError("SyntaxError", "Unclosed bracket or triple-quoted string", bufStartLine);
  }
  return result;
}

function buildAst(lines: { indent: number; line: number; text: string }[]): Statement[] {
  let i = 0;
  function parseBlock(minIndent: number): Statement[] {
    const stmts: Statement[] = [];
    while (i < lines.length) {
      const cur = lines[i];
      if (cur.indent < minIndent) break;
      if (cur.indent > minIndent) {
        throw new PyError("IndentationError", "unexpected indent", cur.line);
      }
      const stmt: Statement = { indent: cur.indent, line: cur.line, text: cur.text };
      i++;
      const expectsBlock =
        /^(if|elif|else|for|while|def|class|try|except|finally|with)\b/.test(cur.text) &&
        cur.text.endsWith(":");
      if (expectsBlock) {
        if (i >= lines.length || lines[i].indent <= cur.indent) {
          throw new PyError("IndentationError", "expected an indented block", cur.line);
        }
        stmt.children = parseBlock(lines[i].indent);
      }
      stmts.push(stmt);
    }
    return stmts;
  }
  if (lines.length === 0) return [];
  return parseBlock(lines[0].indent);
}

/** Split top-level expression string by separator character(s) outside quotes & brackets */
function splitTopLevel(expr: string, sep: string): string[] {
  const parts: string[] = [];
  let current = "";
  let depth = 0;
  let quote: string | null = null;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (quote) {
      current += ch;
      if (ch === "\\" && i + 1 < expr.length) {
        current += expr[++i];
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === "(" || ch === "[" || ch === "{") {
      depth++;
      current += ch;
      continue;
    }
    if (ch === ")" || ch === "]" || ch === "}") {
      depth--;
      current += ch;
      continue;
    }
    if (depth === 0 && expr.slice(i, i + sep.length) === sep) {
      parts.push(current);
      current = "";
      i += sep.length - 1;
      continue;
    }
    current += ch;
  }
  parts.push(current);
  return parts;
}

function findTopLevelKeyword(expr: string, kw: string, fromRight = false): number {
  let depth = 0;
  let quote: string | null = null;
  let found = -1;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (quote) {
      if (ch === "\\") {
        i++;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === "(" || ch === "[" || ch === "{") {
      depth++;
      continue;
    }
    if (ch === ")" || ch === "]" || ch === "}") {
      depth--;
      continue;
    }
    if (depth === 0 && expr.slice(i, i + kw.length) === kw) {
      const before = i === 0 ? " " : expr[i - 1];
      const after = i + kw.length >= expr.length ? " " : expr[i + kw.length];
      if (!/[A-Za-z0-9_]/.test(before) && !/[A-Za-z0-9_]/.test(after)) {
        if (!fromRight) return i;
        found = i;
      }
    }
  }
  return found;
}

function findTopLevelOp(expr: string, ops: string[], rightAssoc = false): { index: number; op: string } | null {
  let depth = 0;
  let quote: string | null = null;
  let match: { index: number; op: string } | null = null;

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (quote) {
      if (ch === "\\") {
        i++;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === "(" || ch === "[" || ch === "{") {
      depth++;
      continue;
    }
    if (ch === ")" || ch === "]" || ch === "}") {
      depth--;
      continue;
    }
    if (depth !== 0) continue;

    for (const op of ops) {
      if (expr.slice(i, i + op.length) === op) {
        // Avoid matching ** when looking for *, or // when looking for /, or == / != / <= / >=
        if (op === "*" && (expr[i + 1] === "*" || expr[i - 1] === "*")) continue;
        if (op === "/" && (expr[i + 1] === "/" || expr[i - 1] === "/")) continue;
        if ((op === "<" || op === ">") && expr[i + 1] === "=") continue;
        if ((op === "+" || op === "-") && i === 0) continue;
        if ((op === "+" || op === "-") && /[+\-*/%(,[=<>:!]\s*$/.test(expr.slice(0, i))) continue;
        // Skip scientific notation e.g. 1e-5
        if ((op === "+" || op === "-") && /\d[eE]$/.test(expr.slice(0, i))) continue;
        // Word operators
        if (/^[a-z]/.test(op)) {
          const before = i === 0 ? " " : expr[i - 1];
          const after = i + op.length >= expr.length ? " " : expr[i + op.length];
          if (/[A-Za-z0-9_]/.test(before) || /[A-Za-z0-9_]/.test(after)) continue;
        }
        if (rightAssoc) {
          return { index: i, op };
        }
        match = { index: i, op };
        i += op.length - 1;
        break;
      }
    }
  }
  return match;
}

function unescapeString(raw: string): string {
  return raw
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\r/g, "\r")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");
}

function formatWithSpec(val: unknown, spec: string): string {
  const m = spec.match(/^\.(\d+)f$/);
  if (m && typeof val === "number") {
    return val.toFixed(parseInt(m[1], 10));
  }
  return pyRepr(val, true);
}

function makeStrftime(date: Date, fmt: string): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return fmt
    .replace(/%Y/g, String(date.getFullYear()))
    .replace(/%m/g, pad(date.getMonth() + 1))
    .replace(/%d/g, pad(date.getDate()))
    .replace(/%H/g, pad(date.getHours()))
    .replace(/%M/g, pad(date.getMinutes()))
    .replace(/%S/g, pad(date.getSeconds()));
}

function createModules(): Record<string, PyModule> {
  const mathMod: PyModule = {
    __pyType: "module",
    name: "math",
    exports: {
      pi: Math.PI,
      e: Math.E,
      sqrt: (x: number) => Math.sqrt(x),
      ceil: (x: number) => Math.ceil(x),
      floor: (x: number) => Math.floor(x),
      pow: (x: number, y: number) => Math.pow(x, y),
      fabs: (x: number) => Math.abs(x),
      sin: (x: number) => Math.sin(x),
      cos: (x: number) => Math.cos(x),
    },
  };

  const randomMod: PyModule = {
    __pyType: "module",
    name: "random",
    exports: {
      randint: (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a,
      random: () => Math.random(),
      choice: (seq: unknown) => {
        const arr = Array.isArray(seq) ? seq : isTuple(seq) ? seq.items : typeof seq === "string" ? [...seq] : [];
        return arr[Math.floor(Math.random() * arr.length)];
      },
      shuffle: (arr: unknown[]) => {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return null;
      },
    },
  };

  const toJs = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(toJs);
    if (isTuple(v) || isSet(v)) return v.items.map(toJs);
    if (isPlainDict(v)) {
      const out: Record<string, unknown> = {};
      for (const [k, val] of Object.entries(v)) out[k] = toJs(val);
      return out;
    }
    return v;
  };

  const jsonMod: PyModule = {
    __pyType: "module",
    name: "json",
    exports: {
      loads: (s: string) => JSON.parse(String(s)),
      dumps: (obj: unknown, kwargs?: Record<string, unknown>) => {
        const indent = kwargs && typeof kwargs.indent === "number" ? kwargs.indent : undefined;
        return JSON.stringify(toJs(obj), null, indent);
      },
    },
  };

  const reMod: PyModule = {
    __pyType: "module",
    name: "re",
    exports: {
      findall: (pattern: string, text: string) => {
        const regex = new RegExp(String(pattern), "g");
        const out: string[] = [];
        let m: RegExpExecArray | null;
        while ((m = regex.exec(String(text))) !== null) {
          out.push(m[1] !== undefined ? m[1] : m[0]);
          if (m[0].length === 0) regex.lastIndex++;
        }
        return out;
      },
      search: (pattern: string, text: string) => {
        const m = new RegExp(String(pattern)).exec(String(text));
        return m ? m[0] : null;
      },
      sub: (pattern: string, repl: string, text: string) => {
        return String(text).replace(new RegExp(String(pattern), "g"), String(repl));
      },
    },
  };

  const datetimeCtor = Object.assign(
    (year: number, month: number, day: number, hour = 0, minute = 0, second = 0): PyDateTime => ({
      __pyType: "datetime",
      date: new Date(year, month - 1, day, hour, minute, second),
    }),
    {
      now: (): PyDateTime => ({ __pyType: "datetime", date: new Date() }),
    }
  );

  const timedeltaCtor = (days = 0, kwargs?: Record<string, unknown>): PyTimeDelta => {
    const d = (kwargs && typeof kwargs.days === "number" ? kwargs.days : typeof days === "number" ? days : 0);
    const w = kwargs && typeof kwargs.weeks === "number" ? kwargs.weeks : 0;
    const h = kwargs && typeof kwargs.hours === "number" ? kwargs.hours : 0;
    return {
      __pyType: "timedelta",
      ms: ((d + w * 7) * 86400 + h * 3600) * 1000,
    };
  };

  const datetimeMod: PyModule = {
    __pyType: "module",
    name: "datetime",
    exports: {
      datetime: datetimeCtor,
      timedelta: timedeltaCtor,
    },
  };

  return {
    math: mathMod,
    random: randomMod,
    json: jsonMod,
    re: reMod,
    datetime: datetimeMod,
  };
}

export function runPythonCode(code: string, maxSteps = 5000): SandboxResult {
  const started = performance.now();
  const stdout: string[] = [];
  let steps = 0;

  const tick = (line: number) => {
    steps++;
    if (steps > maxSteps) {
      throw new PyError("RuntimeError", "Execution limit exceeded (possible infinite loop).", line);
    }
  };

  const modules = createModules();
  const globalScope = new Scope(null);

  const callCallable = (fn: unknown, args: unknown[], kwargs: Record<string, unknown>, line: number): unknown => {
    if (isClass(fn)) {
      const inst: PyInstance = { __pyType: "instance", cls: fn, attrs: {} };
      const init = lookupClassAttr(fn, "__init__");
      if (isFunc(init)) {
        callPyFunc(init, [inst, ...args], kwargs, line);
      }
      return inst;
    }
    if (isBoundMethod(fn)) {
      return callPyFunc(fn.fn, [fn.self, ...args], kwargs, line);
    }
    if (isFunc(fn)) {
      return callPyFunc(fn, args, kwargs, line);
    }
    if (typeof fn === "function") {
      return (fn as (...a: unknown[]) => unknown)(...args, ...(Object.keys(kwargs).length ? [kwargs] : []));
    }
    throw new PyError("TypeError", `'${pyTypeName(fn)}' object is not callable`, line);
  };

  const formatForPrint = (val: unknown, line: number): string => {
    if (isInstance(val)) {
      const strFn = lookupClassAttr(val.cls, "__str__");
      if (isFunc(strFn)) {
        const res = callPyFunc(strFn, [val], {}, line);
        return pyRepr(res, true);
      }
    }
    return pyRepr(val, true);
  };

  const toIterable = (val: unknown, line: number): unknown[] => {
    if (Array.isArray(val)) return val;
    if (isTuple(val) || isSet(val)) return val.items;
    if (typeof val === "string") return [...val];
    if (isPlainDict(val)) return Object.keys(val);
    throw new PyError("TypeError", `'${pyTypeName(val)}' object is not iterable`, line);
  };

  // Built-ins
  globalScope.set("print", (...rawArgs: unknown[]) => {
    let kwargs: Record<string, unknown> = {};
    let args = rawArgs;
    if (rawArgs.length > 0 && isPlainDict(rawArgs[rawArgs.length - 1]) && "__isKwargs" in (rawArgs[rawArgs.length - 1] as Record<string, unknown>)) {
      kwargs = rawArgs[rawArgs.length - 1] as Record<string, unknown>;
      args = rawArgs.slice(0, -1);
    }
    const sep = typeof kwargs.sep === "string" ? kwargs.sep : " ";
    const text = args.map((a) => formatForPrint(a, 0)).join(sep);
    stdout.push(text);
    return null;
  });

  globalScope.set("len", (v: unknown) => {
    if (typeof v === "string" || Array.isArray(v)) return v.length;
    if (isTuple(v) || isSet(v)) return v.items.length;
    if (isPlainDict(v)) return Object.keys(v).length;
    if (isInstance(v)) {
      const lenFn = lookupClassAttr(v.cls, "__len__");
      if (isFunc(lenFn)) return callPyFunc(lenFn, [v], {}, 0);
    }
    throw new PyError("TypeError", `object of type '${pyTypeName(v)}' has no len()`, 0);
  });

  globalScope.set("type", (v: unknown) => `<class '${pyTypeName(v)}'>`);
  globalScope.set("int", (v: unknown) => {
    const n = parseInt(String(v), 10);
    if (Number.isNaN(n)) throw new PyError("ValueError", `invalid literal for int(): '${v}'`, 0);
    return n;
  });
  globalScope.set("float", (v: unknown) => {
    const n = parseFloat(String(v));
    if (Number.isNaN(n)) throw new PyError("ValueError", `could not convert string to float: '${v}'`, 0);
    return n;
  });
  globalScope.set("str", (v: unknown) => formatForPrint(v, 0));
  globalScope.set("bool", (v: unknown) => pyTruthy(v));
  globalScope.set("abs", (v: number) => Math.abs(v));
  globalScope.set("round", (v: number, digits = 0) => {
    const f = Math.pow(10, digits);
    return Math.round(v * f) / f;
  });
  globalScope.set("sum", (v: unknown) => toIterable(v, 0).reduce<number>((acc, x) => acc + Number(x), 0));
  globalScope.set("min", (...args: unknown[]) => {
    const items = args.length === 1 ? toIterable(args[0], 0) : args;
    return items.reduce((a, b) => ((a as number) < (b as number) ? a : b));
  });
  globalScope.set("max", (...args: unknown[]) => {
    const items = args.length === 1 ? toIterable(args[0], 0) : args;
    return items.reduce((a, b) => ((a as number) > (b as number) ? a : b));
  });
  globalScope.set("sorted", (v: unknown) => {
    const arr = [...toIterable(v, 0)];
    arr.sort((a, b) => (a === b ? 0 : (a as number) < (b as number) ? -1 : 1));
    return arr;
  });
  globalScope.set("reversed", (v: unknown) => [...toIterable(v, 0)].reverse());
  globalScope.set("list", (v?: unknown) => (v === undefined ? [] : [...toIterable(v, 0)]));
  globalScope.set("tuple", (v?: unknown): PyTuple => ({ __pyType: "tuple", items: v === undefined ? [] : [...toIterable(v, 0)] }));
  globalScope.set("set", (v?: unknown): PySet => {
    const items: unknown[] = [];
    if (v !== undefined) {
      for (const item of toIterable(v, 0)) {
        if (!items.some((x) => pyEquals(x, item))) items.push(item);
      }
    }
    return { __pyType: "set", items };
  });
  globalScope.set("range", (a: number, b?: number, step = 1) => {
    const start = b === undefined ? 0 : a;
    const stop = b === undefined ? a : b;
    if (step === 0) throw new PyError("ValueError", "range() arg 3 must not be zero", 0);
    const out: number[] = [];
    if (step > 0) {
      for (let x = start; x < stop; x += step) out.push(x);
    } else {
      for (let x = start; x > stop; x += step) out.push(x);
    }
    return out;
  });
  globalScope.set("enumerate", (v: unknown, start = 0) =>
    toIterable(v, 0).map((item, idx): PyTuple => ({ __pyType: "tuple", items: [idx + start, item] }))
  );
  globalScope.set("zip", (...seqs: unknown[]) => {
    const arrays = seqs.map((s) => toIterable(s, 0));
    const minLen = Math.min(...arrays.map((a) => a.length));
    const out: PyTuple[] = [];
    for (let i = 0; i < minLen; i++) {
      out.push({ __pyType: "tuple", items: arrays.map((a) => a[i]) });
    }
    return out;
  });
  globalScope.set("map", (fn: unknown, seq: unknown) =>
    toIterable(seq, 0).map((item) => callCallable(fn, [item], {}, 0))
  );
  globalScope.set("filter", (fn: unknown, seq: unknown) =>
    toIterable(seq, 0).filter((item) => pyTruthy(callCallable(fn, [item], {}, 0)))
  );
  globalScope.set("input", (prompt = "") => {
    if (prompt) stdout.push(`${prompt}7`);
    return "7";
  });
  globalScope.set("isinstance", (obj: unknown, cls: unknown) => {
    if (isInstance(obj) && isClass(cls)) {
      let cur: PyClassDef | null = obj.cls;
      while (cur) {
        if (cur === cls) return true;
        cur = cur.parent;
      }
      return false;
    }
    return false;
  });

  function lookupClassAttr(cls: PyClassDef, attr: string): unknown {
    if (Object.prototype.hasOwnProperty.call(cls.attrs, attr)) return cls.attrs[attr];
    if (cls.parent) return lookupClassAttr(cls.parent, attr);
    return undefined;
  }

  function callPyFunc(fn: PyFunc, args: unknown[], kwargs: Record<string, unknown>, line: number): unknown {
    const fnScope = new Scope(fn.closure);
    fn.params.forEach((p, idx) => {
      if (idx < args.length) {
        fnScope.set(p.name, args[idx]);
      } else if (Object.prototype.hasOwnProperty.call(kwargs, p.name)) {
        fnScope.set(p.name, kwargs[p.name]);
      } else if (p.defaultVal !== undefined) {
        fnScope.set(p.name, p.defaultVal);
      } else {
        throw new PyError("TypeError", `${fn.name}() missing required argument: '${p.name}'`, line);
      }
    });

    if (fn.isGenerator) {
      const yielded: unknown[] = [];
      execBlock(fn.body, fnScope, yielded);
      return yielded;
    }

    try {
      execBlock(fn.body, fnScope);
    } catch (sig) {
      if (sig instanceof ReturnSignal) return sig.value;
      throw sig;
    }
    return null;
  }

  function evalFString(inner: string, scope: Scope, line: number): string {
    let out = "";
    let i = 0;
    while (i < inner.length) {
      if (inner[i] === "{") {
        if (inner[i + 1] === "{") {
          out += "{";
          i += 2;
          continue;
        }
        let depth = 1;
        let j = i + 1;
        while (j < inner.length && depth > 0) {
          if (inner[j] === "{") depth++;
          else if (inner[j] === "}") depth--;
          j++;
        }
        const rawExpr = inner.slice(i + 1, j - 1);
        const colonIdx = rawExpr.lastIndexOf(":");
        let exprPart = rawExpr;
        let fmtSpec = "";
        if (colonIdx !== -1 && !rawExpr.slice(colonIdx).includes("'") && !rawExpr.slice(colonIdx).includes('"') && !rawExpr.slice(colonIdx).includes("]")) {
          exprPart = rawExpr.slice(0, colonIdx);
          fmtSpec = rawExpr.slice(colonIdx + 1).trim();
        }
        const val = evalExpr(exprPart.trim(), scope, line);
        out += fmtSpec ? formatWithSpec(val, fmtSpec) : formatForPrint(val, line);
        i = j;
      } else if (inner[i] === "}" && inner[i + 1] === "}") {
        out += "}";
        i += 2;
      } else {
        out += inner[i];
        i++;
      }
    }
    return unescapeString(out);
  }

  function evalArgs(argsText: string, scope: Scope, line: number): { args: unknown[]; kwargs: Record<string, unknown> } {
    if (!argsText.trim()) return { args: [], kwargs: {} };
    // Support bare generator expressions as sole function argument: sum(x for x in items)
    const genArg = evalGeneratorOrComp(argsText.trim(), scope, line);
    if (genArg !== null) {
      return { args: [genArg], kwargs: {} };
    }
    const rawParts = splitTopLevel(argsText, ",");
    const args: unknown[] = [];
    const kwargs: Record<string, unknown> = {};
    for (const raw of rawParts) {
      const part = raw.trim();
      if (!part) continue;
      // Check kwarg: ident = expr (not ==)
      const kwMatch = part.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=(?!=)(.+)$/);
      if (kwMatch) {
        kwargs[kwMatch[1]] = evalExpr(kwMatch[2].trim(), scope, line);
      } else {
        args.push(evalExpr(part, scope, line));
      }
    }
    return { args, kwargs };
  }

  function evalGeneratorOrComp(inner: string, scope: Scope, line: number): unknown[] | null {
    const forIdx = findTopLevelKeyword(inner, "for");
    if (forIdx === -1) return null;
    const exprPart = inner.slice(0, forIdx).trim();
    const rest = inner.slice(forIdx + 3).trim();
    const inIdx = findTopLevelKeyword(rest, "in");
    if (inIdx === -1) return null;
    const varName = rest.slice(0, inIdx).trim();
    const afterIn = rest.slice(inIdx + 2).trim();
    const ifIdx = findTopLevelKeyword(afterIn, "if");
    const iterExpr = (ifIdx === -1 ? afterIn : afterIn.slice(0, ifIdx)).trim();
    const condExpr = ifIdx === -1 ? null : afterIn.slice(ifIdx + 2).trim();

    const iterable = toIterable(evalExpr(iterExpr, scope, line), line);
    const out: unknown[] = [];
    for (const item of iterable) {
      tick(line);
      const compScope = new Scope(scope);
      assignTarget(varName, item, compScope, line);
      if (!condExpr || pyTruthy(evalExpr(condExpr, compScope, line))) {
        out.push(evalExpr(exprPart, compScope, line));
      }
    }
    return out;
  }

  function evalAttribute(obj: unknown, attr: string, line: number): unknown {
    if (isModule(obj)) {
      if (Object.prototype.hasOwnProperty.call(obj.exports, attr)) return obj.exports[attr];
      throw new PyError("AttributeError", `module '${obj.name}' has no attribute '${attr}'`, line);
    }
    if (isInstance(obj)) {
      if (Object.prototype.hasOwnProperty.call(obj.attrs, attr)) return obj.attrs[attr];
      const clsAttr = lookupClassAttr(obj.cls, attr);
      if (isFunc(clsAttr)) return { __pyType: "bound_method", self: obj, fn: clsAttr } as PyBoundMethod;
      if (clsAttr !== undefined) return clsAttr;
      throw new PyError("AttributeError", `'${obj.cls.name}' object has no attribute '${attr}'`, line);
    }
    if (isClass(obj)) {
      const clsAttr = lookupClassAttr(obj, attr);
      if (clsAttr !== undefined) return clsAttr;
    }
    if (isDateTime(obj)) {
      if (attr === "year") return obj.date.getFullYear();
      if (attr === "month") return obj.date.getMonth() + 1;
      if (attr === "day") return obj.date.getDate();
      if (attr === "strftime") return (fmt: string) => makeStrftime(obj.date, String(fmt));
    }
    if (isTimeDelta(obj)) {
      if (attr === "days") return Math.floor(obj.ms / 86400000);
      if (attr === "seconds") return Math.floor((obj.ms % 86400000) / 1000);
    }
    if (typeof obj === "function" && attr in (obj as unknown as Record<string, unknown>)) {
      return (obj as unknown as Record<string, unknown>)[attr];
    }
    if (typeof obj === "string") {
      const strMethods: Record<string, unknown> = {
        upper: () => obj.toUpperCase(),
        lower: () => obj.toLowerCase(),
        title: () => obj.replace(/\b\w/g, (c) => c.toUpperCase()),
        capitalize: () => (obj ? obj[0].toUpperCase() + obj.slice(1).toLowerCase() : ""),
        strip: () => obj.trim(),
        lstrip: () => obj.trimStart(),
        rstrip: () => obj.trimEnd(),
        replace: (a: string, b: string) => obj.split(String(a)).join(String(b)),
        split: (sep?: string) => (sep === undefined ? obj.trim().split(/\s+/).filter(Boolean) : obj.split(String(sep))),
        join: (seq: unknown) => toIterable(seq, line).map((x) => formatForPrint(x, line)).join(obj),
        startswith: (prefix: string) => obj.startsWith(String(prefix)),
        endswith: (suffix: string) => obj.endsWith(String(suffix)),
        find: (sub: string) => obj.indexOf(String(sub)),
        count: (sub: string) => (String(sub) ? obj.split(String(sub)).length - 1 : obj.length + 1),
      };
      if (attr in strMethods) return strMethods[attr];
    }
    if (Array.isArray(obj)) {
      const listMethods: Record<string, unknown> = {
        append: (x: unknown) => {
          obj.push(x);
          return null;
        },
        extend: (seq: unknown) => {
          obj.push(...toIterable(seq, line));
          return null;
        },
        insert: (idx: number, x: unknown) => {
          obj.splice(idx, 0, x);
          return null;
        },
        pop: (idx?: number) => {
          if (obj.length === 0) throw new PyError("IndexError", "pop from empty list", line);
          if (idx === undefined) return obj.pop();
          const real = idx < 0 ? obj.length + idx : idx;
          return obj.splice(real, 1)[0];
        },
        remove: (x: unknown) => {
          const idx = obj.findIndex((item) => pyEquals(item, x));
          if (idx === -1) throw new PyError("ValueError", "list.remove(x): x not in list", line);
          obj.splice(idx, 1);
          return null;
        },
        sort: () => {
          obj.sort((a, b) => (a === b ? 0 : (a as number) < (b as number) ? -1 : 1));
          return null;
        },
        reverse: () => {
          obj.reverse();
          return null;
        },
        copy: () => [...obj],
        clear: () => {
          obj.length = 0;
          return null;
        },
      };
      if (attr in listMethods) return listMethods[attr];
    }
    if (isSet(obj)) {
      const setMethods: Record<string, unknown> = {
        add: (x: unknown) => {
          if (!obj.items.some((i) => pyEquals(i, x))) obj.items.push(x);
          return null;
        },
        discard: (x: unknown) => {
          obj.items = obj.items.filter((i) => !pyEquals(i, x));
          return null;
        },
      };
      if (attr in setMethods) return setMethods[attr];
    }
    if (isPlainDict(obj)) {
      const dictMethods: Record<string, unknown> = {
        keys: () => Object.keys(obj),
        values: () => Object.values(obj),
        items: () => Object.entries(obj).map(([k, v]): PyTuple => ({ __pyType: "tuple", items: [k, v] })),
        get: (k: unknown, def: unknown = null) =>
          Object.prototype.hasOwnProperty.call(obj, String(k)) ? obj[String(k)] : def,
        pop: (k: unknown, def?: unknown) => {
          const key = String(k);
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const val = obj[key];
            delete obj[key];
            return val;
          }
          if (def !== undefined) return def;
          throw new PyError("KeyError", `'${key}'`, line);
        },
        update: (other: Record<string, unknown>) => {
          Object.assign(obj, other);
          return null;
        },
      };
      if (attr in dictMethods) return dictMethods[attr];
    }
    throw new PyError("AttributeError", `'${pyTypeName(obj)}' object has no attribute '${attr}'`, line);
  }

  function evalIndexOrSlice(obj: unknown, indexText: string, line: number): unknown {
    if (indexText.includes(":")) {
      const parts = splitTopLevel(indexText, ":");
      const seq = typeof obj === "string" ? [...obj] : Array.isArray(obj) ? obj : isTuple(obj) ? obj.items : null;
      if (!seq) throw new PyError("TypeError", `'${pyTypeName(obj)}' object is not subscriptable`, line);
      const len = seq.length;
      const step = parts[2]?.trim() ? Number(evalExpr(parts[2].trim(), globalScope, line)) : 1;
      const norm = (val: number | null, def: number) => {
        if (val === null) return def;
        return val < 0 ? Math.max(0, len + val) : Math.min(len, val);
      };
      if (step < 0) {
        const start = parts[0]?.trim() ? Number(evalExpr(parts[0].trim(), globalScope, line)) : len - 1;
        const stop = parts[1]?.trim() ? Number(evalExpr(parts[1].trim(), globalScope, line)) : -1;
        const out: unknown[] = [];
        for (let i = start < 0 ? len + start : start; i > stop; i += step) {
          if (i >= 0 && i < len) out.push(seq[i]);
        }
        return typeof obj === "string" ? out.join("") : isTuple(obj) ? ({ __pyType: "tuple", items: out } as PyTuple) : out;
      }
      const start = norm(parts[0]?.trim() ? Number(evalExpr(parts[0].trim(), globalScope, line)) : null, 0);
      const stop = norm(parts[1]?.trim() ? Number(evalExpr(parts[1].trim(), globalScope, line)) : null, len);
      const out: unknown[] = [];
      for (let i = start; i < stop; i += step) out.push(seq[i]);
      return typeof obj === "string" ? out.join("") : isTuple(obj) ? ({ __pyType: "tuple", items: out } as PyTuple) : out;
    }

    const key = evalExpr(indexText.trim(), globalScope, line);
    if (Array.isArray(obj) || typeof obj === "string" || isTuple(obj)) {
      const seq = isTuple(obj) ? obj.items : obj;
      const idx = Number(key);
      const real = idx < 0 ? seq.length + idx : idx;
      if (real < 0 || real >= seq.length) throw new PyError("IndexError", "sequence index out of range", line);
      return seq[real];
    }
    if (isPlainDict(obj)) {
      const k = String(key);
      if (!Object.prototype.hasOwnProperty.call(obj, k)) {
        throw new PyError("KeyError", `'${k}'`, line);
      }
      return obj[k];
    }
    throw new PyError("TypeError", `'${pyTypeName(obj)}' object is not subscriptable`, line);
  }

  function evalExpr(raw: string, scope: Scope, line: number): unknown {
    const expr = raw.trim();
    if (!expr) throw new PyError("SyntaxError", "Empty expression", line);

    // Lambda: lambda a, b: expr
    if (/^lambda\b/.test(expr)) {
      const colonIdx = expr.indexOf(":");
      if (colonIdx === -1) throw new PyError("SyntaxError", "Invalid lambda syntax", line);
      const paramsRaw = expr.slice(6, colonIdx).trim();
      const bodyExpr = expr.slice(colonIdx + 1).trim();
      const params = paramsRaw
        ? paramsRaw.split(",").map((p) => ({ name: p.trim() }))
        : [];
      const fn: PyFunc = {
        __pyType: "function",
        name: "<lambda>",
        params,
        body: [{ indent: 0, line, text: `return ${bodyExpr}` }],
        closure: scope,
        isGenerator: false,
      };
      return fn;
    }

    // Ternary: a if cond else b
    const ifIdx = findTopLevelKeyword(expr, "if");
    if (ifIdx > 0) {
      const elseIdx = findTopLevelKeyword(expr.slice(ifIdx + 2), "else");
      if (elseIdx !== -1) {
        const truePart = expr.slice(0, ifIdx).trim();
        const condPart = expr.slice(ifIdx + 2, ifIdx + 2 + elseIdx).trim();
        const falsePart = expr.slice(ifIdx + 2 + elseIdx + 4).trim();
        return pyTruthy(evalExpr(condPart, scope, line))
          ? evalExpr(truePart, scope, line)
          : evalExpr(falsePart, scope, line);
      }
    }

    // Boolean OR
    const orMatch = findTopLevelOp(expr, ["or"]);
    if (orMatch) {
      const left = evalExpr(expr.slice(0, orMatch.index), scope, line);
      return pyTruthy(left) ? left : evalExpr(expr.slice(orMatch.index + 2), scope, line);
    }

    // Boolean AND
    const andMatch = findTopLevelOp(expr, ["and"]);
    if (andMatch) {
      const left = evalExpr(expr.slice(0, andMatch.index), scope, line);
      return !pyTruthy(left) ? left : evalExpr(expr.slice(andMatch.index + 3), scope, line);
    }

    // Unary NOT
    if (/^not\b/.test(expr)) {
      return !pyTruthy(evalExpr(expr.slice(3), scope, line));
    }

    // Comparisons
    const cmpMatch = findTopLevelOp(expr, ["not in", "is not", "==", "!=", "<=", ">=", "<", ">", "in", "is"]);
    if (cmpMatch) {
      const left = evalExpr(expr.slice(0, cmpMatch.index), scope, line);
      const right = evalExpr(expr.slice(cmpMatch.index + cmpMatch.op.length), scope, line);
      switch (cmpMatch.op) {
        case "==":
          return pyEquals(left, right);
        case "!=":
          return !pyEquals(left, right);
        case "<":
          return (left as number) < (right as number);
        case "<=":
          return (left as number) <= (right as number);
        case ">":
          return (left as number) > (right as number);
        case ">=":
          return (left as number) >= (right as number);
        case "is":
          return left === right;
        case "is not":
          return left !== right;
        case "in":
        case "not in": {
          let contained = false;
          if (typeof right === "string") contained = right.includes(String(left));
          else if (Array.isArray(right)) contained = right.some((x) => pyEquals(x, left));
          else if (isTuple(right) || isSet(right)) contained = right.items.some((x) => pyEquals(x, left));
          else if (isPlainDict(right)) contained = Object.prototype.hasOwnProperty.call(right, String(left));
          return cmpMatch.op === "in" ? contained : !contained;
        }
      }
    }

    // Addition / Subtraction
    const addMatch = findTopLevelOp(expr, ["+", "-"]);
    if (addMatch) {
      const left = evalExpr(expr.slice(0, addMatch.index), scope, line);
      const right = evalExpr(expr.slice(addMatch.index + 1), scope, line);
      if (addMatch.op === "+") {
        if (isDateTime(left) && isTimeDelta(right)) {
          return { __pyType: "datetime", date: new Date(left.date.getTime() + right.ms) } as PyDateTime;
        }
        if (typeof left === "string" && typeof right === "string") return left + right;
        if (Array.isArray(left) && Array.isArray(right)) return [...left, ...right];
        if (typeof left === "number" && typeof right === "number") return left + right;
        throw new PyError("TypeError", `unsupported operand type(s) for +: '${pyTypeName(left)}' and '${pyTypeName(right)}'`, line);
      } else {
        if (isDateTime(left) && isDateTime(right)) {
          return { __pyType: "timedelta", ms: left.date.getTime() - right.date.getTime() } as PyTimeDelta;
        }
        if (isDateTime(left) && isTimeDelta(right)) {
          return { __pyType: "datetime", date: new Date(left.date.getTime() - right.ms) } as PyDateTime;
        }
        if (typeof left === "number" && typeof right === "number") return left - right;
        throw new PyError("TypeError", `unsupported operand type(s) for -: '${pyTypeName(left)}' and '${pyTypeName(right)}'`, line);
      }
    }

    // Multiplication / Division / FloorDiv / Modulo
    const mulMatch = findTopLevelOp(expr, ["//", "*", "/", "%"]);
    if (mulMatch) {
      const left = evalExpr(expr.slice(0, mulMatch.index), scope, line);
      const right = evalExpr(expr.slice(mulMatch.index + mulMatch.op.length), scope, line);
      if (mulMatch.op === "*") {
        if (typeof left === "string" && typeof right === "number") return left.repeat(Math.max(0, right));
        if (typeof left === "number" && typeof right === "string") return right.repeat(Math.max(0, left));
        if (typeof left === "number" && typeof right === "number") return left * right;
        throw new PyError("TypeError", `can't multiply '${pyTypeName(left)}' and '${pyTypeName(right)}'`, line);
      }
      if (typeof left !== "number" || typeof right !== "number") {
        throw new PyError("TypeError", `unsupported operand type(s) for ${mulMatch.op}`, line);
      }
      if (right === 0) throw new PyError("ZeroDivisionError", "division by zero", line);
      if (mulMatch.op === "/") return left / right;
      if (mulMatch.op === "//") return Math.floor(left / right);
      return ((left % right) + right) % right;
    }

    // Unary + / -
    if (expr.startsWith("-") && expr.length > 1) {
      return -Number(evalExpr(expr.slice(1), scope, line));
    }
    if (expr.startsWith("+") && expr.length > 1) {
      return +Number(evalExpr(expr.slice(1), scope, line));
    }

    // Power ** (right associative)
    const powMatch = findTopLevelOp(expr, ["**"], true);
    if (powMatch) {
      const left = Number(evalExpr(expr.slice(0, powMatch.index), scope, line));
      const right = Number(evalExpr(expr.slice(powMatch.index + 2), scope, line));
      return Math.pow(left, right);
    }

    // Literals & Primary expressions
    if (expr === "True") return true;
    if (expr === "False") return false;
    if (expr === "None") return null;
    if (/^\d+(\.\d+)?$/.test(expr)) return Number(expr);

    // String literals (triple, raw, f-string, regular)
    const tripleMatch = expr.match(/^([fFrR]?)("""[\s\S]*"""|'''[\s\S]*''')$/);
    if (tripleMatch) {
      const prefix = tripleMatch[1].toLowerCase();
      const inner = tripleMatch[2].slice(3, -3);
      if (prefix === "f") return evalFString(inner, scope, line);
      if (prefix === "r") return inner;
      return unescapeString(inner);
    }

    const strMatch = expr.match(/^([fFrR]?)(["'])([\s\S]*)\2$/);
    if (strMatch && isSingleCompleteString(expr, strMatch[1].length)) {
      const prefix = strMatch[1].toLowerCase();
      const inner = strMatch[3];
      if (prefix === "f") return evalFString(inner, scope, line);
      if (prefix === "r") return inner;
      return unescapeString(inner);
    }

    // Parenthesized expr / tuple / generator expression
    if (expr.startsWith("(") && expr.endsWith(")") && matchingClose(expr, 0) === expr.length - 1) {
      const inner = expr.slice(1, -1).trim();
      if (inner === "") return { __pyType: "tuple", items: [] } as PyTuple;
      const gen = evalGeneratorOrComp(inner, scope, line);
      if (gen !== null) return gen;
      const parts = splitTopLevel(inner, ",");
      if (parts.length > 1) {
        const items = parts.filter((p) => p.trim() !== "").map((p) => evalExpr(p, scope, line));
        return { __pyType: "tuple", items } as PyTuple;
      }
      return evalExpr(inner, scope, line);
    }

    // List literal or list comprehension
    if (expr.startsWith("[") && expr.endsWith("]") && matchingClose(expr, 0) === expr.length - 1) {
      const inner = expr.slice(1, -1).trim();
      if (inner === "") return [];
      const comp = evalGeneratorOrComp(inner, scope, line);
      if (comp !== null) return comp;
      return splitTopLevel(inner, ",")
        .filter((p) => p.trim() !== "")
        .map((p) => evalExpr(p, scope, line));
    }

    // Dict or Set literal
    if (expr.startsWith("{") && expr.endsWith("}") && matchingClose(expr, 0) === expr.length - 1) {
      const inner = expr.slice(1, -1).trim();
      if (inner === "") return {};
      const parts = splitTopLevel(inner, ",").filter((p) => p.trim() !== "");
      const isDict = parts[0] && splitTopLevel(parts[0], ":").length >= 2;
      if (isDict) {
        const dict: Record<string, unknown> = {};
        for (const p of parts) {
          const kv = splitTopLevel(p, ":");
          if (kv.length < 2) throw new PyError("SyntaxError", "Invalid dictionary entry", line);
          const k = evalExpr(kv[0], scope, line);
          const v = evalExpr(kv.slice(1).join(":"), scope, line);
          dict[String(k)] = v;
        }
        return dict;
      } else {
        const items: unknown[] = [];
        for (const p of parts) {
          const val = evalExpr(p, scope, line);
          if (!items.some((x) => pyEquals(x, val))) items.push(val);
        }
        return { __pyType: "set", items } as PySet;
      }
    }

    // Postfix chain: call (...), subscript [...], attribute .name
    const postfix = parseTrailingPostfix(expr);
    if (postfix) {
      const baseVal = evalExpr(postfix.base, scope, line);
      if (postfix.kind === "attr") {
        return evalAttribute(baseVal, postfix.payload, line);
      }
      if (postfix.kind === "index") {
        // Evaluate index expression with current scope
        const keyText = postfix.payload.trim();
        if (keyText.includes(":")) {
          return evalIndexOrSliceWithScope(baseVal, keyText, scope, line);
        }
        const key = evalExpr(keyText, scope, line);
        if (Array.isArray(baseVal) || typeof baseVal === "string" || isTuple(baseVal)) {
          const seq = isTuple(baseVal) ? baseVal.items : baseVal;
          const idx = Number(key);
          const real = idx < 0 ? seq.length + idx : idx;
          if (real < 0 || real >= seq.length) throw new PyError("IndexError", "index out of range", line);
          return seq[real];
        }
        if (isPlainDict(baseVal)) {
          const k = String(key);
          if (!Object.prototype.hasOwnProperty.call(baseVal, k)) {
            throw new PyError("KeyError", `'${k}'`, line);
          }
          return baseVal[k];
        }
        throw new PyError("TypeError", `'${pyTypeName(baseVal)}' object is not subscriptable`, line);
      }
      if (postfix.kind === "call") {
        const { args, kwargs } = evalArgs(postfix.payload, scope, line);
        if (postfix.base.trim() === "print" && Object.keys(kwargs).length > 0) {
          return callCallable(baseVal, [...args, { ...kwargs, __isKwargs: true }], {}, line);
        }
        return callCallable(baseVal, args, kwargs, line);
      }
    }

    // Identifier lookup
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(expr)) {
      const found = scope.get(expr);
      if (!found.found) {
        throw new PyError("NameError", `name '${expr}' is not defined`, line);
      }
      return found.value;
    }

    throw new PyError("SyntaxError", `Could not parse expression: ${expr}`, line);
  }

  function evalIndexOrSliceWithScope(obj: unknown, indexText: string, scope: Scope, line: number): unknown {
    const parts = splitTopLevel(indexText, ":");
    const seq = typeof obj === "string" ? [...obj] : Array.isArray(obj) ? obj : isTuple(obj) ? obj.items : null;
    if (!seq) throw new PyError("TypeError", `'${pyTypeName(obj)}' object is not subscriptable`, line);
    const len = seq.length;
    const step = parts[2]?.trim() ? Number(evalExpr(parts[2].trim(), scope, line)) : 1;
    if (step === 0) throw new PyError("ValueError", "slice step cannot be zero", line);
    const out: unknown[] = [];
    if (step > 0) {
      const startRaw = parts[0]?.trim() ? Number(evalExpr(parts[0].trim(), scope, line)) : 0;
      const stopRaw = parts[1]?.trim() ? Number(evalExpr(parts[1].trim(), scope, line)) : len;
      const start = startRaw < 0 ? Math.max(0, len + startRaw) : Math.min(len, startRaw);
      const stop = stopRaw < 0 ? Math.max(0, len + stopRaw) : Math.min(len, stopRaw);
      for (let i = start; i < stop; i += step) out.push(seq[i]);
    } else {
      const startRaw = parts[0]?.trim() ? Number(evalExpr(parts[0].trim(), scope, line)) : len - 1;
      const stopRaw = parts[1]?.trim() ? Number(evalExpr(parts[1].trim(), scope, line)) : -len - 1;
      const start = startRaw < 0 ? len + startRaw : Math.min(len - 1, startRaw);
      const stop = stopRaw < 0 ? len + stopRaw : stopRaw;
      for (let i = start; i > stop; i += step) {
        if (i >= 0 && i < len) out.push(seq[i]);
      }
    }
    if (typeof obj === "string") return out.join("");
    if (isTuple(obj)) return { __pyType: "tuple", items: out } as PyTuple;
    return out;
  }

  function assignTarget(targetRaw: string, value: unknown, scope: Scope, line: number) {
    const target = targetRaw.trim();
    // Tuple unpacking: a, b = (1, 2)
    const parts = splitTopLevel(target, ",");
    if (parts.length > 1) {
      const items = toIterable(value, line);
      if (items.length !== parts.length) {
        throw new PyError("ValueError", `expected ${parts.length} values to unpack, got ${items.length}`, line);
      }
      parts.forEach((p, idx) => assignTarget(p, items[idx], scope, line));
      return;
    }

    // Attribute assignment: self.brand = brand
    const postfix = parseTrailingPostfix(target);
    if (postfix && postfix.kind === "attr") {
      const obj = evalExpr(postfix.base, scope, line);
      if (isInstance(obj)) {
        obj.attrs[postfix.payload] = value;
        return;
      }
      if (isClass(obj)) {
        obj.attrs[postfix.payload] = value;
        return;
      }
      throw new PyError("AttributeError", `cannot set attribute '${postfix.payload}'`, line);
    }

    // Subscript assignment: arr[1] = x or dict['k'] = v
    if (postfix && postfix.kind === "index") {
      const obj = evalExpr(postfix.base, scope, line);
      const key = evalExpr(postfix.payload, scope, line);
      if (Array.isArray(obj)) {
        const idx = Number(key);
        const real = idx < 0 ? obj.length + idx : idx;
        obj[real] = value;
        return;
      }
      if (isPlainDict(obj)) {
        obj[String(key)] = value;
        return;
      }
      if (isTuple(obj)) {
        throw new PyError("TypeError", "'tuple' object does not support item assignment", line);
      }
      throw new PyError("TypeError", `'${pyTypeName(obj)}' object does not support item assignment`, line);
    }

    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(target)) {
      throw new PyError("SyntaxError", `Cannot assign to '${target}'`, line);
    }
    scope.set(target, value);
  }

  function containsYield(stmts: Statement[]): boolean {
    for (const s of stmts) {
      if (/^yield\b/.test(s.text)) return true;
      if (s.children && containsYield(s.children)) return true;
    }
    return false;
  }

  function execBlock(stmts: Statement[], scope: Scope, yieldCollector?: unknown[]) {
    let idx = 0;
    while (idx < stmts.length) {
      const stmt = stmts[idx];
      tick(stmt.line);
      const text = stmt.text;

      // Skip pass
      if (text === "pass") {
        idx++;
        continue;
      }

      if (text === "break") throw new BreakSignal();
      if (text === "continue") throw new ContinueSignal();

      if (/^return\b/.test(text)) {
        const rest = text.slice(6).trim();
        throw new ReturnSignal(rest ? evalExpr(rest, scope, stmt.line) : null);
      }

      if (/^yield\b/.test(text)) {
        const rest = text.slice(5).trim();
        const val = rest ? evalExpr(rest, scope, stmt.line) : null;
        if (yieldCollector) yieldCollector.push(val);
        idx++;
        continue;
      }

      // Decorators: @decorator above def
      if (text.startsWith("@")) {
        const decorators: string[] = [];
        while (idx < stmts.length && stmts[idx].text.startsWith("@")) {
          decorators.push(stmts[idx].text.slice(1).trim());
          idx++;
        }
        if (idx >= stmts.length || !stmts[idx].text.startsWith("def ")) {
          throw new PyError("SyntaxError", "Decorator must precede a function definition", stmt.line);
        }
        const defStmt = stmts[idx];
        const fnName = execDef(defStmt, scope);
        let wrapped = scope.get(fnName).value;
        for (let d = decorators.length - 1; d >= 0; d--) {
          const decFn = evalExpr(decorators[d], scope, stmt.line);
          wrapped = callCallable(decFn, [wrapped], {}, stmt.line);
        }
        scope.set(fnName, wrapped);
        idx++;
        continue;
      }

      // import / from ... import
      const impMatch = text.match(/^import\s+([A-Za-z_][A-Za-z0-9_]*)(?:\s+as\s+([A-Za-z_][A-Za-z0-9_]*))?$/);
      if (impMatch) {
        const modName = impMatch[1];
        const alias = impMatch[2] || modName;
        if (!modules[modName]) {
          throw new PyError("ModuleNotFoundError", `No module named '${modName}' in browser sandbox`, stmt.line);
        }
        scope.set(alias, modules[modName]);
        idx++;
        continue;
      }

      const fromImpMatch = text.match(/^from\s+([A-Za-z_][A-Za-z0-9_]*)\s+import\s+(.+)$/);
      if (fromImpMatch) {
        const modName = fromImpMatch[1];
        if (!modules[modName]) {
          throw new PyError("ModuleNotFoundError", `No module named '${modName}' in browser sandbox`, stmt.line);
        }
        for (const rawSym of fromImpMatch[2].split(",")) {
          const [sym, alias] = rawSym.trim().split(/\s+as\s+/);
          if (!(sym in modules[modName].exports)) {
            throw new PyError("ImportError", `cannot import name '${sym}' from '${modName}'`, stmt.line);
          }
          scope.set(alias || sym, modules[modName].exports[sym]);
        }
        idx++;
        continue;
      }

      // del target
      if (/^del\s+/.test(text)) {
        const target = text.slice(4).trim();
        const postfix = parseTrailingPostfix(target);
        if (postfix && postfix.kind === "index") {
          const obj = evalExpr(postfix.base, scope, stmt.line);
          const key = evalExpr(postfix.payload, scope, stmt.line);
          if (isPlainDict(obj)) delete obj[String(key)];
          else if (Array.isArray(obj)) obj.splice(Number(key), 1);
        }
        idx++;
        continue;
      }

      // if / elif / else chain
      if (/^if\b/.test(text) && text.endsWith(":")) {
        let matched = false;
        const cond = evalExpr(text.slice(2, -1), scope, stmt.line);
        if (pyTruthy(cond)) {
          execBlock(stmt.children || [], scope, yieldCollector);
          matched = true;
        }
        idx++;
        while (idx < stmts.length && (/^elif\b/.test(stmts[idx].text) || stmts[idx].text === "else:")) {
          const branch = stmts[idx];
          if (!matched) {
            if (branch.text === "else:") {
              execBlock(branch.children || [], scope, yieldCollector);
              matched = true;
            } else {
              const eCond = evalExpr(branch.text.slice(4, -1), scope, branch.line);
              if (pyTruthy(eCond)) {
                execBlock(branch.children || [], scope, yieldCollector);
                matched = true;
              }
            }
          }
          idx++;
        }
        continue;
      }

      // for loop
      const forMatch = text.match(/^for\s+(.+?)\s+in\s+(.+):$/);
      if (forMatch) {
        const target = forMatch[1].trim();
        const iterable = toIterable(evalExpr(forMatch[2], scope, stmt.line), stmt.line);
        for (const item of iterable) {
          tick(stmt.line);
          assignTarget(target, item, scope, stmt.line);
          try {
            execBlock(stmt.children || [], scope, yieldCollector);
          } catch (sig) {
            if (sig instanceof BreakSignal) break;
            if (sig instanceof ContinueSignal) continue;
            throw sig;
          }
        }
        idx++;
        continue;
      }

      // while loop
      const whileMatch = text.match(/^while\s+(.+):$/);
      if (whileMatch) {
        while (pyTruthy(evalExpr(whileMatch[1], scope, stmt.line))) {
          tick(stmt.line);
          try {
            execBlock(stmt.children || [], scope, yieldCollector);
          } catch (sig) {
            if (sig instanceof BreakSignal) break;
            if (sig instanceof ContinueSignal) continue;
            throw sig;
          }
        }
        idx++;
        continue;
      }

      // def function
      if (/^def\s+/.test(text) && text.endsWith(":")) {
        execDef(stmt, scope);
        idx++;
        continue;
      }

      // class definition
      const classMatch = text.match(/^class\s+([A-Za-z_][A-Za-z0-9_]*)(?:\(([^)]*)\))?:$/);
      if (classMatch) {
        const name = classMatch[1];
        const parentName = classMatch[2]?.trim();
        let parent: PyClassDef | null = null;
        if (parentName) {
          const p = evalExpr(parentName, scope, stmt.line);
          if (isClass(p)) parent = p;
        }
        const clsScope = new Scope(scope);
        execBlock(stmt.children || [], clsScope);
        const clsDef: PyClassDef = { __pyType: "class", name, parent, attrs: clsScope.vars };
        scope.set(name, clsDef);
        idx++;
        continue;
      }

      // try / except / else / finally
      if (text === "try:") {
        const tryChildren = stmt.children || [];
        const exceptClauses: { types: string[]; varName?: string; body: Statement[] }[] = [];
        let elseBody: Statement[] | null = null;
        let finallyBody: Statement[] | null = null;

        idx++;
        while (idx < stmts.length) {
          const next = stmts[idx];
          if (/^except\b/.test(next.text) && next.text.endsWith(":")) {
            const header = next.text.slice(6, -1).trim();
            let types: string[] = [];
            let varName: string | undefined;
            if (header) {
              const asMatch = header.match(/^(.+?)\s+as\s+([A-Za-z_][A-Za-z0-9_]*)$/);
              const typePart = asMatch ? asMatch[1].trim() : header;
              varName = asMatch ? asMatch[2] : undefined;
              types = typePart.replace(/[()]/g, "").split(",").map((s) => s.trim()).filter(Boolean);
            }
            exceptClauses.push({ types, varName, body: next.children || [] });
            idx++;
          } else if (next.text === "else:") {
            elseBody = next.children || [];
            idx++;
          } else if (next.text === "finally:") {
            finallyBody = next.children || [];
            idx++;
          } else {
            break;
          }
        }

        let caught = false;
        let pendingError: unknown = null;
        try {
          execBlock(tryChildren, scope, yieldCollector);
        } catch (err) {
          if (err instanceof PyError) {
            const match = exceptClauses.find(
              (c) => c.types.length === 0 || c.types.includes("Exception") || c.types.includes(err.pyType)
            );
            if (match) {
              caught = true;
              if (match.varName) scope.set(match.varName, err.message);
              execBlock(match.body, scope, yieldCollector);
            } else {
              pendingError = err;
            }
          } else {
            pendingError = err;
          }
        } finally {
          if (!caught && !pendingError && elseBody) {
            execBlock(elseBody, scope, yieldCollector);
          }
          if (finallyBody) {
            execBlock(finallyBody, scope, yieldCollector);
          }
        }
        if (pendingError) throw pendingError;
        continue;
      }

      // Augmented assignments (+=, -=, *=, /=, //=, %=, **=)
      const augMatch = findTopLevelOp(text, ["+=", "-=", "*=", "//=", "/=", "%=", "**="]);
      if (augMatch) {
        const leftTarget = text.slice(0, augMatch.index).trim();
        const rightExpr = text.slice(augMatch.index + augMatch.op.length).trim();
        const baseOp = augMatch.op.slice(0, -1);
        const newVal = evalExpr(`(${leftTarget}) ${baseOp} (${rightExpr})`, scope, stmt.line);
        assignTarget(leftTarget, newVal, scope, stmt.line);
        idx++;
        continue;
      }

      // Simple assignment (=)
      const assignIdx = findAssignmentEquals(text);
      if (assignIdx !== -1) {
        const leftTarget = text.slice(0, assignIdx).trim();
        const rightExpr = text.slice(assignIdx + 1).trim();
        const val = evalExpr(rightExpr, scope, stmt.line);
        assignTarget(leftTarget, val, scope, stmt.line);
        idx++;
        continue;
      }

      // Expression statement
      evalExpr(text, scope, stmt.line);
      idx++;
    }
  }

  function execDef(stmt: Statement, scope: Scope): string {
    const defMatch = stmt.text.match(/^def\s+([A-Za-z_][A-Za-z0-9_]*)\s*\((.*)\)\s*:$/);
    if (!defMatch) throw new PyError("SyntaxError", `Invalid function definition: ${stmt.text}`, stmt.line);
    const name = defMatch[1];
    const paramsRaw = defMatch[2].trim();
    const params: { name: string; defaultVal?: unknown }[] = [];
    if (paramsRaw) {
      for (const part of splitTopLevel(paramsRaw, ",")) {
        const trimmed = part.trim();
        if (!trimmed) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          params.push({
            name: trimmed.slice(0, eqIdx).trim(),
            defaultVal: evalExpr(trimmed.slice(eqIdx + 1).trim(), scope, stmt.line),
          });
        } else {
          params.push({ name: trimmed });
        }
      }
    }
    const body = stmt.children || [];
    const fn: PyFunc = {
      __pyType: "function",
      name,
      params,
      body,
      closure: scope,
      isGenerator: containsYield(body),
    };
    scope.set(name, fn);
    return name;
  }

  try {
    const lines = preprocessLines(code);
    const ast = buildAst(lines);
    const userScope = new Scope(globalScope);
    execBlock(ast, userScope);

    const variables: Record<string, string> = {};
    for (const [k, v] of Object.entries(userScope.vars)) {
      if (!isModule(v) && !isFunc(v) && !isClass(v)) {
        variables[k] = pyRepr(v, false);
      }
    }

    return {
      ok: true,
      stdout,
      variables,
      durationMs: Math.round((performance.now() - started) * 10) / 10,
    };
  } catch (err) {
    if (err instanceof PyError) {
      return {
        ok: false,
        stdout,
        error: err.message,
        errorLine: err.line || undefined,
        variables: {},
        durationMs: Math.round((performance.now() - started) * 10) / 10,
      };
    }
    return {
      ok: false,
      stdout,
      error: `RuntimeError: ${err instanceof Error ? err.message : String(err)}`,
      variables: {},
      durationMs: Math.round((performance.now() - started) * 10) / 10,
    };
  }
}

function findAssignmentEquals(text: string): number {
  let depth = 0;
  let quote: string | null = null;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === "\\") {
        i++;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === "(" || ch === "[" || ch === "{") {
      depth++;
      continue;
    }
    if (ch === ")" || ch === "]" || ch === "}") {
      depth--;
      continue;
    }
    if (depth === 0 && ch === "=") {
      const prev = text[i - 1];
      const next = text[i + 1];
      if (next !== "=" && prev !== "=" && prev !== "!" && prev !== "<" && prev !== ">") {
        return i;
      }
    }
  }
  return -1;
}

function matchingClose(s: string, openIdx: number): number {
  const open = s[openIdx];
  const close = open === "(" ? ")" : open === "[" ? "]" : "}";
  let depth = 0;
  let quote: string | null = null;
  for (let i = openIdx; i < s.length; i++) {
    const ch = s[i];
    if (quote) {
      if (ch === "\\") {
        i++;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function isSingleCompleteString(expr: string, quoteStart: number): boolean {
  const q = expr[quoteStart];
  for (let i = quoteStart + 1; i < expr.length - 1; i++) {
    if (expr[i] === "\\") {
      i++;
      continue;
    }
    if (expr[i] === q) return false;
  }
  return true;
}

function parseTrailingPostfix(
  expr: string
): { base: string; kind: "call" | "index" | "attr"; payload: string } | null {
  const trimmed = expr.trim();
  if (!trimmed) return null;

  const last = trimmed[trimmed.length - 1];
  if (last === ")" || last === "]") {
    const openChar = last === ")" ? "(" : "[";
    let depth = 0;
    let quote: string | null = null;
    for (let i = trimmed.length - 1; i >= 0; i--) {
      const ch = trimmed[i];
      if (quote) {
        if (ch === quote && trimmed[i - 1] !== "\\") quote = null;
        continue;
      }
      if (ch === '"' || ch === "'") {
        quote = ch;
        continue;
      }
      if (ch === last) depth++;
      else if (ch === openChar) {
        depth--;
        if (depth === 0) {
          if (i === 0) return null;
          return {
            base: trimmed.slice(0, i),
            kind: last === ")" ? "call" : "index",
            payload: trimmed.slice(i + 1, -1),
          };
        }
      }
    }
  }

  // Trailing .attr
  let depth = 0;
  let quote: string | null = null;
  for (let i = trimmed.length - 1; i >= 0; i--) {
    const ch = trimmed[i];
    if (quote) {
      if (ch === quote && trimmed[i - 1] !== "\\") quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === ")" || ch === "]" || ch === "}") depth++;
    else if (ch === "(" || ch === "[" || ch === "{") depth--;
    else if (depth === 0 && ch === ".") {
      const base = trimmed.slice(0, i);
      const attr = trimmed.slice(i + 1);
      if (base && /^[A-Za-z_][A-Za-z0-9_]*$/.test(attr) && !/^\d+$/.test(base)) {
        return { base, kind: "attr", payload: attr };
      }
      return null;
    }
  }
  return null;
}
