import { useRef, useState, useEffect, memo, useMemo } from "react";
import { useTruncate } from "../../index";

// Generate N labels
const generateLabels = (count: number) => {
  const colors = [
    "#e5484d",
    "#0090ff",
    "#8e4ec6",
    "#46a758",
    "#f76b15",
    "#ffe629",
    "#e93d82",
    "#00a2c7",
    "#ab4aba",
    "#30a46c",
  ];

  const names = [
    "Bug",
    "Feature",
    "Improvement",
    "Documentation",
    "Design",
    "Question",
    "Security",
    "Performance",
    "Testing",
    "Refactor",
    "Enhancement",
    "Critical",
    "High Priority",
    "Low Priority",
    "Blocked",
    "In Progress",
    "Ready",
    "Review",
    "Approved",
    "Deployed",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: names[i % names.length],
    color: colors[i % colors.length],
  }));
};

const Label = memo(function Label({
  label,
}: {
  label: { id: number; name?: string; color?: string };
}) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded cursor-pointer transition-colors hover:bg-gray-50 whitespace-nowrap">
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: label.color }}
      />
      <span>{label.name}</span>
    </div>
  );
});

const OverflowIndicator = memo(function OverflowIndicator({
  count,
}: {
  count: number;
}) {
  return (
    <div
      data-truncate-indicator
      className="flex items-center justify-center px-2 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded cursor-pointer transition-colors hover:bg-gray-200 whitespace-nowrap flex-shrink-0"
    >
      +{count}
    </div>
  );
});

const LabelRow = memo(function LabelRow({
  width,
  labels,
}: {
  width: number;
  labels: ReturnType<typeof generateLabels>;
}) {
  const container = useRef<HTMLDivElement>(null);
  const overflowCount = useTruncate({
    boundary: container,
  });

  return (
    <div
      className="flex items-center gap-1.5 overflow-hidden p-3 bg-gray-50 border border-gray-200 rounded-lg mb-3"
      style={{ width }}
      ref={container}
    >
      {labels.map((label) => (
        <Label key={label.id} label={label} />
      ))}
      {overflowCount > 0 ? <OverflowIndicator count={overflowCount} /> : null}
    </div>
  );
});

function App() {
  const randomWidth = useMemo(
    () => Math.floor(Math.random() * (800 - 200 + 1)) + 250,
    [],
  );
  const [width, setWidth] = useState(randomWidth);
  const [numLabels, setNumLabels] = useState(50);
  const [numRows, setNumRows] = useState(20);
  const [renderTime, setRenderTime] = useState(0);

  const labels = useMemo(() => generateLabels(numLabels), [numLabels]);

  useEffect(() => {
    const start = performance.now();
    requestAnimationFrame(() => {
      const end = performance.now();
      setRenderTime(end - start);
    });
  }, [width, numLabels, numRows]);

  const totalLabels = numLabels * numRows;

  return (
    <div className="p-10 font-sans bg-gray-50 min-h-screen">
      <div className="sticky top-0 bg-white p-6 rounded-xl shadow-lg mb-6 z-10">
        <h1 className="text-2xl font-semibold mb-2">react-truncate</h1>
        <p className="text-sm text-gray-600 mb-6">
          {numRows} rows × {numLabels.toLocaleString()} labels each ={" "}
          {totalLabels.toLocaleString()} total labels
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label
              htmlFor="width-slider"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Container Width: {width}px
            </label>
            <input
              id="width-slider"
              type="range"
              min="200"
              max="1400"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label
              htmlFor="labels-slider"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Labels per row: {numLabels.toLocaleString()}
            </label>
            <input
              id="labels-slider"
              type="range"
              min="10"
              max="2000"
              step="10"
              value={numLabels}
              onChange={(e) => setNumLabels(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label
              htmlFor="rows-slider"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Number of rows: {numRows}
            </label>
            <input
              id="rows-slider"
              type="range"
              min="1"
              max="50"
              value={numRows}
              onChange={(e) => setNumRows(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <div>
            <strong className="text-gray-900" title="Time To Next Frame">
              TTNF:
            </strong>{" "}
            {renderTime.toFixed(2)}ms
          </div>
          <div>
            <strong className="text-gray-900">Total labels:</strong>{" "}
            {totalLabels.toLocaleString()}
          </div>
          <div>
            <strong className="text-gray-900">Rows:</strong> {numRows}
          </div>
          <div>
            <strong className="text-gray-900">Labels per row:</strong>{" "}
            {numLabels.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        {Array.from({ length: numRows }, (_, i) => (
          <LabelRow key={i} width={width} labels={labels} />
        ))}
      </div>
    </div>
  );
}

export default App;
