<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vitepress';

const route = useRoute();
const backToTop = ref();

watch(
  () => route.path,
  () => backToTop.value.focus(),
);

const focusOnTargetAnchor = ({ target }: Event) => {
  const el = document.querySelector((target as HTMLAnchorElement).hash!) as HTMLAnchorElement;

  if (el) {
    const removeTabIndex = () => {
      el.removeAttribute('tabindex');
      el.removeEventListener('blur', removeTabIndex);
    };
    el.setAttribute('tabindex', '-1');
    el.addEventListener('blur', removeTabIndex);
    el.focus();
    window.scrollTo(0, 0);
  }
};
</script>

<template>
  <span ref="backToTop" tabindex="-1" />
  <a href="#VPContent" class="VPSkipLink visually-hidden" @click="focusOnTargetAnchor"> Skip to content </a>
</template>

<style scoped>
.VPSkipLink {
  top: 0.25rem;
  left: 0.25rem;
  z-index: 999;

  padding: 0.65rem 1.5rem;

  color: var(--vt-c-brand);
  font-weight: bold;
  font-size: 0.9em;
  text-decoration: none;

  border-radius: 8px;

  background-color: var(--vt-c-bg);

  box-shadow: var(--vt-shadow-3);
}

.dark .VPSkipLink {
  color: var(--vt-c-brand);
}

.VPSkipLink:focus {
  width: auto;
  height: auto;

  clip: auto;
  clip-path: none;
}
</style>
