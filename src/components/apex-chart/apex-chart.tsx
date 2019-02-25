import { Component, Prop, State } from '@stencil/core';
import ApexCharts from 'apexcharts';

@Component({
  tag: 'apex-chart',
  styleUrl: 'apex-chart.css',
  shadow: false
})
export class chart {
  el: HTMLElement;
  @State() chart: ApexCharts = null;

  @Prop() options: object = {}

  componentDidLoad() {
    if (this.chart === null) {
      this.chart = new ApexCharts(this.el, this.options);
      return this.chart.render();  
    }
  }

  componentDidUnload()  {
    if (this.chart !== null) {
      this.chart.destroy();
    }
  }
  render() {
    return <div ref={(el) => this.el = el}></div>;
  }
}
