<script lang="ts" setup>
import VTLink from './VTLink.vue';
import type { MenuItemWithLink } from '../types/menu';

defineProps<{ item: MenuItemWithLink }>();
</script>

<template>
  <VTLink class="vt-menu-link" :href="item.link">
    {{ item.text }}
  </VTLink>
</template>
