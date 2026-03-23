const THEME_SWITCH_STYLE_ID = '__theme_switch_view_transition_style__'

export function useThemeSwitchAnime(
  event: MouseEvent,
  isDark: () => boolean,
  callback: () => void,
  delay: number = 750,
  fn?: Function
) {
  if (!document.getElementById(THEME_SWITCH_STYLE_ID)) {
    const css = `
    ::view-transition-image-pair(root) {
      isolation: auto;
    }

    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
      mix-blend-mode: normal;
    }

    .dark::view-transition-new(root) {
      z-index: 999;
    }

    ::view-transition-new(root) {
      z-index: -1;
    }
    `
    const style = document.createElement('style')
    style.id = THEME_SWITCH_STYLE_ID
    style.textContent = css
    document.head.appendChild(style)
  }

  const x = event.clientX
  const y = event.clientY

  const endRadio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  const viewTransition = document.startViewTransition(callback)

  viewTransition.ready.then(() => {
    const effect = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadio}px at ${x}px ${y}px)`]
    document.documentElement.animate(
      {
        clipPath: isDark() ? effect : effect.reverse()
      },
      {
        duration: delay,
        easing: 'ease-in-out',
        fill: 'forwards',
        pseudoElement: isDark() ? '::view-transition-new(root)' : '::view-transition-old(root)'
      }
    )
  })
}

export function hash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash &= hash
  }
  return Math.abs(hash)
}

export const COLORS = [
  '#f4dbd6',
  '#f0c6c6',
  '#f5bde6',
  '#c6a0f6',
  '#ed8796',
  '#ee99a0',
  '#f5a97f',
  '#eed49f',
  '#a6da95',
  '#8bd5ca',
  '#91d7e3',
  '#7dc4e4',
  '#8aadf4',
  '#b7bdf8',
  '#cad3f5',
  '#b8c0e0',
  '#a5adcb',
  '#939ab7',
  '#8087a2',
  '#6e738d',
  '#1e2030',
  '#181926'
]

export const contrastColor = (color: string) => {
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b

  return luminance > 186 ? '#000000' : '#ffffff'
}

export const getColor = (str: string) => {
  return COLORS[hash(str) % COLORS.length]
}
