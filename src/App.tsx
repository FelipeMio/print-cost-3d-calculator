import { useState, type ChangeEvent } from 'react'
import './App.css'

import { printers } from './data/printers'
import {
  defaultMaterials,
  type Material,
} from './data/materials'

import { useLocalStorage } from './hooks/useLocalStorage'
import {
  defaultMaterialPurchases,
  type MaterialPurchase,
} from './data/materialPurchases'
import MaterialsPage from './pages/MaterialsPage'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function App() {
  const [currentPage, setCurrentPage] =
    useState<'calculator' | 'materials'>('calculator')

  const [materials, setMaterials] =
  useLocalStorage<Material[]>(
    'printcost-materials-v2',
    defaultMaterials,
  )

  const [materialPurchases, setMaterialPurchases] =
    useLocalStorage<MaterialPurchase[]>(
      'printcost-material-purchases',
      defaultMaterialPurchases,
    )

  const [selectedPrinterId, setSelectedPrinterId] = useState(
    printers[0].id,
  )

  const selectedPrinter =
    printers.find(
      (printer) => printer.id === selectedPrinterId,
    ) ?? printers[0]

  const compatibleMaterials = materials.filter(
    (material) =>
      material.technology === selectedPrinter.technology,
  )

  const [selectedMaterialId, setSelectedMaterialId] = useState(
    compatibleMaterials[0]?.id ?? '',
  )

  const [materialUsed, setMaterialUsed] = useState(0)
  const [printHours, setPrintHours] = useState(0)
  const [printMinutes, setPrintMinutes] = useState(0)

  const selectedMaterial =
    compatibleMaterials.find(
      (material) => material.id === selectedMaterialId,
    ) ?? compatibleMaterials[0]

  const latestMaterialPurchase = selectedMaterial
    ? materialPurchases
        .filter(
          (purchase) =>
            purchase.materialId === selectedMaterial.id,
        )
        .sort(
          (a, b) =>
            new Date(b.purchasedAt).getTime() -
            new Date(a.purchasedAt).getTime(),
        )[0]
    : undefined

  const materialUnitCost = latestMaterialPurchase
    ? latestMaterialPurchase.price /
      latestMaterialPurchase.quantity
    : 0

  const normalizedMaterialPrice =
    materialUnitCost * 1000

  const normalizedMaterialUnit =
    selectedMaterial?.unit === 'g'
      ? 'kg'
      : 'L'

  const materialCost =
    materialUsed * materialUnitCost

  const printTimeHours =
    printHours + printMinutes / 60

  // Valor provisório da energia elétrica.
  // Depois será configurável pelo usuário.
  const energyRate = 0.95

  const energyCost =
    (selectedPrinter.powerWatts / 1000) *
    printTimeHours *
    energyRate

  const wearCost =
    selectedPrinter.wearCostPerHour *
    printTimeHours

  const printCost =
    materialCost +
    energyCost +
    wearCost

  const failureReserve =
    printCost * (selectedPrinter.failureRate / 100)

  const productionCost =
    printCost + failureReserve

  const markup = 2.2

  const suggestedPrice =
    productionCost * markup

  const estimatedProfit =
    suggestedPrice - productionCost

  const profitMargin =
    suggestedPrice > 0
      ? (estimatedProfit / suggestedPrice) * 100
      : 0

  function handlePrinterChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const printerId = event.target.value

    setSelectedPrinterId(printerId)

    const newPrinter = printers.find(
      (printer) => printer.id === printerId,
    )

    const firstCompatibleMaterial = materials.find(
      (material) =>
        material.technology === newPrinter?.technology,
    )

    setSelectedMaterialId(
      firstCompatibleMaterial?.id ?? '',
    )
  }
  return (
    <div className="app">
      <header className="header">
        <div>
          <strong>PrintCost 3D</strong>
        </div>

        <nav>
          <button
            className={currentPage === 'calculator' ? 'active' : ''}
            onClick={() => setCurrentPage('calculator')}
          >
            Calculadora
          </button>

          <button disabled>
            Impressoras
          </button>

          <button
            className={currentPage === 'materials' ? 'active' : ''}
            onClick={() => setCurrentPage('materials')}
          >
            Materiais
          </button>

          <button disabled>
            Projetos
          </button>
        </nav>
      </header>

      <main className="page">
        <section
          className="calculator"
          style={{
            display:
              currentPage === 'calculator'
                ? undefined
                : 'none',
          }}
        >
          <div className="page-heading">
            <p>Novo orçamento</p>

            <h1>Calcule o preço da sua impressão 3D</h1>

            <p>
              Informe os dados da produção para descobrir custos,
              preço de venda e lucro.
            </p>
          </div>

          <div className="content">
            <div className="configuration">
              <section className="card">
                <h2>1. Arquivo</h2>

                <div className="upload-area">
                  <p>Arraste seu arquivo 3D aqui</p>

                  <span>STL, 3MF ou G-code</span>

                  <button type="button">
                    Selecionar arquivo
                  </button>
                </div>
              </section>

              <section className="card">
          <h2>2. Produção</h2>

          <div className="field">
            <label htmlFor="printer">
              Impressora
            </label>

            <select
              id="printer"
              value={selectedPrinterId}
              onChange={handlePrinterChange}
            >
              {printers.map((printer) => (
                <option
                  key={printer.id}
                  value={printer.id}
                >
                  {printer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="material">
              Material
            </label>

            <select
              id="material"
              value={selectedMaterialId}
              onChange={(event) =>
                setSelectedMaterialId(event.target.value)
              }
            >
              {compatibleMaterials.map((material) => (
                <option
                  key={material.id}
                  value={material.id}
                >
                  {material.name}
                </option>
              ))}
            </select>

            {selectedMaterial && (
              <div className="material-price-reference">
                <span>Último preço registrado</span>

                {latestMaterialPurchase ? (
                  <strong>
                    {currencyFormatter.format(
                      normalizedMaterialPrice,
                    )}{' '}
                    / {normalizedMaterialUnit}
                  </strong>
                ) : (
                  <strong>
                    Nenhum preço registrado
                  </strong>
                )}
              </div>
            )}
          </div>

          <div className="field">
            <label htmlFor="materialUsed">
              Material utilizado
            </label>

            <div className="input-unit">
              <input
                id="materialUsed"
                type="number"
                min="0"
                value={materialUsed || ''}
                placeholder="0"
                onChange={(event) =>
                  setMaterialUsed(Number(event.target.value))
                }
              />

              <span>{selectedMaterial?.unit}</span>
            </div>
          </div>

          <div className="field">
            <label>
              Tempo de impressão
            </label>

            <div className="time-inputs">
              <input
                type="number"
                min="0"
                value={printHours || ''}
                placeholder="Horas"
                onChange={(event) =>
                  setPrintHours(Number(event.target.value))
                }
              />

              <input
                type="number"
                min="0"
                max="59"
                value={printMinutes || ''}
                placeholder="Minutos"
                onChange={(event) =>
                  setPrintMinutes(Number(event.target.value))
                }
              />
            </div>
          </div>
        </section>
            </div>

            <aside className="summary">
              <p>Resumo do orçamento</p>

              <div className="summary-row">
                <span>Material</span>

                <strong>
                  {currencyFormatter.format(materialCost)}
                </strong>
              </div>

              <div className="summary-row">
                <span>Energia</span>
                <strong>{currencyFormatter.format(energyCost)}</strong>
              </div>

              <div className="summary-row">
                <span>Desgaste da máquina</span>
                <strong>{currencyFormatter.format(wearCost)}</strong>
              </div>

              <div className="summary-row">
                <span>Reserva para falhas</span>
                <strong>
                  {currencyFormatter.format(failureReserve)}
                </strong>
              </div>



              <hr />

              <div className="summary-row">
                <span>Custo da impressão</span>
                <strong>{currencyFormatter.format(productionCost)}</strong>
              </div>

              <div className="price">
                <span>Preço sugerido</span>
                <strong>{currencyFormatter.format(suggestedPrice)}</strong>
              </div>

              <div className="summary-row">
                <span>Lucro estimado</span>
                <strong>
                  {currencyFormatter.format(estimatedProfit)}
                </strong>
              </div>

              <div className="summary-row">
                <span>Margem</span>
                <strong>
                  {profitMargin.toFixed(1)}%
                </strong>
              </div>

              <button type="button">
                Salvar orçamento
              </button>
            </aside>
          </div>
        </section>
        {currentPage === 'materials' && (
          <MaterialsPage
            materials={materials}
            setMaterials={setMaterials}
            purchases={materialPurchases}
            setPurchases={setMaterialPurchases}
          />
        )}
      </main>
    </div>
  )
}

export default App