<script lang="ts" setup>
import { nextTick, ref, watchPostEffect } from 'vue';
import { useSidebar } from '../composables/sidebar';
import VPSidebarGroup from './VPSidebarGroup.vue';

const { sidebar, hasSidebar } = useSidebar();

const props = defineProps<{
  open: boolean;
}>();

// A11y: Focus Nav element when menu has opened
const navEl = ref<(Element & { focus(): void }) | null>(null);
watchPostEffect(async () => {
  if (props.open) {
    await nextTick();
    navEl.value?.focus();
  }
});
</script>

<template>
  <aside v-if="hasSidebar" ref="navEl" class="VPSidebar" :class="{ open }" @click.stop>
    <nav id="VPSidebarNav" aria-labelledby="sidebar-aria-label" tabindex="-1">
      <slot name="top" />
      <span id="sidebar-aria-label" class="visually-hidden">Sidebar Navigation</span>
      <div v-for="group in sidebar" :key="group.text" class="group">
        <VPSidebarGroup :text="group.text" :items="group.items" />
      </div>
      <slot name="bottom" />
    </nav>
  </aside>
</template>

<style scoped>


/* .VPSidebar::-webkit-scrollbar {
  display: none;
} */

@media (min-width: 960px) {
  .VPSidebar {
    top: calc(var(--vt-nav-height) + var(--vt-banner-height, 0px));
    z-index: 1;

    width: var(--vp-sidebar-width-small);
    max-width: 100%;

    border-right: 1px solid var(--vt-c-divider-light);

    box-shadow: none;

    visibility: visible;

    opacity: 1;
    transform: translateX(0);

    transition: border-color 0.5s, background-color 0.5s;
  }
}

@media (min-width: 1440px) {
  .VPSidebar {
    width: calc((100% - var(--vp-screen-max-width)) / 2 + var(--vp-sidebar-width-small));
    padding: 0 32px 96px calc((100% - var(--vp-screen-max-width)) / 2);
  }
}

@media (min-width: 960px) {
  .group + .group {
    padding-top: 16px;
  }
}

.VPSidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: var(--vp-z-index-sidebar);

  width: calc(100vw - 64px);
  max-width: var(--vp-sidebar-width-mobile);
  padding: 0 32px 96px;

  background-color: var(--vt-c-bg);

  box-shadow: var(--vt-c-shadow-3);

  opacity: 0;
  transform: translateX(-100%);

  overflow-x: hidden;
  overflow-y: auto;

  transition: background-color 0.5s, opacity 0.5s, transform 0.3s ease;

  /* -ms-overflow-style: none; */

  /* scrollbar-width: none; */
}

#VPSidebarNav {
  padding-top: 24px;

  outline: 0;
}

.VPSidebar.open {
  visibility: visible;

  opacity: 1;
  transform: translateX(0);

  transition: background-color 0.5s, opacity 0.25s, transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.dark .VPSidebar {
  box-shadow: var(--vt-shadow-1);
}

.group + .group {
  padding-top: 24px;
}
</style>
