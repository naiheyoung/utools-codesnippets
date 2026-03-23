<template>
  <div>
    <nav class="flex items-center pr3ch">
      <router-link
        class="w1.3em h1.3em bg-neutral-100/10 rounded backdrop-blur hover:cursor-pointer"
        to="/create">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
          <path
            d="M16.15 13H5q-.425 0-.712-.288T4 12t.288-.712T5 11h11.15L13.3 8.15q-.3-.3-.288-.7t.288-.7q.3-.3.713-.312t.712.287L19.3 11.3q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.575 4.575q-.3.3-.712.288t-.713-.313q-.275-.3-.288-.7t.288-.7z"
            fill="currentColor" />
        </svg>
      </router-link>
      <input
        class="px2.5 py1 rounded-l-lg font-sans text-3.75 flex-1 min-w-70%"
        placeholder="Search snippets..."
        type="text"
        v-model="inputValue" />
      <n-select
        class="mlauto w-[max(180px,15%)]"
        :options="selectOptions"
        :render-label="renderLabel"
        default-value="js"
        placeholder="Select Tags..."
        placement="bottom-end"
        size="small"
        v-model:show="selectActive"
        v-model:value="selectValue"
        @update:value="filterSnippets">
        <template #arrow>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            class="transition-transform duration-350"
            :class="selectActive ? 'rotate-180' : 'rotate-0'"
            viewBox="0 0 24 24">
            <path
              d="M12 14.975q-.2 0-.375-.062T11.3 14.7l-4.6-4.6q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l3.9 3.9l3.9-3.9q.275-.275.7-.275t.7.275t.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213t-.375.062"
              fill="currentColor" />
          </svg>
        </template>
        <template #empty>&ensp;</template>
      </n-select>
    </nav>
    <div class="px3ch py1.5ch flex h73dvh gap-x-2ch">
      <div class="lit w-1/2">
        <div ref="listWrapper" class="h-full px2 py3 overflow-y-auto scroll-py-3">
          <div
            class="rounded mb-2 flex items-center gap-x-2.5 p2 hover:cursor-pointer last:mb-0 select-none"
            :class="{ 'bg-#343434': idx === selectIdx }"
            :key="snippet.id"
            v-for="(snippet, idx) in snippets"
            @abort=""
            @click.stop.prevent="selectIdx = idx"
            @dblclick.stop.prevent="copy">
            <span class="bg-#484848 p1 rounded text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                v-html="snippet.icon"
                viewBox="0 0 32 32"></svg>
            </span>
            <span class="font-500" v-text="snippet.title"></span>
            <span
              class="bg-#484848 px1.5 py2px rounded font-code text-xs text-white/70"
              v-if="snippet.keyword?.trim()"
              v-text="snippet.keyword"></span>
          </div>
        </div>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="w-1/2 flex flex-col gap-y-1ch">
        <div class="lit grow-0 shrink-0 basis-63% min-h-52.5 overflow-hidden">
          <div class="h-full p1 px3 py2 overflow-y-auto">
            <pre v-html="selectCode" v-if="selectSnippet?.code"></pre>
          </div>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="lit flex-1 overflow-hidden">
          <div class="h-full p1.5ch font-500 overflow-y-auto">
            <div class="text-13px text-[var(--colors-d)] mb1.8 select-none">Information</div>
            <section class="flex text-sm py2 b-b gap-x-2">
              <span class="text-[--colors-d] select-none">Name</span>
              <span
                class="mlauto truncate"
                v-if="selectSnippet?.title"
                v-text="selectSnippet?.title" />
            </section>
            <section class="flex text-sm py1.5 b-b gap-x-2">
              <span class="text-[--colors-d] select-none">Tags</span>
              <div
                id="tagBox"
                ref="tagBox"
                class="mlauto flex gap-x-1 items-center overflow-x-auto"
                v-if="selectSnippet?.tags">
                <span
                  :style="{ color: getColor(tag), backgroundColor: `${getColor(tag)}33` }"
                  class="px2 text-xs rounded-xs"
                  v-for="tag in selectSnippet.tags"
                  v-text="tag" />
              </div>
            </section>
            <section class="flex text-sm py1.5 b-b gap-x-2">
              <span class="text-[--colors-d] select-none">Modified</span>
              <span class="mlauto font-mono text-xs flex items-center min-w-0">
                <span
                  class="truncate"
                  v-if="selectSnippet?.createdAt"
                  v-text="litTime(selectSnippet.createdAt)" />
              </span>
            </section>
            <section class="flex text-sm py1.5 b-b gap-x-2">
              <span class="text-[--colors-d] select-none">Created</span>
              <span class="mlauto font-mono text-xs flex items-center min-w-0">
                <span
                  class="truncate"
                  v-if="selectSnippet?.updatedAt"
                  v-text="litTime(selectSnippet.updatedAt)" />
              </span>
            </section>
          </div>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    <div class="bg-white/10 h-3ch rounded-sm flex pr2 leading-3ch mt4">
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
        <span class="select-none pointer-events-none mr2">Copy</span>
        <code class="text-xs b px0.5 font-code text-white/80 rounded-sm b-white/30">
          {{ 'Enter' }}
        </code>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SelectOption } from 'naive-ui'
import dayjs from 'dayjs'
import { s } from '~/composables/highlighter'
import { SnippetRepository, TagRepository } from '~/composables/repository'
import { Snippet, Tag } from '~/composables/types'
import { Transition } from 'vue'
import { nanoid } from 'nanoid'

const snippetRepo = new SnippetRepository()
const tagRepo = new TagRepository()

const { copy: _copy, copied } = useClipboard()
const alert = useAlert()
const tagBox = useTemplateRef('tagBox')
const listEl = useTemplateRef('listWrapper')
const inputValue = shallowRef('')
const searchValue = refDebounced(inputValue)
let selectActive = $ref(false)
const selectValue = $ref(null)
let tags = $ref<Tag[]>([
  {
    id: nanoid(),
    title: 'All Snippets'
  }
])
let snippetsSource = $ref<Snippet[]>([])
let snippets = $ref<Snippet[]>([])
let selectIdx = $ref(0)
const selectSnippet = computed(() => snippets[selectIdx])
const selectCode = computed(() =>
  s(selectSnippet.value?.tags || ['plain'], selectSnippet.value.code)
)
const selectOptions = computed(() =>
  tags.map<SelectOption>(tag => ({
    label: tag.title,
    value: tag.title === 'All Snippets' ? '' : tag.title,
    color: getColor(tag.title)
  }))
)
const renderLabel = (option: SelectOption, selected: boolean) => {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        columnGap: '7px'
      }
    },
    [
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          width: '1.1em',
          height: '1.1em',
          viewBox: '0 0 32 32'
        },
        selected
          ? [
              h('circle', {
                cx: '16',
                cy: '16',
                r: '14',
                fill: option.color,
                class: 'transform-origin-center animate-[lit] animate-duration-350ms'
              })
            ]
          : [
              h('path', {
                fill: option.color,
                d: 'M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14s14-6.268 14-14S23.732 2 16 2m0 26C9.373 28 4 22.627 4 16S9.373 4 16 4s12 5.373 12 12s-5.373 12-12 12'
              })
            ]
      ),
      h(
        'div',
        {
          style: {
            color: selected && 'white',
            fontWeight: 500
          }
        },
        option.label as string
      )
    ]
  )
}

watch(searchValue, v => {
  if (!v.trim() && !selectValue) {
    snippets = snippetsSource
    return
  }
  snippets = selectValue
    ? snippetsSource.filter(s => s.tags?.includes(selectValue) && s.title.includes(v))
    : snippetsSource.filter(s => s.title.includes(v))
  selectIdx = 0
})

const litTime = (timestamp: number) => {
  return dayjs(timestamp).format('MM/DD YY hh:mm:ss A')
}
const prev = () => {
  selectIdx = Math.max(selectIdx - 1, 0)
  listEl.value?.children[selectIdx].scrollIntoView({
    behavior: 'smooth',
    block: 'end'
  })
}
const next = () => {
  selectIdx = Math.min(selectIdx + 1, snippets.length - 1)
  listEl.value?.children[selectIdx].scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  })
}
const copy = async () => {
  await _copy(snippets[selectIdx].code)
  if (copied) {
    alert.show('ok', 'Copied!')
  }
}
const filterSnippets = (value: string) => {
  if (!value.trim()) {
    snippets = snippetsSource
  } else {
    snippets = searchValue.value
      ? snippetsSource.filter(
          snippet =>
            snippet.title.includes(searchValue.value) &&
            snippet.tags?.some(tag => tag === value)
        )
      : snippetsSource.filter(snippet => snippet.tags?.some(tag => tag === value))
  }
  selectIdx = 0
  selectActive = true
}

useEventListener(
  tagBox,
  'wheel',
  evt => {
    evt.preventDefault()
    tagBox.value!.scrollLeft += evt.deltaY
  },
  {
    passive: false
  }
)

useEventListener('keydown', evt => {
  if (evt.code !== 'ArrowUp' && evt.code !== 'ArrowDown' && evt.code !== 'Enter') return
  evt.preventDefault()
  evt.code === 'ArrowUp' && prev()
  evt.code === 'ArrowDown' && next()
  evt.code === 'Enter' && copy()
})

onBeforeMount(async () => {
  snippetsSource = snippets = await snippetRepo.listLatest()
  const _tags = await tagRepo.list()
  tags = tags.concat(_tags)
})
</script>

<style scoped>
section {
  border-bottom-color: rgb(var(--colors-d-rgb) / 30%);

  & > :first-child {
    flex: 0 0 60px;
  }

  &:last-child {
    border-bottom: unset;
  }
}

#tagBox {
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }
}

:deep(.n-base-selection__border),
:deep(.n-base-selection__state-border) {
  appearance: none;
  display: none;
}

:deep(.n-base-selection-label) {
  background: color-mix(in oklab, var(--colors-white) 10%, transparent) !important;
}

:deep(.n-base-selection) {
  border-radius: 4px;
}

:deep(.alert-enter-active),
:deep(.alert-leave-active) {
  transition: opacity 0.25s ease;
}

:deep(.alert-enter-from),
:deep(.alert-leave-to) {
  opacity: 0;
}

.lit {
  --corner-foreground: rgb(255 255 255 / 0.55);
  border: 1px dashed rgb(var(--colors-d-rgb) / 0.3);
  position: relative;

  &:hover {
    --corner-foreground: rgb(255 255 255 / 1);
  }

  & > span {
    position: absolute;
    width: 8px;
    height: 8px;
    user-select: none;
    pointer-events: none;
    transition: border-color 0.25s;

    &:nth-of-type(1) {
      border-left: 1px solid var(--corner-foreground);
      border-top: 1px solid var(--corner-foreground);
      top: 0;
      left: 0;
    }
    &:nth-of-type(2) {
      border-right: 1px solid var(--corner-foreground);
      border-top: 1px solid var(--corner-foreground);
      top: 0;
      right: 0;
    }
    &:nth-of-type(3) {
      border-left: 1px solid var(--corner-foreground);
      border-bottom: 1px solid var(--corner-foreground);
      bottom: 0;
      left: 0;
    }
    &:nth-of-type(4) {
      border-right: 1px solid var(--corner-foreground);
      border-bottom: 1px solid var(--corner-foreground);
      bottom: 0;
      right: 0;
    }
  }
}
</style>

<style>
.n-base-select-option__check {
  --n-option-check-color: #ffffff;
}

@keyframes lit {
  from {
    transform: scale(0.65);
  }
  to {
    transform: scale(1);
  }
}
</style>
