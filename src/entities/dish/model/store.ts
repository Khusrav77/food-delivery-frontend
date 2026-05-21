import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Product, MenuItem } from './types'

const NOW = '2024-01-01T00:00:00.000Z'

const mockProducts: Product[] = [
  {
    id: 'd1',
    categoryId: 'c1',
    name: 'Ролл Филадельфия',
    description: 'Нежный лосось, сливочный сыр, огурец, авокадо',
    isActive: true,
    position: 1,
    createdAt: NOW,
    updatedAt: NOW,
    menuItems: [
      {
        id: 'mi1',
        productId: 'd1',
        name: '4 шт',
        price: 400,
        isActive: true,
        position: 1,
        images: [{ id: 'img1', menuItemId: 'mi1', url: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80', position: 1 }],
        sizes: [{ id: 's1', menuItemId: 'mi1', sizeType: 'weight', sizeValue: 200, sizeUnit: 'gram' }],
        tagIds: ['t1'],
      },
      {
        id: 'mi2',
        productId: 'd1',
        name: '8 шт',
        price: 700,
        isActive: true,
        position: 2,
        images: [{ id: 'img2', menuItemId: 'mi2', url: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80', position: 1 }],
        sizes: [{ id: 's2', menuItemId: 'mi2', sizeType: 'weight', sizeValue: 400, sizeUnit: 'gram' }],
        tagIds: ['t1'],
      },
    ],
  },
  {
    id: 'd2',
    categoryId: 'c1',
    name: 'Ролл Дракон',
    description: 'Угорь, авокадо, огурец, соус унаги, кунжут',
    isActive: true,
    position: 2,
    createdAt: NOW,
    updatedAt: NOW,
    menuItems: [
      {
        id: 'mi3',
        productId: 'd2',
        name: '8 шт',
        price: 580,
        isActive: true,
        position: 1,
        images: [{ id: 'img3', menuItemId: 'mi3', url: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&q=80', position: 1 }],
        sizes: [{ id: 's3', menuItemId: 'mi3', sizeType: 'weight', sizeValue: 320, sizeUnit: 'gram' }],
        tagIds: ['t1', 't3'],
      },
    ],
  },
  {
    id: 'd3',
    categoryId: 'c1',
    name: 'Ролл Калифорния',
    description: 'Краб, авокадо, огурец, икра тобико',
    isActive: true,
    position: 3,
    createdAt: NOW,
    updatedAt: NOW,
    menuItems: [
      {
        id: 'mi4',
        productId: 'd3',
        name: '8 шт',
        price: 450,
        isActive: true,
        position: 1,
        images: [{ id: 'img4', menuItemId: 'mi4', url: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&q=80', position: 1 }],
        sizes: [{ id: 's4', menuItemId: 'mi4', sizeType: 'weight', sizeValue: 280, sizeUnit: 'gram' }],
        tagIds: ['t2'],
      },
    ],
  },
  {
    id: 'd4',
    categoryId: 'c2',
    name: 'Пицца Маргарита',
    description: 'Томатный соус, моцарелла, свежий базилик',
    isActive: true,
    position: 1,
    createdAt: NOW,
    updatedAt: NOW,
    menuItems: [
      {
        id: 'mi5',
        productId: 'd4',
        name: '20 см',
        price: 550,
        isActive: true,
        position: 1,
        images: [{ id: 'img5', menuItemId: 'mi5', url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80', position: 1 }],
        sizes: [
          { id: 's5', menuItemId: 'mi5', sizeType: 'diameter', sizeValue: 20, sizeUnit: 'cm' },
          { id: 's6', menuItemId: 'mi5', sizeType: 'weight', sizeValue: 400, sizeUnit: 'gram' },
        ],
        tagIds: ['t4'],
      },
      {
        id: 'mi6',
        productId: 'd4',
        name: '30 см',
        price: 850,
        isActive: true,
        position: 2,
        images: [{ id: 'img6', menuItemId: 'mi6', url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80', position: 1 }],
        sizes: [
          { id: 's7', menuItemId: 'mi6', sizeType: 'diameter', sizeValue: 30, sizeUnit: 'cm' },
          { id: 's8', menuItemId: 'mi6', sizeType: 'weight', sizeValue: 700, sizeUnit: 'gram' },
        ],
        tagIds: ['t4'],
      },
    ],
  },
  {
    id: 'd5',
    categoryId: 'c2',
    name: 'Пицца Пепперони',
    description: 'Томатный соус, моцарелла, острые колбаски пепперони',
    isActive: true,
    position: 2,
    createdAt: NOW,
    updatedAt: NOW,
    menuItems: [
      {
        id: 'mi7',
        productId: 'd5',
        name: '20 см',
        price: 620,
        isActive: true,
        position: 1,
        images: [{ id: 'img7', menuItemId: 'mi7', url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80', position: 1 }],
        sizes: [
          { id: 's9', menuItemId: 'mi7', sizeType: 'diameter', sizeValue: 20, sizeUnit: 'cm' },
          { id: 's10', menuItemId: 'mi7', sizeType: 'weight', sizeValue: 450, sizeUnit: 'gram' },
        ],
        tagIds: ['t1', 't3'],
      },
      {
        id: 'mi8',
        productId: 'd5',
        name: '30 см',
        price: 950,
        isActive: true,
        position: 2,
        images: [{ id: 'img8', menuItemId: 'mi8', url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80', position: 1 }],
        sizes: [
          { id: 's11', menuItemId: 'mi8', sizeType: 'diameter', sizeValue: 30, sizeUnit: 'cm' },
          { id: 's12', menuItemId: 'mi8', sizeType: 'weight', sizeValue: 750, sizeUnit: 'gram' },
        ],
        tagIds: ['t1', 't3'],
      },
    ],
  },
  {
    id: 'd6',
    categoryId: 'c3',
    name: 'Сет Суши Классика',
    description: '10 кусочков: лосось, тунец, угорь, сёмга, икура',
    isActive: true,
    position: 1,
    createdAt: NOW,
    updatedAt: NOW,
    menuItems: [
      {
        id: 'mi9',
        productId: 'd6',
        name: '10 шт',
        price: 750,
        isActive: true,
        position: 1,
        images: [{ id: 'img9', menuItemId: 'mi9', url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&q=80', position: 1 }],
        sizes: [
          { id: 's13', menuItemId: 'mi9', sizeType: 'count', sizeValue: 10, sizeUnit: 'piece' },
          { id: 's14', menuItemId: 'mi9', sizeType: 'weight', sizeValue: 300, sizeUnit: 'gram' },
        ],
        tagIds: ['t1', 't2'],
      },
    ],
  },
  {
    id: 'd7',
    categoryId: 'c3',
    name: 'Суши Лосось',
    description: 'Свежий лосось на рисовой подушке',
    isActive: false,
    position: 2,
    createdAt: NOW,
    updatedAt: NOW,
    menuItems: [
      {
        id: 'mi10',
        productId: 'd7',
        name: '2 шт',
        price: 200,
        isActive: false,
        position: 1,
        images: [{ id: 'img10', menuItemId: 'mi10', url: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400&q=80', position: 1 }],
        sizes: [
          { id: 's15', menuItemId: 'mi10', sizeType: 'count', sizeValue: 2, sizeUnit: 'piece' },
          { id: 's16', menuItemId: 'mi10', sizeType: 'weight', sizeValue: 80, sizeUnit: 'gram' },
        ],
        tagIds: ['t5'],
      },
    ],
  },
  {
    id: 'd8',
    categoryId: 'c4',
    name: 'Coca-Cola',
    description: 'Освежающий газированный напиток',
    isActive: true,
    position: 1,
    createdAt: NOW,
    updatedAt: NOW,
    menuItems: [
      {
        id: 'mi11',
        productId: 'd8',
        name: '0.33 л',
        price: 120,
        isActive: true,
        position: 1,
        images: [{ id: 'img11', menuItemId: 'mi11', url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80', position: 1 }],
        sizes: [{ id: 's17', menuItemId: 'mi11', sizeType: 'volume', sizeValue: 330, sizeUnit: 'ml' }],
        tagIds: [],
      },
      {
        id: 'mi12',
        productId: 'd8',
        name: '0.5 л',
        price: 160,
        isActive: true,
        position: 2,
        images: [{ id: 'img12', menuItemId: 'mi12', url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80', position: 1 }],
        sizes: [{ id: 's18', menuItemId: 'mi12', sizeType: 'volume', sizeValue: 500, sizeUnit: 'ml' }],
        tagIds: [],
      },
    ],
  },
]

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([...mockProducts])

  const getByCategory = computed(() => (categoryId: string | null) => {
    if (categoryId === null) return products.value.filter(p => p.categoryId === null)
    return products.value.filter(p => p.categoryId === categoryId)
  })

  const getByTag = computed(() => (tagId: string) =>
    products.value.filter(p => p.menuItems.some(mi => mi.tagIds.includes(tagId))),
  )

  function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString()
    products.value.push({ ...product, id: `d${Date.now()}`, createdAt: now, updatedAt: now })
  }

  function updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      products.value[idx] = { ...products.value[idx], ...updates, updatedAt: new Date().toISOString() }
    }
  }

  function removeProduct(id: string) {
    products.value = products.value.filter(p => p.id !== id)
  }

  function toggleActive(id: string) {
    const product = products.value.find(p => p.id === id)
    if (product) product.isActive = !product.isActive
  }

  function addMenuItem(productId: string, item: Omit<MenuItem, 'id' | 'productId'>) {
    const product = products.value.find(p => p.id === productId)
    if (product) product.menuItems.push({ ...item, id: `mi${Date.now()}`, productId })
  }

  function updateMenuItem(productId: string, itemId: string, updates: Partial<Omit<MenuItem, 'id' | 'productId'>>) {
    const product = products.value.find(p => p.id === productId)
    if (!product) return
    const idx = product.menuItems.findIndex(mi => mi.id === itemId)
    if (idx !== -1) product.menuItems[idx] = { ...product.menuItems[idx], ...updates }
  }

  function removeMenuItem(productId: string, itemId: string) {
    const product = products.value.find(p => p.id === productId)
    if (product) product.menuItems = product.menuItems.filter(mi => mi.id !== itemId)
  }

  return {
    products,
    getByCategory,
    getByTag,
    addProduct,
    updateProduct,
    removeProduct,
    toggleActive,
    addMenuItem,
    updateMenuItem,
    removeMenuItem,
  }
})
