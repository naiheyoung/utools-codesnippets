import type { ShikiTransformer } from '@shikijs/core'
import { createHighlighter } from './shiki.bundle'
import { addClassToHast } from '@shikijs/core'

const LANGS = [
  'bash',
  'sh',
  'bat',
  'css',
  'diff',
  'docker',
  'html',
  'http',
  'java',
  'js',
  'json',
  'lua',
  'md',
  'nginx',
  'py',
  'ps',
  'regex',
  'sql',
  'ts',
  'vim',
  'vue',
  'xml',
  'yml'
]

const highlighter = await createHighlighter({
  langs: LANGS,
  themes: ['vitesse-dark', 'vitesse-light']
})

const codeBreakTransformer: ShikiTransformer = {
  name: 'codeBreakTransformer',
  code: hast => {
    addClassToHast(hast, ['whitespace-pre-wrap', 'break-words'])
  },
  pre: hast => {
    hast.properties.tabindex = '-1'
  }
}

const s = (langs: string[], code: string) => {
  const lang = langs.find(l => LANGS.includes(l))
  return highlighter.codeToHtml(code, {
    lang: lang || 'plain',
    theme: 'vitesse-dark'
  })
}

export { highlighter, codeBreakTransformer, s }
