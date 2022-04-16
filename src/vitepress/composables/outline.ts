import type { Ref } from 'vue';
import { onMounted, onUnmounted, onUpdated } from 'vue';
import type { Header } from 'vitepress';
import { useMediaQuery } from '@vueuse/core';
import type { MenuItemWithLink } from '../../core';

interface HeaderWithChildren extends Header {
  children?: Header[];
}

interface MenuItemWithLinkAndChildren extends MenuItemWithLink {
  children?: MenuItemWithLinkAndChildren[];
}

export function resolveHeaders(headers: Header[]) {
  return mapHeaders(groupHeaders(headers));
}

function groupHeaders(thereHeaders: Header[]): HeaderWithChildren[] {
  const headers = thereHeaders.map((h) => ({ ...h }));
  let lastH2: HeaderWithChildren | undefined;

  headers.forEach((h) => {
    if (h.level === 2) {
      lastH2 = h;
    } else if (lastH2 && h.level <= 3) {
      (lastH2.children || (lastH2.children = [])).push(h);
    }
  });

  return headers.filter((h) => h.level === 2);
}

function mapHeaders(headers: HeaderWithChildren[]): MenuItemWithLinkAndChildren[] {
  return headers.map((header) => ({
    text: header.title,
    link: `#${header.slug}`,
    children: header.children ? mapHeaders(header.children) : undefined,
  }));
}

export function useActiveAnchor(container: Ref<HTMLElement>, bg: Ref<HTMLElement>) {
  const isOutlineEnabled = useMediaQuery('(min-width: 1280px)');
  const onScroll = throttleAndDebounce(setActiveLink, 100);

  function setActiveLink(): void {
    if (!isOutlineEnabled.value) {
      return;
    }

    const links = Array.prototype.slice.call(container.value.querySelectorAll('.outline-link')) as HTMLAnchorElement[];

    const anchors = Array.prototype.slice
      .call(document.querySelectorAll('.content .header-anchor'))
      .filter((anchor: HTMLAnchorElement) => links.some((link) => link.hash === anchor.hash)) as HTMLAnchorElement[];

    // page bottom - highlight last one
    if (anchors.length > 0 && window.scrollY + window.innerHeight === document.body.offsetHeight) {
      activateLink(anchors[anchors.length - 1]?.hash);
      return;
    }

    for (let i = 0; i < anchors.length; i += 1) {
      const anchor = anchors[i];
      const nextAnchor = anchors[i + 1];

      const [isActive, hash] = isAnchorActive(i, anchor, nextAnchor);

      if (isActive) {
        window.history.replaceState(null, document.title, hash || ' ');
        activateLink(hash);
        return;
      }
    }
  }

  let prevActiveLink: HTMLAnchorElement | null = null;

  function activateLink(hash: string | null | undefined): void {
    if (prevActiveLink) {
      prevActiveLink.classList.remove('active');
    }

    const activeLink = (prevActiveLink =
      hash == null
        ? null
        : (container.value.querySelector(`a[href="${decodeURIComponent(hash)}"]`) as HTMLAnchorElement));
    if (activeLink) {
      activeLink.classList.add('active');
      bg.value.style.opacity = '1';
      bg.value.style.top = `${activeLink.offsetTop + 33}px`;
    } else {
      bg.value.style.opacity = '0';
      bg.value.style.top = '33px';
    }
  }

  onMounted(() => {
    requestAnimationFrame(setActiveLink);
    window.addEventListener('scroll', onScroll);
  });

  onUpdated(() => {
    // sidebar update means a route change
    activateLink(location.hash);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
  });
}

// magic number to avoid repeated retrieval
const pageOffset = 56;

function getAnchorTop(anchor: HTMLAnchorElement): number {
  return anchor.parentElement!.offsetTop - pageOffset - 15;
}

function isAnchorActive(
  index: number,
  anchor: HTMLAnchorElement,
  nextAnchor: HTMLAnchorElement | undefined,
): [boolean, string | null] {
  const scrollTop = window.scrollY;

  if (index === 0 && scrollTop === 0) {
    return [true, null];
  }

  if (scrollTop < getAnchorTop(anchor)) {
    return [false, null];
  }

  if (!nextAnchor || scrollTop < getAnchorTop(nextAnchor)) {
    return [true, anchor.hash];
  }

  return [false, null];
}

function throttleAndDebounce(fn: () => void, delay: number): () => void {
  let timeout: any;
  let called = false;

  return () => {
    if (timeout) {
      clearTimeout(timeout);
    }

    if (!called) {
      fn();
      called = true;
      setTimeout(() => {
        called = false;
      }, delay);
    } else {
      timeout = setTimeout(fn, delay);
    }
  };
}
