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

type ChartToolbar = {
  show?: boolean
  offsetX?: number
  offsetY?: number
  tools?: {
    download?: boolean | string
    selection?: boolean | string
    zoom?: boolean | string
    zoomin?: boolean | string
    zoomout?: boolean | string
    pan?: boolean | string
    reset?: boolean | string
  }
  export?: {
    csv?: {
      filename?: string
      columnDelimiter?: string
      headerCategory?: string
      headerValue?: string
    }
    svg?: {
      filename?: string
    }
    png?: {
      filename?: string
    }
  }
  autoSelected?: 'zoom' | 'selection' | 'pan'
}

const buildConfig = (
  options: ApexOptions = {},
  overrides: {
    type?: ChartType;
    width?: string | number;
    height?: string | number;
    toolbar?: ChartToolbar;
    stacked?: boolean;
    stackType?: '100%' | 'normal';
  },
  series?: ApexOptions['series']
): ApexOptions => {
  // Use a simple object for the chart configuration
  const chart = { ...options.chart };
  
  // Apply overrides to chart config
  if (overrides.type !== undefined) chart.type = overrides.type;
  if (overrides.width !== undefined) chart.width = overrides.width;
  if (overrides.height !== undefined) chart.height = overrides.height;
  if (overrides.toolbar !== undefined) chart.toolbar = overrides.toolbar;
  if (overrides.stacked !== undefined) chart.stacked = overrides.stacked;
  if (overrides.stackType !== undefined) chart.stackType = overrides.stackType;

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
  private resizeObserver?: ResizeObserver;
  private resizeTimeout?: ReturnType<typeof setTimeout>;

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
   * Toolbar configuration
   */
  @Prop() toolbar?: ChartToolbar;

  /**
   * Enable stacked charts
   */
  @Prop() stacked?: boolean;

  /**
   * Stack type for stacked charts
   */
  @Prop() stackType?: '100%' | 'normal';

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
          toolbar: this.toolbar,
          stacked: this.stacked,
          stackType: this.stackType,
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
  @Watch('toolbar')
  @Watch('stacked')
  @Watch('stackType')
  configChanged() {
    if (this.chartInstance) {
      const config = buildConfig(
        this.options,
        {
          type: this.type,
          width: this.width,
          height: this.height,
          toolbar: this.toolbar,
          stacked: this.stacked,
          stackType: this.stackType,
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
          toolbar: this.toolbar,
          stacked: this.stacked,
          stackType: this.stackType,
        },
        this.series
      );

      this.chartInstance = new ApexCharts(this.chartRef, config);
      await this.chartInstance.render();
    }
  }

  async componentDidLoad() {
    await this.initChart();
    
    // Setup resize observer for responsive charts
    if ('ResizeObserver' in window && this.chartRef) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.chartInstance) {
          // Debounce resize to avoid too many updates
          clearTimeout(this.resizeTimeout);
          this.resizeTimeout = setTimeout(() => {
            if (this.chartInstance) {
              // Force chart to recalculate dimensions
              this.chartInstance.updateOptions({
                chart: {
                  width: '100%',
                  height: this.height || 'auto'
                }
              }, false, false);
            }
          }, 100);
        }
      });
      this.resizeObserver.observe(this.hostElement);
    }
  }

  disconnectedCallback() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
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