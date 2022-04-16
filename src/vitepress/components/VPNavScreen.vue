<script setup lang="ts">
import { ref } from 'vue';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import VPNavScreenMenu from './VPNavScreenMenu.vue';
import VPNavScreenAppearance from './VPNavScreenAppearance.vue';
import VPNavScreenSocialLinks from './VPNavScreenSocialLinks.vue';

defineProps<{
  open: boolean;
}>();

const screen = ref<HTMLElement | null>(null);

function lockBodyScroll() {
  disableBodyScroll(screen.value!, { reserveScrollBarGap: true });
}

function unlockBodyScroll() {
  clearAllBodyScrollLocks();
}
</script>

<template>
  <transition name="fade" @enter="lockBodyScroll" @after-leave="unlockBodyScroll">
    <div v-if="open" ref="screen" class="VPNavScreen">
      <div class="container">
        <VPNavScreenMenu class="menu" />
        <VPNavScreenSocialLinks class="social-links" />
        <VPNavScreenAppearance class="appearance" />
      </div>
    </div>
  </transition>
</template>

<style scoped>
.VPNavScreen {
  position: fixed;
  top: calc(var(--vt-nav-height) + var(--vt-banner-height, 0px));
  left: 0;
  bottom: 0;
  right: 0;

  width: 100%;
  padding: 0 32px;

  background-color: var(--vt-c-bg);

  overflow-y: auto;

  transition: background-color 0.5s;
}

.VPNavScreen.fade-enter-active,
.VPNavScreen.fade-leave-active {
  transition: opacity 0.25s;
}

.VPNavScreen.fade-enter-active .container,
.VPNavScreen.fade-leave-active .container {
  transition: transform 0.25s ease;
}

.VPNavScreen.fade-enter-from,
.VPNavScreen.fade-leave-to {
  opacity: 0;
}

.VPNavScreen.fade-enter-from .container,
.VPNavScreen.fade-leave-to .container {
  transform: translateY(-8px);
}

@media (min-width: 768px) {
  .VPNavScreen {
    display: none;
  }
}

.container {
  max-width: 288px;
  margin: 0 auto;
  padding: 24px 0 96px;
}

.appearance {
  margin-top: 24px;
}

.social-links {
  margin-top: 16px;
}
</style>
