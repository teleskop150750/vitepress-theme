<script lang="ts" setup>
import { useData } from 'vitepress';
import { VTLink } from '../../core';

const { theme } = useData();
</script>

<template>
  <div class="VPFooter">
    <p v-if="theme.footer?.license" class="license">
      Released under the
      <VTLink class="link" :href="theme.footer.license.link" no-icon>{{ theme.footer.license.text }}</VTLink
      >.
    </p>

    <p v-if="theme.footer?.copyright" class="copyright">
      {{ theme.footer.copyright }}
      <VTLink v-if="theme.author" class="link" :href="theme.author.link" no-icon>{{ theme.author.name }}</VTLink>
    </p>
  </div>
</template>

<style scoped>
.VPFooter {
  padding: 23px 0 24px;

  border-top: 1px solid var(--vt-c-bg-soft);

  background-color: var(--vt-c-bg-soft);

  transition: border-top 0.5s, background-color 0.5s;
}

.dark .VPFooter {
  border-top: 1px solid var(--vt-c-divider-light);

  background-color: var(--vt-c-bg);
}

.license,
.copyright {
  color: var(--vt-c-text-2);
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  text-align: center;

  transition: color 0.25s;
}

.link {
  color: var(--vt-c-text-1);

  transition: color 0.25s;
}

.link:hover {
  color: var(--vt-c-text-2);
}
</style>
