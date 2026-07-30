# CLAUDE.md

# Frontend Engineering Principles

Assume another engineer will debug this UI at 3 AM during a production incident.

Every decision should optimize for:

- Readability
- Predictability
- Easy debugging
- Fewer files
- Less abstraction
- Explicit state flow

Do not optimize for clever React patterns.

---

## Simplicity First

Prefer writing straightforward code over creating abstractions.

If a component is only used once, keep it in the same file.

Avoid creating hooks, helpers, providers, contexts, or utility files unless they remove significant duplication.

---

## Component Design

Components should have one responsibility.

Good examples:

- FileUploadCard
- WorkspaceSidebar
- SearchResults
- DocumentViewer

Avoid components that do many unrelated things.

---

## State Management

Keep state as close as possible to where it is used.

Prefer:

- useState
- useReducer (only when state becomes complex)

Avoid unnecessary Context providers.

Only introduce global state when multiple unrelated pages genuinely require it.

---

## Naming

Use descriptive names.

Good

```tsx
selectedWorkspace
uploadedFiles
searchResults
documentPreview
```

Bad

```tsx
data
list
tmp
res
value
x
```

Functions should describe exactly what they do.

```tsx
loadWorkspace()
uploadFiles()
deleteDocument()
refreshSearchResults()
```

instead of

```tsx
load()
run()
handle()
process()
```

---

## Component Size

Aim for 100–200 lines.

If a component exceeds ~300 lines because it contains multiple responsibilities, split it.

Do not split components simply because they are "too long."

---

## File Structure

Prefer fewer files.

Good

```
app/
components/
lib/
types/
```

Avoid

```
hooks/
contexts/
providers/
constants/
helpers/
utils/
services/
factories/
builders/
adapters/
```

Only create a new folder when it clearly improves organization.

---

## Data Fetching

Keep API calls simple.

```tsx
const workspaces = await workspaceApi.list();
```

Avoid unnecessary wrapper layers.

---

## Tailwind

Prefer Tailwind utilities directly inside components.

Avoid extracting tiny class helpers.

Good

```tsx
className="flex items-center gap-2 rounded-lg border p-4"
```

Avoid

```tsx
cardStyles.primary
```

unless reused many times.

---

## Comments

Comment only when explaining:

- architectural decisions
- browser quirks
- external API workarounds
- performance tradeoffs

Never comment obvious code.

---

## Error Handling

Always handle:

- loading
- empty
- error
- success

Every async operation should have visible feedback.

---

## Readability

Prefer explicit code.

Good

```tsx
if (!workspace) {
    return <EmptyState />;
}
```

instead of

```tsx
return workspace && <Dashboard />;
```

---

## Reuse

Duplicate small amounts of code before creating abstractions.

Three similar implementations are better than one complicated generic solution.

Abstract only after a pattern becomes obvious.

---

## Styling

- Tailwind only
- No CSS Modules
- No styled-components
- No inline styles unless dynamic

---

## Icons

Use Lucide.

Keep icon size and spacing consistent.

---

## Forms

Use React Hook Form for complex forms.

Simple dialogs can use useState.

---

## Performance

Do not optimize prematurely.

Only introduce:

- useMemo
- useCallback
- React.memo

when profiling shows they are needed.

---

## Philosophy

This project values:

- Less code
- Less abstraction
- Less indirection
- Fewer files
- Predictable components
- Easy debugging
- Fast onboarding

When unsure, write the version that a new engineer can understand in under two minutes.
