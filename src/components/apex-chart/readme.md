# apex-chart



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                   | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Default     |
| ----------- | ------------ | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `height`    | `height`     | Chart height                  | `number \| string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `undefined` |
| `options`   | `options`    | Chart configuration options   | `ApexOptions \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `undefined` |
| `series`    | `series`     | Chart series data             | `number[] \| undefined \| { name?: string \| undefined; type?: string \| undefined; color?: string \| undefined; group?: string \| undefined; hidden?: boolean \| undefined; zIndex?: number \| undefined; parsing?: ApexParsing \| undefined; data: (number \| null)[] \| { x: any; y: any; fill?: ApexFill \| undefined; fillColor?: string \| undefined; strokeColor?: string \| undefined; meta?: any; goals?: { name?: string \| undefined; value: number; strokeHeight?: number \| undefined; strokeWidth?: number \| undefined; strokeColor?: string \| undefined; strokeDashArray?: number \| undefined; strokeLineCap?: "butt" \| "square" \| "round" \| undefined; }[] \| undefined; barHeightOffset?: number \| undefined; columnWidthOffset?: number \| undefined; }[] \| [number, number \| null][] \| [number, (number \| null)[]][] \| number[][] \| Record<string, any>[]; }[]` | `undefined` |
| `stackType` | `stack-type` | Stack type for stacked charts | `"100%" \| "normal" \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `undefined` |
| `stacked`   | `stacked`    | Enable stacked charts         | `boolean \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `undefined` |
| `toolbar`   | `toolbar`    | Toolbar configuration         | `undefined \| { show?: boolean \| undefined; offsetX?: number \| undefined; offsetY?: number \| undefined; tools?: { download?: string \| boolean \| undefined; selection?: string \| boolean \| undefined; zoom?: string \| boolean \| undefined; zoomin?: string \| boolean \| undefined; zoomout?: string \| boolean \| undefined; pan?: string \| boolean \| undefined; reset?: string \| boolean \| undefined; } \| undefined; export?: { csv?: { filename?: string \| undefined; columnDelimiter?: string \| undefined; headerCategory?: string \| undefined; headerValue?: string \| undefined; } \| undefined; svg?: { filename?: string \| undefined; } \| undefined; png?: { filename?: string \| undefined; } \| undefined; } \| undefined; autoSelected?: "zoom" \| "selection" \| "pan" \| undefined; }`                                                                           | `undefined` |
| `type`      | `type`       | Chart type                    | `"area" \| "bar" \| "boxPlot" \| "bubble" \| "candlestick" \| "donut" \| "heatmap" \| "line" \| "pie" \| "polarArea" \| "radar" \| "radialBar" \| "rangeArea" \| "rangeBar" \| "scatter" \| "treemap" \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `undefined` |
| `width`     | `width`      | Chart width                   | `number \| string \| undefined`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `undefined` |


## Methods

### `refresh() => Promise<void>`

Destroy and recreate the chart

#### Returns

Type: `Promise<void>`



### `updateOptions(newOptions: ApexOptions, redrawPaths?: boolean, animate?: boolean) => Promise<void>`

Update chart configuration

#### Parameters

| Name          | Type          | Description |
| ------------- | ------------- | ----------- |
| `newOptions`  | `ApexOptions` |             |
| `redrawPaths` | `boolean`     |             |
| `animate`     | `boolean`     |             |

#### Returns

Type: `Promise<void>`



### `updateSeries(newSeries: ApexOptions["series"], animate?: boolean) => Promise<void>`

Update chart series

#### Parameters

| Name        | Type                                  | Description |
| ----------- | ------------------------------------- | ----------- |
| `newSeries` | `ApexNonAxisChartSeries \| undefined` |             |
| `animate`   | `boolean`                             |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
