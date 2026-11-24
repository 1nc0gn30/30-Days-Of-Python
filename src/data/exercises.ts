export type CurriculumPhase =
  | "Week 1 · Foundations"
  | "Week 2 · Data & Functions"
  | "Week 3 · Modules & OOP"
  | "Week 4 · Modern Python & Capstone";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DayExercise {
  dayId: number;
  phase: CurriculumPhase;
  estimatedMinutes: number;
  concepts: string[];
  starterCode: string;
  solutionCode: string;
  checkHint: string;
  /** Keywords or patterns expected in code or stdout for task verification */
  validation: {
    requireOutputLines?: number;
    codeMustInclude?: string[];
    outputMustInclude?: string[];
  };
  quiz: [QuizQuestion, QuizQuestion];
}

export const DAY_EXERCISES: Record<number, DayExercise> = {
  1: {
    dayId: 1,
    phase: "Week 1 · Foundations",
    estimatedMinutes: 15,
    concepts: ["print()", "strings", "sep argument"],
    starterCode: `# Day 1: Print your name, dream role, and a fun fact
print("Name: Alex")
print("Role: Python Developer")
print("Python", "is", "readable", sep=" | ")`,
    solutionCode: `print("Name: Jordan")
print("Dream Job: Systems Engineer")
print("Fun Fact: I wrote my first Python script today!")
print("Day 1", "Complete", sep=" -> ")`,
    checkHint: "Call print() at least 3 times to output your name, dream job, and a fun fact.",
    validation: { requireOutputLines: 3, codeMustInclude: ["print("] },
    quiz: [
      {
        id: "d1q1",
        question: "What does print('A', 'B', 'C', sep='-') output?",
        options: ["A B C", "A-B-C", "A,B,C", "A - B - C"],
        correctIndex: 1,
        explanation: "The sep argument replaces the default space separator between print() arguments with '-'."
      },
      {
        id: "d1q2",
        question: "Which string literal is valid Python?",
        options: ["'Hello\"", "\"Hello'", "'Hello, Python!'", "Hello, Python!"],
        correctIndex: 2,
        explanation: "Strings must start and end with matching quote characters ('...' or \"...\")."
      }
    ]
  },
  2: {
    dayId: 2,
    phase: "Week 1 · Foundations",
    estimatedMinutes: 20,
    concepts: ["variables", "str/int/float/bool", "type()"],
    starterCode: `# Day 2: Define fruit (str), price (float), and is_organic (bool)
fruit = "Honeycrisp Apple"
price = 2.49
is_organic = True

print(fruit, type(fruit))
print(price, type(price))
print(is_organic, type(is_organic))`,
    solutionCode: `fruit = "Mango"
price = 1.95
is_organic = True

print(type(fruit))
print(type(price))
print(type(is_organic))`,
    checkHint: "Create a string, float, and boolean variable, and inspect each with type().",
    validation: { requireOutputLines: 3, codeMustInclude: ["type("], outputMustInclude: ["float", "bool"] },
    quiz: [
      {
        id: "d2q1",
        question: "Which variable name is invalid in Python?",
        options: ["player_1", "_score", "2nd_place", "totalScore"],
        correctIndex: 2,
        explanation: "Python variable names cannot start with a digit."
      },
      {
        id: "d2q2",
        question: "What does type(5.0) return?",
        options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'number'>"],
        correctIndex: 1,
        explanation: "Any numeric literal containing a decimal point is a float in Python."
      }
    ]
  },
  3: {
    dayId: 3,
    phase: "Week 1 · Foundations",
    estimatedMinutes: 20,
    concepts: ["arithmetic", "// floor div", "% modulo", "** exponent"],
    starterCode: `# Day 3: Area of a circle with radius 7
pi = 3.14
radius = 7
area = pi * (radius ** 2)
print("Circle area:", area)
print("Is radius odd?", radius % 2 == 1)`,
    solutionCode: `r = 7
area = 3.14 * (r ** 2)
print(area)`,
    checkHint: "Compute area = 3.14 * (r ** 2) for r = 7 and print the result (153.86).",
    validation: { requireOutputLines: 1, codeMustInclude: ["**"], outputMustInclude: ["153.86"] },
    quiz: [
      {
        id: "d3q1",
        question: "What is the result of 17 // 3 in Python 3?",
        options: ["5.666", "5", "2", "6"],
        correctIndex: 1,
        explanation: "Floor division (//) divides and discards the fractional remainder, yielding 5."
      },
      {
        id: "d3q2",
        question: "What type does 16 / 2 produce in Python 3?",
        options: ["int (8)", "float (8.0)", "str ('8')", "bool (True)"],
        correctIndex: 1,
        explanation: "True division (/) always returns a float in Python 3, even when dividing evenly."
      }
    ]
  },
  4: {
    dayId: 4,
    phase: "Week 1 · Foundations",
    estimatedMinutes: 20,
    concepts: ["string methods", "f-strings", "slicing", "len()"],
    starterCode: `# Day 4: String methods and f-strings
full_name = "Ada Lovelace"
print(full_name.upper())
print(full_name.lower())
print(f"My name is {full_name} and it has {len(full_name)} characters.")`,
    solutionCode: `full_name = "Grace Hopper"
print(full_name.upper())
print(full_name.lower())
print(f"My name is {full_name} and it has {len(full_name)} characters.")`,
    checkHint: "Use .upper(), .lower(), len(), and an f-string to format your name.",
    validation: { requireOutputLines: 3, codeMustInclude: [".upper()", "len(", "f\""] },
    quiz: [
      {
        id: "d4q1",
        question: "What does 'Python'[0:3] evaluate to?",
        options: ["'Pyt'", "'Pyth'", "'yth'", "'Py'"],
        correctIndex: 0,
        explanation: "Slicing [start:stop] includes start (0) and excludes stop (3), giving characters at indices 0, 1, 2."
      },
      {
        id: "d4q2",
        question: "How do you embed variable score inside an f-string?",
        options: ["f'Score: $score'", "f'Score: {score}'", "'Score: {score}'", "f'Score: [score]'"],
        correctIndex: 1,
        explanation: "Prefix the string with f and wrap expressions in curly braces {}."
      }
    ]
  },
  5: {
    dayId: 5,
    phase: "Week 1 · Foundations",
    estimatedMinutes: 20,
    concepts: ["if/elif/else", "comparisons", "and/or/not"],
    starterCode: `# Day 5: Temperature classifier
temperature = 24

if temperature > 30:
    print("It's hot!")
elif temperature >= 20:
    print("It's nice.")
else:
    print("It's chilly.")`,
    solutionCode: `temperature = 25

if temperature > 30:
    print("It's hot!")
elif temperature >= 20 and temperature <= 30:
    print("It's nice.")
else:
    print("It's chilly.")`,
    checkHint: "Use if, elif, and else with a temperature variable to print one of the three messages.",
    validation: { requireOutputLines: 1, codeMustInclude: ["if ", "elif ", "else:"] },
    quiz: [
      {
        id: "d5q1",
        question: "Which operator checks whether two values are equal?",
        options: ["=", "==", "===", ":="],
        correctIndex: 1,
        explanation: "A single = assigns a variable; double == tests value equality."
      },
      {
        id: "d5q2",
        question: "What happens if the body of an if block is not indented?",
        options: ["Python auto-indents it", "It silently skips the block", "Python raises an IndentationError", "It prints a warning only"],
        correctIndex: 2,
        explanation: "Indentation is part of Python's grammar; missing indentation raises IndentationError."
      }
    ]
  },
  6: {
    dayId: 6,
    phase: "Week 1 · Foundations",
    estimatedMinutes: 25,
    concepts: ["lists", "indexing", "append/insert/pop", "mutability"],
    starterCode: `# Day 6: Modify a list of favorite movies
movies = ["Arrival", "Interstellar", "Dune", "Matrix", "Spirited Away"]
movies.insert(0, "Blade Runner 2049")
movies[2] = "Ex Machina"
movies.pop()
print(movies)
print("Total movies:", len(movies))`,
    solutionCode: `movies = ["Inception", "Arrival", "Dune", "Memento", "Tenet"]
movies.insert(0, "Interstellar")
movies[2] = "The Prestige"
movies.pop()
print(movies)`,
    checkHint: "Create a list of movies, insert at index 0, update a middle item, pop the last, and print the list.",
    validation: { requireOutputLines: 1, codeMustInclude: [".insert(", ".pop("] },
    quiz: [
      {
        id: "d6q1",
        question: "What does items[-1] return for items = ['a', 'b', 'c']?",
        options: ["'a'", "'b'", "'c'", "IndexError"],
        correctIndex: 2,
        explanation: "Negative indices count backwards from the end of the list, so -1 is the last item."
      },
      {
        id: "d6q2",
        question: "Which method removes and returns the last element of a list?",
        options: [".remove()", ".pop()", ".delete()", ".shift()"],
        correctIndex: 1,
        explanation: "list.pop() removes and returns the last element when called with no arguments."
      }
    ]
  },
  7: {
    dayId: 7,
    phase: "Week 1 · Foundations",
    estimatedMinutes: 25,
    concepts: ["for loops", "range()", "accumulators"],
    starterCode: `# Day 7: Sum all numbers from 1 to 50
total = 0
for num in range(1, 51):
    total += num

print("Sum 1..50 =", total)`,
    solutionCode: `total = 0
for i in range(1, 51):
    total += i
print(total)`,
    checkHint: "Use a for loop over range(1, 51) to accumulate total (should equal 1275).",
    validation: { requireOutputLines: 1, codeMustInclude: ["for ", "range("], outputMustInclude: ["1275"] },
    quiz: [
      {
        id: "d7q1",
        question: "Which numbers does range(1, 5) generate?",
        options: ["1, 2, 3, 4, 5", "0, 1, 2, 3, 4", "1, 2, 3, 4", "2, 3, 4, 5"],
        correctIndex: 2,
        explanation: "range(start, stop) stops right before the stop value, so range(1, 5) yields 1, 2, 3, 4."
      },
      {
        id: "d7q2",
        question: "How many times does `for ch in 'Py':` iterate?",
        options: ["1", "2", "3", "0"],
        correctIndex: 1,
        explanation: "Iterating over a string visits one character per iteration ('P', then 'y')."
      }
    ]
  },
  8: {
    dayId: 8,
    phase: "Week 2 · Data & Functions",
    estimatedMinutes: 25,
    concepts: ["while loops", "break", "continue", "exit condition"],
    starterCode: `# Day 8: Number guessing loop (simulated guesses in sandbox)
secret = 7
guesses = [3, 5, 7, 9]
index = 0

while index < len(guesses):
    guess = guesses[index]
    index += 1
    if guess == secret:
        print(f"Guess {guess}: Success!")
        break
    print(f"Guess {guess}: Try again")`,
    solutionCode: `secret = 7
attempt = 5
while attempt <= 10:
    if attempt == secret:
        print("Success!")
        break
    print("Wrong guess:", attempt)
    attempt += 1`,
    checkHint: "Use a while loop with a terminating condition or break statement and print 'Success!'.",
    validation: { requireOutputLines: 1, codeMustInclude: ["while ", "break"], outputMustInclude: ["Success!"] },
    quiz: [
      {
        id: "d8q1",
        question: "What does the `continue` statement do inside a loop?",
        options: [
          "Exits the loop completely",
          "Skips the remaining body of the current iteration and moves to the next",
          "Restarts the program",
          "Pauses for 1 second"
        ],
        correctIndex: 1,
        explanation: "continue jumps immediately to the next loop check/iteration without exiting the loop."
      },
      {
        id: "d8q2",
        question: "What causes an infinite while loop?",
        options: [
          "Using an integer counter",
          "The loop condition never becomes False and no break runs",
          "Having an if inside while",
          "Printing inside the loop"
        ],
        correctIndex: 1,
        explanation: "If the condition stays True and break is never hit, a while loop runs forever."
      }
    ]
  },
  9: {
    dayId: 9,
    phase: "Week 2 · Data & Functions",
    estimatedMinutes: 25,
    concepts: ["dictionaries", "key-value pairs", ".get()", ".items()"],
    starterCode: `# Day 9: Book dictionary
book = {
    "title": "Dune",
    "author": "Frank Herbert",
    "pages": 412
}
book["genre"] = "Sci-Fi"
book["pages"] = 688

print(book)
print("Rating:", book.get("rating", "Not rated yet"))`,
    solutionCode: `book = {"title": "Clean Code", "author": "Robert C. Martin", "pages": 464}
book["genre"] = "Software Engineering"
book["pages"] = 470
print(book)`,
    checkHint: "Define a book dict with title, author, pages, add genre, update pages, and print it.",
    validation: { requireOutputLines: 1, codeMustInclude: ["title", "author", "genre"] },
    quiz: [
      {
        id: "d9q1",
        question: "Why is car.get('price', 0) safer than car['price']?",
        options: [
          "It sorts the dictionary",
          "It returns the default value (0) instead of raising KeyError if the key is missing",
          "It converts the value to a float",
          "It deletes the key after reading"
        ],
        correctIndex: 1,
        explanation: "dict.get(key, default) prevents crashes when a key is not present in the dictionary."
      },
      {
        id: "d9q2",
        question: "Which dictionary method returns both keys and values for looping?",
        options: [".pairs()", ".entries()", ".items()", ".both()"],
        correctIndex: 2,
        explanation: "dict.items() yields (key, value) pairs."
      }
    ]
  },
  10: {
    dayId: 10,
    phase: "Week 2 · Data & Functions",
    estimatedMinutes: 20,
    concepts: ["tuples", "immutability", "sets", "deduplication"],
    starterCode: `# Day 10: Unique set of fruits & immutable birthday tuple
fruits = {"apple", "mango", "apple", "pear", "mango"}
birthday = (1998, 7, 14)

print("Unique fruits:", fruits)
print("Count:", len(fruits))
print("Birthday tuple:", birthday)`,
    solutionCode: `fruits = {"apple", "banana", "apple", "cherry", "banana"}
birthday = (2000, 1, 15)
print(fruits)
print(birthday)`,
    checkHint: "Create a set with duplicate fruit names and a (year, month, day) tuple, then print both.",
    validation: { requireOutputLines: 2, codeMustInclude: ["{", "("] },
    quiz: [
      {
        id: "d10q1",
        question: "What is the length of {1, 2, 2, 3, 3, 3}?",
        options: ["6", "3", "4", "Error"],
        correctIndex: 1,
        explanation: "Sets automatically discard duplicate elements, leaving only {1, 2, 3}."
      },
      {
        id: "d10q2",
        question: "What happens if you try to reassign an element of a tuple (`t[0] = 9`)?",
        options: [
          "It updates in place",
          "It converts the tuple to a list",
          "Python raises a TypeError because tuples are immutable",
          "It silently ignores the change"
        ],
        correctIndex: 2,
        explanation: "Tuples do not support item assignment after creation."
      }
    ]
  },
  11: {
    dayId: 11,
    phase: "Week 2 · Data & Functions",
    estimatedMinutes: 25,
    concepts: ["def", "parameters", "default arguments", "DRY"],
    starterCode: `# Day 11: Reusable calculate_area function
def calculate_area(width, height=1):
    area = width * height
    print(f"{width} x {height} = {area}")

calculate_area(5, 4)
calculate_area(12, 3)
calculate_area(8)`,
    solutionCode: `def calculate_area(width, height):
    print(width * height)

calculate_area(4, 5)
calculate_area(10, 2)`,
    checkHint: "Define def calculate_area(width, height) and call it at least twice.",
    validation: { requireOutputLines: 2, codeMustInclude: ["def calculate_area"] },
    quiz: [
      {
        id: "d11q1",
        question: "Which keyword starts a function definition in Python?",
        options: ["function", "func", "def", "fn"],
        correctIndex: 2,
        explanation: "Python functions are declared with the `def` keyword."
      },
      {
        id: "d11q2",
        question: "In `def greet(name='Guest'):`, what happens when you call `greet()`?",
        options: [
          "TypeError: missing argument",
          "name defaults to 'Guest'",
          "name becomes None",
          "SyntaxError"
        ],
        correctIndex: 1,
        explanation: "Default parameter values are used whenever the caller omits that argument."
      }
    ]
  },
  12: {
    dayId: 12,
    phase: "Week 2 · Data & Functions",
    estimatedMinutes: 25,
    concepts: ["return", "local scope", "global scope"],
    starterCode: `# Day 12: Return values and scope
def convert_to_minutes(hours):
    return hours * 60

mins = convert_to_minutes(2.5)
print(f"That is {mins} minutes.")`,
    solutionCode: `def convert_to_minutes(hours):
    return hours * 60

result = convert_to_minutes(3)
print(f"That is {result} minutes.")`,
    checkHint: "Write convert_to_minutes(hours) using return, store its result, and print it.",
    validation: { requireOutputLines: 1, codeMustInclude: ["def convert_to_minutes", "return "], outputMustInclude: ["minutes"] },
    quiz: [
      {
        id: "d12q1",
        question: "What does a Python function return if it has no `return` statement?",
        options: ["0", "False", "None", "Empty string"],
        correctIndex: 2,
        explanation: "Functions without an explicit return statement implicitly return None."
      },
      {
        id: "d12q2",
        question: "Where can a local variable defined inside a function be accessed?",
        options: [
          "Anywhere in the file",
          "Only inside that function",
          "In any other function",
          "Only after the function returns"
        ],
        correctIndex: 1,
        explanation: "Local variables live only within the scope of the function where they are defined."
      }
    ]
  },
  13: {
    dayId: 13,
    phase: "Week 2 · Data & Functions",
    estimatedMinutes: 25,
    concepts: ["list comprehensions", "filtering", "transforming"],
    starterCode: `# Day 13: Filter odd numbers from 1 to 10 with a list comprehension
numbers = list(range(1, 11))
odds = [n for n in numbers if n % 2 != 0]
squares = [n * n for n in odds]

print("Odds:", odds)
print("Odd squares:", squares)`,
    solutionCode: `nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
odds = [n for n in nums if n % 2 == 1]
print(odds)`,
    checkHint: "Use a list comprehension `[n for n in ... if ...]` to produce [1, 3, 5, 7, 9].",
    validation: { requireOutputLines: 1, codeMustInclude: ["[", " for ", " in ", " if "], outputMustInclude: ["[1, 3, 5, 7, 9]"] },
    quiz: [
      {
        id: "d13q1",
        question: "What does `[x * 2 for x in [1, 2, 3]]` evaluate to?",
        options: ["[1, 2, 3]", "[2, 4, 6]", "[1, 4, 9]", "6"],
        correctIndex: 1,
        explanation: "Each item x is multiplied by 2 and collected into a new list."
      },
      {
        id: "d13q2",
        question: "Where does the filtering condition go in a list comprehension?",
        options: [
          "Before the opening bracket",
          "At the end, after `for item in iterable`",
          "Inside the iterable name",
          "Comprehensions cannot filter"
        ],
        correctIndex: 1,
        explanation: "The syntax is `[expression for item in iterable if condition]`."
      }
    ]
  },
  14: {
    dayId: 14,
    phase: "Week 2 · Data & Functions",
    estimatedMinutes: 25,
    concepts: ["try/except", "KeyError", "finally"],
    starterCode: `# Day 14: Safely look up dictionary keys with try/except
def safe_lookup(data, key):
    try:
        return data[key]
    except KeyError:
        return f"Missing key: '{key}'"
    finally:
        print(f"Lookup attempted for '{key}'")

profile = {"user": "neo", "level": 14}
print(safe_lookup(profile, "user"))
print(safe_lookup(profile, "email"))`,
    solutionCode: `def get_value(d, key):
    try:
        print(d[key])
    except KeyError:
        print("Key not found!")

get_value({"a": 1}, "b")`,
    checkHint: "Use try and except KeyError inside a function to handle a missing key gracefully.",
    validation: { requireOutputLines: 1, codeMustInclude: ["try:", "except KeyError"] },
    quiz: [
      {
        id: "d14q1",
        question: "When does the `finally` block run?",
        options: [
          "Only when an exception occurs",
          "Only when no exception occurs",
          "Always, whether an exception occurred or not",
          "Only when `break` is used"
        ],
        correctIndex: 2,
        explanation: "finally always runs, making it ideal for cleanup actions like closing files."
      },
      {
        id: "d14q2",
        question: "Which exception is raised by `10 / 0`?",
        options: ["ValueError", "ZeroDivisionError", "TypeError", "ArithmeticOverflow"],
        correctIndex: 1,
        explanation: "Dividing any number by zero raises ZeroDivisionError."
      }
    ]
  },
  15: {
    dayId: 15,
    phase: "Week 3 · Modules & OOP",
    estimatedMinutes: 25,
    concepts: ["with open()", "write/read modes", "context managers"],
    starterCode: `# Day 15: Format lines for saving to bands.txt
bands = ["Radiohead", "Daft Punk", "Khruangbin"]
file_content = "\\n".join(bands)

print("--- Simulated bands.txt ---")
print(file_content)
print("Total lines:", len(bands))`,
    solutionCode: `bands = ["Linkin Park", "Tame Impala", "Massive Attack"]
for idx, band in enumerate(bands, 1):
    print(f"{idx}. {band}")`,
    checkHint: "Prepare and display 3 favorite bands formatted on separate lines (run with open() locally on disk).",
    validation: { requireOutputLines: 3, codeMustInclude: ["bands"] },
    quiz: [
      {
        id: "d15q1",
        question: "Why should you open files with `with open(...) as f:`?",
        options: [
          "It encrypts the file",
          "It automatically closes the file even if an exception occurs",
          "It makes the file read-only",
          "It is required to read JSON"
        ],
        correctIndex: 1,
        explanation: "Context managers guarantee the file handle is closed cleanly when exiting the `with` block."
      },
      {
        id: "d15q2",
        question: "Which mode appends text to the end of an existing file without erasing it?",
        options: ["'r'", "'w'", "'a'", "'x'"],
        correctIndex: 2,
        explanation: "'a' opens for appending; 'w' truncates/overwrites existing file contents."
      }
    ]
  },
  16: {
    dayId: 16,
    phase: "Week 3 · Modules & OOP",
    estimatedMinutes: 20,
    concepts: ["import", "from ... import", "math", "random"],
    starterCode: `# Day 16: Simulate rolling a 6-sided die with random
import math
import random

roll = random.randint(1, 6)
print(f"You rolled a {roll}!")
print("sqrt(81) =", math.sqrt(81))`,
    solutionCode: `import random

die = random.randint(1, 6)
print("Die roll:", die)`,
    checkHint: "Import random and use random.randint(1, 6) to roll a 6-sided die.",
    validation: { requireOutputLines: 1, codeMustInclude: ["import random", "randint"] },
    quiz: [
      {
        id: "d16q1",
        question: "Why shouldn't you name your own script `random.py`?",
        options: [
          "Python forbids 6-letter filenames",
          "It shadows the standard library `random` module when importing",
          "It runs slower",
          "It causes a syntax error on line 1"
        ],
        correctIndex: 1,
        explanation: "Python searches the current directory first, so `random.py` shadows the built-in module."
      },
      {
        id: "d16q2",
        question: "How do you import only `sqrt` from the `math` module?",
        options: [
          "import sqrt from math",
          "from math import sqrt",
          "math.import(sqrt)",
          "use math::sqrt"
        ],
        correctIndex: 1,
        explanation: "`from module import name` brings a specific symbol directly into scope."
      }
    ]
  },
  17: {
    dayId: 17,
    phase: "Week 3 · Modules & OOP",
    estimatedMinutes: 20,
    concepts: ["venv", "pip", "requirements.txt", "isolation"],
    starterCode: `# Day 17: Build a requirements manifest & venv command cheatsheet
packages = {"requests": "2.32.3", "pytest": "8.3.4", "rich": "13.9.4"}

print("Create venv: python3 -m venv .venv")
print("Activate (macOS/Linux): source .venv/bin/activate")
print("--- requirements.txt ---")
for pkg, ver in packages.items():
    print(f"{pkg}=={ver}")`,
    solutionCode: `deps = ["requests==2.32.3", "flask==3.1.0"]
print("python3 -m venv .venv")
for dep in deps:
    print(dep)`,
    checkHint: "Format your project's pinned dependencies and venv activation steps.",
    validation: { requireOutputLines: 2, codeMustInclude: ["venv"] },
    quiz: [
      {
        id: "d17q1",
        question: "What command creates a virtual environment named `venv`?",
        options: [
          "pip create venv",
          "python -m venv venv",
          "venv init",
          "python install venv"
        ],
        correctIndex: 1,
        explanation: "The built-in `venv` module is invoked via `python -m venv <folder>`."
      },
      {
        id: "d17q2",
        question: "What problem do virtual environments primarily solve?",
        options: [
          "Speeding up CPU clock rates",
          "Isolating per-project package versions so projects don't conflict",
          "Compiling Python to C",
          "Replacing Git"
        ],
        correctIndex: 1,
        explanation: "Virtual environments isolate installed dependencies per project."
      }
    ]
  },
  18: {
    dayId: 18,
    phase: "Week 3 · Modules & OOP",
    estimatedMinutes: 25,
    concepts: ["HTTP GET", "status_code", "JSON response"],
    starterCode: `# Day 18: Parse a mock PokeAPI JSON response
import json

mock_response = '{"name": "pikachu", "weight": 60, "types": ["electric"]}'
status_code = 200

if status_code == 200:
    pokemon = json.loads(mock_response)
    print(f"Pokemon: {pokemon['name'].title()}")
    print(f"Weight: {pokemon['weight']}")`,
    solutionCode: `import json

raw = '{"name": "pikachu", "weight": 60}'
data = json.loads(raw)
print(data["name"], "weight:", data["weight"])`,
    checkHint: "Parse a JSON API payload for 'pikachu' and print its weight.",
    validation: { requireOutputLines: 1, codeMustInclude: ["json.loads"], outputMustInclude: ["60"] },
    quiz: [
      {
        id: "d18q1",
        question: "Which HTTP status code indicates a successful GET request?",
        options: ["200", "301", "404", "500"],
        correctIndex: 0,
        explanation: "HTTP 200 OK means the request succeeded."
      },
      {
        id: "d18q2",
        question: "In the `requests` library, what does `response.json()` return?",
        options: [
          "Raw bytes",
          "Parsed Python objects (dict/list)",
          "An HTML page",
          "A file path"
        ],
        correctIndex: 1,
        explanation: "`response.json()` deserializes the JSON body into Python dictionaries and lists."
      }
    ]
  },
  19: {
    dayId: 19,
    phase: "Week 3 · Modules & OOP",
    estimatedMinutes: 20,
    concepts: ["class", "instances", "OOP blueprints"],
    starterCode: `# Day 19: Define a Car class and instantiate two objects
class Car:
    wheels = 4

car1 = Car()
car2 = Car()
print(type(car1))
print("Wheels:", car1.wheels, "| Distinct objects:", car1 is not car2)`,
    solutionCode: `class Car:
    pass

car1 = Car()
car2 = Car()
print(car1)
print(car2)`,
    checkHint: "Define class Car and create two instances car1 and car2.",
    validation: { requireOutputLines: 1, codeMustInclude: ["class Car", "Car()"] },
    quiz: [
      {
        id: "d19q1",
        question: "What is the relationship between a Class and an Object?",
        options: [
          "They are unrelated",
          "A class is the blueprint; an object is a concrete instance built from it",
          "An object is a blueprint for a class",
          "Classes can only create one object"
        ],
        correctIndex: 1,
        explanation: "You define a class once and instantiate as many independent objects from it as needed."
      },
      {
        id: "d19q2",
        question: "What naming convention does PEP 8 recommend for Python classes?",
        options: ["snake_case", "SCREAMING_SNAKE", "PascalCase (CapWords)", "kebab-case"],
        correctIndex: 2,
        explanation: "PEP 8 uses CapWords / PascalCase (e.g., `ShoppingCart`) for class names."
      }
    ]
  },
  20: {
    dayId: 20,
    phase: "Week 3 · Modules & OOP",
    estimatedMinutes: 25,
    concepts: ["__init__", "self", "instance methods"],
    starterCode: `# Day 20: Car class with __init__ and drive() method
class Car:
    def __init__(self, make, year):
        self.make = make
        self.year = year

    def drive(self):
        print(f"The {self.year} {self.make} is driving!")

my_car = Car("Rivian", 2026)
my_car.drive()`,
    solutionCode: `class Car:
    def __init__(self, make, year):
        self.make = make
        self.year = year

    def drive(self):
        print(f"The {self.make} is driving!")

car = Car("Toyota", 2025)
car.drive()`,
    checkHint: "Add __init__(self, make, year) and a drive(self) method to Car, then call drive().",
    validation: { requireOutputLines: 1, codeMustInclude: ["def __init__", "def drive"], outputMustInclude: ["driving"] },
    quiz: [
      {
        id: "d20q1",
        question: "What does `self` refer to inside an instance method?",
        options: [
          "The global module",
          "The specific object instance the method was called on",
          "The parent class only",
          "The Python interpreter"
        ],
        correctIndex: 1,
        explanation: "Python passes the current object instance as the first argument (`self`) automatically."
      },
      {
        id: "d20q2",
        question: "When does `__init__` run?",
        options: [
          "When you delete an object",
          "Automatically whenever a new instance of the class is created",
          "Only when called manually",
          "Once when the file is imported"
        ],
        correctIndex: 1,
        explanation: "`__init__` initializes each newly created instance's attributes."
      }
    ]
  },
  21: {
    dayId: 21,
    phase: "Week 3 · Modules & OOP",
    estimatedMinutes: 25,
    concepts: ["inheritance", "overriding", "super()"],
    starterCode: `# Day 21: Vehicle -> ElectricCar inheritance
class Vehicle:
    def __init__(self, brand):
        self.brand = brand

    def start_engine(self):
        print(f"{self.brand}: Powering on...")

class ElectricCar(Vehicle):
    def check_range(self):
        print(f"{self.brand}: 320 miles remaining.")

ev = ElectricCar("Lucid")
ev.start_engine()
ev.check_range()`,
    solutionCode: `class Vehicle:
    def start_engine(self):
        print("Engine started.")

class ElectricCar(Vehicle):
    def check_range(self):
        print("Range: 300 miles.")

ev = ElectricCar()
ev.start_engine()
ev.check_range()`,
    checkHint: "Have ElectricCar inherit from Vehicle, add check_range(), and call both inherited and child methods.",
    validation: { requireOutputLines: 2, codeMustInclude: ["class ElectricCar(Vehicle)", "check_range", "start_engine"] },
    quiz: [
      {
        id: "d21q1",
        question: "How does `Dog` inherit from `Animal` in Python?",
        options: [
          "class Dog extends Animal:",
          "class Dog(Animal):",
          "class Dog -> Animal:",
          "class Dog inherits Animal:"
        ],
        correctIndex: 1,
        explanation: "Parent classes are listed in parentheses after the child class name."
      },
      {
        id: "d21q2",
        question: "What is `super()` used for?",
        options: [
          "Making a class private",
          "Calling a method from the parent class inside a child class",
          "Creating a global variable",
          "Boosting execution speed"
        ],
        correctIndex: 1,
        explanation: "`super()` delegates method calls (commonly `__init__`) up to the parent class."
      }
    ]
  },
  22: {
    dayId: 22,
    phase: "Week 4 · Modern Python & Capstone",
    estimatedMinutes: 25,
    concepts: ["dunder methods", "__str__", "__len__"],
    starterCode: `# Day 22: Rectangle with __str__
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def __str__(self):
        return f"A {self.width}x{self.height} Rectangle."

rect = Rectangle(12, 8)
print(rect)`,
    solutionCode: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def __str__(self):
        return f"A {self.width}x{self.height} Rectangle."

print(Rectangle(5, 10))`,
    checkHint: "Implement __str__ on Rectangle so print(rect) outputs 'A <w>x<h> Rectangle.'.",
    validation: { requireOutputLines: 1, codeMustInclude: ["def __str__"], outputMustInclude: ["Rectangle"] },
    quiz: [
      {
        id: "d22q1",
        question: "Which magic method controls how `print(obj)` displays your object?",
        options: ["__print__", "__str__", "__show__", "__format_out__"],
        correctIndex: 1,
        explanation: "`print()` calls `str(obj)`, which invokes `obj.__str__()`."
      },
      {
        id: "d22q2",
        question: "Which magic method enables `len(my_obj)`?",
        options: ["__size__", "__count__", "__len__", "__length__"],
        correctIndex: 2,
        explanation: "Defining `__len__(self)` lets Python's built-in `len()` work on your class."
      }
    ]
  },
  23: {
    dayId: 23,
    phase: "Week 4 · Modern Python & Capstone",
    estimatedMinutes: 25,
    concepts: ["decorators", "higher-order functions", "@syntax"],
    starterCode: `# Day 23: Create an emphasis decorator
def emphasis(func):
    def wrapper():
        print("-----------------")
        func()
        print("-----------------")
    return wrapper

@emphasis
def announce():
    print("Python decorators are clean!")

announce()`,
    solutionCode: `def emphasis(func):
    def wrapper():
        print("-----------------")
        func()
        print("-----------------")
    return wrapper

@emphasis
def hello():
    print("Hello!")

hello()`,
    checkHint: "Define an emphasis decorator that prints dashed lines before and after calling func().",
    validation: { requireOutputLines: 3, codeMustInclude: ["@emphasis", "def emphasis"], outputMustInclude: ["---"] },
    quiz: [
      {
        id: "d23q1",
        question: "What is `@log_call` placed above `def say_hi():` equivalent to?",
        options: [
          "say_hi = log_call(say_hi)",
          "log_call = say_hi()",
          "import log_call",
          "say_hi.call(log_call)"
        ],
        correctIndex: 0,
        explanation: "The `@decorator` syntax is syntactic sugar for wrapping the function and rebinding its name."
      },
      {
        id: "d23q2",
        question: "What is a common real-world use case for decorators?",
        options: [
          "Declaring integer types",
          "Cross-cutting concerns like logging, timing, auth checks, and caching",
          "Replacing for loops",
          "Creating virtual environments"
        ],
        correctIndex: 1,
        explanation: "Decorators cleanly attach reusable pre/post behavior without cluttering the wrapped function."
      }
    ]
  },
  24: {
    dayId: 24,
    phase: "Week 4 · Modern Python & Capstone",
    estimatedMinutes: 25,
    concepts: ["generators", "yield", "lazy iteration"],
    starterCode: `# Day 24: Generator for even numbers up to max_val
def even_numbers(max_val):
    n = 0
    while n <= max_val:
        yield n
        n += 2

evens = list(even_numbers(10))
print("Evens:", evens)`,
    solutionCode: `def even_numbers(limit):
    for n in range(0, limit + 1, 2):
        yield n

for num in even_numbers(10):
    print(num)`,
    checkHint: "Use `yield` inside `even_numbers` to lazily produce even integers from 0 up to your limit.",
    validation: { requireOutputLines: 1, codeMustInclude: ["yield "], outputMustInclude: ["0", "2", "4"] },
    quiz: [
      {
        id: "d24q1",
        question: "How does `yield` differ from `return`?",
        options: [
          "yield deletes all local variables",
          "yield produces a value and pauses function state until the next item is requested",
          "yield only works with strings",
          "There is no difference"
        ],
        correctIndex: 1,
        explanation: "Generators suspend execution at `yield` and resume right after it on the next `next()` call."
      },
      {
        id: "d24q2",
        question: "Why are generators preferred for huge sequences?",
        options: [
          "They use O(1) memory by producing one item at a time instead of storing the whole list",
          "They sort data automatically",
          "They run on the GPU",
          "They prevent all runtime errors"
        ],
        correctIndex: 0,
        explanation: "Lazy evaluation avoids allocating a massive list in memory all at once."
      }
    ]
  },
  25: {
    dayId: 25,
    phase: "Week 4 · Modern Python & Capstone",
    estimatedMinutes: 20,
    concepts: ["lambda", "map()", "filter()"],
    starterCode: `# Day 25: Lambda sum + map/filter
add = lambda a, b: a + b
print("10 + 20 =", add(10, 20))

nums = [1, 2, 3, 4, 5, 6]
evens = list(filter(lambda x: x % 2 == 0, nums))
print("Evens:", evens)`,
    solutionCode: `add = lambda x, y: x + y
print(add(10, 20))`,
    checkHint: "Create a lambda that sums two numbers and print its output for (10, 20) -> 30.",
    validation: { requireOutputLines: 1, codeMustInclude: ["lambda "], outputMustInclude: ["30"] },
    quiz: [
      {
        id: "d25q1",
        question: "How many expressions can a Python `lambda` body contain?",
        options: ["Unlimited statements", "Exactly one expression", "Up to three lines", "Only boolean checks"],
        correctIndex: 1,
        explanation: "Lambdas are limited to a single expression whose value is implicitly returned."
      },
      {
        id: "d25q2",
        question: "What does `list(map(lambda x: x + 1, [1, 2, 3]))` return?",
        options: ["[1, 2, 3]", "[2, 3, 4]", "[1, 4, 9]", "6"],
        correctIndex: 1,
        explanation: "`map` applies the lambda to every element of the iterable."
      }
    ]
  },
  26: {
    dayId: 26,
    phase: "Week 4 · Modern Python & Capstone",
    estimatedMinutes: 20,
    concepts: ["datetime", "strftime", "timedelta"],
    starterCode: `# Day 26: Days remaining until New Year's Day
from datetime import datetime, timedelta

now = datetime.now()
next_year = datetime(now.year + 1, 1, 1)
days_left = (next_year - now).days

print("Today:", now.strftime("%Y-%m-%d"))
print(f"There are {days_left} days left in the year.")`,
    solutionCode: `from datetime import datetime

now = datetime.now()
new_year = datetime(now.year + 1, 1, 1)
remaining = (new_year - now).days
print(f"There are {remaining} days left in the year.")`,
    checkHint: "Use datetime.now() and subtract to print how many days are left in the year.",
    validation: { requireOutputLines: 1, codeMustInclude: ["datetime"], outputMustInclude: ["days left"] },
    quiz: [
      {
        id: "d26q1",
        question: "Which method formats a `datetime` object into a custom string like `'2026-11-24'`?",
        options: [".format_date()", ".strftime()", ".strptime()", ".tostring()"],
        correctIndex: 1,
        explanation: "`strftime` (string format time) converts a datetime into formatted text."
      },
      {
        id: "d26q2",
        question: "Which class represents a duration you can add to or subtract from a `datetime`?",
        options: ["timespan", "timedelta", "duration", "interval"],
        correctIndex: 1,
        explanation: "`datetime.timedelta(days=7)` represents a time difference for date arithmetic."
      }
    ]
  },
  27: {
    dayId: 27,
    phase: "Week 4 · Modern Python & Capstone",
    estimatedMinutes: 25,
    concepts: ["re.findall", "raw strings r''", "character classes"],
    starterCode: `# Day 27: Find all capitalized words using regex
import re

sentence = "Python was created by Guido van Rossum in Amsterdam."
capitalized = re.findall(r"\\b[A-Z][a-z]+\\b", sentence)
print("Capitalized words:", capitalized)`,
    solutionCode: `import re

text = "Learning Python at Neal Frazier Tech in Virginia."
words = re.findall(r"\\b[A-Z][a-z]*\\b", text)
print(words)`,
    checkHint: "Use re.findall with a raw regex string r'...' to extract capitalized words.",
    validation: { requireOutputLines: 1, codeMustInclude: ["import re", "re.findall"] },
    quiz: [
      {
        id: "d27q1",
        question: "Why should regex patterns be written as raw strings (`r'\\d+'`)?",
        options: [
          "Raw strings run 10x faster",
          "Python won't interpret backslashes as string escape sequences before regex sees them",
          "Regex fails without double quotes",
          "Raw strings ignore case automatically"
        ],
        correctIndex: 1,
        explanation: "Raw strings pass backslashes verbatim to the `re` engine."
      },
      {
        id: "d27q2",
        question: "What does `\\d+` match in a regular expression?",
        options: [
          "A single letter",
          "One or more consecutive digits",
          "Zero digits only",
          "Whitespace characters"
        ],
        correctIndex: 1,
        explanation: "`\\d` matches any digit 0–9 and `+` repeats it one or more times."
      }
    ]
  },
  28: {
    dayId: 28,
    phase: "Week 4 · Modern Python & Capstone",
    estimatedMinutes: 20,
    concepts: ["json.loads", "json.dumps", "indent"],
    starterCode: `# Day 28: Serialize a pizza dictionary to pretty JSON
import json

pizza = {
    "name": "Margherita",
    "toppings": ["mozzarella", "basil", "san marzano"],
    "price": 14.50
}

pretty_json = json.dumps(pizza, indent=2)
print(pretty_json)`,
    solutionCode: `import json

pizza = {"name": "Pepperoni", "toppings": ["cheese", "pepperoni"], "price": 16.0}
print(json.dumps(pizza, indent=4))`,
    checkHint: "Use json.dumps(pizza, indent=...) to serialize your pizza dict and print it.",
    validation: { requireOutputLines: 1, codeMustInclude: ["import json", "json.dumps"], outputMustInclude: ["toppings"] },
    quiz: [
      {
        id: "d28q1",
        question: "Which function converts a JSON string into a Python dictionary?",
        options: ["json.dumps()", "json.loads()", "json.parse()", "json.to_dict()"],
        correctIndex: 1,
        explanation: "`json.loads()` ('load string') parses a JSON string into Python objects."
      },
      {
        id: "d28q2",
        question: "What does `indent=4` do in `json.dumps(data, indent=4)`?",
        options: [
          "Limits nesting to 4 levels",
          "Pretty-prints the JSON output with 4-space indentation",
          "Skips the first 4 keys",
          "Compresses the string"
        ],
        correctIndex: 1,
        explanation: "The `indent` parameter formats JSON across multiple readable lines."
      }
    ]
  },
  29: {
    dayId: 29,
    phase: "Week 4 · Modern Python & Capstone",
    estimatedMinutes: 30,
    concepts: ["architecture", "data modeling", "function contracts"],
    starterCode: `# Day 29: Prototype the Personal Finance Tracker data model
expenses = [
    {"amount": 12.50, "category": "Food", "date": "2026-11-20"},
    {"amount": 45.00, "category": "Books", "date": "2026-11-21"},
    {"amount": 18.75, "category": "Food", "date": "2026-11-22"}
]

def add_expense(records, amount, category, date):
    records.append({"amount": amount, "category": category, "date": date})

def total_spent(records):
    return sum(item["amount"] for item in records)

add_expense(expenses, 9.25, "Coffee", "2026-11-24")
print("Recorded items:", len(expenses))
print(f"Total spent: \${total_spent(expenses):.2f}")`,
    solutionCode: `expenses = []

def add_expense(records, amount, category, date):
    records.append({"amount": amount, "category": category, "date": date})

def view_summary(records):
    total = sum(e["amount"] for e in records)
    print(f"Count: {len(records)}, Total: {total}")

add_expense(expenses, 20.0, "Groceries", "2026-11-24")
view_summary(expenses)`,
    checkHint: "Define add_expense and a summary/total function operating on a list of expense dictionaries.",
    validation: { requireOutputLines: 1, codeMustInclude: ["def add_expense", "expenses"] },
    quiz: [
      {
        id: "d29q1",
        question: "Why is a list of dictionaries a good fit for storing expenses before JSON export?",
        options: [
          "Dictionaries cannot store numbers",
          "Lists of dicts map directly to JSON arrays of objects without custom serializers",
          "Lists are immutable",
          "JSON only supports tuples"
        ],
        correctIndex: 1,
        explanation: "Python lists and dicts with primitive values serialize cleanly via `json.dumps()`."
      },
      {
        id: "d29q2",
        question: "Why separate `save_data()` and `add_expense()` into distinct functions?",
        options: [
          "Python forbids >10 lines per function",
          "Separation of concerns makes each piece easier to test and reuse",
          "It eliminates the need for variables",
          "JSON requires separate files"
        ],
        correctIndex: 1,
        explanation: "Single-responsibility functions keep logic testable and maintainable."
      }
    ]
  },
  30: {
    dayId: 30,
    phase: "Week 4 · Modern Python & Capstone",
    estimatedMinutes: 35,
    concepts: ["capstone", "aggregation", "JSON export", "refactoring"],
    starterCode: `# Day 30: Complete Personal Finance Tracker summary + JSON export
import json

expenses = [
    {"amount": 14.50, "category": "Food"},
    {"amount": 60.00, "category": "Transport"},
    {"amount": 22.00, "category": "Food"},
    {"amount": 35.00, "category": "Learning"}
]

def summarize_by_category(records):
    totals = {}
    for item in records:
        cat = item["category"]
        totals[cat] = totals.get(cat, 0) + item["amount"]
    return totals

summary = summarize_by_category(expenses)
grand_total = sum(summary.values())

for cat, amt in summary.items():
    print(f"{cat}: \${amt:.2f}")
print(f"Grand Total: \${grand_total:.2f}")
print(json.dumps(summary))`,
    solutionCode: `import json

expenses = [
    {"amount": 15.0, "category": "Food"},
    {"amount": 40.0, "category": "Tools"},
    {"amount": 10.0, "category": "Food"}
]

totals = {}
for e in expenses:
    c = e["category"]
    totals[c] = totals.get(c, 0) + e["amount"]

print("Totals:", totals)
print("JSON:", json.dumps(totals))`,
    checkHint: "Aggregate expenses by category, compute the grand total, and serialize the summary to JSON.",
    validation: { requireOutputLines: 2, codeMustInclude: ["json.dumps"], outputMustInclude: ["Food"] },
    quiz: [
      {
        id: "d30q1",
        question: "What does `totals[cat] = totals.get(cat, 0) + amount` accomplish?",
        options: [
          "Deletes the category key",
          "Safely accumulates category totals starting from 0 when a category appears for the first time",
          "Sorts categories alphabetically",
          "Divides amount by zero"
        ],
        correctIndex: 1,
        explanation: "Using `.get(cat, 0)` avoids a KeyError on the first occurrence of each category."
      },
      {
        id: "d30q2",
        question: "Which workflow helps keep a larger Python project reliable as you build it?",
        options: [
          "Write 500 lines before running anything",
          "Build incrementally, test small pieces often, and refactor repeated logic into functions",
          "Put all values in global variables",
          "Catch all errors with empty `except: pass`"
        ],
        correctIndex: 1,
        explanation: "Incremental testing and small focused functions catch bugs early and keep code readable."
      }
    ]
  }
};
