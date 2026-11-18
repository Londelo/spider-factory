---
name: standards-file-organization
description: >
  File and directory organization standards for the project. Use when creating files, organizing code,
  deciding folder structure, naming files, or refactoring directory layouts.
  Trigger: "file organization", "folder structure", "vertical slices", "directory layout", "how should I organize this", "where does this go", "index.ts", "Dunghill Anti-Pattern".
---

# File Organization Standards

## Vertical Slices Over Horizontal Layers

Organize by feature (vertical slice), not by layer (horizontal). Code that changes together lives together — the Common Closure Principle.

```
// Good — vertical slices
src/features/user/
├── user.controller.ts
├── user.service.ts
├── user.repository.ts
├── user.model.ts
└── user.dto.ts

// Bad — horizontal layers
src/
├── controllers/
├── services/
├── repositories/
└── models/
```

When a requirement touches 5 layers horizontally, the developer jumps between 5 directories. In a vertical layout, they open one folder.

## Index as Shell, Not Barrel

`index.ts` is a 301 forwarder, not a barrel. It re-exports the public API — nothing more.

```typescript
// Good — explicit forwarder
export { default } from './Component';
export { useHook } from './useHook';

// Bad — shotgun barrel
export * from './Component';
export * from './helpers';
```

Never use `export *`. It is opaque to tree-shaking, hides imports from static analysis, makes AI context retrieval noisy, and causes accidental coupling. Use explicit named exports or granular entrypoints in `package.json` for library/SDK packages.

## When to Create a New File

Create a new file when any of these apply:

- Function is used by 2+ files in the same module
- File exceeds 400–500 lines
- SRP violation — two unrelated responsibilities share a file
- A specific name exists for the concept but the file is misnamed

Keep things together when:

- Changes happen together frequently
- Code is tightly coupled
- The module is small and closely related

## Helpers vs Utilities vs Domain Functions vs Selectors vs Services

Every shared file has a specific purpose. There is no dump category.

| Type | Scope | Location | Naming |
|------|-------|----------|--------|
| **Domain function** | Owns a business concept | Inside the feature folder | Named after the business concept |
| **Helper** | Project-specific, non-trivial | `src/helpers/` or colocated | `X.helpers.ts` |
| **Utility** | Generic, domain-agnostic | Function-specific file (`email.ts`, `date.ts`) | Named for the operation |
| **Selector** | Derived data from state | Colocated with state slice or component | `selectXxx` |
| **Service** | Stateful, multiple impls, external systems | `src/services/` | Named after the external concern |

```
features/user-registration/use-case.ts       // domain function
components/FileViewer/FileViewer.helpers.ts  // helper
utils/email.ts                               // utility

// NEVER — the Dunghill Anti-Pattern
utils/utils.ts
helpers/helpers.ts
misc.ts
commons/
library/
```

The Dunghill Anti-Pattern is any file named `utils.ts`, `helpers.ts`, `misc.ts`, `commons/`, or `library/` that collects unrelated functions. Every shared file must have a specific purpose and name.

## AI-Optimized Structure

The file system is the prompt. Folder structure shapes what the AI knows before you type.

- **Folder depth should increase or stay constant with object composition.** Deeper composition → deeper nesting. Do not flatten.
- **Hexagonal Architecture produces cleaner graphs** (6–8 edges) vs classic DDD (14–30+ edges). Cleaner graphs mean fewer chunks the AI must retrieve.
- **Pure functions eliminate invisible edges.** No global state, no singletons, no deep inheritance. Each file is self-contained and independently retrievable.
- **Avoid `commons/`, `library/` as graph black holes.** Every query pulls the entire folder as context. Name shared folders for what they contain (`src/patterns/`, `src/middleware/`), not for their role as a dumping ground.

Inside Hexagonal spatial structure, use DDD terminology for naming:

```
src/
├── domain/       # entity, value-object, domain services
├── ports/        # interfaces (repos, external APIs)
├── adapters/     # implementations of ports
└── use-cases/    # business logic
```

## The Dependency Rule (Clean Architecture)

The entire structure follows one rule: **source code dependencies only point inward**. Inner layers (pure functions, domain logic) never reference outer layers (I/O, frameworks, HTTP, databases). Outer layers implement interfaces that inner layers define.

This is the reason we use vertical slices, forwarder-only `index.ts`, and FCIS — they all enforce the same boundary. The goal is **tech-stack independence**: swap a framework, database, or deployment target without touching the core.

- **Inner layer defines the contract.** A repository interface, a port, a result type — declared in the core.
- **Outer layer implements the contract.** PostgreSQL adapter, HTTP client, Lambda handler — lives outside the core.
- **Switching stacks is a localized change.** Rewrite the adapter layer and update one composition root. The domain, use cases, and pure functions stay untouched.

This is why the rules matter. `export *` leaks outer-layer concerns inward. Global state creates invisible dependencies that cross boundaries. Horizontal layers scatter one feature across many directories, making it impossible to isolate or move a piece of the system. All of these anti-patterns violate the Dependency Rule.

## Context-Specific Structures

| Context | Rule | Example |
|---------|------|---------|
| **React / Next.js** | Colocate sub-components, types, helpers with the component. Feature folders use vertical slices. | `components/FileViewer/` with `FileViewer.tsx`, `Directory.tsx`, `FileViewer.helpers.ts`, `index.ts` (forwarder) |
| **NestJS** | One folder per feature with module, controller, service, DTO, entity, and test. Shared code in `src/shared/`. | `users/` containing `users.module.ts`, `users.controller.ts`, `users.service.ts`, `dto/`, `entities/` |
| **Lambda / Serverless** | One folder per feature. `package.individually: true` so each Lambda only bundles what it needs. | `features/user-registration/` with `handler.ts` (shell), `use-case.ts` (core), `validators.ts`, `helpers/`, `tests/` |
| **GraphQL** | Co-locate schema + resolver per domain. Use `mergeResolvers` or GraphQL Modules to assemble the full schema. | `domain/user/schema.ts` and `domain/user/resolver.ts` |

## Decision Rules

| Situation | Decision |
|---|---|
| Adding a new business entity | Create new feature folder with all layers (vertical slice) |
| Helper used by 2+ files in same module | Extract to `X.helpers.ts` in same module |
| Helper used across multiple modules | Promote to shared location (never `utils.ts`) |
| File exceeds 400–500 lines | Split by extracting distinct responsibilities |
| Two unrelated things in same file | Separate files |
| Component with sub-components | Colocate all in one feature folder; use forwarder index |
| Library / SDK package | Avoid `export *`; use granular entrypoints |
| Lambda handler | One folder per function, individually packaged |
| GraphQL resolver | Co-locate schema + resolver per domain |
| Generic utility (email, date, formatting) | Function-specific file — never a dump file |