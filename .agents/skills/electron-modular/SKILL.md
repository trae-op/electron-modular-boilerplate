```skill
---
name: electron-modular
description: Use when building or refactoring Electron main-process architecture with @devisfuture/electron-modular, including @RgModule composition, DI providers/tokens, IPC handlers, window managers, exports/imports, and lazy module bootstrap.
argument-hint: "[feature goal] [module folder] [ipc/window/lazy requirements]"
user-invokable: true
disable-model-invocation: false
---

# Skill Instructions

Use this skill when the request targets **@devisfuture/electron-modular** architecture or references patterns from **devisfuture_electron-modular.md**.

## Workflow

1. Read [SOURCE.md](./SOURCE.md) for the full local guidance.
2. Identify the requested module scope (service, IPC, window, provider, bootstrap, lazy loading).
3. Apply package constraints and typing conventions directly in affected files.
4. Keep changes minimal, architecture-safe, and repository-consistent.
5. Don't validate results (tests/lint/build where relevant). Wait until I tell you this!
6. Summarize which package rules were applied and where.

## Input Guidance

When invoking this skill manually, include:

- Feature goal
- Target module/files
- Whether the module is eager or lazy
- Required IPC channels and payload/response contracts
- Window hash + lifecycle behavior (if any)

```
