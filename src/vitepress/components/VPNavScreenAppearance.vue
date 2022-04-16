<script lang="ts" setup>
import { VTSwitchAppearance } from '../../core';
import { useConfig } from '../composables/config';

const { config } = useConfig();
</script>

<template>
  <div v-if="config.appearance" class="VPNavScreenAppearance">
    <p class="text">Appearance</p>
    <VTSwitchAppearance />
  </div>
</template>

<style scoped>
.VPNavScreenAppearance {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 12px 14px 12px 16px;

  border-radius: 8px;

  background-color: var(--vt-c-bg-soft);

  transition: background-color 0.5s;
}

.text {
  color: var(--vt-c-text-2);
  font-weight: 500;
  font-size: 12px;
  line-height: 24px;

  transition: color 0.5s;
}
</style>
