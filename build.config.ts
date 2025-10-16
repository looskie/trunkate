import dts from "bun-plugin-dts";

await Bun.build({
  format: "esm",
  entrypoints: ["./index.tsx"],
  minify: true,
  plugins: [
    dts({
      output: { noBanner: true },
    }),
  ],
  outdir: "./dist",
  external: ["react", "react-dom"],
});

console.log("Built");
