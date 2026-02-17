---
name: renderer-process-unit-tests
description: Use when writing or debugging React renderer tests; creates Vitest + Testing Library unit tests with jsdom setup, window.electron mocks, user interaction checks, and positive/negative/error scenarios.
argument-hint: "[test target] [component/hook] [mocked IPC cases]"
user-invokable: true
disable-model-invocation: false
---

# Skill Instructions

Use this skill when the request matches **Renderer Process Unit Tests**.

## Workflow

1. Read [SOURCE.md](./SOURCE.md) for the full repository guidance.
2. Identify concrete constraints, conventions, and required outputs.
3. Apply the guidance directly to the current task, keeping changes minimal and repository-consistent.
4. Summarize what was applied from this skill and where.

## Input Guidance

When invoking this skill manually, include:

- Task goal
- Target files or modules
- Any constraints (performance, architecture, style, tests)
