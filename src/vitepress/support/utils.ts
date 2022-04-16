import { withBase } from 'vitepress';
import { ref } from 'vue';

export const hashRE = /#.*$/;
export const extRE = /(index)?\.(md|html)$/;
export const outboundRE = /^[a-z]+:/i;

export function isExternal(path: string): boolean {
  return outboundRE.test(path);
}

export function ensureStartingSlash(path: string): string {
  return /^\//.test(path) ? path : `/${path}`;
}

export function normalizeLink(url: string): string {
  if (isExternal(url)) {
    return url;
  }
  const { pathname, search, hash } = new URL(url, 'http://vuejs.org');
  return withBase(
    pathname.endsWith('/') || pathname.endsWith('.html')
      ? url
      : `${pathname.replace(/(\.md)?$/, '.html')}${search}${hash}`,
  );
}

const inBrowser = typeof window !== 'undefined';
const hashRef = ref(inBrowser ? window.location.hash : '');

if (inBrowser) {
  window.addEventListener('hashchange', () => {
    hashRef.value = window.location.hash;
  });
}

export function isActive(thereCurrentPath: string, matchPath?: string, asRegex = false): boolean {
  if (matchPath === undefined) {
    return false;
  }
  const currentPath = normalize(`/${thereCurrentPath}`);
  if (asRegex) {
    return new RegExp(matchPath).test(currentPath);
  }
  if (normalize(matchPath) !== currentPath) {
    return false;
  }
  const hashMatch = matchPath.match(hashRE);
  if (hashMatch) {
    return hashRef.value === hashMatch[0];
  }
  return true;
}

export function normalize(path: string): string {
  return decodeURI(path).replace(hashRE, '').replace(extRE, '');
}
