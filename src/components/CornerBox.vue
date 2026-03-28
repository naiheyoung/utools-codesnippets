<template>
  <div ref="outer" :style="outerStyle" class="cornerBox" :class="outerClass">
    <div ref="inner" :style="innerStyle" :class="innerClass" v-bind="$attrs"><slot /></div>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

const innerDiv = useTemplateRef('inner')
const outerDiv = useTemplateRef('outer')

defineExpose({
  innerDiv,
  outerDiv
})

const { outerClass, outerStyle } = defineProps<
  Partial<{
    outerClass: string
    outerStyle: any
    innerClass: string
    innerStyle: any
  }>
>()
</script>

<style scoped>
.cornerBox {
  --corner-foreground: rgb(255 255 255 / 0.55);
  position: relative;
  overflow: hidden;
  border: 1px dashed rgb(var(--colors-d-rgb) / 0.3);

  &:hover {
    --corner-foreground: rgb(255 255 255 / 1);
  }

  & > div {
    height: 100%;
    overflow-y: auto;
  }

  & > span {
    position: absolute;
    width: 0.5rem;
    height: 0.5rem;
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
