export type PrinterTechnology = 'FDM' | 'RESIN'

export type Printer = {
  id: string
  name: string
  technology: PrinterTechnology
  powerWatts: number
  failureRate: number
}

export const defaultPrinters: Printer[] = [
  {
    id: 'elegoo-saturn-2',
    name: 'Elegoo Saturn 2',
    technology: 'RESIN',
    powerWatts: 80,
    failureRate: 10,
  },

  {
    id: 'ender-5-pro',
    name: 'Creality Ender 5 Pro',
    technology: 'FDM',
    powerWatts: 120,
    failureRate: 7,
  },
]
