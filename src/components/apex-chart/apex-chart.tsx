import { Component, h, Method, Prop, State, Watch } from "@stencil/core";
import ApexCharts, { ApexOptions } from "apexcharts";
import {
  ApexChartHeight,
  ApexChartType,
  ApexChartWidth,
  ApexOptionsSeries,
} from ".";

const config = (
  options: ApexOptions,
  type: ApexChartType,
  width: ApexChartWidth,
  height: ApexChartHeight,
  series: ApexOptionsSeries
): ApexOptions => {
  const chart: ApexChart = options.chart ? { ...options.chart } : {};
  if (type) {
    chart.type = type;
  }
  if (width) {
    chart.width = width;
  }
  if (height) {
    chart.height = height;
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
export class chart {
  chartRef: HTMLElement;

  /**
   * Internal ApexCharts instance
   */
  @State() chartObj: ApexCharts = null;

  /**
   * (optional) Type
   * @see https://apexcharts.com/docs/options/chart/type/
   */
  @Prop() type?: ApexChartType;

  /**
   * (optional) Width
   * @see https://apexcharts.com/docs/options/chart/width/
   */
  @Prop() width?: ApexChartWidth;

  /**
   * (optional) Height
   * @see https://apexcharts.com/docs/options/chart/height/
   */
  @Prop() height?: ApexChartHeight;

  /**
   * (optional) Options
   * @see https://apexcharts.com/docs/options/
   */
  @Prop({ mutable: true }) options?: ApexOptions;

  @Watch("options")
  optionsChanged(options: ApexOptions) {
    if (this.chartObj !== null) {
      return this.chartObj.updateOptions(
        config(options, this.type, this.width, this.height, this.series)
      );
    }
  }

  /**
   * (optional) Series
   * @see https://apexcharts.com/docs/options/series/
   */
  @Prop({ mutable: true }) series?: ApexOptionsSeries;

  @Watch("series")
  seriesChanged(series: ApexOptionsSeries) {
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
        config(this.options, this.type, this.width, this.height, this.series)
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
