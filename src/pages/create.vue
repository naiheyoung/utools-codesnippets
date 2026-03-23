<template>
  <div>
    <nav>
      <router-link
        class="w1.3em h1.3em bg-neutral-100/10 rounded flex items-center justify-center backdrop-blur hover:cursor-pointer"
        to="/">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
          <path
            d="m7.85 13l2.85 2.85q.3.3.288.7t-.288.7q-.3.3-.712.313t-.713-.288L4.7 12.7q-.3-.3-.3-.7t.3-.7l4.575-4.575q.3-.3.713-.287t.712.312q.275.3.288.7t-.288.7L7.85 11H19q.425 0 .713.288T20 12t-.288.713T19 13z"
            fill="currentColor" />
        </svg>
      </router-link>
    </nav>
    <div class="px3ch py1.5ch flex gap-x-2ch">
      <div class="flex-1 h73dvh rounded p1">
        <h2 class="text-[var(--colors-d)] font-500 mb1ch text-3.75">Snippet</h2>
        <textarea
          id="editor"
          ref="editor"
          class="resize-none bg-white/10 p2 font-mono w-full h35ch rounded-lg break-all"
          placeholder="Enter anything..."
          v-model="snippetInfo.code"></textarea>
      </div>
      <div class="flex-1 h73dvh rounded p1">
        <section>
          <h2 class="text-[var(--colors-d)] font-500 mb1ch text-3.75">Name & Icon</h2>
          <div class="flex">
            <input
              class="bg-white/10 px2.5 py1 rounded-l-lg font-sans text-3.75 flex-1"
              placeholder="Snippet Name"
              type="text"
              v-model="snippetInfo.title" />
            <n-select
              class="w-7ch"
              :filterable="true"
              :options="iconSelectOptions()"
              :renderLabel="iconSelectRenderLabel"
              :renderTag="iconSelectRenderTag"
              placeholder="Icon"
              placement="bottom-end"
              v-model:show="iconSelectActive"
              v-model:value="snippetInfo.icon">
              <template #arrow>
                <transition>
                  <CircleDash
                    class="animate-spin origin-center animate-duration-5s"
                    v-if="iconSelectActive" />
                  <CircleFilled v-else />
                </transition>
              </template>
            </n-select>
          </div>
        </section>
        <section class="mt-2ch">
          <h2 class="text-[var(--colors-d)] font-500 mb1ch text-3.75">Keyword</h2>
          <input
            class="bg-white/10 px2.5 py1 rounded-lg font-sans text-3.75 flex-1 w-full"
            placeholder="Keyword (optional)"
            type="text"
            v-model="snippetInfo.keyword" />
        </section>
        <section class="mt-2ch">
          <h2 class="text-[var(--colors-d)] font-500 mb1ch text-3.75">Tags</h2>
          <n-select
            class="rounded-lg"
            :options="tagSelectOptions"
            :renderLabel="tagRenderLabel"
            :renderTag="tagSelectRenderTag"
            :showArrow="false"
            filterable
            multiple
            placeholder="Tags"
            tag
            v-model:value="snippetInfo.tags"
            @create="onTagCreate">
            <template #empty>&ensp;</template>
          </n-select>
        </section>
      </div>
    </div>
    <div class="bg-white/10 h-3ch rounded-sm flex pr2 leading-3ch">
      <transition name="alert">
        <div
          class="rounded-sm pl2 font-mono"
          :class="
            alert.type === 'ok'
              ? 'bg-[radial-gradient(circle_at_left,#325846_0%,transparent_70%)]'
              : 'bg-[radial-gradient(circle_at_left,#3e2727_0%,transparent_70%)]'
          "
          v-if="alert.text?.trim()"
          v-text="alert.text"></div>
      </transition>
      <div class="ml-auto">
        <span class="select-none pointer-events-none mr2">Save&nbsp;Snippet</span>
        <code class="text-xs b px0.5 font-code text-white/80 rounded-sm b-white/30 mr0.5">
          {{ 'Ctrl' }}
        </code>
        <code class="text-xs b px0.5 font-code text-white/80 rounded-sm b-white/30">
          {{ 'Enter' }}
        </code>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SelectOption, SelectRenderTag } from 'naive-ui'
import { NTag } from 'naive-ui'
import { nanoid } from 'nanoid'
import carbonJson from '@iconify-json/carbon/icons.json'
import CircleDash from '@iconify-vue/carbon/circle-dash'
import CircleFilled from '@iconify-vue/carbon/circle-filled'
import { SnippetRepository, TagRepository } from '~/composables/repository'
import { Snippet } from '~/composables/types'
import dayjs from 'dayjs'

const snippetRepo = new SnippetRepository()
const tagRepo = new TagRepository()

const alert = useAlert()
const editor = useTemplateRef('editor')
const iconSelectActive = ref(false)
const defaultIcon =
  '<path fill=\"currentColor\" d=\"m31 16l-7 7l-1.41-1.41L28.17 16l-5.58-5.59L24 9zM1 16l7-7l1.41 1.41L3.83 16l5.58 5.59L8 23zm11.42 9.484L17.64 6l1.932.517L14.352 26z\"/>'
const snippetInfo = $ref<Snippet>({
  id: nanoid(),
  code: `public static void main() {
  System.out.println("Hello, world!");
}`,
  title: '',
  icon: defaultIcon,
  keyword: null,
  tags: null,
  createdAt: dayjs().valueOf(),
  updatedAt: dayjs().valueOf()
})
const iconSelectOptions = (): SelectOption[] => {
  return Object.entries(carbonJson.icons).map(([icon, data]) => ({
    label: icon,
    value: data.body
  }))
}
let tagSelectOptions: SelectOption[] = $ref([])
const iconSelectRenderLabel = (option: { label: string; value: string }) => {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        columnGap: '1ch'
      }
    },
    [
      h('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        width: 16,
        height: 16,
        viewBox: '0 0 32 32',
        innerHTML: option.value,
        style: {
          flex: '0 0 16px'
        }
      }),
      h(
        'span',
        {
          class: ['truncate']
        },
        (option.label as string)
          .replace(/(^|-)(\w)/g, (_, __, c) => ' ' + c.toUpperCase())
          .trim()
      )
    ]
  )
}
const iconSelectRenderTag = (props: { option: SelectOption }) => {
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: 16,
    height: 16,
    viewBox: '0 0 32 32',
    innerHTML: props.option.value
  })
}
const tagSelectRenderTag: SelectRenderTag = ({ option, handleClose }) => {
  return h(
    NTag,
    {
      size: 'small',
      color: {
        color: 'color-mix(in oklab, var(--colors-white) 10%, transparent)',
        borderColor: 'transparent',
        textColor: option.color as string
      },
      closable: true,
      onMousedown: (e: FocusEvent) => {
        e.preventDefault()
      },
      onClose: (e: MouseEvent) => {
        e.stopPropagation()
        handleClose()
      }
    },
    () => option.label
  )
}
const onTagCreate = (label: string) => {
  return {
    label,
    value: label,
    color: getColor(label)
  }
}
const tagRenderLabel = (option: SelectOption) => {
  return h(
    'span',
    {
      style: {
        color: option.color
      }
    },
    [option.label as string]
  )
}

const indent = '  '

useEventListener(editor, 'keydown', e => {
  if (e.key !== 'Tab') return
  e.preventDefault()
  const start = editor.value?.selectionStart as number
  const end = editor.value?.selectionEnd as number
  snippetInfo.code =
    snippetInfo.code.substring(0, start) + indent + snippetInfo.code.substring(end)
  nextTick(() => {
    editor.value!.selectionStart = editor.value!.selectionEnd = start + indent.length
  })
})

useEventListener('keydown', async evt => {
  if (evt.key !== 'Enter' || !evt.ctrlKey) return
  evt.preventDefault()
  if (!snippetInfo.code || !snippetInfo.title || !snippetInfo.title.trim()) {
    alert.show('e', 'Missing required fields.')
    return
  }
  try {
    snippetInfo.createdAt = dayjs().valueOf()
    snippetInfo.updatedAt = dayjs().valueOf()
    const key = await snippetRepo.create(toRaw(snippetInfo))
    if (key) {
      alert.show('ok', 'Snippet Created!')
      snippetInfo.id = nanoid()
      snippetInfo.code = ''
      snippetInfo.title = ''
      snippetInfo.icon = defaultIcon
      snippetInfo.keyword = null
      snippetInfo.tags = null
      return
    }
    throw new Error('Something went wrong...')
  } catch (e) {
    alert.show('e', 'Failed to create snippet.')
  }
})

onMounted(async () => {
  const _tags = await tagRepo.list()
  if (_tags.length > 0) {
    tagSelectOptions = _tags.map(tag => ({
      label: tag.title,
      value: tag.title,
      color: getColor(tag.title)
    }))
  }
})
</script>

<style scoped>
:deep(.n-base-selection__border),
:deep(.n-base-selection__state-border) {
  appearance: none;
  display: none;
}

:deep(.n-base-selection-label) {
  background: color-mix(in oklab, var(--colors-white) 10%, transparent) !important;
  border-top-left-radius: unset !important;
  border-bottom-left-radius: unset !important;
  border-left: 1px solid color-mix(in oklab, var(--colors-white) 3%, transparent);
}

:deep(.n-base-selection) {
  border-top-right-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-lg);
}

:deep(.v-enter-active),
:deep(.v-leave-active) {
  transition: opacity 0.35s ease;
}

:deep(.v-enter-from),
:deep(.v-leave-to) {
  position: absolute;
  opacity: 0;
}

:deep(.alert-enter-active),
:deep(.alert-leave-active) {
  transition: opacity 0.25s ease;
}

:deep(.alert-enter-from),
:deep(.alert-leave-to) {
  opacity: 0;
}

:deep(.n-base-clear),
:deep(.n-base-icon),
:deep(.n-base-icon svg) {
  width: 12px;
  height: 12px;
}

:deep(h2 ~ .n-select .n-base-selection) {
  border-top-left-radius: var(--radius-lg);
  border-bottom-left-radius: var(--radius-lg);
}

:deep(.n-base-selection-input-tag__input),
:deep(.n-base-selection-input) {
  caret-color: unset !important;
}
</style>
