---
name: main-process-modular-architecture
description: Use when designing or refactoring Electron main-process feature modules; enforces project modular architecture with module/service/ipc/window separation, DI providers/tokens, imports/exports boundaries, and typed contracts.
argument-hint: "[module goal] [main feature folder] [ipc/window requirements]"
user-invokable: true
disable-model-invocation: false
---

# Skill Instructions

Use this skill when the request matches **Electron Main Process Architecture Guide**.

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
