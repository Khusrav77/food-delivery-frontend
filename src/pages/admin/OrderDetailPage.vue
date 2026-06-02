<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ArrowLeft, MapPin, CreditCard, MessageSquare, User, Phone, Truck, Star } from 'lucide-vue-next'
import { useAdminOrderStore, STATUS_META, ORDER_STEPS, PAYMENT_LABEL, MOCK_COURIERS, OrderStatusTimeline } from '@/entities/order'
import type { OrderStatus } from '@/entities/order'
import { useToastStore } from '@/shared/lib/toast'
import { formatDateTime } from '@/shared/lib/date'
import { formatPrice } from '@/shared/lib/money'

const route  = useRoute()
const router = useRouter()
const store  = useAdminOrderStore()
const toast  = useToastStore()
const { current: order, loadingCurrent, currentError } = storeToRefs(store)

const changingStatus   = ref(false)
const assigningCourier = ref(false)

const statusOptions: { value: OrderStatus; label: string }[] = ORDER_STEPS.map((k) => ({
  value: k,
  label: STATUS_META[k].label,
}))
statusOptions.push({ value: 'cancelled', label: STATUS_META.cancelled.label })

const courierOptions = [
  { id: null, name: '— Не назначен —' },
  ...MOCK_COURIERS,
]

onMounted(() => store.fetchOne(route.params.id as string))

async function onStatusChange(e: Event): Promise<void> {
  const val = (e.target as HTMLSelectElement).value as OrderStatus
  changingStatus.value = true
  try {
    await store.changeStatus(order.value!.id, val)
    toast.success('Статус обновлён')
  } catch {
    toast.error('Не удалось обновить статус')
  } finally {
    changingStatus.value = false
  }
}

async function onCourierChange(e: Event): Promise<void> {
  const val = (e.target as HTMLSelectElement).value || null
  assigningCourier.value = true
  try {
    await store.setCourier(order.value!.id, val)
    toast.success('Курьер назначен')
  } catch {
    toast.error('Не удалось назначить курьера')
  } finally {
    assigningCourier.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-3xl space-y-5">
    <!-- Back -->
    <button
      class="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink transition-colors
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-lg"
      @click="router.back()"
    >
      <ArrowLeft :size="15" />
      К списку заказов
    </button>

    <!-- Loading -->
    <template v-if="loadingCurrent && !order">
      <div v-for="i in 4" :key="i" class="h-28 bg-surface rounded-2xl border border-line animate-pulse" />
    </template>

    <!-- Error -->
    <div v-else-if="currentError" class="py-12 text-center text-sm text-red-500">{{ currentError }}</div>

    <template v-else-if="order">
      <!-- Header + timeline -->
      <div class="bg-surface rounded-2xl border border-line p-5 sm:p-6 space-y-5">
        <div class="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 class="font-display text-xl font-extrabold text-ink">Заказ №{{ order.number }}</h1>
            <p class="text-xs text-faint mt-0.5">{{ formatDateTime(order.createdAt) }}</p>
          </div>
          <span
            class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border"
            :class="STATUS_META[order.status].badgeClass"
          >
            {{ STATUS_META[order.status].label }}
          </span>
        </div>
        <OrderStatusTimeline :status="order.status" size="lg" />
      </div>

      <!-- Actions: статус + курьер -->
      <div class="bg-surface rounded-2xl border border-line p-5 grid sm:grid-cols-2 gap-4">
        <!-- Смена статуса -->
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-faint uppercase tracking-wide">Изменить статус</label>
          <select
            class="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-60"
            :value="order.status"
            :disabled="changingStatus"
            @change="onStatusChange"
          >
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <!-- Назначение курьера -->
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-faint uppercase tracking-wide">Курьер</label>
          <select
            class="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-60"
            :value="order.courierId ?? ''"
            :disabled="assigningCourier"
            @change="onCourierChange"
          >
            <option v-for="c in courierOptions" :key="c.id ?? 'none'" :value="c.id ?? ''">
              {{ c.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Клиент -->
      <div class="bg-surface rounded-2xl border border-line p-5 space-y-3">
        <h2 class="text-sm font-semibold text-ink">Клиент</h2>
        <div class="flex items-center gap-2 text-sm">
          <User :size="15" class="text-faint shrink-0" />
          <span class="text-muted">{{ order.clientName }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <Phone :size="15" class="text-faint shrink-0" />
          <span class="text-muted">{{ order.clientPhone }}</span>
        </div>
        <div class="flex items-start gap-2 text-sm">
          <MapPin :size="15" class="text-faint shrink-0 mt-0.5" />
          <span class="text-muted">{{ order.payload.address }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <CreditCard :size="15" class="text-faint shrink-0" />
          <span class="text-muted">{{ PAYMENT_LABEL[order.payload.paymentMethod] }}</span>
        </div>
        <div v-if="order.payload.comment" class="flex items-start gap-2 text-sm">
          <MessageSquare :size="15" class="text-faint shrink-0 mt-0.5" />
          <span class="text-muted">{{ order.payload.comment }}</span>
        </div>
        <div v-if="order.courierName" class="flex items-center gap-2 text-sm">
          <Truck :size="15" class="text-faint shrink-0" />
          <span class="text-muted">{{ order.courierName }}</span>
        </div>
      </div>

      <!-- Состав -->
      <div class="bg-surface rounded-2xl border border-line p-5">
        <h2 class="text-sm font-semibold text-ink mb-3">Состав заказа</h2>
        <ul class="space-y-2.5">
          <li
            v-for="item in order.payload.items"
            :key="item.menuItemId"
            class="flex items-center justify-between gap-3"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-9 h-9 rounded-lg bg-canvas border border-line shrink-0 flex items-center justify-center text-faint text-xs">
                {{ item.productName[0] }}
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-ink truncate">{{ item.productName }}</p>
                <p class="text-xs text-faint">{{ item.variantName }} · {{ item.quantity }} шт.</p>
              </div>
            </div>
            <span class="text-sm font-semibold text-ink shrink-0">{{ formatPrice(item.price * item.quantity) }}</span>
          </li>
        </ul>
      </div>

      <!-- Итог -->
      <div class="bg-surface rounded-2xl border border-line p-5 space-y-2">
        <h2 class="text-sm font-semibold text-ink mb-3">Итог</h2>
        <div class="flex justify-between text-sm text-muted">
          <span>Товары</span>
          <span>{{ formatPrice(order.payload.subtotal) }}</span>
        </div>
        <div class="flex justify-between text-sm text-muted">
          <span>Доставка</span>
          <span>{{ order.payload.deliveryCost === 0 ? 'Бесплатно' : formatPrice(order.payload.deliveryCost) }}</span>
        </div>
        <div v-if="order.payload.promoDiscount > 0" class="flex justify-between text-sm text-emerald-600">
          <span>Промокод{{ order.payload.promoCode ? ` (${order.payload.promoCode})` : '' }}</span>
          <span>−{{ formatPrice(order.payload.promoDiscount) }}</span>
        </div>
        <div v-if="order.payload.bonusUsed > 0" class="flex justify-between text-sm text-emerald-600">
          <span>Бонусы</span>
          <span>−{{ order.payload.bonusUsed }} ₽</span>
        </div>
        <div v-if="order.payload.tip > 0" class="flex justify-between text-sm text-muted">
          <span>Чаевые</span>
          <span>+{{ formatPrice(order.payload.tip) }}</span>
        </div>
        <div class="flex justify-between font-semibold text-ink pt-2 border-t border-line">
          <span>Итого</span>
          <span>{{ formatPrice(order.total) }}</span>
        </div>
      </div>

      <!-- Оценка клиента -->
      <div v-if="order.rating" class="bg-surface rounded-2xl border border-line p-5 space-y-2">
        <h2 class="text-sm font-semibold text-ink mb-3">Оценка клиента</h2>
        <div class="flex items-center gap-1">
          <Star
            v-for="n in 5"
            :key="n"
            :size="20"
            :class="n <= order.rating.stars ? 'text-amber-400 fill-amber-400' : 'text-line'"
          />
          <span class="ml-2 text-sm font-semibold text-ink">{{ order.rating.stars }}/5</span>
        </div>
        <p v-if="order.rating.comment" class="text-sm text-muted">{{ order.rating.comment }}</p>
      </div>
    </template>
  </div>
</template>
