export function useIcon(selector: string, dataUrl: string) {
  return `
  ${selector} {
    -webkit-mask: url("${dataUrl}") no-repeat;
    mask: url("${dataUrl}") no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    background-color: currentColor;
    color: inherit;
    display: inline-block;
    vertical-align: middle;
    width: 1em;
    height: 1em;
  }`
}
