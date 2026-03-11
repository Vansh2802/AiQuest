import json
import re
import os
import logging
import asyncio
from app.config import LOCAL_LLM_PATH

logger = logging.getLogger("ai_service")

_gpt4all_model = None
_model_load_attempted = False

# --- Anthropic Claude Setup ---
_anthropic_client = None
_anthropic_loaded = False


def _load_anthropic_key():
    """Read Anthropic API key from anthropic_key.txt, init client, then delete the file."""
    global _anthropic_client, _anthropic_loaded
    if _anthropic_loaded:
        return _anthropic_client
    _anthropic_loaded = True

    key_path = os.path.join(os.path.dirname(__file__), "..", "..", "anthropic_key.txt")
    key_path = os.path.normpath(key_path)

    api_key = None
    if os.path.isfile(key_path):
        try:
            with open(key_path, "r", encoding="utf-8") as f:
                api_key = f.read().strip()
            if api_key and not api_key.startswith("sk-"):
                logger.warning("anthropic_key.txt does not contain a valid key (expected sk-...)")
                api_key = None
            if api_key:
                # Delete the key file after reading
                try:
                    os.remove(key_path)
                    logger.info("anthropic_key.txt read and deleted successfully")
                except OSError as e:
                    logger.warning(f"Could not delete anthropic_key.txt: {e}")
        except Exception as e:
            logger.error(f"Failed to read anthropic_key.txt: {e}")

    if not api_key:
        # Also check environment variable as fallback
        api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()

    if api_key:
        try:
            import anthropic
            _anthropic_client = anthropic.Anthropic(api_key=api_key)
            logger.info("Anthropic Claude client initialized successfully")
        except ImportError:
            logger.error("anthropic package not installed. Run: pip install anthropic")
        except Exception as e:
            logger.error(f"Failed to initialize Anthropic client: {e}")

    return _anthropic_client


def _generate_claude(prompt: str, system_prompt: str = "", max_tokens: int = 1024) -> str | None:
    """Synchronously call Claude API."""
    client = _load_anthropic_key()
    if client is None:
        return None

    try:
        kwargs = {
            "model": "claude-sonnet-4-20250514",
            "max_tokens": max_tokens,
            "messages": [{"role": "user", "content": prompt}],
        }
        if system_prompt:
            kwargs["system"] = system_prompt

        response = client.messages.create(**kwargs)
        return response.content[0].text
    except Exception as e:
        logger.error(f"Claude API error: {e}")
        return None


def _get_model():
    global _gpt4all_model, _model_load_attempted
    if _model_load_attempted:
        return _gpt4all_model

    _model_load_attempted = True

    if not LOCAL_LLM_PATH:
        logger.warning("LOCAL_LLM_PATH not set in .env - using fallback mode (no LLM)")
        return None

    try:
        from gpt4all import GPT4All

        logger.info(f"Loading local model from: {LOCAL_LLM_PATH}")
        _gpt4all_model = GPT4All(model_name=LOCAL_LLM_PATH, allow_download=False)
        return _gpt4all_model
    except Exception as e:
        logger.error(f"Failed to load GPT4All model: {e}")
        return None


def _generate_sync(prompt: str, max_tokens: int = 1024) -> str | None:
    model = _get_model()
    if model is None:
        return None

    with model.chat_session():
        response = model.generate(prompt, max_tokens=max_tokens, temp=0.7)
    return response


# --- Rich fallback content for topics ---

TOPIC_EXPLANATIONS = {
    "Binary Search": (
        "## Binary Search\n\n"
        "**Simple Explanation:**\n"
        "Binary Search is an efficient algorithm for finding an item in a **sorted** list. "
        "Instead of checking every element one by one (linear search), it repeatedly divides "
        "the search space in half, making it much faster.\n\n"
        "**How It Works (Step by Step):**\n"
        "1. Start with the entire sorted array\n"
        "2. Find the middle element\n"
        "3. If the middle element is the target — you're done!\n"
        "4. If the target is smaller, search the **left half**\n"
        "5. If the target is larger, search the **right half**\n"
        "6. Repeat until found or the search space is empty\n\n"
        "**Real-World Example:**\n"
        "Think of looking up a word in a dictionary. You don't start from page 1 — you open "
        "it roughly to the middle, check if your word comes before or after, and keep narrowing down.\n\n"
        "**Key Points:**\n"
        "- Time complexity: O(log n) — extremely fast even for large datasets\n"
        "- Requires the data to be **sorted** first\n"
        "- Used in databases, search engines, and many real-world systems\n"
        "- Much faster than linear search O(n) for large collections\n\n"
        "```python\n"
        "def binary_search(arr, target):\n"
        "    low, high = 0, len(arr) - 1\n"
        "    while low <= high:\n"
        "        mid = (low + high) // 2\n"
        "        if arr[mid] == target:\n"
        "            return mid\n"
        "        elif arr[mid] < target:\n"
        "            low = mid + 1\n"
        "        else:\n"
        "            high = mid - 1\n"
        "    return -1\n"
        "```"
    ),
    "Recursion": (
        "## Recursion\n\n"
        "**Simple Explanation:**\n"
        "Recursion is when a function calls **itself** to solve a problem. It breaks a big problem "
        "into smaller, identical sub-problems until reaching a simple **base case** that can be solved directly.\n\n"
        "**How It Works (Step by Step):**\n"
        "1. Define a **base case** — the simplest version that stops the recursion\n"
        "2. Define the **recursive case** — the function calls itself with a smaller input\n"
        "3. Each call moves closer to the base case\n"
        "4. Results bubble back up as each call returns\n\n"
        "**Real-World Example:**\n"
        "Russian nesting dolls (Matryoshka): open a doll, find a smaller doll inside, open that one, "
        "and keep going until you reach the smallest doll (base case).\n\n"
        "**Key Points:**\n"
        "- Every recursive function MUST have a base case to avoid infinite loops\n"
        "- Uses the call stack — too many calls can cause a Stack Overflow\n"
        "- Many algorithms use recursion: tree traversal, sorting (merge sort), fractals\n"
        "- Can often be converted to iterative solutions using loops\n\n"
        "```python\n"
        "def factorial(n):\n"
        "    if n <= 1:        # base case\n"
        "        return 1\n"
        "    return n * factorial(n - 1)  # recursive case\n"
        "\n"
        "# factorial(5) = 5 * 4 * 3 * 2 * 1 = 120\n"
        "```"
    ),
    "JavaScript Closures": (
        "## JavaScript Closures\n\n"
        "**Simple Explanation:**\n"
        "A closure is a function that **remembers** the variables from the place where it was created, "
        "even after that outer function has finished running. It 'closes over' its environment.\n\n"
        "**How It Works (Step by Step):**\n"
        "1. An outer function defines some variables\n"
        "2. An inner function is created inside the outer function\n"
        "3. The inner function references variables from the outer function\n"
        "4. The outer function returns the inner function\n"
        "5. The inner function still has access to those outer variables!\n\n"
        "**Real-World Example:**\n"
        "Think of a backpack: when you leave a classroom (outer function ends), you still carry "
        "your notes in your backpack (closure). The notes came from the classroom but travel with you.\n\n"
        "**Key Points:**\n"
        "- Closures enable data privacy and encapsulation\n"
        "- Essential for callbacks, event handlers, and React hooks\n"
        "- They keep variables alive after the outer function returns\n"
        "- Common use: counter functions, module patterns, currying\n\n"
        "```javascript\n"
        "function createCounter() {\n"
        "  let count = 0;  // private variable\n"
        "  return function() {\n"
        "    count++;\n"
        "    return count;\n"
        "  };\n"
        "}\n"
        "const counter = createCounter();\n"
        "counter(); // 1\n"
        "counter(); // 2 — remembers count!\n"
        "```"
    ),
    "Python Lists": (
        "## Python Lists\n\n"
        "**Simple Explanation:**\n"
        "A Python list is an **ordered, mutable collection** that can hold items of any type. "
        "Lists are one of the most used data structures in Python — they're like a flexible array.\n\n"
        "**How It Works (Step by Step):**\n"
        "1. Create a list with square brackets: `my_list = [1, 2, 3]`\n"
        "2. Access items by index (0-based): `my_list[0]` gives `1`\n"
        "3. Modify items: `my_list[1] = 99`\n"
        "4. Add items: `my_list.append(4)` or `my_list.insert(0, 'hi')`\n"
        "5. Remove items: `my_list.remove(99)` or `my_list.pop()`\n\n"
        "**Real-World Example:**\n"
        "A shopping list: you can add items, remove items, reorder them, and check what's on the list.\n\n"
        "**Key Points:**\n"
        "- Lists are mutable — you can change them after creation\n"
        "- Support slicing: `my_list[1:3]` gets a sub-list\n"
        "- List comprehensions make creating lists easy: `[x**2 for x in range(5)]`\n"
        "- Common methods: append, pop, sort, reverse, extend, index\n\n"
        "```python\n"
        "fruits = ['apple', 'banana', 'cherry']\n"
        "fruits.append('date')       # Add to end\n"
        "fruits[1] = 'blueberry'     # Modify\n"
        "sliced = fruits[1:3]        # ['blueberry', 'cherry']\n"
        "squares = [x**2 for x in range(5)]  # [0, 1, 4, 9, 16]\n"
        "```"
    ),
    "Sorting Algorithms": (
        "## Sorting Algorithms\n\n"
        "**Simple Explanation:**\n"
        "Sorting algorithms arrange elements in a specific order (ascending or descending). "
        "Different algorithms have different trade-offs between speed, memory usage, and simplicity.\n\n"
        "**Common Sorting Algorithms:**\n"
        "1. **Bubble Sort** — Compare adjacent pairs, swap if out of order. Simple but slow O(n²)\n"
        "2. **Selection Sort** — Find the minimum, put it first, repeat. Also O(n²)\n"
        "3. **Merge Sort** — Divide in half, sort each half, merge. Fast O(n log n)\n"
        "4. **Quick Sort** — Pick a pivot, partition around it. Average O(n log n)\n"
        "5. **Insertion Sort** — Build sorted array one item at a time. Good for small/nearly sorted data\n\n"
        "**Real-World Example:**\n"
        "Sorting a hand of playing cards: you might pick each card and insert it in the right position "
        "among the cards you've already sorted (insertion sort).\n\n"
        "**Key Points:**\n"
        "- O(n log n) algorithms (merge sort, quick sort) are preferred for large data\n"
        "- Bubble sort is educational but rarely used in practice\n"
        "- Python's built-in `sorted()` uses TimSort — a hybrid of merge + insertion sort\n"
        "- Stability matters: stable sorts keep equal elements in original order\n\n"
        "```python\n"
        "# Bubble Sort example\n"
        "def bubble_sort(arr):\n"
        "    n = len(arr)\n"
        "    for i in range(n):\n"
        "        for j in range(0, n-i-1):\n"
        "            if arr[j] > arr[j+1]:\n"
        "                arr[j], arr[j+1] = arr[j+1], arr[j]\n"
        "    return arr\n"
        "```"
    ),
    "Web Development": (
        "## Web Development\n\n"
        "**Simple Explanation:**\n"
        "Web development is the process of building websites and web applications. It encompasses "
        "everything from creating simple static pages to complex interactive applications.\n\n"
        "**The Three Pillars:**\n"
        "1. **HTML** — The structure/skeleton of a webpage (headings, paragraphs, images)\n"
        "2. **CSS** — The styling/appearance (colors, fonts, layouts, animations)\n"
        "3. **JavaScript** — The behavior/interactivity (click events, dynamic content, API calls)\n\n"
        "**Frontend vs Backend:**\n"
        "- **Frontend**: What users see and interact with (HTML, CSS, JS, React, Vue)\n"
        "- **Backend**: Server-side logic, databases, APIs (Node.js, Python, Java)\n"
        "- **Full-Stack**: Both frontend and backend\n\n"
        "**Real-World Example:**\n"
        "Think of a restaurant: the **dining area** (frontend) is what customers see, "
        "while the **kitchen** (backend) prepares the food (data) behind the scenes.\n\n"
        "**Key Points:**\n"
        "- Modern web dev uses frameworks: React, Vue, Angular (frontend), Express, FastAPI (backend)\n"
        "- Responsive design ensures sites work on all screen sizes\n"
        "- APIs connect frontend to backend using HTTP requests\n"
        "- Version control with Git is essential for all developers\n\n"
        "```html\n"
        "<!-- Simple HTML page -->\n"
        "<!DOCTYPE html>\n"
        "<html>\n"
        "  <head><title>My Site</title></head>\n"
        "  <body>\n"
        "    <h1>Hello, World!</h1>\n"
        "    <button onclick=\"alert('Clicked!')\">Click Me</button>\n"
        "  </body>\n"
        "</html>\n"
        "```"
    ),
}

TOPIC_QUIZZES = {
    "Binary Search": [
        {
            "question": "What is the primary requirement for binary search to work?",
            "options": ["A) The array must be sorted", "B) The array must contain unique elements", "C) The array must be small", "D) The array must contain integers only"],
            "answer": "A) The array must be sorted",
        },
        {
            "question": "What is the time complexity of binary search?",
            "options": ["A) O(n)", "B) O(n²)", "C) O(log n)", "D) O(1)"],
            "answer": "C) O(log n)",
        },
        {
            "question": "In binary search, if the target is greater than the middle element, where do you search next?",
            "options": ["A) The left half", "B) The right half", "C) Start over from the beginning", "D) The middle element again"],
            "answer": "B) The right half",
        },
        {
            "question": "How many comparisons does binary search need for a sorted array of 1024 elements in the worst case?",
            "options": ["A) 1024", "B) 512", "C) 10", "D) 100"],
            "answer": "C) 10",
        },
        {
            "question": "Which of the following is NOT an application of binary search?",
            "options": ["A) Finding a word in a dictionary", "B) Searching in a linked list", "C) Finding the square root of a number", "D) Searching in a database index"],
            "answer": "B) Searching in a linked list",
        },
    ],
    "Recursion": [
        {
            "question": "What is a base case in recursion?",
            "options": ["A) The first call to the function", "B) The condition that stops the recursion", "C) The largest input value", "D) A loop inside the function"],
            "answer": "B) The condition that stops the recursion",
        },
        {
            "question": "What happens if a recursive function has no base case?",
            "options": ["A) It returns 0", "B) It runs once and stops", "C) It causes infinite recursion (stack overflow)", "D) It converts to a loop automatically"],
            "answer": "C) It causes infinite recursion (stack overflow)",
        },
        {
            "question": "What is the recursive formula for factorial(n)?",
            "options": ["A) n + factorial(n-1)", "B) n * factorial(n-1)", "C) n * factorial(n+1)", "D) factorial(n) / n"],
            "answer": "B) n * factorial(n-1)",
        },
        {
            "question": "Which data structure does recursion implicitly use?",
            "options": ["A) Queue", "B) Array", "C) Stack (call stack)", "D) Hash table"],
            "answer": "C) Stack (call stack)",
        },
        {
            "question": "Which algorithm is a classic example of recursion?",
            "options": ["A) Linear search", "B) Bubble sort", "C) Merge sort", "D) Counting sort"],
            "answer": "C) Merge sort",
        },
    ],
    "JavaScript Closures": [
        {
            "question": "What is a closure in JavaScript?",
            "options": ["A) A way to close a browser window", "B) A function that has access to its outer function's variables even after the outer function returns", "C) A method to delete variables", "D) A type of loop"],
            "answer": "B) A function that has access to its outer function's variables even after the outer function returns",
        },
        {
            "question": "What will this code output?\nfunction outer() { let x = 10; return function() { return x; }; }\nconst fn = outer(); console.log(fn());",
            "options": ["A) undefined", "B) null", "C) 10", "D) Error"],
            "answer": "C) 10",
        },
        {
            "question": "Closures are commonly used for:",
            "options": ["A) Data privacy and encapsulation", "B) Sorting arrays", "C) Creating HTML elements", "D) Database queries"],
            "answer": "A) Data privacy and encapsulation",
        },
        {
            "question": "In a closure, the inner function:",
            "options": ["A) Cannot access outer variables", "B) Creates a copy of outer variables", "C) Maintains a reference to the outer scope", "D) Deletes the outer variables"],
            "answer": "C) Maintains a reference to the outer scope",
        },
        {
            "question": "Which React feature relies heavily on closures?",
            "options": ["A) CSS modules", "B) Hooks (useState, useEffect)", "C) HTML rendering", "D) Image loading"],
            "answer": "B) Hooks (useState, useEffect)",
        },
    ],
    "Python Lists": [
        {
            "question": "What is the output of `[1,2,3][1]`?",
            "options": ["A) 1", "B) 2", "C) 3", "D) Error"],
            "answer": "B) 2",
        },
        {
            "question": "Which method adds an element to the end of a list?",
            "options": ["A) add()", "B) insert()", "C) append()", "D) push()"],
            "answer": "C) append()",
        },
        {
            "question": "What does `[1,2,3,4,5][1:4]` return?",
            "options": ["A) [1,2,3,4]", "B) [2,3,4]", "C) [2,3,4,5]", "D) [1,2,3]"],
            "answer": "B) [2,3,4]",
        },
        {
            "question": "What is a list comprehension?",
            "options": ["A) A way to delete lists", "B) A concise way to create lists from expressions", "C) A method to sort lists", "D) A debugging tool"],
            "answer": "B) A concise way to create lists from expressions",
        },
        {
            "question": "Are Python lists mutable or immutable?",
            "options": ["A) Immutable", "B) Mutable", "C) Read-only", "D) It depends on the content"],
            "answer": "B) Mutable",
        },
    ],
    "Sorting Algorithms": [
        {
            "question": "Which sorting algorithm has the best average time complexity?",
            "options": ["A) Bubble Sort - O(n²)", "B) Selection Sort - O(n²)", "C) Merge Sort - O(n log n)", "D) Insertion Sort - O(n²)"],
            "answer": "C) Merge Sort - O(n log n)",
        },
        {
            "question": "What does 'stable sort' mean?",
            "options": ["A) The algorithm never crashes", "B) Equal elements maintain their relative order", "C) It uses less memory", "D) It always runs in O(n)"],
            "answer": "B) Equal elements maintain their relative order",
        },
        {
            "question": "Which sort is best for nearly sorted data?",
            "options": ["A) Quick Sort", "B) Merge Sort", "C) Insertion Sort", "D) Selection Sort"],
            "answer": "C) Insertion Sort",
        },
        {
            "question": "What sorting algorithm does Python's built-in sorted() use?",
            "options": ["A) Quick Sort", "B) Merge Sort", "C) Tim Sort", "D) Heap Sort"],
            "answer": "C) Tim Sort",
        },
        {
            "question": "In Bubble Sort, what happens in each pass?",
            "options": ["A) The smallest element moves to the front", "B) Adjacent elements are compared and swapped if out of order", "C) The array is divided in half", "D) A pivot element is chosen"],
            "answer": "B) Adjacent elements are compared and swapped if out of order",
        },
    ],
    "Web Development": [
        {
            "question": "What are the three core technologies of frontend web development?",
            "options": ["A) Python, Java, C++", "B) HTML, CSS, JavaScript", "C) React, Vue, Angular", "D) MySQL, MongoDB, PostgreSQL"],
            "answer": "B) HTML, CSS, JavaScript",
        },
        {
            "question": "What does HTML stand for?",
            "options": ["A) Hyper Text Markup Language", "B) High Tech Modern Language", "C) Hyper Transfer Markup Language", "D) Home Tool Markup Language"],
            "answer": "A) Hyper Text Markup Language",
        },
        {
            "question": "What is the role of CSS in web development?",
            "options": ["A) Adding interactivity", "B) Storing data", "C) Styling and layout of web pages", "D) Server-side processing"],
            "answer": "C) Styling and layout of web pages",
        },
        {
            "question": "What is an API in web development?",
            "options": ["A) A programming language", "B) An interface that allows different software to communicate", "C) A type of database", "D) A CSS framework"],
            "answer": "B) An interface that allows different software to communicate",
        },
        {
            "question": "What is responsive web design?",
            "options": ["A) A fast website", "B) Design that adapts to different screen sizes", "C) A website that responds quickly", "D) A secure website"],
            "answer": "B) Design that adapts to different screen sizes",
        },
    ],
}


def _fallback_explanation(topic: str) -> str:
    if topic in TOPIC_EXPLANATIONS:
        return TOPIC_EXPLANATIONS[topic]

    return (
        f"## {topic}\n\n"
        f"**Simple Explanation:**\n"
        f"{topic} is an important concept in programming and computer science. "
        f"Understanding it will strengthen your foundation and help you solve real-world problems.\n\n"
        f"**How It Works (Step by Step):**\n"
        f"1. Start by understanding the basic definition of {topic}\n"
        f"2. Study how it's used in practice with examples\n"
        f"3. Implement it yourself in code to build muscle memory\n"
        f"4. Compare it with related concepts to deepen understanding\n\n"
        f"**Real-World Example:**\n"
        f"Many software systems and applications rely on {topic}. "
        f"From web applications to mobile apps, this concept appears everywhere in modern development.\n\n"
        f"**Key Points:**\n"
        f"- {topic} is widely used across many programming domains\n"
        f"- Practice with small examples before tackling complex problems\n"
        f"- Understanding the theory AND the code is equally important\n"
        f"- Try building a small project that uses {topic}\n\n"
        f"*Tip: For richer AI-generated explanations, configure a local LLM model in the backend settings.*"
    )


def _fallback_quiz(topic: str) -> list[dict]:
    if topic in TOPIC_QUIZZES:
        return TOPIC_QUIZZES[topic]

    return [
        {
            "question": f"What is the main purpose of {topic}?",
            "options": [
                "A) To solve a specific class of computational problems efficiently",
                "B) To make code look more complex",
                "C) To slow down program execution",
                "D) To replace all other programming concepts",
            ],
            "answer": "A) To solve a specific class of computational problems efficiently",
        },
        {
            "question": f"When should you use {topic} in practice?",
            "options": [
                "A) Never — it's purely theoretical",
                "B) When the problem requirements match its strengths",
                "C) Only in interviews",
                "D) Only in Python programs",
            ],
            "answer": "B) When the problem requirements match its strengths",
        },
        {
            "question": f"What is the best approach to learning {topic}?",
            "options": [
                "A) Memorize the definition only",
                "B) Study theory, practice with examples, and build projects",
                "C) Skip examples and jump to advanced topics",
                "D) Only watch videos without coding",
            ],
            "answer": "B) Study theory, practice with examples, and build projects",
        },
        {
            "question": f"Which skill is most important when working with {topic}?",
            "options": [
                "A) Problem decomposition and logical thinking",
                "B) Typing speed",
                "C) Number of programming languages known",
                "D) Amount of RAM on your computer",
            ],
            "answer": "A) Problem decomposition and logical thinking",
        },
        {
            "question": f"How does understanding {topic} benefit a developer?",
            "options": [
                "A) It only helps in academic settings",
                "B) It improves problem-solving ability and code quality",
                "C) It has no practical benefit",
                "D) It's only useful for senior developers",
            ],
            "answer": "B) It improves problem-solving ability and code quality",
        },
    ]


def _fallback_chat(message: str, topic: str) -> str:
    msg_lower = message.lower()
    if any(word in msg_lower for word in ["hello", "hi", "hey", "howdy"]):
        return ("Hey there, fellow coder! I'm your AI tutor, ready to help you on your learning quest. "
                "Ask me anything about programming concepts, and I'll do my best to explain!")

    if any(word in msg_lower for word in ["what is", "what are", "define", "explain"]):
        subject = topic if topic else "this concept"
        return (f"Great question! {subject} is a fundamental concept that every developer should understand. "
                f"Here's the key idea: it's about solving problems more effectively by applying structured approaches. "
                f"I recommend starting with the explanation and video on the study page, then testing your "
                f"understanding with the quiz. Feel free to ask me specific questions!")

    if any(word in msg_lower for word in ["help", "stuck", "confused", "don't understand"]):
        return ("No worries — getting stuck is a natural part of learning! Here are some tips:\n\n"
                "1. Break the problem into smaller pieces\n"
                "2. Re-read the explanation section carefully\n"
                "3. Watch the video for a visual walkthrough\n"
                "4. Try writing the code yourself, even if it's wrong at first\n"
                "5. Ask me a specific question about what's confusing you!")

    if any(word in msg_lower for word in ["example", "show me", "code", "how to"]):
        subject = topic if topic else "programming"
        return (f"I'd love to show you an example! Check out the AI Explanation section on the study page "
                f"for detailed code examples about {subject}. If you need more practice, "
                f"try modifying the example code and see what happens. Experimentation is the best teacher!")

    if any(word in msg_lower for word in ["thank", "thanks", "awesome", "great", "cool"]):
        return ("You're welcome! Keep up the great work on your learning journey. "
                "Every concept you master brings you closer to becoming a skilled developer. "
                "Ready for the next challenge?")

    topic_hint = f" about {topic}" if topic else ""
    return (f"That's a thoughtful question{topic_hint}! Here's my advice:\n\n"
            f"- Review the explanation section for the core concepts\n"
            f"- Watch the video for a visual understanding\n"
            f"- Take the quiz to test what you've learned\n"
            f"- Practice by writing code yourself\n\n"
            f"Feel free to ask me anything more specific — I'm here to help!")


async def explain_topic(topic: str) -> dict:
    system_prompt = (
        "You are a friendly and expert programming tutor. "
        "You explain concepts in a clear, beginner-friendly way with enthusiasm. "
        "Use markdown formatting for readability."
    )
    prompt = (
        f"Explain the concept '{topic}' for a beginner programmer.\n\n"
        f"Structure your explanation with:\n"
        f"1. **Simple Explanation** — What is it in plain language? (2-3 sentences)\n"
        f"2. **Real-World Example** — An analogy from everyday life\n"
        f"3. **How It Works (Step by Step)** — Numbered steps breaking it down\n"
        f"4. **Code Example** — A small, well-commented code snippet\n"
        f"5. **Key Takeaways** — 4-5 bullet points summarizing the essentials\n\n"
        f"Format with markdown headers (##) and bold (**) for readability."
    )

    # Try Claude first
    try:
        result = await asyncio.to_thread(_generate_claude, prompt, system_prompt, 1024)
        if result:
            return {"ok": True, "explanation": result}
    except Exception as e:
        logger.error(f"Claude explain error: {e}")

    # Try GPT4All fallback
    try:
        result = await asyncio.to_thread(_generate_sync, prompt, 1024)
        if result:
            return {"ok": True, "explanation": result}
    except Exception as e:
        logger.error(f"LLM explain error: {e}")

    logger.warning("Using fallback explanation (no LLM available)")
    return {"ok": True, "explanation": _fallback_explanation(topic)}


async def generate_quiz(topic: str) -> dict:
    system_prompt = (
        "You are a quiz generator for a programming education platform. "
        "Generate challenging but fair questions that test real understanding. "
        "Return ONLY valid JSON with no extra text."
    )
    prompt = (
        f"Generate 5 multiple-choice questions about '{topic}'.\n\n"
        f"Requirements:\n"
        f"- Test conceptual understanding, not memorization\n"
        f"- Each question should require reasoning or applying knowledge\n"
        f"- Provide 4 realistic options — wrong answers should be common misconceptions\n"
        f"- Make questions progressively harder (easy → medium → hard)\n"
        f"- Include scenario-based or code-output questions when applicable\n"
        f"- Prefix each option with A), B), C), D)\n\n"
        f"Return ONLY a valid JSON array in this exact format:\n"
        f'[\n  {{ "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "answer": "A) ..." }}\n]\n'
        f"No markdown, no explanation — ONLY the JSON array."
    )

    # Try Claude first
    try:
        result = await asyncio.to_thread(_generate_claude, prompt, system_prompt, 2048)
        if result:
            content = result.strip()
            json_match = re.search(r'```(?:json)?\s*([\s\S]*?)```', content)
            if json_match:
                content = json_match.group(1).strip()

            arr_match = re.search(r'\[[\s\S]*\]', content)
            if arr_match:
                content = arr_match.group(0)

            questions = json.loads(content)
            if isinstance(questions, list) and len(questions) > 0:
                return {"ok": True, "questions": questions}
    except Exception as e:
        logger.error(f"Claude quiz error: {e}")

    # Try GPT4All fallback
    try:
        result = await asyncio.to_thread(_generate_sync, prompt, 2048)
        if result:
            content = result.strip()
            json_match = re.search(r'```(?:json)?\s*([\s\S]*?)```', content)
            if json_match:
                content = json_match.group(1).strip()

            arr_match = re.search(r'\[[\s\S]*\]', content)
            if arr_match:
                content = arr_match.group(0)

            questions = json.loads(content)
            if isinstance(questions, list) and len(questions) > 0:
                return {"ok": True, "questions": questions}
    except Exception as e:
        logger.error(f"LLM quiz error: {e}")

    logger.warning("Using fallback quiz (no LLM available)")
    return {"ok": True, "questions": _fallback_quiz(topic)}


async def chat_with_tutor(message: str, topic: str = "") -> dict:
    system_prompt = (
        "You are a friendly, encouraging AI tutor helping students learn programming and computer science. "
        "You explain concepts clearly, use examples, and keep answers concise (2-4 paragraphs max). "
        "Be patient — the student may be a beginner. "
        "Use simple language and analogies when possible."
    )
    topic_context = f" The student is currently studying: {topic}." if topic else ""
    prompt = f"Context:{topic_context}\n\nStudent's message: {message}"

    # Try Claude first
    try:
        result = await asyncio.to_thread(_generate_claude, prompt, system_prompt + topic_context, 512)
        if result:
            return {"ok": True, "reply": result.strip()}
    except Exception as e:
        logger.error(f"Claude chat error: {e}")

    # Try GPT4All fallback
    try:
        gpt4all_prompt = f"{system_prompt}{topic_context}\n\nStudent: {message}\n\nTutor:"
        result = await asyncio.to_thread(_generate_sync, gpt4all_prompt, 512)
        if result:
            return {"ok": True, "reply": result.strip()}
    except Exception as e:
        logger.error(f"LLM chat error: {e}")

    logger.warning("Using fallback chat (no LLM available)")
    return {"ok": True, "reply": _fallback_chat(message, topic)}
