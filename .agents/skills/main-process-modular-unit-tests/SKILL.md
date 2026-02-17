---
name: main-process-modular-unit-tests
description: Use when writing or fixing tests for Electron main process; creates Vitest unit tests for modules, services, IPC handlers, window managers, and DI providers/tokens with correct Electron and dependency mocks.
argument-hint: "[test target] [main module/service/ipc] [error paths]"
user-invokable: true
disable-model-invocation: false
---

# Skill Instructions

Use this skill when the request matches **Electron Main Process Unit Testing Guide with Vitest**.

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
