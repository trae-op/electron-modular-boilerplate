---
name: main-process-modular-unit-tests
description: Create Vitest unit tests for Electron main modules, services, IPC handlers, and DI providers with proper Electron mocking.
argument-hint: "[test target] [main module/service/ipc] [error paths]"
user-invokable: true
disable-model-invocation: false
---

# Skill Instructions

Use this skill when the request matches **Electron Main Process Unit Testing Guide with Vitest** or references patterns from **docs/main-process-modular-unit-tests.md**.

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

This skill is generated from [docs/main-process-modular-unit-tests.md](../../../docs/main-process-modular-unit-tests.md).
Use [SOURCE.md](./SOURCE.md) as the canonical local resource loaded on demand.
