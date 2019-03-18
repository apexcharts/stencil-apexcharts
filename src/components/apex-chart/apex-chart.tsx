import { Component, Prop, State, Watch } from '@stencil/core';
import ApexCharts from 'apexcharts';
import { ApexOptions } from 'apexcharts';
import {
  ApexChartType,
  ApexChartHeight,
  ApexChartWidth,
  ApexOptionsSeries
} from './apex-charts';

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
@Component({
  tag: 'apex-chart',
  shadow: false
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

  @Watch('options')
  optionsChanged(options) {
    if (this.chartObj !== null) {
      return this.chartObj.updateOptions(
        config(options, this.type, this.width, options, this.series)
      );
    }
  }

  /**
   * (optional) Series
   * @see https://apexcharts.com/docs/options/series/
   */
  @Prop({ mutable: true }) series?: ApexOptionsSeries;

  @Watch('series')
  seriesChanged(series) {
    if (this.chartObj !== null) {
      this.chartObj.updateSeries(series, true);
    }
  }

  componentDidLoad() {
    if (this.chartObj === null) {
      this.chartObj = new ApexCharts(
        this.chartRef,
        config(this.options, this.type, this.width, this.height, this.series)
      );
      return this.chartObj.render();
    }
  }

  componentDidUnload() {
    if (this.chartObj !== null) {
      this.chartObj.destroy();
    }
  }

  render() {
    return <div ref={el => (this.chartRef = el)} />;
  }
}
