---
name: rest-api
description: Implement or consume documented REST endpoints with correct auth, payload contracts, resource ownership checks, and response handling.
argument-hint: "[endpoint goal] [resource] [auth/error cases]"
user-invokable: true
disable-model-invocation: false
---

# Skill Instructions

Use this skill when the request matches **REST API Documentation** or references patterns from **docs/rest-api.md**.

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

This skill is generated from [docs/rest-api.md](../../../docs/rest-api.md).
Use [SOURCE.md](./SOURCE.md) as the canonical local resource loaded on demand.
