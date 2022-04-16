import type { Component, InjectionKey, Ref } from 'vue';
import { computed, defineComponent, h, inject, provide } from 'vue';
import { useData } from 'vitepress';
import type { Config, MultiSidebarConfig, SidebarConfig, SidebarGroup } from '../config';
import type { MenuItem, MenuItemChild } from '../../core';
import { normalizeLink } from '../support/utils';

const configSymbol: InjectionKey<Ref<Config>> = Symbol('config');

/**
 * Wrap root App component to provide the resolved theme config
 * so that we reuse the same computed ref across the entire app instead of
 * re-creating one in every consumer component.
 */
export function withConfigProvider(App: Component) {
  return defineComponent({
    name: 'VPConfigProvider',
    setup(_, { slots }) {
      const { theme } = useData();
      const config = computed(() => resolveConfig(theme.value));
      provide(configSymbol, config);
      return () => h(App, null, slots);
    },
  });
}

export function useConfig() {
  return {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    config: inject(configSymbol)!,
  };
}

function resolveConfig(config: Config): Config {
  const nav = config.nav?.map(normalizeMenuItem);
  return {
    appearance: true,
    ...config,
    nav,
    sidebar: config.sidebar && normalizeSideBar(config.sidebar),
  };
}

function normalizeMenuItem<T extends MenuItem | MenuItemChild>(item: T): T {
  if ('link' in item) {
    return { ...item, link: normalizeLink(item.link) };
  }
  return { ...item, items: item.items.map((element) => normalizeMenuItem(element)) };
}

function normalizeSideBar(sidebar: SidebarConfig): SidebarConfig {
  if (Array.isArray(sidebar)) {
    return sidebar.map((element) => normalizeMenuItem(element));
  }
  const ret: MultiSidebarConfig = {};

  Object.keys(sidebar).forEach((key) => {
    ret[key] = normalizeSideBar(sidebar[key] as SidebarConfig) as SidebarGroup[];
  });

  return ret;
}
