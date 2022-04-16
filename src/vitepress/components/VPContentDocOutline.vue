<script setup lang="ts">
import { useData } from 'vitepress';
import { computed, inject, ref } from 'vue';
import { resolveHeaders, useActiveAnchor } from '../composables/outline';

const { page } = useData();
const container = ref();
const marker = ref();
useActiveAnchor(container, marker);

const filterHeaders = inject('filter-headers', null) as any;
const filteredHeaders = computed(() => (filterHeaders ? filterHeaders(page.value.headers) : page.value.headers));

const handleClick = ({ target: el }: Event) => {
  const id = `#${(el as HTMLAnchorElement).href!.split('#')[1]}`;
  const heading = document.querySelector(id) as HTMLAnchorElement;
  heading?.focus();
};
</script>

<template>
  <div ref="container" class="VPContentDocOutline">
    <div ref="marker" class="outline-marker" />
    <div class="outline-title">On this page</div>
    <nav aria-labelledby="doc-outline-aria-label">
      <span id="doc-outline-aria-label" class="visually-hidden">Table of Contents for current page</span>
      <ul class="root">
        <li v-for="{ text, link, children } in resolveHeaders(filteredHeaders)" :key="link">
          <a class="outline-link" :href="link" @click="handleClick">{{ text }}</a>
          <ul v-if="children">
            <li v-for="{ text, link } in children" :key="link">
              <a class="outline-link nested" :href="link" @click="handleClick">{{ text }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.VPContentDocOutline {
  position: relative;

  font-weight: 500;
  font-size: 13px;
}

.outline-title {
  margin-bottom: 4px;

  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.outline-link {
  display: block;

  color: var(--vt-c-text-2);
  line-height: 28px;
  white-space: nowrap;
  text-overflow: ellipsis;

  overflow: hidden;

  transition: color 0.5s;
}

.outline-link:hover,
.outline-link.active {
  color: var(--vt-c-text-1);

  transition: color 0.25s;
}

.outline-link.nested {
  padding-left: 1em;
}

.outline-marker {
  position: absolute;
  top: 32px;
  left: -12px;
  z-index: 0;

  width: 4px;
  height: 20px;

  border-radius: 4px;

  background-color: var(--vt-c-brand);

  opacity: 0;

  transition: top 0.25s cubic-bezier(0, 1, 0.5, 1), opacity 0.25s, background-color 0.5s;
}

.root {
  position: relative;
  z-index: 1;
}
</style>
