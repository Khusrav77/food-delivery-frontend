<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Search, Star } from 'lucide-vue-next'
import { useAdminCustomerStore } from '@/entities/customer'
import { formatDate } from '@/shared/lib/date'
import { formatPrice } from '@/shared/lib/money'

const router = useRouter()
const store  = useAdminCustomerStore()
const { list, loadingList, listError } = storeToRefs(store)

const search = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  const src = [...list.value].sort(
    (a, b) => b.ordersCount - a.ordersCount,
  )
  if (!q) return src
  return src.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q),
  )
})

onMounted(store.fetchAll)
</script>

<template>
  <div class="p-6 space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="font-display text-xl font-extrabold text-ink">Клиенты</h1>
        <p class="text-xs text-faint mt-0.5">{{ filtered.length }} клиентов</p>
      </div>

      <!-- Search -->
      <div class="relative">
        <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
        <input
          v-model="search"
          type="text"
          placeholder="Поиск по имени, телефону или email…"
          class="pl-8 pr-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink placeholder:text-faint w-72
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loadingList" class="bg-surface rounded-2xl border border-line overflow-hidden">
      <div v-for="i in 8" :key="i" class="h-14 border-b border-line last:border-0 animate-pulse bg-canvas/50" />
    </div>

    <!-- Error -->
    <div v-else-if="listError" class="py-12 text-center text-sm text-red-500">{{ listError }}</div>

    <!-- Empty -->
    <div v-else-if="filtered.length === 0" class="py-16 flex flex-col items-center gap-3 text-center">
      <div class="w-14 h-14 rounded-2xl bg-canvas border border-line flex items-center justify-center text-2xl">👤</div>
      <p class="text-muted text-sm">Клиентов с таким поиском не найдено</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-surface rounded-2xl border border-line overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-surface-soft text-left">
              <th class="px-5 py-3 text-xs font-semibold text-faint uppercase tracking-wide">Клиент</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide hidden md:table-cell">Телефон</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide hidden lg:table-cell">Email</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide text-right">Заказы</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide text-right">Сумма</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide text-right">Бонусы</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide hidden xl:table-cell">Регистрация</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr
              v-for="c in filtered"
              :key="c.id"
              class="hover:bg-surface-soft transition-colors cursor-pointer"
              @click="router.push(`/admin/customers/${c.id}`)"
            >
              <!-- Клиент -->
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-accent-soft text-accent font-bold text-xs flex items-center justify-center shrink-0">
                    {{ c.name.split(' ').map((w) => w[0]).slice(0, 2).join('') }}
                  </div>
                  <span class="font-medium text-ink text-sm">{{ c.name }}</span>
                </div>
              </td>

              <!-- Телефон -->
              <td class="px-4 py-3.5 hidden md:table-cell text-xs text-muted">{{ c.phone }}</td>

              <!-- Email -->
              <td class="px-4 py-3.5 hidden lg:table-cell text-xs text-muted">{{ c.email }}</td>

              <!-- Заказы -->
              <td class="px-4 py-3.5 text-right">
                <span class="text-sm font-semibold text-ink">{{ c.ordersCount }}</span>
              </td>

              <!-- Сумма -->
              <td class="px-4 py-3.5 text-right font-semibold text-ink text-sm whitespace-nowrap">
                {{ formatPrice(c.totalSpent) }}
              </td>

              <!-- Бонусы -->
              <td class="px-4 py-3.5 text-right">
                <div class="flex items-center justify-end gap-1">
                  <Star :size="12" class="text-amber-400 fill-amber-400" />
                  <span class="text-sm font-semibold text-ink">{{ c.bonusBalance }}</span>
                </div>
              </td>

              <!-- Дата -->
              <td class="px-4 py-3.5 hidden xl:table-cell text-xs text-faint whitespace-nowrap">
                {{ formatDate(c.registeredAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
