import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { CURRICULUM } from "../src/data/curriculum.ts";
import { DAY_EXERCISES } from "../src/data/exercises.ts";
import { runPythonCode } from "../src/lib/pythonSandbox.ts";
import { generateLocalTutorReply, getQuickPrompts } from "../src/lib/pythonTutor.ts";

const ROOT = path.resolve(import.meta.dirname, "..");

test("Curriculum has 30 sequential lessons with complete exercises and 60 quiz questions", () => {
  assert.equal(CURRICULUM.length, 30);
  let totalQuestions = 0;

  for (let day = 1; day <= 30; day++) {
    const lesson = CURRICULUM[day - 1];
    assert.equal(lesson.id, day, `Expected lesson ${day}`);
    assert.ok(lesson.title.trim().length > 0);
    assert.ok(lesson.summary.trim().length > 0);
    assert.ok(lesson.content.trim().length > 50);

    const ex = DAY_EXERCISES[day];
    assert.ok(ex, `Missing exercise for Day ${day}`);
    assert.equal(ex.dayId, day);
    assert.ok(ex.concepts.length >= 2);
    assert.equal(ex.quiz.length, 2, `Day ${day} should have 2 quiz questions`);

    for (const q of ex.quiz) {
      assert.ok(q.question.length > 5);
      assert.equal(q.options.length, 4);
      assert.ok(q.correctIndex >= 0 && q.correctIndex < 4);
      assert.ok(q.explanation.length > 10);
      totalQuestions++;
    }
  }

  assert.equal(totalQuestions, 60);
});

test("Every Day 1..30 starterCode and solutionCode executes cleanly in the browser Python sandbox", () => {
  for (let day = 1; day <= 30; day++) {
    const ex = DAY_EXERCISES[day];

    const starterRes = runPythonCode(ex.starterCode);
    assert.equal(
      starterRes.ok,
      true,
      `Day ${day} starterCode failed: ${starterRes.error}`
    );
    assert.ok(
      starterRes.stdout.length >= 1,
      `Day ${day} starterCode should produce output`
    );

    const solRes = runPythonCode(ex.solutionCode);
    assert.equal(
      solRes.ok,
      true,
      `Day ${day} solutionCode failed: ${solRes.error}`
    );
    if (ex.validation.requireOutputLines) {
      assert.ok(
        solRes.stdout.length >= ex.validation.requireOutputLines,
        `Day ${day} solutionCode output lines (${solRes.stdout.length}) < required (${ex.validation.requireOutputLines})`
      );
    }
    if (ex.validation.codeMustInclude) {
      for (const token of ex.validation.codeMustInclude) {
        assert.ok(
          ex.starterCode.includes(token) || ex.solutionCode.includes(token),
          `Day ${day} missing expected token '${token}'`
        );
      }
    }
  }
});

test("Python sandbox handles core syntax, OOP, decorators, generators, and error diagnostics", () => {
  // Arithmetic & f-strings
  const r1 = runPythonCode(`
x = 17
print(x // 3, x % 3, 2 ** 4)
print(f"val={x + 3}")
`);
  assert.equal(r1.ok, true);
  assert.deepEqual(r1.stdout, ["5 2 16", "val=20"]);

  // List comprehension + slicing
  const r2 = runPythonCode(`
nums = [n * n for n in range(1, 6) if n % 2 == 1]
print(nums)
print("Python"[::-1])
`);
  assert.equal(r2.ok, true);
  assert.deepEqual(r2.stdout, ["[1, 9, 25]", "nohtyP"]);

  // ZeroDivisionError diagnostic
  const rErr = runPythonCode(`x = 10 / 0`);
  assert.equal(rErr.ok, false);
  assert.match(rErr.error || "", /ZeroDivisionError/);

  // NameError diagnostic
  const rName = runPythonCode(`print(undefined_var)`);
  assert.equal(rName.ok, false);
  assert.match(rName.error || "", /NameError/);

  // IndentationError diagnostic
  const rIndent = runPythonCode(`if True:\nprint("bad")`);
  assert.equal(rIndent.ok, false);
  assert.match(rIndent.error || "", /IndentationError/);

  // Infinite loop safety cap
  const rInf = runPythonCode(`while True:\n    x = 1`, 200);
  assert.equal(rInf.ok, false);
  assert.match(rInf.error || "", /Execution limit exceeded/);
});

test("Local deterministic Python tutor answers offline across all lessons and errors", () => {
  for (const lesson of CURRICULUM) {
    const prompts = getQuickPrompts(lesson);
    assert.ok(prompts.length >= 3);
    const reply = generateLocalTutorReply(prompts[0], lesson);
    assert.ok(reply.length > 40, `Day ${lesson.id} tutor reply too short`);
  }

  const errReply = generateLocalTutorReply(
    "Why did I get an IndentationError?",
    CURRICULUM[4]
  );
  assert.match(errReply, /IndentationError/);

  const solReply = generateLocalTutorReply(
    "Show me the solution example",
    CURRICULUM[12]
  );
  assert.match(solReply, /```python/);
});

test("SEO, AEO JSON-LD, Netlify config, icons, and open-access invariants pass", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1\.0"/);
  assert.match(html, /property="og:image" content="https:\/\/python-30\.nealfrazier\.tech\/og-image\.png"/);
  assert.match(html, /name="twitter:site" content="@1nc0gn30"/);
  assert.match(html, /name="twitter:creator" content="@1nc0gn30"/);
  assert.doesNotMatch(html, /picsum\.photos/);

  const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(ldMatch, "JSON-LD script missing in index.html");
  const ld = JSON.parse(ldMatch[1]);
  assert.ok(Array.isArray(ld["@graph"]));
  const types = ld["@graph"].map((n: { "@type": string }) => n["@type"]);
  assert.ok(types.includes("WebApplication"));
  assert.ok(types.includes("Course"));
  assert.ok(types.includes("FAQPage"));

  // Static files & assets
  const robots = fs.readFileSync(path.join(ROOT, "public/robots.txt"), "utf8");
  for (const bot of ["Googlebot", "GPTBot", "ClaudeBot", "PerplexityBot", "Applebot"]) {
    assert.ok(robots.includes(bot), `robots.txt missing ${bot}`);
  }
  assert.ok(robots.includes("Sitemap: https://python-30.nealfrazier.tech/sitemap.xml"));

  const aiTxt = fs.readFileSync(path.join(ROOT, "public/ai.txt"), "utf8");
  assert.doesNotMatch(aiTxt, /Disallow:\s*\//);

  const sitemap = fs.readFileSync(path.join(ROOT, "public/sitemap.xml"), "utf8");
  assert.ok(sitemap.includes("https://python-30.nealfrazier.tech/"));

  const netlifyToml = fs.readFileSync(path.join(ROOT, "netlify.toml"), "utf8");
  assert.ok(netlifyToml.includes('publish = "dist"'));
  assert.ok(netlifyToml.includes("X-Frame-Options"));
  assert.ok(netlifyToml.includes("status = 200"));

  assert.ok(fs.existsSync(path.join(ROOT, "public/og-image.png")));
  assert.ok(fs.existsSync(path.join(ROOT, "public/apple-touch-icon.png")));
  assert.ok(fs.existsSync(path.join(ROOT, "public/icon.svg")));

  // Ensure zero paywall / blur lock / DePay strings in src
  const srcFiles = [
    "src/App.tsx",
    "src/components/AITutor.tsx",
    "src/components/LessonView.tsx",
    "src/components/Sidebar.tsx",
    "src/components/PracticeLab.tsx",
  ];
  for (const rel of srcFiles) {
    const content = fs.readFileSync(path.join(ROOT, rel), "utf8");
    assert.doesNotMatch(content, /depay/i, `Found DePay reference in ${rel}`);
    assert.doesNotMatch(content, /Tutor Offline/, `Found blur-lock overlay in ${rel}`);
    assert.doesNotMatch(content, /backdrop-blur-\[2px\]/, `Found paywall/key blur in ${rel}`);
  }
});
