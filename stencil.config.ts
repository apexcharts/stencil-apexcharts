import { Config } from "@stencil/core";

export const config: Config = {
  namespace: "apex",
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "../loader",
    },
    {
      type: "dist-custom-elements",
    },
    {
      type: "docs-readme",
    },
    {
      type: "www",
      serviceWorker: null, // disable service workers
      copy: [
        {
          src: "examples",
        },
      ],
    },
  ],
  extras: {
    enableImportInjection: true,
  },
  // apexcharts is the app's, never this package's: every output leaves the
  // import to the app's bundler, or to the page's window.ApexCharts (see
  // loadApexCharts in apex-chart.tsx). Bundled, it pinned every user to the
  // version installed when the package was built.
  rollupConfig: {
    inputOptions: {
      external: [/^apexcharts(\/|$)/],
    },
  },
};
