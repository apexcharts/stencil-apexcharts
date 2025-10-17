import { 
  Component, 
  h, 
  Method, 
  Prop, 
  State, 
  Watch, 
  Element 
} from "@stencil/core";
import ApexCharts, { ApexOptions } from "apexcharts";

type ChartType = 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'rangeArea' | 'treemap';

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

if (typeof window !== 'undefined') {
  (window as any).ApexCharts = ApexCharts;
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
      return this.chartInstance.updateOptions(newOptions, redrawPaths, animate);
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
      return this.chartInstance.updateSeries(newSeries, animate);
    }
  }

  /**
   * Destroy and recreate the chart
   */
  @Method()
  async refresh(): Promise<void> {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      await this.initChart();
    }
  }

  private async initChart(): Promise<void> {
    if (this.chartRef) {
      const config = buildConfig(
        this.options,
        {
          type: this.type,
          width: this.width,
          height: this.height,
        },
        this.series
      );

      this.chartInstance = new ApexCharts(this.chartRef, config);
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