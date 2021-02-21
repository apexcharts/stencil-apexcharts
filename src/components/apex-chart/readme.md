# apex-chart



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description        | Type                                                                                                                                                                                                   | Default     |
| --------- | --------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| `height`  | `height`  | (optional) Height  | `number \| string`                                                                                                                                                                                     | `undefined` |
| `options` | --        | (optional) Options | `ApexOptions`                                                                                                                                                                                          | `undefined` |
| `series`  | --        | (optional) Series  | `number[] \| { name?: string; type?: string; color?: string; data: number[] \| { x: any; y: any; fillColor?: string; strokeColor?: string; }[] \| [number, number][] \| [number, number[]][]; }[]`     | `undefined` |
| `type`    | `type`    | (optional) Type    | `"area" \| "bar" \| "boxPlot" \| "bubble" \| "candlestick" \| "donut" \| "heatmap" \| "histogram" \| "line" \| "pie" \| "polarArea" \| "radar" \| "radialBar" \| "rangeBar" \| "scatter" \| "treemap"` | `undefined` |
| `width`   | `width`   | (optional) Width   | `number \| string`                                                                                                                                                                                     | `undefined` |


## Methods

### `updateOptions(newOptions: ApexOptions, redrawPaths?: boolean, animate?: boolean) => Promise<void>`

Updates the configuration object. The new config object is merged with the existing config object preserving the existing configuration.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
