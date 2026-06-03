/** Город из фиксированного списка: центр карты + дефолтный зум. */
export interface ICity {
  id: string
  name: string
  lat: number
  lng: number
  zoom: number
}

/** Выбранная пользователем точка доставки (город + адрес + координаты). */
export interface IDeliveryLocation {
  cityId: string
  cityName: string
  street: string
  house: string
  apartment: string
  entrance: string
  floor: string
  comment: string
  lat: number
  lng: number
}
