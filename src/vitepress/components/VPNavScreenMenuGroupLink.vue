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
  <VTLink class="VPNavScreenMenuGroupLink" :href="link" @click="closeScreen">
    {{ text }}
  </VTLink>
</template>

<style scoped>
.VPNavScreenMenuGroupLink {
  display: block;

  margin-left: 0.6em;

  color: var(--vt-c-text-1);
  font-weight: 400;
  font-size: 13px;
  line-height: 32px;

  transition: color 0.25s;
}

.VPNavScreenMenuGroupLink:hover {
  color: var(--vt-c-brand);
}
</style>
