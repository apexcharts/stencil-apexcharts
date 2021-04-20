import { Component, h, Method, Prop, State, Watch } from "@stencil/core";
import ApexCharts, { ApexOptions } from "apexcharts";

const config = (
  options: ApexOptions,
  type: globalThis.ApexChart["type"],
  width: globalThis.ApexChart["width"],
  height: globalThis.ApexChart["height"],
  toolbar: globalThis.ApexChart["toolbar"],
  stacked: globalThis.ApexChart["stacked"],
  stackType: globalThis.ApexChart["stackType"],
  series: ApexOptions["series"]
): ApexOptions => {
  const chart: globalThis.ApexChart = options.chart ? { ...options.chart } : {};
  if (type) {
    chart.type = type;
  }
  if (width) {
    chart.width = width;
  }
  if (height) {
    chart.height = height;
  }
  if (toolbar) {
    chart.toolbar = toolbar;
  }
  if (stacked) {
    chart.stacked = stacked;
  }
  if (stackType) {
    chart.stackType = stackType;
  }
  return series ? { ...options, chart, series } : { ...options, chart };
};

if (window) {
  const win = window as any;
  win.ApexCharts = ApexCharts;
}

@Component({
  tag: "apex-chart",
  styleUrl: "apex-chart.css",
})
export class ApexChart {
  chartRef: HTMLElement;

  /**
   * Internal ApexCharts instance
   */
  @State() chartObj: ApexCharts = null;

  /**
   * (optional) Type
   * @see https://apexcharts.com/docs/options/chart/type/
   */
  @Prop() type?: globalThis.ApexChart["type"];

  /**
   * (optional) Width
   * @see https://apexcharts.com/docs/options/chart/width/
   */
  @Prop() width?: globalThis.ApexChart["width"];

  /**
   * (optional) Height
   * @see https://apexcharts.com/docs/options/chart/height/
   */
  @Prop() height?: globalThis.ApexChart["height"];

  /**
   * (optional) Toolbar
   * @see https://apexcharts.com/docs/options/chart/toolbar/
   */
  @Prop() toolbar?: globalThis.ApexChart["toolbar"];

  /**
   * (optional) Stacked
   * @see https://apexcharts.com/docs/options/chart/stacked/
   */
  @Prop() stacked?: globalThis.ApexChart["stacked"];

  /**
   * (optional) StackType
   * @see https://apexcharts.com/docs/options/chart/stackType/
   */
  @Prop() stackType?: globalThis.ApexChart["stackType"];

  /**
   * (optional) Options
   * @see https://apexcharts.com/docs/options/
   */
  @Prop({ mutable: true }) options?: ApexOptions;

  @Watch("options")
  optionsChanged(options: ApexOptions) {
    if (this.chartObj !== null) {
      return this.chartObj.updateOptions(
        config(
          options,
          this.type,
          this.width,
          this.height,
          this.toolbar,
          this.stacked,
          this.stackType,
          this.series
        )
      );
    }
  }

  /**
   * (optional) Series
   * @see https://apexcharts.com/docs/options/series/
   */
  @Prop({ mutable: true }) series?: ApexOptions["series"];

  @Watch("series")
  seriesChanged(series: ApexOptions["series"]) {
    if (this.chartObj !== null) {
      this.chartObj.updateSeries(series, true);
    }
  }

  /**
   * Updates the configuration object. The new config object is merged with the existing config object preserving the existing configuration.
   * @param newOptions The configuration object to merge on the existing one
   * @param redrawPaths When the chart is re-rendered, should it draw from the existing paths or completely redraw the chart paths from the beginning. By default, the chart is re-rendered from the existing paths
   * @param animate Should the chart animate on re-rendering
   */
  @Method()
  async updateOptions(
    newOptions: ApexOptions,
    redrawPaths?: boolean,
    animate?: boolean
  ) {
    return this.chartObj.updateOptions(newOptions, redrawPaths, animate);
  }

  async componentDidLoad() {
    if (this.chartObj === null) {
      this.chartObj = new ApexCharts(
        this.chartRef,
        config(
          this.options,
          this.type,
          this.width,
          this.height,
          this.toolbar,
          this.stacked,
          this.stackType,
          this.series
        )
      );
      return this.chartObj.render();
    }
  }

  disconnectedCallback() {
    if (this.chartObj !== null) {
      this.chartObj.destroy();
    }
  }

  render() {
    return <div ref={(el) => (this.chartRef = el)} />;
  }
}
