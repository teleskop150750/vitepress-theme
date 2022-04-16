<script lang="ts" setup>
import { computed } from 'vue';
import { useData } from 'vitepress';
import VPContentDocOutline from './VPContentDocOutline.vue';
import VPContentDocFooter from './VPContentDocFooter.vue';
import type { Config } from '../config';
import { VTLink, VTIconEdit } from '../../core';

const { page, frontmatter, theme } = useData<Config>();

const hashMatch = /#(\w+)$/;

const repoUrl = computed(() => {
  const repo = theme.value.editLink?.repo || 'vuejs/docs';
  const branch = repo.match(hashMatch)?.[1] || 'main';
  return `https://github.com/vuejs/docs/edit/${branch}/src/${page.value.relativePath}`;
});

const pageClass = computed(() => {
  const { relativePath } = page.value;
  return relativePath.slice(0, relativePath.indexOf('/'));
});
</script>

<template>
  <div class="VPContentDoc" :class="{ 'has-aside': frontmatter['aside'] !== false }">
    <div class="container">
      <aside v-if="frontmatter['aside'] !== false" class="aside">
        <div class="aside-container">
          <slot name="aside-top" />
          <VPContentDocOutline v-if="page.headers && frontmatter['outline'] !== false" />
          <slot name="aside-mid" />
          <slot name="aside-bottom" />
        </div>
      </aside>
      <div class="content">
        <slot name="content-top" />
        <main>
          <Content class="vt-doc" :class="pageClass" />
          <p v-if="theme.editLink && frontmatter['editLink'] !== false" class="edit-link">
            <VTIconEdit class="vt-icon" />
            <VTLink :href="repoUrl" :no-icon="true">{{ theme.editLink.text }}</VTLink>
          </p>
        </main>
        <slot name="content-bottom" />
        <VPContentDocFooter v-if="frontmatter['footer'] !== false" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.VPContentDoc {
  padding: 32px 24px 96px;
}

.vt-doc {
  margin-bottom: 54px;
}

.content {
  position: relative;

  max-width: 75ch;
  margin: 0 auto;
}

.aside {
  position: relative;

  display: none;
  flex-shrink: 0;

  width: 320px;
  padding-left: 64px;
}

.aside-container {
  position: sticky;
  top: calc(var(--vt-nav-height) + var(--vt-banner-height, 0px) + 24px);
  bottom: 0;

  width: 224px;
}

.aside-container::-webkit-scrollbar {
  display: none;
}

.edit-link {
  margin: 0 0 32px;

  /* text-align: center; */
}

.edit-link .vt-link {
  color: var(--vt-c-brand);
  font-weight: 500;
  font-size: 14px;
}

.vt-icon {
  position: relative;
  top: -1px;

  display: inline-block;

  width: 18px;
  height: 18px;
  margin-right: 8px;

  color: var(--vt-c-brand);
}

@media (min-width: 768px) {
  .VPContentDoc {
    padding: 48px 32px 96px;
  }
}

@media (min-width: 960px) {
  .VPContentDoc {
    padding: 64px 64px 96px;
  }
}

@media (min-width: 1280px) {
  .VPContentDoc {
    padding: 64px 0 96px 64px;
  }

  .VPContentDoc:not(.has-sidebar.has-aside) {
    padding-left: calc((100vw - 688px) / 2);
  }

  .VPContentDoc.has-aside:not(.has-sidebar) {
    padding-left: calc((100vw - 688px - 320px) / 2);
  }

  .container {
    display: flex;
  }

  .content {
    order: 1;

    min-width: 620px;
    margin: 0;
  }

  .VPContentDoc:not(.has-aside) .content {
    min-width: 688px;
  }

  .aside {
    order: 2;

    display: block;
  }
}

@media (min-width: 1440px) {
  .VPContentDoc {
    padding: 64px 0 96px 96px;
  }

  .aside {
    padding-left: 96px;
  }
}
</style>
