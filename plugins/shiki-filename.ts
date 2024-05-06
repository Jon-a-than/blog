import type { ShikiConfig } from 'astro'

const shikiFilenameReg = /filename=([^ ]*)/
const specialFilenameReg = [
  {
    reg: /\/?package\.json/,
    lang: 'package.json'
  },
  {
    reg: /\/?tsconfig\..*\.json/,
    lang: 'tsconfig.json'
  }
]

export function filenameTransformer(): Required<ShikiConfig>['transformers'][number] {
  return {
    postprocess(html, options) {
      const filename = this.options.meta?.__raw?.match(shikiFilenameReg)?.[1] || ''

      const specialFilenameLang = specialFilenameReg.find(({ reg }) => {
        return reg.test(filename)
      })?.lang

      return `<div class="shiki-code-block">
        <span
          data-lang="${specialFilenameLang ?? options.lang}"
          class="shiki-filename${filename === '' ? ' no-filename' : ''}"
        >
          ${filename}
        </span>
        ${html}
      </div>`
    }
  }
}
