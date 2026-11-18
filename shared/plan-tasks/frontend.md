# Frontend-UX Task Template

Use this template for `frontend-ux` category tasks. It covers Next.js/TSX components, Tailwind CSS styling, shadcn/ui components, layout, form UI, visual state components, SVG icons, and DOM-focused hooks.

## Template

```markdown
## Task: [Title]

**File:** `path/to/file.tsx`
**Unit:** `<ComponentName>` or `[hookName]`
**Category:** frontend-ux

### What to do
[One sentence: what the component/hook does and its purpose. Be specific — one unit only.]

### Component Structure
[Element hierarchy for components. Root elements, children, conditional sections. For hooks, skip this section.]

- Root: `[root element and its classes/attributes]`
  - `[child element]`
  - `[conditional sections: "Conditional: empty state overlay when no data"]`

> **Note:** For simple components (e.g., `<Button>`), this section can be brief. For complex components (e.g., `<DataTable>`, `<Modal>`), be thorough — define the full element hierarchy. Layout is the parent's job; don't bake positioning into atomic components.

### Props
- **interface `ComponentNameProps`:**
  - `propName: Type` -- description, required/optional, default
  - ...
- **Required props:** `[list]`
- **Optional props:** `[list]`

> For hooks: describe the `useXxx` signature — parameters, return value, and what the hook does.

### State & Events
- **Internal state:** `[useState declarations and their purpose — e.g., `value: string`, `error: string | null`, `loading: boolean`]`
- **State shape:** `[full state shape for complex components — e.g., `{ items: Item[], selectedId: string | null, filter: string, sort: SortConfig }`]`
- **State transitions:** `[how state changes — e.g., "on select: set selectedId, on deselect: clear selectedId"]`
- **Derived state:** `[memoized selectors — e.g., "filteredItems is derived from items.filter(...), memoized with useMemo"]`
- **Event handlers:** `[onChange, onBlur, onClick, etc. — what fires, when, what it updates]`
- **External callbacks:** `[onSubmit, onChange, onClose, etc. — parent-provided callbacks]`
- **Props-driven state:** `[disabled, error, loading — how props affect component behavior]`

### Styling
- **Tailwind classes:** `[key utility classes — e.g., "flex items-center gap-2 p-4 rounded-lg bg-muted/50 text-sm"]`
- **Design tokens via Tailwind:** `[shadcn/ui CSS variable format — e.g., `bg-[hsl(var(--primary))]`, `text-[hsl(var(--muted-foreground))]`, `border-border`, `bg-card`. Specify exact shadcn/ui token names.]`
- **Responsive:** `[specific breakpoints + specific changes per breakpoint — e.g., "Mobile < 768px: full-width, single column. Desktop > 1024px: centered with max-width."]`
- **Theme:** `[dark mode considerations, if any — e.g., "use `dark:` variant for color tokens"]`
- **Pseudo-variants:** `[hover:, focus:, focus-visible:, disabled:, aria-checked:, etc. — specify which state variants apply]`

### Accessibility
- **Roles:** `[role attributes — e.g., `role="dialog"`, `role="combobox"`]`
- **ARIA attributes:** `[aria-*, aria-*, etc. — e.g., `aria-modal="true"`, `aria-expanded` tied to open state, `aria-label` from title prop]`
- **Focus management:** `[where focus goes on mount, on close, on open — e.g., "focus trap inside modal, focus returns to trigger element on close"]`
- **Keyboard navigation:** `[which keys trigger what — e.g., `Escape` closes, `Enter` selects, `ArrowDown` opens and moves to first option, `Tab` moves to next]`
- **Screen reader:** `[when something should be visually hidden but screen-reader visible]`
- **Focus indicators:** `[focus visible vs focus ring — when should focus indicators appear?]`

### Animation / Motion
- **Entry animation:** `[how the component appears — e.g., "fade in + slide up over 200ms ease-out"]`
- **Exit animation:** `[how the component disappears — e.g., "fade out over 150ms ease-in"]`
- **Hover / active states:** `[micro-interactions — e.g., "button scales to 1.02 on hover, darkens on active"]`
- **Motion tokens:** `[duration + easing — e.g., "motion-fast (150ms) motion-ease-out"]`

### Data Dependencies
- **External data:** `[what the component fetches or depends on — e.g., "calls `useUser(id)` hook, expects `{ name: string; email: string; avatarUrl?: string }`"]`
- **Context:** `[if the component consumes React context — e.g., "reads `ThemeContext` for dark/light mode"]`

### Performance / Scale
- **Scale note:** `[if the component handles large data — e.g., "renders 1000+ rows — use virtualization"]`
- **Optimization hints:** `[if specific performance patterns are needed — e.g., "memoize expensive renders with React.memo"]`

### Shared Components
- **shadcn/ui components:** `[which shadcn/ui primitives to use — e.g., "use `<Button>` with `variant='outline'`, `<Dialog>` for modals, `<Input>` for text fields, `<Select>` for dropdowns, `<Table>` for data grids"]`
- **Component tree:** `[which shared components compose this one — e.g., "compose `<Card>`, `<CardHeader>`, `<CardContent>`, `<CardFooter>` from shadcn/ui"]`
- **Custom atoms:** `[which custom (non-shadcn) atoms to use — e.g., "use `<Logo>` for branding, `<StatusBadge>` for status indicators"]`

> **Rule:** Abstract early, compose later. If writing a small UI element (button, input, heading, badge) and it's used in more than one place, extract it into a shared component immediately. Scan for existing shared components first — if one exists, use it. If not, create it. Prefer shadcn/ui over building from scratch for standard patterns (buttons, dialogs, forms, tables, dropdowns, tooltips, etc.).

### Dependencies
- **Cross-category:** `[other tasks this depends on, named by their ticket id and what each supplies — e.g., "the backend-logic ticket that lands `formatUserProfile`", "the task that owns the shared `<Badge>`"]`
- **Dependency links:** `[the blocks edges this ticket sits on, named by ticket id — the one task it waits on and the gate it blocks — for execution ordering]`

### Pattern
- **Structure:** `[reference for layout/structure — e.g., "follow `src/components/add-user-modal.tsx` for overlay + panel pattern, use shadcn/ui `<Dialog>`"]`
- **Styling:** `[reference for token usage — e.g., "follow `src/components/settings-card.tsx` for `bg-card`, `border-border`, `text-muted-foreground` tokens"]`
- **shadcn/ui pattern:** `[reference for shadcn/ui component usage — e.g., "follow `src/components/user-table.tsx` for `<Table>`, `<TableRow>`, `<TableCell>` usage"]`
- **State management:** `[reference for state patterns — e.g., "follow `src/hooks/useToggle.ts` for boolean state with controlled open/close"]`
- **What NOT to follow:** `[e.g., "Do not follow `src/components/legacy-modal.tsx` — uses inline styles and hardcoded colors, not shadcn/ui `<Dialog>`"]`

> **Note:** If no good pattern exists for an aspect, say so: "No existing pattern for error state handling — implement based on the design token system."
```

## Key Design Decisions

- **Props, not Input/Output:** Components receive props, not "input." This is component-native framing.
- **State & Events, not Logic:** Frontend "logic" is UI behavior (state transitions, event handlers), not business logic.
- **Accessibility as a separate section:** Accessibility is not styling — it's a behavioral requirement. Separate section ensures comprehensive coverage (roles, ARIA, focus, keyboard, screen reader).
- **Animation/Motion as a separate section:** Entry/exit animations and micro-interactions are not covered by Styling or State & Events alone.
- **Data Dependencies as a separate section:** A component's external data fetch is neither a prop nor internal state. This fills that gap.
- **Performance/Scale as a separate section:** Large lists, virtualization, and optimization hints need explicit callout.
- **Dependencies section:** Cross-category dependencies (backend-logic tasks, shared component tasks) must be explicit so the execution agent knows what data comes from where.
- **Multiple pattern references:** One blanket pattern reference is too narrow. Target references for structure, styling, state management separately.