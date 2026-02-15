---
name: electron-path-aliasing
description: Apply correct path aliasing for Electron main vs renderer imports, ensuring runtime-safe Node subpath and Vite alias usage.
argument-hint: "[refactor goal] [main/renderer files] [alias migration scope]"
user-invokable: true
disable-model-invocation: false
---

# Skill Instructions

Use this skill when the request matches **Electron Path Aliasing Guide** or references patterns from **docs/electron-path-aliasing.md**.

## Workflow

1. Read [SOURCE.md](./SOURCE.md) for the full repository guidance.
2. Identify concrete constraints, conventions, and required outputs.
3. Apply the guidance directly to the current task, keeping changes minimal and repository-consistent.
4. Validate results (tests/lint/build where relevant).
5. Summarize what was applied from this skill and where.

## Input Guidance

When invoking this skill manually, include:

- Task goal
- Target files or modules
- Any constraints (performance, architecture, style, tests)

## Source

This skill is generated from [docs/electron-path-aliasing.md](../../../docs/electron-path-aliasing.md).
Use [SOURCE.md](./SOURCE.md) as the canonical local resource loaded on demand.
