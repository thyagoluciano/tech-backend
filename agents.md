# AGENTS.md - Backend Governance

## Project Overview

TypeScript Backend using Node.js 20 and Express/Next.js API.

## Build and Test Commands

- **Install**: `npm install`
- **Build**: `npm run build`
- **Test**: `npm test` (Must use Vitest)
- **Run**: `npm start`

## Technical Stack

- **Language**: TypeScript (Strict Mode)
- **Runtime**: Node.js v20
- **Package Manager**: npm (DO NOT use pnpm/yarn)
- **Test Runner**: Vitest

## Architectural Patterns

- **Repository Pattern**: Strict separation between Logic (Service) and Data Access (Repository).
- **Error Handling**: Return `{ success: boolean, data?: T, error?: string }`. DO NOT throw exceptions for business errors.
- **Validation**: Use **Zod** for all input validation.

## Critical Rules

1. **Bootstrap**: First task MUST be creating `package.json`, `tsconfig.json`, and `.gitignore`.
2. **ESM**: Use `"type": "module"` in `package.json`.
3. **Tests**: Business logic MUST have unit tests.
