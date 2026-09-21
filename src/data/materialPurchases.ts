export type MaterialPurchase = {
  id: string
  materialId: string
  price: number
  quantity: number
  purchasedAt: string
}

export const defaultMaterialPurchases: MaterialPurchase[] = [
  {
    id: 'purchase-resin-example',
    materialId: 'resin-abs-like',
    price: 120,
    quantity: 1000,
    purchasedAt: '2026-09-21',
  },

  {
    id: 'purchase-pla-example',
    materialId: 'pla-generic',
    price: 90,
    quantity: 1000,
    purchasedAt: '2026-09-21',
  },
]
