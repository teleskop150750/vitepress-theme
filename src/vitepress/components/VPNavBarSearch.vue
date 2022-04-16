<script lang="ts" setup>
import { useData } from 'vitepress';
import { ref, defineAsyncComponent, onMounted, onUnmounted } from 'vue';

const { theme } = useData();
const VPAlgoliaSearchBox = defineAsyncComponent(() => import('./VPAlgoliaSearchBox.vue'));

// to avoid loading the docsearch js upfront (which is more than 1/3 of the
// payload), we delay initializing it until the user has actually clicked or
// hit the hotkey to invoke it
const loaded = ref(false);
const metaKey = ref();

onMounted(() => {
  // meta key detect (same logic as in @docsearch/js)
  metaKey.value.textContent = /(mac|iphone|ipod|ipad)/i.test(navigator.platform) ? '⌘' : 'Ctrl';
  const handleSearchHotKey = (e: KeyboardEvent) => {
    if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      load();
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      remove();
    }
  };
  const remove = () => {
    window.removeEventListener('keydown', handleSearchHotKey);
  };
  window.addEventListener('keydown', handleSearchHotKey);
  onUnmounted(remove);
});

function load() {
  if (!loaded.value) {
    loaded.value = true;
  } else {
    document.querySelector<HTMLElement>('.DocSearch-Button')?.click();
  }
}
</script>

<template>
  <button v-if="theme.algolia" type="button" class="search-button" aria-label="Search" @click="load">
    <span class="search-button-container">
      <svg width="20" height="20" class="DocSearch-Search-Icon" viewBox="0 0 20 20">
        <path
          d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
          stroke="currentColor"
          fill="none"
          fill-rule="evenodd"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
      <span class="search-placeholder">Search</span>
    </span>
    <span class="search-keys">
      <span ref="metaKey" class="search-key">⌘</span>
      <span class="search-key">K</span>
    </span>
  </button>
  <VPAlgoliaSearchBox v-if="loaded" />
</template>

<style>
#docsearch {
  display: none;
}

.search-button-container {
  display: flex;
  align-items: center;
}

.search-button {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  width: 48px;
  height: 55px;
  margin: 0;
  margin-right: 16px;

  background: transparent;
}

@media (min-width: 768px) {
  .search-button {
    flex-grow: 1;
    justify-content: flex-end;

    width: 100%;
    margin-right: 3rem;
  }
}

.search-button:focus {
  outline: 1px dotted;
  outline: 5px auto -webkit-focus-ring-color;
}

.search-button:focus:not(:focus-visible) {
  outline: none !important;
}

.search-button .DocSearch-Search-Icon {
  position: relative;

  width: 18px;
  height: 18px;

  color: var(--vt-c-text-2);

  fill: currentcolor;

  transition: color 0.5s;
}

@media (min-width: 768px) {
  .search-button .DocSearch-Search-Icon {
    top: 1px;

    width: 15px;
    height: 15px;
    margin-right: 10px;
  }
}

.search-button:hover .DocSearch-Search-Icon {
  color: var(--vt-c-text-1);
}

.search-placeholder {
  display: none;

  padding: 0 10px 0 0;

  color: var(--vt-c-text-2);
  font-weight: 500;
  font-size: 13px;

  transition: color 0.5s;
}

@media (min-width: 960px) {
  .search-placeholder {
    display: inline-block;
  }
}

.search-button:hover .search-placeholder {
  color: var(--vt-c-text-1);
}

.search-button .search-key {
  display: none;

  height: 22px;
  min-width: 0;
  margin-top: 2px;
  padding-left: 6px;

  line-height: 22px;

  border: 1px solid var(--vt-c-divider);
  border-right: none;
  border-radius: 4px 0 0 4px;

  transition: color 0.5s, border-color 0.5s;
}

.search-button .search-key + .search-key {
  padding-right: 6px;
  padding-left: 2px;

  border-right: 1px solid var(--vt-c-divider);
  border-left: none;
  border-radius: 0 4px 4px 0;
}

.search-button:hover .search-key {
  color: var(--vt-c-brand-light);

  border-color: var(--vt-c-brand-light);
}

@media (min-width: 768px) {
  .search-button .search-key {
    display: inline-block;
  }
}

.search-key {
  display: inline-block;

  width: auto;
  height: 20px;
  margin: 0;
  padding: 0 1px;

  color: var(--vt-c-text-3);
  font-weight: 500;
  font-size: 12px;

  transition: color 0.5s;
}
</style>
