import type { PrinterTechnology } from './printers'

export type MaterialUnit = 'g' | 'ml'

export type Material = {
  id: string
  name: string
  technology: PrinterTechnology
  price: number
  quantity: number
  unit: MaterialUnit
}

export const materials: Material[] = [
  {
    id: 'resin-abs-like',
    name: 'Resina ABS-Like',
    technology: 'RESIN',
    price: 120,
    quantity: 1000,
    unit: 'ml',
  },

  {
    id: 'pla-generic',
    name: 'PLA',
    technology: 'FDM',
    price: 90,
    quantity: 1000,
    unit: 'g',
  },
]