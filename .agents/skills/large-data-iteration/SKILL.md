---
name: large-data-iteration
description: Optimize nested data processing using indexing/maps, chunking, lazy iteration, and memoization to avoid O(n*m*k) bottlenecks.
argument-hint: "[perf goal] [dataset shape] [memory/latency constraints]"
user-invokable: true
disable-model-invocation: false
---

# Skill Instructions

Use this skill when the request matches **JavaScript Guide: Optimizing Large Data Iteration with Nested Collections** or references patterns from **docs/large-data-iteration.md**.

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

This skill is generated from [docs/large-data-iteration.md](../../../docs/large-data-iteration.md).
Use [SOURCE.md](./SOURCE.md) as the canonical local resource loaded on demand.
