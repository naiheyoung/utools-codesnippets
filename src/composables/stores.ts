import { defineStore } from 'pinia'

export const useAlert = defineStore('alertInfo', () => {
  const _type = ref('')
  const _text = ref('')

  const { start, stop } = useTimeoutFn(
    () => {
      _type.value = ''
      _text.value = ''
    },
    2700,
    {
      immediate: false
    }
  )

  const show = (t: string, v: string) => {
    _type.value = t
    _text.value = v

    stop()
    start()
  }

  return {
    type: readonly(_type),
    text: readonly(_text),
    show
  }
})
