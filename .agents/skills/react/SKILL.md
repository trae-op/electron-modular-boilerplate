---
name: react
description: Use when implementing or refactoring renderer React code; applies repository patterns for memoized components, hook-first business logic extraction, composition, typed props/state, and predictable render architecture.
argument-hint: "[goal] [renderer files/components] [state/perf constraints]"
user-invokable: true
disable-model-invocation: false
---

# Skill Instructions

Use this skill when the request matches **React Best Practices Guide**.

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
