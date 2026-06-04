<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { AccountSidebar, AccountMobileList, AccountMobileHeader } from '@/widgets/account-sidebar'

const route = useRoute()
const router = useRouter()

const DESKTOP_QUERY = '(min-width: 768px)'
const mql = window.matchMedia(DESKTOP_QUERY)
const isDesktop = ref(mql.matches)

const isIndex = computed(() => route.path === '/account' || route.path === '/account/')
// Mobile shows a section list at the index; desktop always needs a section open.
const showList = computed(() => !isDesktop.value && isIndex.value)

function redirectDesktopIndex(): void {
  if (isDesktop.value && isIndex.value) router.replace('/account/profile')
}

function onMqlChange(e: MediaQueryListEvent): void {
  isDesktop.value = e.matches
  redirectDesktopIndex()
}

onMounted(() => {
  mql.addEventListener('change', onMqlChange)
  redirectDesktopIndex()
})
onBeforeUnmount(() => mql.removeEventListener('change', onMqlChange))
watch(isIndex, redirectDesktopIndex)
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-8 pb-6 md:pb-8">
    <!-- Mobile: master list -->
    <AccountMobileList v-if="showList" />

    <!-- Desktop: sidebar + content · Mobile detail: back header + content -->
    <div v-else class="flex flex-col gap-4 md:flex-row md:gap-6 md:items-start">
      <AccountSidebar />
      <main class="flex-1 min-w-0 w-full">
        <AccountMobileHeader class="md:hidden" />
        <RouterView />
      </main>
    </div>
  </div>
</template>
