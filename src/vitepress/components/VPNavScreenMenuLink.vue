<script lang="ts" setup>
import { inject } from 'vue';
import { VTLink } from '../../core';

defineProps<{
  text: string;
  link: string;
}>();

const closeScreen = inject('close-screen') as () => void;
</script>

<template>
  <VTLink class="VPNavScreenMenuLink" :href="link" @click="closeScreen">
    {{ text }}
  </VTLink>
</template>

<style scoped>
.VPNavScreenMenuLink {
  display: block;

  padding: 12px 0 11px;

  color: var(--vt-c-text-1);
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;

  border-bottom: 1px solid var(--vt-c-divider-light);

  transition: border-color 0.5s, color 0.25s;
}

.VPNavScreenMenuLink:hover {
  color: var(--vt-c-brand);
}
</style>
