<script setup lang="ts">
import { Save, CheckCircle2 } from 'lucide-vue-next'
import { useProfileForm } from '../model/useProfileForm'

const { form, errors, serverError, saved, updating, submit } = useProfileForm()
</script>

<template>
  <div class="bg-surface rounded-2xl border border-line p-6 space-y-6">
    <h2 class="text-lg font-semibold text-ink">Личные данные</h2>

    <div class="grid sm:grid-cols-2 gap-4">
      <!-- Имя -->
      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-ink">Имя <span class="text-red-500">*</span></label>
        <input
          v-model="form.firstName"
          type="text"
          autocomplete="given-name"
          placeholder="Алексей"
          class="w-full px-3.5 py-2.5 rounded-xl border text-sm text-ink bg-canvas placeholder:text-faint
                 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          :class="errors.firstName ? 'border-red-400' : 'border-line'"
        />
        <p v-if="errors.firstName" class="text-xs text-red-500">{{ errors.firstName }}</p>
      </div>

      <!-- Фамилия -->
      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-ink">Фамилия <span class="text-red-500">*</span></label>
        <input
          v-model="form.lastName"
          type="text"
          autocomplete="family-name"
          placeholder="Смирнов"
          class="w-full px-3.5 py-2.5 rounded-xl border text-sm text-ink bg-canvas placeholder:text-faint
                 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          :class="errors.lastName ? 'border-red-400' : 'border-line'"
        />
        <p v-if="errors.lastName" class="text-xs text-red-500">{{ errors.lastName }}</p>
      </div>

      <!-- Email -->
      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-ink">Email</label>
        <input
          v-model="form.email"
          type="email"
          autocomplete="email"
          placeholder="alex@example.com"
          class="w-full px-3.5 py-2.5 rounded-xl border text-sm text-ink bg-canvas placeholder:text-faint
                 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          :class="errors.email ? 'border-red-400' : 'border-line'"
        />
        <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
      </div>

      <!-- Телефон -->
      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-ink">Телефон</label>
        <input
          v-model="form.phone"
          type="tel"
          autocomplete="tel"
          placeholder="+7 (999) 000-00-00"
          class="w-full px-3.5 py-2.5 rounded-xl border text-sm text-ink bg-canvas placeholder:text-faint
                 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          :class="errors.phone ? 'border-red-400' : 'border-line'"
        />
        <p v-if="errors.phone" class="text-xs text-red-500">{{ errors.phone }}</p>
      </div>
    </div>

    <p v-if="serverError" class="text-sm text-red-500">{{ serverError }}</p>

    <div class="flex items-center gap-3">
      <button
        class="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold
               rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        :disabled="updating"
        @click="submit"
      >
        <Save v-if="!updating" :size="15" />
        <span v-if="updating" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        {{ updating ? 'Сохраняем...' : 'Сохранить' }}
      </button>

      <Transition name="fade">
        <span v-if="saved" class="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
          <CheckCircle2 :size="15" />
          Сохранено
        </span>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
