<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { MenuItemChild } from '../../core';
import { VTIconPlus } from '../../core';
import VPNavScreenMenuGroupLink from './VPNavScreenMenuGroupLink.vue';
import VPNavScreenMenuGroupSection from './VPNavScreenMenuGroupSection.vue';

const props = defineProps<{
  text: string;
  items: MenuItemChild[];
}>();

const isOpen = ref(false);

const groupId = computed(() => `NavScreenGroup-${props.text.replace(' ', '-').toLowerCase()}`);

function toggle() {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <div class="VPNavScreenMenuGroup" :class="{ open: isOpen }">
    <button class="button" :aria-controls="groupId" :aria-expanded="isOpen" @click="toggle">
      <span class="button-text">{{ text }}</span>
      <VTIconPlus class="button-icon" />
    </button>

    <div :id="groupId" class="items">
      <template v-for="item in items" :key="item.text">
        <div v-if="'link' in item" :key="item.text" class="item">
          <VPNavScreenMenuGroupLink :text="item.text" :link="item.link" />
        </div>

        <div v-else class="group">
          <VPNavScreenMenuGroupSection :text="item.text" :items="item.items" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.VPNavScreenMenuGroup {
  height: 48px;

  border-bottom: 1px solid var(--vt-c-divider-light);

  overflow: hidden;

  transition: border-color 0.5s;
}

.VPNavScreenMenuGroup .items {
  visibility: hidden;
}

.VPNavScreenMenuGroup.open .items {
  visibility: visible;
}

.VPNavScreenMenuGroup.open {
  height: auto;
  padding-bottom: 10px;
}

.VPNavScreenMenuGroup.open .button {
  padding-bottom: 6px;

  color: var(--vt-c-brand);
}

.VPNavScreenMenuGroup.open .button-icon {
  transform: rotate(45deg);
}

.button {
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  padding: 12px 4px 11px 0;

  color: var(--vt-c-text-1);
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;

  transition: color 0.25s;
}

.button:hover {
  color: var(--vt-c-brand);
}

.button-icon {
  width: 14px;
  height: 14px;

  fill: var(--vt-c-text-2);

  transition: fill 0.5s, transform 0.25s;
}

.group:first-child {
  padding-top: 4px;
}

.group + .group {
  padding-top: 8px;
}

.group + .item {
  padding-top: 8px;
}
</style>
