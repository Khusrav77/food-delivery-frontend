import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useProductStore } from '@/entities/dish'
import type { Product } from '@/entities/dish'
import type { MenuItemDraft } from './types'
import { defaultMenuItemDraft, productToDraft, draftToMenuItem, validateDishForm } from './dishDraft'

export function useDishForm(
  productRef: Ref<Product | null | undefined>,
  onClose: () => void,
) {
  const productStore = useProductStore()

  const name = ref('')
  const description = ref('')
  const categoryId = ref<string | null>(null)
  const isActive = ref(true)
  const menuItems = ref<MenuItemDraft[]>([])
  const errors = ref<Record<string, string>>({})
  const saving = ref(false)
  const saveError = ref<string | null>(null)

  watch(
    productRef,
    (product) => {
      if (product) {
        name.value = product.name
        description.value = product.description
        categoryId.value = product.categoryId
        isActive.value = product.isActive
        menuItems.value = product.menuItems.map(productToDraft)
      } else {
        name.value = ''
        description.value = ''
        categoryId.value = null
        isActive.value = true
        menuItems.value = [defaultMenuItemDraft()]
      }
      errors.value = {}
    },
    { immediate: true },
  )

  async function save() {
    errors.value = validateDishForm(name.value, menuItems.value)
    if (Object.keys(errors.value).length > 0) return

    saving.value = true
    saveError.value = null
    try {
      const product = productRef.value
      const data = {
        categoryId: categoryId.value,
        name: name.value.trim(),
        description: description.value.trim(),
        isActive: isActive.value,
        position: product?.position ?? 0,
        menuItems: menuItems.value.map((d, i) => draftToMenuItem(d, i, product?.id)),
      }
      if (product) {
        await productStore.updateProduct(product.id, data)
      } else {
        await productStore.addProduct(data)
      }
      onClose()
    } catch (e) {
      saveError.value = (e as { message: string }).message ?? 'Ошибка сохранения'
    } finally {
      saving.value = false
    }
  }

  return {
    name,
    description,
    categoryId,
    isActive,
    menuItems,
    errors,
    saving,
    saveError,
    save,
  }
}