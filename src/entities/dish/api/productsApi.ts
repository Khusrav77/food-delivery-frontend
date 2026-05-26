import { http } from '@/shared/api'
import type { Product, MenuItem, MenuItemImage, MenuItemSize, SizeType, SizeUnit } from '../model/types'

// ─── Backend DTO types ─────────────────────────────────────────────────────

type BackendProduct = {
  id: string
  categoryId: string | null
  name: string
  description: string | null
  active: boolean
  position: number | null
  createdAt: string
  updatedAt: string
}

type BackendSizeView = {
  id: string
  label: string      // 'WEIGHT' | 'DIAMETER' | 'VOLUME' | 'PIECES'
  sizeValue: number
  sizeUnit: string   // 'GRAM' | 'KG' | 'ML' | 'LITER' | 'CM' | 'PCS'
  price: number
}

export type BackendMenuItem = {
  id: string
  productId: string
  name: string
  active: boolean
  position: number | null
  createdAt: string
  updatedAt: string
  imageUrls: string[]
  sizes: BackendSizeView[]
  tagLabels: string[]
}

type BackendMenuItemImage = {
  id: string
  menuItemId: string
  url: string
  position: number | null
  createdAt: string
  updatedAt: string
}

type BackendMenuItemSize = {
  id: string
  menuItemId: string
  label: string
  sizeValue: number
  sizeUnit: string
  price: number
}

// ─── Enum mapping tables ───────────────────────────────────────────────────

const LABEL_TO_SIZE_TYPE: Record<string, SizeType> = {
  WEIGHT: 'weight',
  DIAMETER: 'diameter',
  VOLUME: 'volume',
  PIECES: 'count',
}

export const SIZE_TYPE_TO_LABEL: Record<SizeType, string> = {
  weight: 'WEIGHT',
  diameter: 'DIAMETER',
  volume: 'VOLUME',
  count: 'PIECES',
}

const UNIT_TO_SIZE_UNIT: Record<string, SizeUnit> = {
  GRAM: 'gram',
  KG: 'kg',
  ML: 'ml',
  LITER: 'l',
  CM: 'cm',
  PCS: 'piece',
}

export const SIZE_UNIT_TO_UNIT: Record<SizeUnit, string> = {
  gram: 'GRAM',
  kg: 'KG',
  ml: 'ML',
  l: 'LITER',
  cm: 'CM',
  piece: 'PCS',
}

// ─── Mappers ───────────────────────────────────────────────────────────────

function mapProduct(raw: BackendProduct): Omit<Product, 'menuItems'> {
  return {
    id: raw.id,
    categoryId: raw.categoryId,
    name: raw.name,
    description: raw.description ?? '',
    isActive: raw.active,
    position: raw.position ?? 0,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
}

// tagResolver: converts a backend tag name → frontend tag id (supplied by store)
export function mapMenuItem(
  raw: BackendMenuItem,
  tagResolver: (label: string) => string | undefined,
): MenuItem {
  const images: MenuItemImage[] = raw.imageUrls.map((url, i) => ({
    id: `img-${raw.id}-${i}`,
    menuItemId: raw.id,
    url,
    position: i + 1,
  }))

  const sizes: MenuItemSize[] = raw.sizes.map(s => ({
    id: s.id,
    menuItemId: raw.id,
    sizeType: LABEL_TO_SIZE_TYPE[s.label] ?? 'weight',
    sizeValue: s.sizeValue,
    sizeUnit: UNIT_TO_SIZE_UNIT[s.sizeUnit] ?? 'gram',
  }))

  const tagIds = raw.tagLabels
    .map(label => tagResolver(label))
    .filter((id): id is string => id !== undefined)

  return {
    id: raw.id,
    productId: raw.productId,
    name: raw.name,
    price: raw.sizes[0]?.price ?? 0,
    isActive: raw.active,
    position: raw.position ?? 0,
    images,
    sizes,
    tagIds,
  }
}

// ─── Products ──────────────────────────────────────────────────────────────

export async function fetchProducts(params?: { categoryId?: string }): Promise<Omit<Product, 'menuItems'>[]> {
  const res = await http.get<BackendProduct[]>('/products', { params })
  return res.data.map(mapProduct)
}

export async function createProduct(payload: {
  categoryId: string
  name: string
  description?: string
  active?: boolean
  position?: number
}): Promise<Omit<Product, 'menuItems'>> {
  const res = await http.post<BackendProduct>('/products', payload)
  return mapProduct(res.data)
}

export async function updateProductApi(
  id: string,
  payload: { categoryId?: string; name?: string; description?: string; active?: boolean; position?: number },
): Promise<Omit<Product, 'menuItems'>> {
  const res = await http.put<BackendProduct>(`/products/${id}`, payload)
  return mapProduct(res.data)
}

export async function deleteProduct(id: string): Promise<void> {
  await http.delete(`/products/${id}`)
}

// ─── Menu Items ────────────────────────────────────────────────────────────

export async function fetchMenuItems(productId?: string): Promise<BackendMenuItem[]> {
  const res = await http.get<BackendMenuItem[]>('/menu-items', {
    params: productId ? { productId } : undefined,
  })
  return res.data
}

// productId + name are @NotNull/@NotBlank in backend — always required
export async function createMenuItemApi(payload: {
  productId: string
  name: string
  active?: boolean
  position?: number
}): Promise<BackendMenuItem> {
  const res = await http.post<BackendMenuItem>('/menu-items', payload)
  return res.data
}

// name + productId are required even on PUT
export async function updateMenuItemApi(
  id: string,
  payload: { productId: string; name: string; active?: boolean; position?: number },
): Promise<BackendMenuItem> {
  const res = await http.put<BackendMenuItem>(`/menu-items/${id}`, payload)
  return res.data
}

export async function deleteMenuItemApi(id: string): Promise<void> {
  await http.delete(`/menu-items/${id}`)
}

export async function attachTag(menuItemId: string, tagId: string): Promise<void> {
  await http.post(`/menu-items/${menuItemId}/tags/${tagId}`)
}

export async function detachTag(menuItemId: string, tagId: string): Promise<void> {
  await http.delete(`/menu-items/${menuItemId}/tags/${tagId}`)
}

// ─── Images ────────────────────────────────────────────────────────────────

export async function fetchMenuItemImages(menuItemId: string): Promise<BackendMenuItemImage[]> {
  const res = await http.get<BackendMenuItemImage[]>('/menu-item-images', {
    params: { menuItemId },
  })
  return res.data
}

export async function createMenuItemImageApi(payload: {
  menuItemId: string
  url: string
}): Promise<BackendMenuItemImage> {
  const res = await http.post<BackendMenuItemImage>('/menu-item-images', payload)
  return res.data
}

export async function deleteMenuItemImageApi(imageId: string): Promise<void> {
  await http.delete(`/menu-item-images/${imageId}`)
}

// ─── Sizes ─────────────────────────────────────────────────────────────────

export async function createMenuItemSizeApi(payload: {
  menuItemId: string
  label: string   // SizeLabel enum: WEIGHT | DIAMETER | VOLUME | PIECES
  sizeValue: number
  sizeUnit: string // SizeUnit enum: GRAM | KG | ML | LITER | CM | PCS
  price: number
}): Promise<BackendMenuItemSize> {
  const res = await http.post<BackendMenuItemSize>('/menu-item-sizes', payload)
  return res.data
}

export async function deleteMenuItemSizeApi(sizeId: string): Promise<void> {
  await http.delete(`/menu-item-sizes/${sizeId}`)
}
