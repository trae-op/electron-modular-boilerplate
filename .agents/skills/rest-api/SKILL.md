---
name: rest-api
description: Use when implementing API clients/services or endpoint integrations; applies REST API contracts with JWT auth headers, request/response payload typing, ownership/access checks, status-code handling, and error mapping.
argument-hint: "[endpoint goal] [resource] [auth/error cases]"
user-invokable: true
disable-model-invocation: false
---

# Skill Instructions

Use this skill when the request matches **REST API Documentation**.

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
