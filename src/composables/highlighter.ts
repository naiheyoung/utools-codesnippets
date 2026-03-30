import type { ShikiTransformer } from 'shiki/bundle-web.mjs'
import { addClassToHast, bundledLanguages, createHighlighter } from 'shiki/bundle-web.mjs'

const langSet = new Set(Object.keys(bundledLanguages))

const highlighter = await createHighlighter({
  langs: Object.keys(bundledLanguages),
  themes: ['vitesse-dark']
})

const codeBreakTransformer: ShikiTransformer = {
  name: 'codeBreakTransformer',
  code: hast => {
    addClassToHast(hast, ['whitespace-pre-wrap', 'break-words'])
  },
  pre: hast => {
    hast.properties.tabindex = '-1'
    hast.properties.style = (hast.properties.style as string).replace(
      /background-color:\s*#[0-9a-fA-F]{3,8};|--shiki-dark-bg:\s*#[0-9a-fA-F]{3,8};/gi,
      ''
    )
  }
}

const s = (langs: string[], code: string) => {
  const lang = langs.find(l => langSet.has(l)) ?? 'plain'
  return highlighter.codeToHtml(code, {
    lang,
    theme: 'vitesse-dark',
    transformers: [codeBreakTransformer]
  })
}

export { codeBreakTransformer, s }
