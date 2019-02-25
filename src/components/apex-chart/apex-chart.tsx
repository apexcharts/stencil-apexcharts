import { Component, Prop, State } from '@stencil/core';
import ApexCharts from 'apexcharts';

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
  @State() chart: ApexCharts = null;

  /**
   * ApexCharts options
   */
  @Prop() options: object = {}

  componentDidLoad() {
    if (this.chart === null) {
      this.chart = new ApexCharts(this.chartRef, this.options);
      return this.chart.render();  
    }
  }

  componentDidUnload()  {
    if (this.chart !== null) {
      this.chart.destroy();
    }
  }
  render() {
    return <div ref={(el) => this.chartRef = el}></div>;
  }
}
