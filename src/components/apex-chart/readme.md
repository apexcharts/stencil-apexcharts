# apex-chart



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description        | Type                                                                                                                                            | Default     |
| --------- | --------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `height`  | `height`  | (optional) Height  | `number \| string`                                                                                                                              | `undefined` |
| `options` | --        | (optional) Options | `ApexOptions`                                                                                                                                   | `undefined` |
| `series`  | --        | (optional) Series  | `number[] \| { name: string; data: number[] \| { x: string; y: number; }[]; }[]`                                                                | `undefined` |
| `type`    | `type`    | (optional) Type    | `"area" \| "bar" \| "bubble" \| "candlestick" \| "donut" \| "heatmap" \| "histogram" \| "line" \| "pie" \| "radar" \| "radialBar" \| "scatter"` | `undefined` |
| `width`   | `width`   | (optional) Width   | `number \| string`                                                                                                                              | `undefined` |


## Methods

### `updateOptions(newOptions: ApexOptions, redrawPaths?: boolean, animate?: boolean) => Promise<void>`

Updates the configuration object. The new config object is merged with the existing config object preserving the existing configuration.

#### Parameters

| Name          | Type          | Description                                                                                                                                                                                 |
| ------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `newOptions`  | `ApexOptions` | The configuration object to merge on the existing one                                                                                                                                       |
| `redrawPaths` | `boolean`     | When the chart is re-rendered, should it draw from the existing paths or completely redraw the chart paths from the beginning. By default, the chart is re-rendered from the existing paths |
| `animate`     | `boolean`     | Should the chart animate on re-rendering                                                                                                                                                    |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
