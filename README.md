# trunkate

a small react package to help you truncate elements! this is especially useful for truncating an inline set of "pills" or "badges"

## installation

### Bun

```bash
bun install trunkate
```

### NPM

```bash
npm install trunkate
```

### Yarn

```bash
yarn install trunkate
```

### PNPM

```bash
pnpm install trunkate
```

## usage

you can easily get started using trunkate by using the `useTruncate` hook. this hook takes a configuration object with the following properties:

- `boundary`: a ref to the container element that holds the items you want to truncate.
- `minBuffer`: an optional number that specifies the minimum space (in pixels) to leave

```js
const overflowCount = useTruncate({
  boundary: containerRef,
  minBuffer: 20, // optional
});
```

you can define a truncate indicator element by adding the `data-truncate-indicator` attribute to it. this element will be shown when items are truncated.

```html
<span data-truncate-indicator>+{overflowCount}</span>
```

the truncate indicator element will be automatically measured and accounted for when calculating how many items can fit within the boundary. if you conditionally render the truncate indicator, you may want to set a minimum buffer with the `minBuffer` property in the `useTruncate` hook config.

### example

```tsx
import { useRef } from "react";
import { useTruncate } from "../../index";

const items = [
  "Item 1",
  "Item 2",
  "Item 3",
  "Item 4",
  "Item 5",
  "Item 6",
  "Item 7",
  "Item 8",
];

export default function App() {
  const container = useRef<HTMLDivElement>(null);
  const overflowCount = useTruncate({
    boundary: container,
    minBuffer: 20,
  });

  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        width: 300,
        overflow: "hidden",
        whiteSpace: "nowrap",
        resize: "horizontal",
      }}
      ref={container}
    >
      {items.map((item) => (
        <span
          style={{ padding: "0 4px", backgroundColor: "lightblue" }}
          key={item}
        >
          {item}
        </span>
      ))}

      {overflowCount > 0 ? (
        <span
          style={{ paddingLeft: 12, backgroundColor: "lawngreen" }}
          data-truncate-indicator
        >
          +{overflowCount}
        </span>
      ) : null}
    </div>
  );
}
```
