---
name: electron-path-aliasing
description: Use when fixing import paths or alias errors in Electron projects; applies correct main-process Node subpath aliases (#main/*), renderer Vite aliases (@/*), and tsconfig/package runtime-safe alignment.
argument-hint: "[refactor goal] [main/renderer files] [alias migration scope]"
user-invokable: true
disable-model-invocation: false
---

# Skill Instructions

Use this skill when the request matches **Electron Path Aliasing Guide**.

## Workflow

1. Read [SOURCE.md](./SOURCE.md) for the full repository guidance.
2. Identify concrete constraints, conventions, and required outputs.
3. Apply the guidance directly to the current task, keeping changes minimal and repository-consistent.
   Don't validate results (tests/lint/build where relevant). Wait until I tell you this!
4. Summarize what was applied from this skill and where.

## Input Guidance

When invoking this skill manually, include:

- Task goal
- Target files or modules
- Any constraints (performance, architecture, style, tests)
