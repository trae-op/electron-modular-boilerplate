---
name: ipc-communication
description: Use when adding or debugging Electron IPC between preload, renderer, and main; implements strongly typed send/invoke/receive channels, payload contracts, window.electron API wiring, and safe handler registration.
argument-hint: "[ipc goal] [channel names] [payload/response types]"
user-invokable: true
disable-model-invocation: false
---

# Skill Instructions

Use this skill when the request matches **IPC communication (Renderer ↔ Main)**.

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
