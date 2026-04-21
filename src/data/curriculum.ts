export interface Lesson {
  id: number;
  title: string;
  summary: string;
  content: string;
}

export const CURRICULUM: Lesson[] = [
  {
    "id": 1,
    "title": "Getting Started & Print",
    "summary": "Welcome to Python! Learn how to output text and get comfortable with your environment.",
    "content": "# Day 1: Hello, Python!\n\nWelcome to Day 1 of your 30-day Python journey! Python is a powerful, readable, and incredibly popular programming language used for everything from web development to Artificial Intelligence.\n\n## Why Python?\nPython is often called a \"batteries-included\" language because it comes with built-in tools for almost any task. It's used by Google, NASA, and Netflix. Its syntax is designed to be as close to English as possible, making it one of the easiest languages for beginners.\n\n## The `print()` Function\n\nThe most basic instruction in Python is `print()`. It tells the computer to output something to the screen. \n\n### Usage:\n```python\nprint(\"Hello, World!\")\n```\n\n### Multiple Arguments:\nYou can pass multiple things to `print()`, separated by commas. Python will automatically add a space between them.\n```python\nprint(\"I am\", 25, \"years old.\")\n```\n\n### Formatting output:\nYou can change how items are separated using the `sep` argument:\n```python\nprint(\"Apple\", \"Banana\", \"Cherry\", sep=\" | \")\n# Output: Apple | Banana | Cherry\n```\n\n--- \n### 💡 Pro-Tip: Quotes\nYou can use single quotes (`'`) or double quotes (`\"`) for text. Just make sure you use the same one at the start and the end!\n\n### 🛠️ Your Task\nOpen your terminal and create a file named `hello.py`. Write a program that prints your name, your dream job, and a fun fact about yourself on separate lines."
  },
  {
    "id": 2,
    "title": "Variables & Data Types",
    "summary": "Understand how to store data using variables and learn about basic types.",
    "content": "# Day 2: Variables & Types\n\nThink of a **variable** as a labeled box in your computer's memory. You can put things in the box and use the label to find them later.\n\n## Assignment\nIn Python, we use the `=` sign to create a variable. This is called **assignment**.\n```python\nscore = 100\nplayer_name = \"Neo\"\n```\n\n## Naming Rules\n1. Names can contain letters, numbers, and underscores (`_`).\n2. They **cannot** start with a number.\n3. They are **case-sensitive** (`Score` and `score` are different variables).\n4. Avoid \"Reserved Words\" (like `print`, `if`, `for`).\n\n## Basic Data Types\n\n1. **Strings (`str`)**: Text, wrapped in quotes. \n   - `\"Hello\"` or `'World'`\n2. **Integers (`int`)**: Whole numbers (positive, negative, or zero). \n   - `42`, `-7`\n3. **Floats (`float`)**: Decimal numbers. \n   - `3.14159`, `-0.01`\n4. **Booleans (`bool`)**: Logic gates. True or False. \n   - `True`, `False` (Capitalization matters!)\n\n## The `type()` Function\nNot sure what a variable is? Ask Python!\n```python\nx = 5.0\nprint(type(x))  # <class 'float'>\n```\n\n--- \n### ⚠️ Common Pitfall: Type Matching\nYou generally can't add a string and a number together directly:\n`\"Age: \" + 25` will cause an error! You must convert them or use f-strings (which we'll learn on Day 4).\n\n### 🛠️ Your Task\nDefine a variable for a fruit name, its price (as a float), and a boolean indicating if it's organic. Print the `type()` of each one."
  },
  {
    "id": 3,
    "title": "Basic Math & Operators",
    "summary": "Perform calculations using Python's built-in math operators.",
    "content": "# Day 3: Math & Operators\n\nPython acts like a super-calculator. Understanding operators is crucial for data analysis and game physics.\n\n## The Arithmetic Operators\n\n- **Addition (`+`)**: `5 + 3` is `8`\n- **Subtraction (`-`)**: `10 - 2` is `8`\n- **Multiplication (`*`)**: `4 * 2` is `8`\n- **Division (`/`)**: `16 / 2` is `8.0`. **Important**: Division always results in a `float` in Python 3.\n- **Floor Division (`//`)**: `17 // 3` is `5`. It discards the decimal.\n- **Modulo (`%`)**: `17 % 3` is `2`. This gives you the **remainder** (17 divided by 3 is 5 with 2 left over).\n- **Exponent (`**`)**: `2 ** 3` is `8`. (2 to the power of 3).\n\n## Order of Operations\nPython follows standard math hierarchy (PEMDAS/BODMAS):\n1. Parentheses `()`\n2. Exponents `**`\n3. Multiplication/Division `*`, `/`, `//`, `%`\n4. Addition/Subtraction `+`, `-`\n\n## Shortcut Assignments\n```python\nx = 10\nx += 5  # Same as x = x + 5\nx *= 2  # Same as x = x * 2\n```\n\n--- \n### 💡 Why Modulo matters?\nThe modulo operator is incredibly useful for:\n- Checking if a number is even/odd (`num % 2 == 0`)\n- Cycling through indices (e.g., in a carousel or loop)\n\n### 🛠️ Your Task\nCalculate the area of a circle with a radius of 7 using the formula: `area = 3.14 * (r ** 2)`. Use variables and print the result."
  },
  {
    "id": 4,
    "title": "Strings & Formatting",
    "summary": "Master text manipulation and f-strings.",
    "content": "# Day 4: Strings & Formatting\n\nIn Python, strings are more than just text—they are objects with powerful methods.\n\n## String Methods\nMethods are built-in functions that live inside an object.\n```python\nmsg = \"learning python is FUN\"\n\nprint(msg.upper())    # \"LEARNING PYTHON IS FUN\"\nprint(msg.lower())    # \"learning python is fun\"\nprint(msg.title())    # \"Learning Python Is Fun\"\nprint(msg.replace(\"FUN\", \"AWESOME\"))\n```\n\n## Multi-line Strings\nUse triple quotes (`\"\"\"` or `'''`) to store blocks of text with line breaks preserved.\n```python\npoem = \"\"\"\nTwinkle, twinkle, little star,\nHow I wonder what you are!\n\"\"\"\n```\n\n## F-Strings (The Golden Standard)\nIntroduced in Python 3.6, **f-strings** are the cleanest way to insert variables into text. Just put an `f` before the first quote and use `{}` for variables.\n\n```python\nuser = \"Zelda\"\nscore = 999\nprint(f\"Hello {user}, your high score is {score}!\")\n```\n\n--- \n### 💡 String Slicing\nYou can grab parts of a string using `[]`. \n`text[0]` is the first letter. \n`text[0:5]` grabs indices 0 through 4.\n\n### 🛠️ Your Task\nCreate a variable `full_name` with your name. Print it in all caps, then lowercase, and finally use an f-string to say: \"My name is [NAME] and it has [LENGTH] characters.\" (Hint: use `len(full_name)`)."
  },
  {
    "id": 5,
    "title": "Conditionals (If/Elif/Else)",
    "summary": "Make your code make decisions based on rules.",
    "content": "# Day 5: Conditionals\n\nConditionals allow your program to branch and take different paths based on data.\n\n## Comparison Operators\nTo make a decision, we need to compare things:\n- `==` (Equal to) - **Note: Two equals!**\n- `!=` (Not equal to)\n- `>` (Greater than)\n- `<` (Less than)\n- `>=` / `<=` (Greater/Less than or equal to)\n\n## The `if` Statement\nPython uses **indentation** (4 spaces) to define what code belongs inside the condition.\n\n```python\nweather = \"rainy\"\n\nif weather == \"sunny\":\n    print(\"Go outside!\")\nelif weather == \"rainy\":\n    print(\"Bring an umbrella.\")\nelse:\n    print(\"Stay inside.\")\n```\n\n## Logic Operators\nYou can combine conditions using `and`, `or`, and `not`.\n- `and`: Both must be true.\n- `or`: At least one must be true.\n- `not`: Inverts the logic.\n\n```python\nif age >= 18 and has_id == True:\n    print(\"Access granted.\")\n```\n\n--- \n### ⚠️ The Indentation Error\nIf you forget to indent after an `if` statement, Python will crash. Indentation is not just for style in Python—it is part of the grammar!\n\n### 🛠️ Your Task\nWrite a program that takes a variable `temperature`. \n- If it's > 30, print \"It's hot!\"\n- If it's between 20 and 30, print \"It's nice.\"\n- If it's < 20, print \"It's chilly.\""
  },
  {
    "id": 6,
    "title": "Lists",
    "summary": "Store a sequence of items in a single variable.",
    "content": "# Day 6: Lists\n\nA list is an ordered collection of items. It's like a shopping list where each item has a specific position.\n\n## Creating and Accessing\nLists are defined using square brackets `[]`.\n```python\ntech = [\"Python\", \"React\", \"Tailwind\", \"Vite\"]\n\n# Accessing - Remember, counting starts at 0!\nprint(tech[0]) # \"Python\"\nprint(tech[-1]) # \"Vite\" (Negative index counts from the end)\n```\n\n## Modifying Lists\nLists are **mutable**, meaning you can change them after creation.\n```python\n# Update an item\ntech[1] = \"Next.js\"\n\n# Adding items\ntech.append(\"Firebase\") # Adds to the end\ntech.insert(0, \"JavaScript\") # Adds at index 0\n\n# Removing items\ntech.pop() # Removes the last item\ntech.remove(\"Python\") # Removes a specific value\n```\n\n## Checking Existence\n```python\nif \"Python\" in tech:\n    print(\"Found it!\")\n```\n\n--- \n### 💡 Useful Functions\n- `len(my_list)`: How many items?\n- `my_list.sort()`: Sort alphabetically/numerically.\n- `my_list.reverse()`: Flip the order.\n\n### 🛠️ Your Task\nCreate a list of 5 favorite movies. Add a new movie to the start, update one movie in the middle, and remove the last movie. Print the final list."
  },
  {
    "id": 7,
    "title": "For Loops",
    "summary": "Repeat blocks of code a specific number of times.",
    "content": "# Day 7: For Loops\n\nA `for` loop allows you to execute code once for each item in a collection (like a list or string).\n\n## Looping through a List\n```python\nfriends = [\"Alice\", \"Bob\", \"Charlie\"]\n\nfor friend in friends:\n    print(f\"Hello {friend}!\")\n```\nIn this example, `friend` is a temporary variable that holds a different name in each round of the loop.\n\n## Looping over a Range\nIf you want to repeat something a specific number of times, use `range()`.\n```python\n# range(start, stop, step)\nfor i in range(1, 6):\n    print(i) # Prints 1, 2, 3, 4, 5\n```\n\n## Looping over a String\n```python\nfor char in \"Python\":\n    print(char.upper())\n```\n\n--- \n### 💡 Nested Loops\nYou can put a loop inside another loop! This is how you work with grids or complex data structures.\n\n### 🛠️ Your Task\nWrite a for loop that calculates the sum of all numbers from 1 to 50. Use a variable `total = 0` and add each number to it in the loop."
  },
  {
    "id": 8,
    "title": "While Loops",
    "summary": "Repeat code while a condition remains true.",
    "content": "# Day 8: While Loops\n\nA `while` loop runs as long as a condition is `True`. It's used when we don't know exactly when to stop ahead of time (e.g., waiting for user input).\n\n## Basic Syntax\n```python\ncount = 5\nwhile count > 0:\n    print(f\"T-Minus {count}\")\n    count -= 1\nprint(\"Liftoff!\")\n```\n\n## Break and Continue\n- `break`: Stops the loop immediately.\n- `continue`: Skips the rest of the current round and moves to the next one.\n\n```python\nwhile True:\n    name = input(\"Enter your name (or 'quit' to exit): \")\n    if name == \"quit\":\n        break\n    print(f\"Hi {name}!\")\n```\n\n--- \n### ⚠️ The Infinite Loop\nIf your condition never becomes `False`, the loop will run forever until your computer runs out of memory or you force-close it (`Ctrl+C` in terminal). Always ensure there is a \"exit path\"!\n\n### 🛠️ Your Task\nWrite a while loop that asks the user to guess a secret number (e.g., 7). If they guess wrong, ask again. If they get it right, print \"Success!\" and end the loop."
  },
  {
    "id": 9,
    "title": "Dictionaries",
    "summary": "Store data in key-value pairs.",
    "content": "# Day 9: Dictionaries\n\nDictionaries are powerful data structures that store information in **Key:Value** pairs. Imagine a physical dictionary: you look up a word (Key) to find its definition (Value).\n\n## Creation and Access\n```python\ncar = {\n    \"brand\": \"Tesla\",\n    \"model\": \"Model S\",\n    \"year\": 2024\n}\n\n# Accessing a value\nprint(car[\"brand\"]) # \"Tesla\"\n```\n\n## Modifying\nDictionaries are mutable. You can add new keys or change existing ones.\n```python\n# Update\ncar[\"year\"] = 2025\n\n# Add\ncar[\"color\"] = \"Red\"\n\n# Delete\ndel car[\"model\"]\n```\n\n## Methods\n- `.keys()`: Get all keys.\n- `.values()`: Get all values.\n- `.items()`: Get key-value pairs as tuples (great for loops!).\n\n--- \n### 💡 Safe Accessing\nUsing `car[\"price\"]` will crash your app if \"price\" doesn't exist. \nUse `.get(\"price\", \"Not available\")` to return a default value instead of crashing.\n\n### 🛠️ Your Task\nCreate a dictionary representing a book with `title`, `author`, and `pages`. Add a `genre` field, update the number of pages, and print the entire dictionary."
  },
  {
    "id": 10,
    "title": "Tuples & Sets",
    "summary": "Learn about immutable tuples and unique sets.",
    "content": "# Day 10: Tuples & Sets\n\nWhile Lists and Dictionaries are the most common, **Tuples** and **Sets** serve specific, important roles in Python.\n\n## Tuples: The Immutable List\nTuples are like lists, but they **cannot be changed** once created. They use parentheses `()`.\n\n```python\n# Good for data that should never change (coordinates, RGB codes)\nlocation = (40.7128, 74.0060)\n```\n**Why use tuples?** They are faster than lists and provide data protection against accidental changes.\n\n## Sets: The Unique Collection\nSets are collections that are **unordered** and contain **no duplicates**. They use curly braces `{}`.\n\n```python\nlottery_numbers = {4, 12, 12, 42, 4}\nprint(lottery_numbers) # {4, 42, 12} (Duplicates are gone!)\n```\n**Why use sets?** They are perfect for removing duplicates from a list and performing \"Set Math\" like finding intersections or differences between two collections.\n\n--- \n### 🛠️ Your Task\nCreate a set of 5 fruit names, including two duplicates. Print the set to see the duplicates vanish. Then, create a tuple representing your birthday (year, month, day)."
  },
  {
    "id": 11,
    "title": "Functions",
    "summary": "Group reusable code into named blocks.",
    "content": "# Day 11: Functions\n\nFunctions are blocks of code that only run when called. They allow you to write logic once and reuse it hundreds of times. This follows the **DRY Principle** (Don't Repeat Yourself).\n\n## Defining a Function\nUse the `def` keyword.\n```python\ndef greet_user():\n    print(\"Welcome explorer!\")\n    print(\"Ready for Day 11?\")\n\ngreet_user() # Calling the function\n```\n\n## Arguments (Parameters)\nFunctions are more useful when you can pass data into them.\n```python\ndef greet(name, time_of_day):\n    print(f\"Good {time_of_day}, {name}!\")\n\ngreet(\"Alice\", \"morning\")\n```\n\n## Default Parameters\nYou can provide a backup value if the user forgets to send an argument.\n```python\ndef greet(name=\"Guest\"):\n    print(f\"Hello {name}\")\n```\n\n--- \n### 💡 Input vs Argument\nArguments are variables listed in the function definition. Parameters are the actual values you send to the function when you call it.\n\n### 🛠️ Your Task\nDefine a function called `calculate_area` that takes `width` and `height` as arguments and prints the resulting area. Call it with several different numbers."
  },
  {
    "id": 12,
    "title": "Scope & Return",
    "summary": "Pass data back from functions and understand variable lifespans.",
    "content": "# Day 12: Scope & Return\n\n## Return Values\nMost functions shouldn't just `print()` results. They should calculate something and **send it back** to the piece of code that called them using the `return` keyword.\n\n```python\ndef multiply(a, b):\n    return a * b\n\n# Now we can save the answer to a variable\nresult = multiply(10, 5)\nprint(result) # 50\n```\nOnce a `return` is reached, the function exits immediately. No code after the return will run.\n\n## Variable Scope\nNot all variables are accessible everywhere.\n- **Local Scope**: Variables defined *inside* a function belong to that function. They disappear when the function finishes.\n- **Global Scope**: Variables defined *outside* all functions are accessible to everyone.\n\n```python\nx = 10 # Global\n\ndef my_func():\n    y = 5 # Local\n    print(x + y) # Accessible\n\n# print(y) # CRASH! 'y' is not defined here.\n```\n\n--- \n### ⚠️ Global Rule\nTry to avoid using too many global variables. It makes your code harder to debug and test.\n\n### 🛠️ Your Task\nWrite a function `convert_to_minutes(hours)` that returns the total minutes. Call it and use the returned value to print: \"That is [X] minutes.\""
  },
  {
    "id": 13,
    "title": "List Comprehensions",
    "summary": "A 'pythonic' one-liner way to build lists.",
    "content": "# Day 13: List Comprehensions\n\nList comprehensions give you a short, elegant way to create a new list based on an existing list. It's often faster and more readable than a traditional for-loop.\n\n## The Syntax\n`[expression for item in iterable if condition]`\n\n## Examples\n\n### 1. Simple Transform\n```python\nnums = [1, 2, 3, 4]\nsquares = [n * n for n in nums]\n# Output: [1, 4, 9, 16]\n```\n\n### 2. With Filtering\n```python\nages = [10, 22, 15, 30, 45, 12]\nadults = [a for a in ages if a >= 18]\n# Output: [22, 30, 45]\n```\n\n### 3. Strings\n```python\nnames = [\"alice\", \"bob\", \"charlie\"]\ncaps = [name.upper() for name in names]\n```\n\n--- \n### 💡 Readability Tip\nWhile comprehensions are cool, don't make them too complex. If you have multiple nested conditions, a standard `for` loop might be more readable for your teammates.\n\n### 🛠️ Your Task\nStart with a list of numbers from 1 to 10. Use a list comprehension to create a new list containing only the **odd** numbers."
  },
  {
    "id": 14,
    "title": "Exception Handling",
    "summary": "Prevent crashes by catching errors gracefully.",
    "content": "# Day 14: Exception Handling\n\nBugs happen. A good programmer doesn't just avoid bugs—they handle them when they occur so the whole application doesn't crash.\n\n## The `try...except` Block\n```python\ntry:\n    number = int(input(\"Enter a number: \"))\n    print(10 / number)\nexcept ZeroDivisionError:\n    print(\"Error: You can't divide by zero!\")\nexcept ValueError:\n    print(\"Error: Please enter a valid whole number.\")\nexcept Exception as e:\n    print(f\"An unexpected error occurred: {e}\")\n```\n\n## Else and Finally\n- `else`: Runs only if **no** errors occurred.\n- `finally`: Runs **no matter what**. (Perfect for closing files or disconnects).\n\n```python\ntry:\n    print(\"Attempting calculation...\")\nexcept:\n    print(\"Oops.\")\nfinally:\n    print(\"Process finished.\")\n```\n\n--- \n### 🛠️ Your Task\nWrite a function that tries to access a key in a dictionary. Use `try...except KeyError` to handle the case where the key doesn't exist and print a friendly message instead of a crash."
  },
  {
    "id": 15,
    "title": "File I/O",
    "summary": "Read from and write to text files.",
    "content": "# Day 15: File Handling\n\nData is persistent. Files allow you to save your progress and read settings or databases.\n\n## Opening Files safely\nIn the old days, you had to manually close files. Today, we use the `with` keyword. It automatically closes the file for you, even if an error happens.\n\n### Writing\n```python\nwith open(\"diary.txt\", \"w\") as file:\n    file.write(\"Day 15: I learned how to save files!\\n\")\n    file.write(\"Python is awesome.\")\n```\n- `\"w\"`: Write (overwrites everything).\n- `\"a\"`: Append (adds to the end).\n\n### Reading\n```python\nwith open(\"diary.txt\", \"r\") as file:\n    content = file.read()\n    print(content)\n```\n\n--- \n### 💡 Reading Line by Line\nIf a file is huge (like 1GB), don't use `.read()`. Use a for loop:\n```python\nwith open(\"big_data.txt\", \"r\") as file:\n    for line in file:\n        print(line.strip())\n```\n\n### 🛠️ Your Task\nCreate a program that asks for your 3 favorite bands and saves them to a file named `bands.txt`, each on a new line."
  },
  {
    "id": 16,
    "title": "Modules & Imports",
    "summary": "Split your code and use built-in Python libraries.",
    "content": "# Day 16: Modules\n\nPython modules are just files containing code. You can use code written by others or organize your own project into multiple files.\n\n## Importing Standard Libraries\nPython comes with hundreds of built-in modules.\n```python\nimport math\nprint(math.sqrt(16)) # 4.0\n\nimport random\nprint(random.choice([\"Heads\", \"Tails\"]))\n```\n\n## Specific Imports\nIf you only need one or two things, use `from`.\n```python\nfrom datetime import datetime\nprint(datetime.now())\n```\n\n## Creating your own\nIf you have a file `my_logic.py` with a function `power()`, you can use it in another file:\n`import my_logic` -> `my_logic.power()`\n\n--- \n### ⚠️ Avoid Shadowing\nDon't name your files the same as standard modules. If you name your file `random.py`, `import random` will import your file instead of the official one, which will break everything!\n\n### 🛠️ Your Task\nUse the `random` module to simulate a rolling 6-sided die. Print the result."
  },
  {
    "id": 17,
    "title": "Virtual Environments",
    "summary": "Manage packages securely.",
    "content": "# Day 17: Virtual Environments (venv)\n\nAs you install external libraries, you may find that different projects need different versions. **Virtual Environments** are isolated containers for each project.\n\n## Creation\nIn your terminal (inside your project folder):\n```bash\npython -m venv venv\n```\n\n## Activation\n- **Mac/Linux**: `source venv/bin/activate`\n- **Windows**: `venv\\Scripts\\activate`\n\nOnce activated, you'll see `(venv)` in your terminal prompt. Anything you install with `pip` will now stay inside this one project.\n\n## Why it matters\nIf Project A needs `Requests 1.0` and Project B needs `Requests 2.0`, global installation would make one of them break. Virtual Envs solve this.\n\n--- \n### 🛠️ Your Task\nTry creating a virtual environment in a folder on your computer and activate it. (If you're on a school/work computer, check your permissions)."
  },
  {
    "id": 18,
    "title": "APIs & Requests",
    "summary": "Talk to the web using the requests library.",
    "content": "# Day 18: Web APIs & Requests\n\nAn **API** (Application Programming Interface) allows your Python code to talk to other services (Weather, Finance, Social Media).\n\n## The `requests` Library\nThis is the most popular library for making web requests. \n`pip install requests` (Inside your venv!)\n\n## Basic GET Request\n```python\nimport requests\n\nresponse = requests.get(\"https://api.github.com/users/octocat\")\n\nif response.status_code == 200:\n    data = response.json() # Turn JSON string into a Python Dictionary\n    print(f\"User: {data['name']}\")\n    print(f\"Bio: {data['bio']}\")\nelse:\n    print(\"Failed to reach API.\")\n```\n\n## JSON\nWebsites usually talk in JSON (JavaScript Object Notation). Luckily, it looks almost exactly like Python dictionaries!\n\n--- \n### 🛠️ Your Task\nLook up a free public API (like the Pokemon API `pokeapi.co`). Try to fetch data for \"pikachu\" and print its weight."
  },
  {
    "id": 19,
    "title": "Class & Objects",
    "summary": "Introduction to Object-Oriented Programming (OOP).",
    "content": "# Day 19: Classes & Objects\n\n**Object-Oriented Programming (OOP)** is a design pattern. Imagine a template for a user profile in a game. Instead of making 100 separate variables, we make one **Class** (the blueprint).\n\n## The Blueprint (Class)\n```python\nclass User:\n    pass\n```\n\n## The Instance (Object)\nAn object is a specific item built from that blueprint.\n```python\nuser1 = User()\nuser2 = User()\n```\n\n## Why use OOP?\nIt helps manage huge projects. Instead of a mess of logic, you have organized \"Entities\" (User, Product, Order, Enemy) that hold their own data and logic.\n\n--- \n### 🛠️ Your Task\nCreate a class named `Car` and create two objects from it (`car1` and `car2`). Right now they don't do anything, but they are valid objects!"
  },
  {
    "id": 20,
    "title": "Methods & Initializers",
    "summary": "Give your classes data and actions.",
    "content": "# Day 20: The `__init__` Method\n\nTo make our objects useful, we need to give them data when we create them. We use the `__init__` method (often called a **Constructor**).\n\n## The `__init__` Method\n```python\nclass Smartphone:\n    def __init__(self, brand, model, battery):\n        self.brand = brand      # self connects the data to the object\n        self.model = model\n        self.battery = battery\n\nphone1 = Smartphone(\"Apple\", \"iPhone 15\", 85)\nprint(phone1.model) # \"iPhone 15\"\n```\n`self` represents the specific object you just created. It allows the class to refer to \"my brand\" or \"my model\".\n\n## Custom Methods\nYou can add actions too!\n```python\n    def charge(self):\n        self.battery = 100\n        print(\"Fully charged!\")\n\nphone1.charge()\n```\n\n--- \n### 🛠️ Your Task\nUpdate your `Car` class from Day 19. Add an `__init__` method that takes `make` and `year`. Then add a `drive()` method that prints \"The [make] is driving!\""
  },
  {
    "id": 21,
    "title": "Inheritance",
    "summary": "Share behaviors between classes.",
    "content": "# Day 21: Inheritance\n\nInheritance allows a class (the Child) to gain all the behaviors and data of another class (the Parent). This prevents code duplication.\n\n## The Pattern\n```python\nclass Animal:\n    def eat(self):\n        print(\"Eating...\")\n\nclass Dog(Animal): # Dog inherits from Animal\n    def bark(self):\n        print(\"Woof!\")\n\nfido = Dog()\nfido.eat()  # Inherited from parent!\nfido.bark() # Unique to child\n```\n\n## Overriding\nA child can provide its own version of a method to \"overwrite\" the parent's version.\n```python\nclass Cat(Animal):\n    def eat(self):\n        print(\"Eating... like a cat.\")\n```\n\n--- \n### 💡 The `super()` Keyword\nIf you want the child to call the parent's version of a method *inside* its own method, use `super()`. \n`super().__init__(name)` is commonly used in constructors.\n\n### 🛠️ Your Task\nCreate a parent class `Vehicle` and a child class `ElectricCar`. The child should have a unique method `check_range()` and also inherit `start_engine()` from the parent."
  },
  {
    "id": 22,
    "title": "Magic Methods",
    "summary": "Make your objects interact nicely with python built-ins.",
    "content": "# Day 22: Magic Methods (Dunder)\n\nMagic methods (Double UNDERscore) allow your custom objects to work with built-in Python features like `print()`, `+`, or `len()`.\n\n## `__str__` (The String Representation)\nWithout this, `print(my_obj)` looks like `<__main__.Book object at 0x0...>`.\n```python\nclass Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n\n    def __str__(self):\n        return f\"{self.title} by {self.author}\"\n\nmy_book = Book(\"The Hobbit\", \"Tolkien\")\nprint(my_book) # Now prints beautifully!\n```\n\n## `__add__` (Operator Overloading)\nYou can define what happens when two objects are added together.\n```python\n    def __add__(self, other):\n        return Wallet(self.money + other.money)\n```\n\n--- \n### 💡 Most common dunders:\n- `__init__`: Constructor\n- `__str__`: User-friendly string\n- `__len__`: Returns length\n- `__getitem__`: Allows indexing like `obj[0]`\n\n### 🛠️ Your Task\nCreate a `Rectangle` class that has `width` and `height`. Implement `__str__` to print: \"A [width]x[height] Rectangle.\""
  },
  {
    "id": 23,
    "title": "Decorators",
    "summary": "Wrap functions to modify their behavior.",
    "content": "# Day 23: Decorators\n\nDecorators are a tool for \"wrapping\" a function inside another piece of code. This allows you to add features (like logging, timing, or security checks) to a function without modifying the function's code itself.\n\n## The Syntax (`@`)\n```python\ndef log_call(func):\n    def wrapper():\n        print(\"Function is starting...\")\n        func()\n        print(\"Function has finished.\")\n    return wrapper\n\n@log_call\ndef say_hi():\n    print(\"Hi!\")\n\nsay_hi()\n```\n\n## Real-world usage\n- **Authentication**: `@require_login` check before running a dashboard function.\n- **Timing**: Measure how many seconds a database call takes.\n- **Caching**: Store previous results so they don't have to be recalculated.\n\n--- \n### 🛠️ Your Task\nCreate a decorator `emphasis` that prints \"-----------------\" before and after a function's execution."
  },
  {
    "id": 24,
    "title": "Generators",
    "summary": "Yield data efficiently.",
    "content": "# Day 24: Generators\n\nStandard functions use `return` to send back a result and stop. **Generators** use `yield` to send back a result and **pause**. When called again, they start exactly where they left off.\n\n## Why use them?\n**Memory Efficiency.** If you need to work with a list of 10 million numbers, a standard list might crash your computer. A generator calculates each number one-by-one, using almost zero memory.\n\n```python\ndef get_countdown(num):\n    while num > 0:\n        yield num\n        num -= 1\n\nfor n in get_countdown(5):\n    print(n)\n```\n\n## The `next()` function\nYou can take items manually:\n```python\ng = get_countdown(3)\nprint(next(g)) # 3\nprint(next(g)) # 2\n```\n\n--- \n### 🛠️ Your Task\nWrite a generator function `even_numbers(max)` that yields even numbers from 0 up to a user-provided maximum."
  },
  {
    "id": 25,
    "title": "Lambda Functions",
    "summary": "Anonymous one-line functions.",
    "content": "# Day 25: Lambdas\n\nLambdas are tiny, unnamed functions that consist of a single expression. They are typically used for short tasks where a full `def` function would feel like \"too much\".\n\n## Syntax\n`lambda arguments: expression`\n\n## Usage\n```python\n# Standard way\ndef square(x): return x*x\n\n# Lambda way\nsquare = lambda x: x * x\nprint(square(5)) # 25\n```\n\n## Great with `map()` and `filter()`\n```python\n# Double everything in a list\nnums = [1, 2, 3]\ndoubled = list(map(lambda x: x * 2, nums))\n\n# Filter even numbers\nevends = list(filter(lambda x: x % 2 == 0, nums))\n```\n\n--- \n### 💡 Don't overuse them\nIf your logic is more than one line, use a regular `def` function. Code readability is more important than being clever!\n\n### 🛠️ Your Task\nWrite a lambda function that takes two numbers and returns their sum. Use it on `(10, 20)` and print the result."
  },
  {
    "id": 26,
    "title": "Datetime",
    "summary": "Work with time and dates.",
    "content": "# Day 26: Datetime\n\nTime is messy (time zones, leap years, formatting). Python's `datetime` module handles the complexity for you.\n\n## Getting the current time\n```python\nfrom datetime import datetime\n\nnow = datetime.now()\nprint(now) # 2024-04-20 12:00:00.123456\n```\n\n## Formatting (`strftime`)\nTurning a date object into a readable string.\n```python\n# %Y = Year, %m = Month, %d = Day, %H = Hour, %M = Minute\nprint(now.strftime(\"%d/%m/%Y at %H:%M\"))\n```\n\n## Time Arithmetic (`timedelta`)\n```python\nfrom datetime import timedelta\n\ntomorrow = now + timedelta(days=1)\nlast_week = now - timedelta(weeks=1)\n```\n\n--- \n### 🛠️ Your Task\nCalculate how many days are left until New Year's Day. Print it as: \"There are [X] days left in the year.\""
  },
  {
    "id": 27,
    "title": "Regex Basics",
    "summary": "Regular expressions for text matching.",
    "content": "# Day 27: Regex (Regular Expressions)\n\nRegex is a language for describing search patterns in text. It's used for validating emails, finding phone numbers, or cleaning data.\n\n## The `re` Module\n```python\nimport re\n\ntext = \"Agent 007, your code is 4567.\"\n\n# Find all numbers\nnumbers = re.findall(r'\\d+', text)\nprint(numbers) # ['007', '4567']\n```\n\n## Common Symbols\n- `\\d`: Any digit (0-9)\n- `\\w`: Any word character (a-z, A-Z, 0-9, _)\n- `+`: One or more\n- `*`: Zero or more\n- `^`: Starts with\n- `$`: Ends with\n\n## Validating an Email (Basic)\n```python\nemail_pattern = r'^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$'\n```\n\n--- \n### ⚠️ Use Raw Strings\nAlways use `r'...'` for regex patterns. This prevents Python from confusing regex backslashes with its own string escape characters.\n\n### 🛠️ Your Task\nWrite a regex to find all capitalized words in a sentence."
  },
  {
    "id": 28,
    "title": "Working with JSON",
    "summary": "Parse data formats standard for the web.",
    "content": "# Day 28: JSON\n\nJSON (JavaScript Object Notation) is the language of the internet. APIs use it, config files use it, and databases use it.\n\n## Parsing (JSON -> Python)\nUse `json.loads` for strings or `json.load` for files.\n```python\nimport json\n\nraw_json = '{\"id\": 1, \"status\": \"active\", \"tags\": [\"VIP\", \"New\"]}'\ndata = json.loads(raw_json) # Becomes a Python Dictionary\nprint(data[\"tags\"][0]) # \"VIP\"\n```\n\n## Writing (Python -> JSON)\nUse `json.dumps` for strings or `json.dump` for files.\n```python\nconfig = {\"port\": 3000, \"debug\": True}\njson_str = json.dumps(config, indent=4) # indent makes it pretty!\n```\n\n--- \n### 💡 Serializing Objects\nNote that standard JSON cannot store custom Python objects (like your `Car` class). You first have to convert your object to a dictionary before saving it to JSON.\n\n### 🛠️ Your Task\nCreate a dictionary representing your favorite pizza with `name`, `toppings` (list), and `price`. Convert it to a pretty JSON string and print it."
  },
  {
    "id": 29,
    "title": "Project: Planning",
    "summary": "Design your final application.",
    "content": "# Day 29: Final Project Planning\n\nYou have the skills. Now it's time to build a real tool. Today is for design and architecture.\n\n## The Goal: A Personal Finance Tracker\nBuild a CLI app that allows users to record expenses and view a summary.\n\n### 1. Data Structure\nHow will you store expenses? A list of dictionaries? Each dictionary could have `amount`, `category`, and `date`.\n\n### 2. Persistence\nUse the `json` module to save expenses to an `expenses.json` file so the data doesn't disappear when the program ends.\n\n### 3. Features\n- `add_expense()`: Use `input()` to get data from user.\n- `view_summary()`: Use a `for` loop to calculate the total.\n- `save_data()` / `load_data()`: The logic for the file system.\n\n### 🛠️ Your Task\nWrite out a list of the function names you'll need and decide what arguments each one will take. Draw a flow-chart of how the user will interact with the menu."
  },
  {
    "id": 30,
    "title": "Project: Execution",
    "summary": "Write, test, and complete.",
    "content": "# Day 30: Execution!\n\nIt's time. Write the code for your Finance Tracker.\n\n## Tips for Success\n1. **Start Small**: Get the file saving/loading working first.\n2. **Test as you go**: Don't write 200 lines and then hit run. Write 10 lines, test it, and move on.\n3. **Refactor**: Once it works, look at your code. Is there any logic you can move into a reusable function?\n\n## What's Next?\nYou've finished the 30-day foundation! Where to go now?\n- **Web**: Learn Flask or Django.\n- **Data Science**: Learn Pandas and NumPy.\n- **AI**: Learn Scikit-Learn or PyTorch.\n- **Automation**: Build bots with Selenium.\n\nCongratulations on completing your 30 Days of Python. You are now a programmer. Keep building! 🐍"
  }
];
