import { Marked } from 'marked'
import { getHighlighter } from 'shiki'
import { markedHighlight } from 'marked-highlight'

// const marked = await buildMarkdownParser()
// console.log(
//   await marked.parse('# Hello `tst` world!\n```js\nconsole.log("Hello world!")\n```\nblalala')
// )

export async function buildMarkdownParser() {
  const highlighter = await getHighlighter({
    theme: 'material-theme',
    langs: ['js', 'bash', 'json', 'html', 'ts']
  })
  const marked = new Marked(
    markedHighlight({
      langPrefix: 'language-',
      highlight(code, lang) {
        return highlighter.codeToHtml(code, { lang })
      }
    })
  )

  marked.use({
    renderer: {
      heading(text, level) {
        const id = encodeURI(text)
        return `
          <h${level} id="${id}" class="header h${level}">
            <a name="${text}" data-level="${level}" class="anchor" href="#${id}">
              <span class="header-link">#</span>
            </a>
            ${text}
          </h${level}>`
      },
      paragraph(text) {
        return `<p class="paragraph">${text}</p>`
      },
      codespan(text) {
        return `<code class="inline-code">${text}</code>`
      },
      strong(text) {
        return `<strong class="strong">${text}</strong>`
      },
      link(href, title, text) {
        return `<a href="${href}" title="${title}" class="link">${text}</a>`
      }
    }
  })

  return marked
}
