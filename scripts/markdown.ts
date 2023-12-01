import { readFileSync, writeFileSync } from 'node:fs'
import { getHighlighter } from 'shiki'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'

const markdown = readFileSync('./content/5.mini-ssr/base.md', { encoding: 'utf8' })

const highlighter = await getHighlighter({
  theme: 'material-theme',
  langs: ['js', 'bash', 'json', 'html']
})
const marked = new Marked(
  markedHighlight({
    langPrefix: 'language-',
    highlight(code, lang) {
      return highlighter.codeToHtml(code, { lang })
    }
  })
)

writeFileSync('test.html', await marked.parse(markdown), { encoding: 'utf8' })
