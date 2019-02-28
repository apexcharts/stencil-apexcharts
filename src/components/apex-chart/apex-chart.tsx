import { Component, Prop, State } from '@stencil/core';
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
  styleUrl: 'apex-chart.css',
  shadow: false
})
export class chart {
  chartRef: HTMLElement;

  /**
   * Internal ApexCharts instance
   */
  @State() chartObj: ApexCharts = null;

  /**
   * ApexCharts type
   */
  @Prop() type: ApexChartType;

  /**
   * ApexChart height
   */
  @Prop() height: ApexChartHeight;

  /**
   * ApexChart width
   */
  @Prop() width: ApexChartWidth;

  /**
   * ApexCharts options
   */
  @Prop() options: ApexOptions;

  /**
   * ApexCharts series
   */
  @Prop() series: ApexOptionsSeries;

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
