import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Product, MenuItem } from './types'
import {
  fetchProducts,
  fetchMenuItems,
  fetchMenuItemImages,
  createProduct,
  updateProductApi,
  deleteProduct,
  createMenuItemApi,
  updateMenuItemApi,
  deleteMenuItemApi,
  attachTag,
  detachTag,
  createMenuItemImageApi,
  deleteMenuItemImageApi,
  createMenuItemSizeApi,
  deleteMenuItemSizeApi,
  mapMenuItem,
  SIZE_TYPE_TO_LABEL,
  SIZE_UNIT_TO_UNIT,
} from '../api/productsApi'
// FSD exception: tag label → id lookup requires tag data at the entity level
import { useTagStore } from '@/entities/tag'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getByCategory = computed(() => (categoryId: string | null) => {
    if (categoryId === null) return products.value.filter(p => p.categoryId === null)
    return products.value.filter(p => p.categoryId === categoryId)
  })

  const getByTag = computed(() => (tagId: string) =>
    products.value.filter(p => p.menuItems.some(mi => mi.tagIds.includes(tagId))),
  )

  function tagResolver(label: string): string | undefined {
    return useTagStore().tags.find(t => t.label === label)?.id
  }

  // ─── Fetch ──────────────────────────────────────────────────────────────

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const [rawProducts, rawItems] = await Promise.all([fetchProducts(), fetchMenuItems()])

      const itemsByProduct = new Map<string, typeof rawItems>()
      for (const item of rawItems) {
        const list = itemsByProduct.get(item.productId) ?? []
        list.push(item)
        itemsByProduct.set(item.productId, list)
      }

      products.value = rawProducts.map(p => ({
        ...p,
        menuItems: (itemsByProduct.get(p.id) ?? []).map(item => mapMenuItem(item, tagResolver)),
      }))
    } catch (e) {
      error.value = (e as { message: string }).message ?? 'Ошибка загрузки продуктов'
    } finally {
      loading.value = false
    }
  }

  // ─── Internal helpers ────────────────────────────────────────────────────

  async function syncSizes(menuItemId: string, item: { price: number; sizes: MenuItem['sizes'] }, existingSizeIds: string[]) {
    await Promise.all(existingSizeIds.map(id => deleteMenuItemSizeApi(id)))

    if (item.sizes.length > 0) {
      await Promise.all(
        item.sizes.map(sz =>
          createMenuItemSizeApi({
            menuItemId,
            label: SIZE_TYPE_TO_LABEL[sz.sizeType],
            sizeValue: sz.sizeValue,
            sizeUnit: SIZE_UNIT_TO_UNIT[sz.sizeUnit],
            price: item.price,
          }),
        ),
      )
    } else if (item.price > 0) {
      // No sizes configured — store the price on a default "piece" size
      await createMenuItemSizeApi({
        menuItemId,
        label: 'PIECES',
        sizeValue: 1,
        sizeUnit: 'PCS',
        price: item.price,
      })
    }
  }

  async function syncImages(menuItemId: string, imageUrls: string[]) {
    const existing = await fetchMenuItemImages(menuItemId)
    await Promise.all(existing.map(img => deleteMenuItemImageApi(img.id)))
    await Promise.all(imageUrls.map(url => createMenuItemImageApi({ menuItemId, url })))
  }

  async function syncTags(menuItemId: string, newTagIds: string[], existingTagIds: string[]) {
    const toAttach = newTagIds.filter(id => !existingTagIds.includes(id))
    const toDetach = existingTagIds.filter(id => !newTagIds.includes(id))
    await Promise.all([
      ...toAttach.map(id => attachTag(menuItemId, id)),
      ...toDetach.map(id => detachTag(menuItemId, id)),
    ])
  }

  async function freshMenuItems(productId: string): Promise<MenuItem[]> {
    const raw = await fetchMenuItems(productId)
    return raw.map(item => mapMenuItem(item, tagResolver))
  }

  async function createFullMenuItem(productId: string, item: Omit<MenuItem, 'id' | 'productId'>) {
    const created = await createMenuItemApi({
      productId,
      name: item.name,
      active: item.isActive,
      position: item.position,
    })
    await Promise.all([
      syncSizes(created.id, item, []),
      syncImages(created.id, item.images.map(img => img.url)),
      syncTags(created.id, item.tagIds, []),
    ])
  }

  // ─── CRUD ────────────────────────────────────────────────────────────────

  async function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const { menuItems, ...fields } = product
    const created = await createProduct({
      categoryId: fields.categoryId ?? '',
      name: fields.name,
      description: fields.description,
      active: fields.isActive,
      position: fields.position,
    })

    for (const item of menuItems) {
      await createFullMenuItem(created.id, item)
    }

    const items = await freshMenuItems(created.id)
    products.value.push({ ...created, menuItems: items })
  }

  async function updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) {
    const { menuItems: newMenuItems, ...fields } = updates

    if (Object.keys(fields).length > 0) {
      await updateProductApi(id, {
        ...(fields.name !== undefined && { name: fields.name }),
        ...(fields.description !== undefined && { description: fields.description }),
        ...(fields.isActive !== undefined && { active: fields.isActive }),
        ...(fields.categoryId !== undefined && fields.categoryId !== null && { categoryId: fields.categoryId }),
        ...(fields.position !== undefined && { position: fields.position }),
      })
    }

    if (newMenuItems !== undefined) {
      const existing = products.value.find(p => p.id === id)
      const existingIds = new Set(existing?.menuItems.map(mi => mi.id) ?? [])

      const toDelete = (existing?.menuItems ?? []).filter(mi => !newMenuItems.find(nmi => nmi.id === mi.id))
      const toCreate = newMenuItems.filter(mi => !existingIds.has(mi.id))
      const toUpdate = newMenuItems.filter(mi => existingIds.has(mi.id))

      await Promise.all(toDelete.map(mi => deleteMenuItemApi(mi.id)))

      for (const item of toCreate) {
        await createFullMenuItem(id, item)
      }

      for (const item of toUpdate) {
        await updateMenuItemApi(item.id, { productId: id, name: item.name, active: item.isActive, position: item.position })
        const existingMi = existing?.menuItems.find(mi => mi.id === item.id)
        await Promise.all([
          syncSizes(item.id, item, existingMi?.sizes.map(s => s.id) ?? []),
          syncImages(item.id, item.images.map(img => img.url)),
          syncTags(item.id, item.tagIds, existingMi?.tagIds ?? []),
        ])
      }
    }

    const items = await freshMenuItems(id)
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      const current = products.value[idx]
      products.value[idx] = {
        ...current,
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.isActive !== undefined && { isActive: updates.isActive }),
        ...(updates.categoryId !== undefined && { categoryId: updates.categoryId }),
        ...(updates.position !== undefined && { position: updates.position }),
        menuItems: items,
      }
    }
  }

  async function removeProduct(id: string) {
    await deleteProduct(id)
    products.value = products.value.filter(p => p.id !== id)
  }

  async function toggleActive(id: string) {
    const product = products.value.find(p => p.id === id)
    if (!product) return
    const next = !product.isActive
    product.isActive = next
    try {
      await updateProductApi(id, { active: next })
    } catch (e) {
      product.isActive = !next
      throw e
    }
  }

  async function addMenuItem(productId: string, item: Omit<MenuItem, 'id' | 'productId'>) {
    await createFullMenuItem(productId, item)
    const items = await freshMenuItems(productId)
    const idx = products.value.findIndex(p => p.id === productId)
    if (idx !== -1) products.value[idx] = { ...products.value[idx], menuItems: items }
  }

  async function updateMenuItem(
    productId: string,
    itemId: string,
    itemUpdates: Partial<Omit<MenuItem, 'id' | 'productId'>>,
  ) {
    const current = products.value.find(p => p.id === productId)?.menuItems.find(mi => mi.id === itemId)
    if (current) {
      await updateMenuItemApi(itemId, {
        productId,
        name: itemUpdates.name ?? current.name,
        active: itemUpdates.isActive ?? current.isActive,
        position: itemUpdates.position ?? current.position,
      })
    }
    const items = await freshMenuItems(productId)
    const idx = products.value.findIndex(p => p.id === productId)
    if (idx !== -1) products.value[idx] = { ...products.value[idx], menuItems: items }
  }

  async function removeMenuItem(productId: string, itemId: string) {
    await deleteMenuItemApi(itemId)
    const product = products.value.find(p => p.id === productId)
    if (product) product.menuItems = product.menuItems.filter(mi => mi.id !== itemId)
  }

  return {
    products,
    loading,
    error,
    getByCategory,
    getByTag,
    fetchAll,
    addProduct,
    updateProduct,
    removeProduct,
    toggleActive,
    addMenuItem,
    updateMenuItem,
    removeMenuItem,
  }
})
