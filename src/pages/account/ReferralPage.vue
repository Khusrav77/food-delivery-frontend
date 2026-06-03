<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Users, Gift, Copy, Check, Share2 } from 'lucide-vue-next'
import { useReferralStore } from '@/entities/referral'
import { useToastStore } from '@/shared/lib/toast'
import { formatDate } from '@/shared/lib/date'

const BONUS_PER_FRIEND = 150

const store = useReferralStore()
const { info, loading } = storeToRefs(store)
const toast = useToastStore()

const codeCopied = ref(false)

async function copyCode(): Promise<void> {
  if (!info.value) return
  await navigator.clipboard.writeText(info.value.code)
  codeCopied.value = true
  toast.success('Код скопирован')
  setTimeout(() => { codeCopied.value = false }, 2000)
}

async function shareLink(): Promise<void> {
  if (!info.value) return
  const link = info.value.link
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'FoodHub — приглашение',
        text: `Заказывай вкусную еду на FoodHub! Мой код: ${info.value.code}`,
        url: link,
      })
    } catch {
      // user cancelled the share sheet — no action needed
    }
    return
  }
  await navigator.clipboard.writeText(link)
  toast.success('Ссылка скопирована')
}

onMounted(store.fetchInfo)
</script>

<template>
  <div class="space-y-5">
    <h2 class="text-lg font-semibold text-ink">Реферальная программа</h2>

    <!-- Loading -->
    <template v-if="loading">
      <div class="h-36 bg-surface rounded-2xl border border-line animate-pulse" />
      <div class="h-32 bg-surface rounded-2xl border border-line animate-pulse" />
      <div class="grid grid-cols-2 gap-3">
        <div class="h-20 bg-surface rounded-2xl border border-line animate-pulse" />
        <div class="h-20 bg-surface rounded-2xl border border-line animate-pulse" />
      </div>
    </template>

    <template v-else-if="info">
      <!-- Gradient banner -->
      <div class="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white overflow-hidden">
        <div class="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
        <div class="absolute -right-2 bottom-2 opacity-20">
          <Gift :size="72" />
        </div>
        <div class="relative">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <Users :size="20" />
          </div>
          <p class="text-lg font-bold leading-snug">Приглашай друзей — получай бонусы</p>
          <p class="text-sm text-white/85 mt-1">
            {{ BONUS_PER_FRIEND }} бонусов за каждого друга, который сделает первый заказ.
          </p>
        </div>
      </div>

      <!-- Code block -->
      <div class="bg-surface rounded-2xl border border-line p-5">
        <p class="text-xs font-medium text-faint mb-2">Ваш промокод</p>
        <div class="flex items-center justify-between gap-3 mb-4">
          <code class="font-mono text-2xl font-bold text-ink tracking-[0.2em]">{{ info.code }}</code>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            :class="codeCopied
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-canvas border border-line text-ink hover:border-accent/50 hover:text-accent'"
            @click="copyCode"
          >
            <component :is="codeCopied ? Check : Copy" :size="15" />
            {{ codeCopied ? 'Скопировано' : 'Копировать код' }}
          </button>
          <button
            class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white
                   bg-accent hover:bg-accent-hover transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            @click="shareLink"
          >
            <Share2 :size="15" />
            Поделиться ссылкой
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-surface rounded-2xl border border-line p-4">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-7 h-7 rounded-lg bg-accent-soft flex items-center justify-center">
              <Users :size="14" class="text-accent" />
            </div>
            <span class="text-xs font-medium text-muted">Приглашено</span>
          </div>
          <p class="text-xl font-bold text-ink">{{ info.totalInvited }}</p>
        </div>
        <div class="bg-surface rounded-2xl border border-line p-4">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Gift :size="14" class="text-emerald-500" />
            </div>
            <span class="text-xs font-medium text-muted">Заработано</span>
          </div>
          <p class="text-xl font-bold text-ink">{{ info.totalBonusEarned }}</p>
        </div>
      </div>

      <!-- Referrals list -->
      <div class="bg-surface rounded-2xl border border-line overflow-hidden">
        <div class="px-5 py-4 border-b border-line">
          <h3 class="text-sm font-semibold text-ink">Приглашённые друзья</h3>
        </div>

        <div v-if="info.referrals.length === 0" class="px-5 py-12 text-center text-sm text-muted">
          Пока никого не пригласили
        </div>

        <ul v-else class="divide-y divide-line">
          <li
            v-for="ref in info.referrals"
            :key="ref.id"
            class="flex items-center gap-3 px-5 py-4"
          >
            <div class="w-9 h-9 rounded-full bg-accent-soft border border-accent/20 flex items-center justify-center
                        text-accent text-xs font-bold shrink-0">
              {{ ref.name.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-ink truncate">{{ ref.name }}</p>
              <p class="text-xs text-faint mt-0.5">Присоединился {{ formatDate(ref.joinedAt) }}</p>
            </div>
            <span class="text-sm font-bold text-emerald-600 shrink-0">
              +{{ ref.bonusEarned }}
            </span>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>
