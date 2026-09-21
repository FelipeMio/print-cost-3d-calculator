import type { PrinterTechnology } from './printers'

export type MaterialUnit = 'g' | 'ml'

export type Material = {
  id: string
  name: string
  brand: string
  color: string
  technology: PrinterTechnology
  unit: MaterialUnit
}

export const defaultMaterials: Material[] = [
  {
    id: 'resin-abs-like',
    name: 'ABS-Like',
    brand: 'Elegoo',
    color: 'Cinza',
    technology: 'RESIN',
    unit: 'ml',
  },

  {
    id: 'pla-generic',
    name: 'PLA',
    brand: 'Genérico',
    color: 'Preto',
    technology: 'FDM',
    unit: 'g',
  },
]
