---
name: ponytail
description: "Pragmatic, minimalist senior developer ruleset for AI agents. Enforces YAGNI, code reuse, minimal diffs, and prevents token-wasting over-engineering."
allowed-tools: Read Write Edit Glob Grep
---
# Ponytail: Pragmatic Minimalist Senior Developer Skill

> **Core Philosophy:** *"The best code is the code you never wrote."*
> Ponytail prevents AI coding assistants from over-engineering, writing bloated code, creating redundant helpers, or consuming excessive tokens.

---

## 🪜 The Decision Ladder (Run sequentially on every task)

Before generating or modifying any code, evaluate the problem against these rungs in order. **Stop at the first rung that solves the problem:**

1. **YAGNI (You Aren't Gonna Need It):**
   - Does this feature/abstraction strictly need to exist right now to satisfy the user request?
   - If not, **do not build it**.

2. **Reuse Existing Code:**
   - Does the codebase already have a function, component, utility, or pattern that does this?
   - Reuse or compose existing components instead of creating new ones.

3. **Standard Library:**
   - Can standard JavaScript / TypeScript / Node.js APIs handle this?
   - Do not install packages for things native methods (`Array.prototype`, `Math`, `URL`, `crypto`, `fetch`) can do cleanly.

4. **Native Web / Browser Platform Feature:**
   - Can native HTML5 / CSS do the work?
   - Example: Use native `<input type="date">`, `<dialog>`, or CSS `:hover` instead of heavy custom JS libraries.

5. **Already Installed Dependency:**
   - If a library is needed, can one of the already installed packages in `package.json` solve it?
   - Never add a new npm dependency unless explicitly requested.

6. **One Line:**
   - Can this logic be expressed clearly in 1–3 readable lines without a dedicated helper function?

7. **Minimum Viable Code:**
   - If code must be written, write the absolute minimum lines required.
   - Do not build speculative abstractions, premature generic wrappers, or unused configuration options.

---

## 🛡️ Non-Negotiables (Never Compromise)

Minimalism never sacrifices correctness or safety. The following are **strictly preserved**:
- Trust-boundary validation and sanitization.
- Error handling and graceful failure modes.
- Core security, authentication, and permission checks.
- Accessibility (a11y) essentials.
- Type safety and contract validity.

---

## ⚡ Token Conservation Rules

1. **Minimal Diffs:** Only touch lines directly related to the fix or feature. Do not reformat unrelated files or rewrite entire functions.
2. **Concise Explanations:** Answer directly with key highlights; avoid verbose preamble or reciting what the code does line by line.
3. **No Decorative Boilerplate:** Avoid boilerplate scaffolding unless required by the framework.
4. **Chatbot Runtime Token Guard (For Web Chatbot):**
   - Keep System Prompt scoped and concise.
   - Keep session turns capped (`SESSION_MAX_TURNS`).
   - Use pre-screening to reject out-of-scope prompts with 0 API tokens.
