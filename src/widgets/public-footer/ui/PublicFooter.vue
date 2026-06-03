<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { UtensilsCrossed, Phone, Mail, MapPin, Apple, Smartphone } from 'lucide-vue-next'
import {
  FOOTER_COLUMNS, FOOTER_SOCIALS, FOOTER_CONTACTS,
  FOOTER_PAYMENTS, FOOTER_TAGLINE,
} from '../config/footerNav'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-16 border-t border-line bg-surface">
    <div class="max-w-7xl mx-auto px-4 md:px-6 py-12">

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

        <!-- Brand + apps + socials -->
        <div class="sm:col-span-2 lg:col-span-4">
          <RouterLink to="/" class="flex items-center gap-2.5 w-fit">
            <div class="w-9 h-9 rounded-md bg-accent flex items-center justify-center shadow-sm">
              <UtensilsCrossed :size="16" class="text-white" />
            </div>
            <span class="font-display font-bold text-ink text-xl leading-none tracking-tight">FoodHub</span>
          </RouterLink>

          <p class="mt-4 text-sm text-muted leading-relaxed max-w-xs">{{ FOOTER_TAGLINE }}</p>

          <!-- App badges -->
          <div class="mt-6 flex flex-wrap gap-2.5">
            <a
              href="#"
              class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-ink text-white hover:bg-ink/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <Apple :size="20" />
              <span class="flex flex-col leading-tight text-left">
                <span class="text-[10px] text-white/70">Загрузите в</span>
                <span class="text-sm font-semibold">App Store</span>
              </span>
            </a>
            <a
              href="#"
              class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-ink text-white hover:bg-ink/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <Smartphone :size="20" />
              <span class="flex flex-col leading-tight text-left">
                <span class="text-[10px] text-white/70">Доступно в</span>
                <span class="text-sm font-semibold">Google Play</span>
              </span>
            </a>
          </div>

          <!-- Socials -->
          <div class="mt-6 flex items-center gap-2.5">
            <a
              v-for="social in FOOTER_SOCIALS"
              :key="social.label"
              :href="social.href"
              :aria-label="social.label"
              class="w-9 h-9 rounded-full border border-line-strong flex items-center justify-center text-muted hover:text-accent hover:border-accent/30 hover:bg-accent-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <component :is="social.icon" :size="16" />
            </a>
          </div>
        </div>

        <!-- Nav columns -->
        <div
          v-for="column in FOOTER_COLUMNS"
          :key="column.title"
          class="lg:col-span-2"
        >
          <h3 class="text-sm font-bold text-ink mb-4">{{ column.title }}</h3>
          <ul class="flex flex-col gap-2.5">
            <li v-for="link in column.links" :key="link.label">
              <a
                :href="link.href"
                class="text-sm text-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:text-accent"
              >{{ link.label }}</a>
            </li>
          </ul>
        </div>

        <!-- Contacts -->
        <div class="lg:col-span-2">
          <h3 class="text-sm font-bold text-ink mb-4">Контакты</h3>
          <ul class="flex flex-col gap-3">
            <li>
              <a
                :href="FOOTER_CONTACTS.phone.href"
                class="flex items-center gap-2 text-sm font-semibold text-ink hover:text-accent transition-colors focus-visible:outline-none focus-visible:text-accent"
              >
                <Phone :size="15" class="text-accent shrink-0" />
                {{ FOOTER_CONTACTS.phone.label }}
              </a>
            </li>
            <li>
              <a
                :href="FOOTER_CONTACTS.email.href"
                class="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:text-accent"
              >
                <Mail :size="15" class="text-accent shrink-0" />
                {{ FOOTER_CONTACTS.email.label }}
              </a>
            </li>
            <li class="flex items-start gap-2 text-sm text-muted">
              <MapPin :size="15" class="text-accent shrink-0 mt-0.5" />
              {{ FOOTER_CONTACTS.city }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-10 pt-6 border-t border-line flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-[13px] text-faint order-2 md:order-1">
          © {{ year }} FoodHub. Все права защищены.
        </p>
        <div class="flex items-center gap-2 order-1 md:order-2">
          <span
            v-for="payment in FOOTER_PAYMENTS"
            :key="payment"
            class="px-2.5 py-1 rounded-md bg-surface-soft border border-line text-[11px] font-semibold text-muted"
          >{{ payment }}</span>
        </div>
      </div>

    </div>
  </footer>
</template>
