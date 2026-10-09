import { 
  Component, 
  h, 
  Method, 
  Prop, 
  State, 
  Watch, 
  Element 
} from "@stencil/core";
// Types only. The class is the app's own, resolved when a chart is first
// drawn (loadApexCharts below), never a copy bundled into this package.
import type ApexCharts from "apexcharts";
import type { ApexOptions } from "apexcharts";

// Exported because Stencil's generated dist/types/components.d.ts references
// ChartType by name in the ApexChart interface. It only emits an import for a
// referenced type if that type is exported from the component file, so while
// this was local the generated declarations referred to a name that was never
// in scope and every consumer typecheck failed with "Cannot find name
// 'ChartType'".
export type ChartType = 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'rangeArea' | 'treemap';

const buildConfig = (
  options: ApexOptions = {},
  overrides: {
    type?: ChartType;
    width?: string | number;
    height?: string | number;
  },
  series?: ApexOptions['series']
): ApexOptions => {
  // Use a simple object for the chart configuration
  const chart = { ...options.chart };
  
  // Apply overrides to chart config
  if (overrides.type !== undefined) chart.type = overrides.type;
  if (overrides.width !== undefined) chart.width = overrides.width;
  if (overrides.height !== undefined) chart.height = overrides.height;

  const config: ApexOptions = { 
    ...options, 
    chart 
  };

  if (series !== undefined) {
    config.series = series;
  }

  return config;
};

/**
 * The ApexCharts class this element draws with: the app's own.
 *
 * Up to 3.1.2 this file imported apexcharts and Stencil bundled the version
 * installed when the package was built (5.3.5) into every output, so the
 * element drew with that copy whatever the app had installed, and a CDN page
 * that loaded apexcharts.min.js first had its window.ApexCharts replaced by
 * the bundled one. Now apexcharts stays external (stencil.config.ts):
 *
 * - A bundled app: import('apexcharts') is resolved by the app's bundler to
 *   the apexcharts it installed, the peer dependency.
 * - A script-tag page: that import has nothing to resolve a bare name against
 *   and fails, and the element uses the window.ApexCharts the page loaded.
 *
 * One lookup per page. window.ApexCharts is still set when the page has none,
 * as it always was, for code that calls ApexCharts.exec() and friends.
 */
let apexChartsClass: Promise<typeof ApexCharts> | null = null;

function loadApexCharts(): Promise<typeof ApexCharts> {
  if (!apexChartsClass) {
    const win: any = typeof window !== "undefined" ? window : undefined;
    apexChartsClass = import("apexcharts").then(
      (mod: any) => {
        const cls = mod.default ?? mod;
        if (win && !win.ApexCharts) win.ApexCharts = cls;
        return cls;
      },
      () => {
        if (win && win.ApexCharts) return win.ApexCharts;
        throw new Error(
          "stencil-apexcharts: ApexCharts is not loaded. Install the apexcharts package, or on a page without a bundler load apexcharts.min.js before this component."
        );
      }
    );
  }
  return apexChartsClass;
}

@Component({
  tag: "apex-chart",
  styleUrl: "apex-chart.css",
  shadow: false,
})
export class ApexChartComponent {
  @Element() hostElement!: HTMLElement;
  
  private chartRef!: HTMLDivElement;

  /**
   * Internal ApexCharts instance
   */
  @State() chartInstance: ApexCharts | null = null;

  /**
   * Chart type
   */
  @Prop() type?: ChartType;

  /**
   * Chart width
   */
  @Prop() width?: string | number;

  /**
   * Chart height  
   */
  @Prop() height?: string | number;

  /**
   * Chart configuration options
   */
  @Prop({ mutable: true }) options?: ApexOptions;

  /**
   * Chart series data
   */
  @Prop({ mutable: true }) series?: ApexOptions['series'];

  @Watch('options')
  optionsChanged(newOptions: ApexOptions) {
    if (this.chartInstance) {
      const config = buildConfig(
        newOptions,
        {
          type: this.type,
          width: this.width,
          height: this.height,
        },
        this.series
      );
      
      this.chartInstance.updateOptions(config, true, true);
    }
  }

  @Watch('series')
  seriesChanged(newSeries: ApexOptions['series']) {
    if (this.chartInstance && newSeries) {
      this.chartInstance.updateSeries(newSeries, true);
    }
  }

  @Watch('type')
  @Watch('width') 
  @Watch('height')
  configChanged() {
    if (this.chartInstance) {
      const config = buildConfig(
        this.options,
        {
          type: this.type,
          width: this.width,
          height: this.height,
        },
        this.series
      );
      
      this.chartInstance.updateOptions(config, true, true);
    }
  }

  /**
   * Update chart configuration
   */
  @Method()
  async updateOptions(
    newOptions: ApexOptions,
    redrawPaths = true,
    animate = true
  ): Promise<void> {
    if (this.chartInstance) {
      // `await` rather than `return`: apexcharts resolves updateOptions with
      // the chart instance, and returning that from a method declared
      // Promise<void> stopped compiling once the upstream signature changed
      // from Promise<void> to Promise<ApexCharts>. Awaiting keeps this
      // method's contract, keeps it building against every apexcharts
      // version, and avoids handing callers the internal instance across the
      // custom-element boundary.
      await this.chartInstance.updateOptions(newOptions, redrawPaths, animate);
    }
  }

  /**
   * Update chart series
   */
  @Method()
  async updateSeries(
    newSeries: ApexOptions['series'],
    animate = true
  ): Promise<void> {
    if (this.chartInstance && newSeries) {
      // See updateOptions above: awaited, not returned, so this keeps its
      // Promise<void> contract whatever apexcharts resolves with.
      await this.chartInstance.updateSeries(newSeries, animate);
    }
  }

  /**
   * Destroy and recreate the chart
   */
  @Method()
  async refresh(): Promise<void> {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
      await this.initChart();
    }
  }

  private async initChart(): Promise<void> {
    if (this.chartRef) {
      let ApexChartsClass: typeof ApexCharts;
      try {
        ApexChartsClass = await loadApexCharts();
      } catch (error) {
        console.error(error);
        return;
      }
      // Loading is asynchronous now: the element may have been removed, or
      // already given a chart by a refresh(), while it waited.
      if (!this.hostElement.isConnected || this.chartInstance) return;

      // Read after the wait, so props set meanwhile are not lost.
      const config = buildConfig(
        this.options,
        {
          type: this.type,
          width: this.width,
          height: this.height,
        },
        this.series
      );

      this.chartInstance = new ApexChartsClass(this.chartRef, config);
      await this.chartInstance.render();
    }
  }

  async componentDidLoad() {
    await this.initChart();
  }

  disconnectedCallback() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  render() {
    return (
      <div 
        class="apex-chart-container"
        ref={el => this.chartRef = el!}
      />
    );
  }
}