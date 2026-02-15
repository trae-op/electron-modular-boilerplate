# LazyRender — Virtualized list helper (React)

**Purpose:** Render large lists efficiently using windowing (via `react-window`) and automatic sizing (`react-virtualized-auto-sizer`). This guide explains how `LazyRender` works, its props, patterns, and examples (including event-delegation and integration tips used in our codebase).

---

## 🔧 What `LazyRender` does

- Wraps `react-window`'s `List` with an `AutoSizer` so the list fills the available space.
- Exposes a simple API: provide item count, item height and a row renderer (children function) and it handles virtualization for you.
- Returns a `renderMessageNotFound` when there are no items (unless `isLoading` is true).
- Memoized with a deep-equality check to avoid unnecessary re-renders when props are stable.

> Implementation highlights:
>
> - Row renderer is built using `buildRowRenderer(children, itemData)` so your row gets `index`, `style`, and `itemData`.
> - `rowProps={{ itemData }}` passes custom data into `react-window` rows.
> - `overscanCount` is set to `5` to reduce visible blankness while scrolling.

---

## 📋 Props (from `src/renderer/composites/LazyRender/types.ts`)

- `itemCount: number` — number of items in the list (required).
- `heightItemComponent: number` — height (px) for every row (required).
- `children: ({ index, style, itemData }) => ReactElement` — row renderer (required). Must apply `style` to the outer element.
- `itemData?: Record<string, unknown>` — arbitrary data passed to each row (optional).
- `renderMessageNotFound?: ReactElement` — fallback UI when `itemCount` is falsy and `isLoading` is `false`.
- `isLoading?: boolean` — when `true`, the empty message is suppressed (optional).
- `isRefresh?: boolean` — used as a memoization input (optional).
- `heightContainer?: number` — force list container height (optional).
- `widthContainer?: number` — force list container width (optional).
- `classNameContainer?: string` — CSS class for the list container (optional).

---

## ✅ Basic usage

```tsx
import { LazyRender } from "@composites/LazyRender";
import { CSSProperties, memo } from "react";

type TCollection = { id: number; name: string };
const collection: TCollection[] = [
  { id: 1, name: "name 1" },
  { id: 2, name: "name 2" },
];

const Item = memo(({ id, name }: TCollection) => (
  <div className="px-4 py-2">{name}</div>
));

<LazyRender
  itemCount={collection.length}
  heightItemComponent={48}
  renderMessageNotFound={<div className="p-4">No items</div>}
  itemData={{ items: collection }}
>
  {({
    index,
    style,
    itemData,
  }: {
    index: number;
    style: CSSProperties;
    itemData?: { items?: TCollection[] };
  }) => (
    <div style={style}>
      <Item
        id={itemData?.items?.[index].id}
        name={itemData?.items?.[index].name}
      />
    </div>
  )}
</LazyRender>;
```

> Important: always pass the `style` prop from `react-window` to the row root element. This ensures proper positioning and virtualization behavior. Also important always make wrap item for `style`! I mean, don't add to props of component `<Item style={style} />`. Always wrap `<div style={style}>`. Also the object `itemData` mustn't add to component `<Item itemData={itemData} />`! You must add only primitives props `<Item id={itemData?.items?.[index].id} />`.

---

## 🧩 Example with event delegation (delete button)

Use a container-level click handler so you don't attach listeners per row (efficient for large lists):

```tsx
const handleDelete = (event: MouseEvent<HTMLDivElement>) => {
  const target = event.target as HTMLElement;
  const actionElement = target.closest('[data-action]');
  if (!actionElement) return;

  const action = actionElement.getAttribute('data-action');
  const itemId = actionElement.getAttribute('data-item-id');

  if (action === 'delete' && itemId) {
    // parse id or dispatch delete
    console.log('delete', itemId);
  }
};

<div onClick={handleDelete}>
  <LazyRender ...>
    {({ index, style, itemData }) => (
      <div style={style}>
        <div data-action="delete" data-item-id={`item-${itemData?.items?.[index].id}`}>
          Delete
        </div>
      </div>
    )}
  </LazyRender>
</div>
```

This pattern is used in our guides and examples (see `docs/event-delegation-guide.md`).

---

## 💡 Optimization & best practices

1. **Keep `itemData` identity stable** — wrap arrays/objects in `useMemo` so deep-equality checks don't trigger re-renders: `const data = useMemo(() => ({ items }), [items]);`.
2. **Avoid inline functions or objects as props** — pass stable references when possible.
3. **Give a fixed `heightItemComponent`** — virtualization requires a fixed row height.
4. **Use `renderMessageNotFound`** for graceful empty state (it won't show when `isLoading` is `true`).
5. **Make rows pure components** — memoize row components when rendering heavy children.
6. **Stop propagation** for nested clickable controls that should not trigger delegated handlers: `onClick={(e) => e.stopPropagation()}`.

---

## ⚠️ Pitfalls and notes

- If you forget to apply the `style` from the children renderer, rows will not be positioned correctly and virtualization will break.
- Changing the shape or reference of `itemData` on every render causes the memo equality check to think props changed — use `useMemo`.
- `LazyRender` assumes fixed-height rows. For variable row heights, use a different `react-window` strategy (e.g., `VariableSizeList`).

---

## 🔍 Where to look in the repo

- Component: `src/renderer/composites/LazyRender/LazyRender.tsx`
- Types: `src/renderer/composites/LazyRender/types.ts`
- Example usage: `src/renderer/windows/home/TestUI.tsx` (see the `LazyRender` example there)

---

## Summary ✅

`LazyRender` is a small, focused helper for virtualized lists. Use it when rendering large collections: provide a stable `itemCount`, a fixed `heightItemComponent`, pass `itemData` (memoized if needed), and implement rows that accept and apply `style`. Combine it with event delegation to handle row actions efficiently.

Happy virtualizing! 🚀
