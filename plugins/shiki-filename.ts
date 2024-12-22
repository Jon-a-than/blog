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

type ShikiTransformer = Required<ShikiConfig>['transformers'][number]
// type Element = Parameters<Required<ShikiTransformer>['code']>[0]
// type Root = Parameters<Required<ShikiTransformer>['root']>[0]

export function filenameTransformer(): ShikiTransformer {
  return {
    root() {
      const filename = this.options.meta?.__raw?.match(shikiFilenameReg)?.[1] || ''
      const specialFilenameLang = specialFilenameReg.find(({ reg }) => reg.test(filename))?.lang

      return {
        type: 'root',
        children: [
          {
            properties: {
              class: 'shiki-code-block'
            },
            type: 'element',
            tagName: 'div',
            children: [
              {
                type: 'element',
                tagName: 'span',
                properties: {
                  'data-lang': specialFilenameLang ?? this.options.lang,
                  class: `shiki-filename${filename === '' ? ' no-filename' : ''}`
                },
                children: [
                  {
                    type: 'text',
                    value: 'filename.ts'
                  }
                ]
              },
              this.pre
            ]
          }
        ]
      }
    }
  }
}
