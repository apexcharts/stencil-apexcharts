// Type-only barrel, deliberately. Stencil derives the layout of dist/types
// from the files reachable here, and without an index the component's
// declaration landed at dist/types/stencil-apexcharts/.stencil/apex-chart.d.ts
// while the generated components.d.ts imported it from
// ./components/apex-chart/apex-chart, so every consumer typecheck failed.
//
// Keep this free of value exports. Exporting the component class pulls the
// whole component, and with it the inlined ApexCharts bundle, into
// dist/esm/index.js and dist/index.cjs.js, adding about a megabyte to the
// tarball for an entry point nobody uses: this package is consumed through
// the <apex-chart> element and stencil-apexcharts/loader.
export type { ChartType } from './components/apex-chart/apex-chart';
