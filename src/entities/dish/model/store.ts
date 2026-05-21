import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Dish } from './types'

const mockDishes: Dish[] = [
  {
    id: 'd1',
    name: 'Ролл Филадельфия',
    description: 'Нежный лосось, сливочный сыр, огурец, авокадо',
    imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80',
    categoryId: 'c1',
    tagIds: ['t1'],
    variants: [
      { id: 'v1', label: '4 шт', weight: 200, price: 400, isDefault: true },
      { id: 'v2', label: '8 шт', weight: 400, price: 700, isDefault: false },
    ],
    isAvailable: true,
    createdAt: '2024-01-10',
  },
  {
    id: 'd2',
    name: 'Ролл Дракон',
    description: 'Угорь, авокадо, огурец, соус унаги, кунжут',
    imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&q=80',
    categoryId: 'c1',
    tagIds: ['t1', 't3'],
    variants: [
      { id: 'v3', label: '8 шт', weight: 320, price: 580, isDefault: true },
    ],
    isAvailable: true,
    createdAt: '2024-01-11',
  },
  {
    id: 'd3',
    name: 'Ролл Калифорния',
    description: 'Краб, авокадо, огурец, икра тобико',
    imageUrl: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&q=80',
    categoryId: 'c1',
    tagIds: ['t2'],
    variants: [
      { id: 'v4', label: '8 шт', weight: 280, price: 450, isDefault: true },
    ],
    isAvailable: true,
    createdAt: '2024-01-12',
  },
  {
    id: 'd4',
    name: 'Пицца Маргарита',
    description: 'Томатный соус, моцарелла, свежий базилик',
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80',
    categoryId: 'c2',
    tagIds: ['t4'],
    variants: [
      { id: 'v5', label: '20 см', weight: 400, price: 550, isDefault: true },
      { id: 'v6', label: '30 см', weight: 700, price: 850, isDefault: false },
    ],
    isAvailable: true,
    createdAt: '2024-01-13',
  },
  {
    id: 'd5',
    name: 'Пицца Пепперони',
    description: 'Томатный соус, моцарелла, острые колбаски пепперони',
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80',
    categoryId: 'c2',
    tagIds: ['t1', 't3'],
    variants: [
      { id: 'v7', label: '20 см', weight: 450, price: 620, isDefault: true },
      { id: 'v8', label: '30 см', weight: 750, price: 950, isDefault: false },
    ],
    isAvailable: true,
    createdAt: '2024-01-14',
  },
  {
    id: 'd6',
    name: 'Сет Суши Классика',
    description: '10 кусочков: лосось, тунец, угорь, сёмга, икура',
    imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&q=80',
    categoryId: 'c3',
    tagIds: ['t1', 't2'],
    variants: [
      { id: 'v9', label: '10 шт', weight: 300, price: 750, isDefault: true },
    ],
    isAvailable: true,
    createdAt: '2024-01-15',
  },
  {
    id: 'd7',
    name: 'Суши Лосось',
    description: 'Свежий лосось на рисовой подушке',
    imageUrl: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400&q=80',
    categoryId: 'c3',
    tagIds: ['t5'],
    variants: [
      { id: 'v10', label: '2 шт', weight: 80, price: 200, isDefault: true },
    ],
    isAvailable: false,
    createdAt: '2024-01-16',
  },
  {
    id: 'd8',
    name: 'Coca-Cola',
    description: 'Освежающий газированный напиток',
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80',
    categoryId: 'c4',
    tagIds: [],
    variants: [
      { id: 'v11', label: '0.33 л', weight: 330, price: 120, isDefault: true },
      { id: 'v12', label: '0.5 л', weight: 500, price: 160, isDefault: false },
    ],
    isAvailable: true,
    createdAt: '2024-01-17',
  },
]

export const useDishStore = defineStore('dish', () => {
  const dishes = ref<Dish[]>([...mockDishes])

  const getByCategory = computed(() => (categoryId: string | null) => {
    if (categoryId === null) return dishes.value.filter(d => d.categoryId === null)
    return dishes.value.filter(d => d.categoryId === categoryId)
  })

  const getByTag = computed(() => (tagId: string) =>
    dishes.value.filter(d => d.tagIds.includes(tagId)),
  )

  function addDish(dish: Omit<Dish, 'id' | 'createdAt'>) {
    dishes.value.push({
      ...dish,
      id: `d${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    })
  }

  function updateDish(id: string, updates: Partial<Omit<Dish, 'id' | 'createdAt'>>) {
    const idx = dishes.value.findIndex(d => d.id === id)
    if (idx !== -1) dishes.value[idx] = { ...dishes.value[idx], ...updates }
  }

  function removeDish(id: string) {
    dishes.value = dishes.value.filter(d => d.id !== id)
  }

  function toggleAvailability(id: string) {
    const dish = dishes.value.find(d => d.id === id)
    if (dish) dish.isAvailable = !dish.isAvailable
  }

  return { dishes, getByCategory, getByTag, addDish, updateDish, removeDish, toggleAvailability }
})
