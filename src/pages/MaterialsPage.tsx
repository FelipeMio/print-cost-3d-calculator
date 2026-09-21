import { useState, type FormEvent } from 'react'

import type { Material } from '../data/materials'
import type { MaterialPurchase } from '../data/materialPurchases'

import './MaterialsPage.css'

type MaterialsPageProps = {
  materials: Material[]
  setMaterials: (materials: Material[]) => void

  purchases: MaterialPurchase[]
  setPurchases: (purchases: MaterialPurchase[]) => void
}

const money = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function MaterialsPage({
  materials,
  setMaterials,
  purchases,
  setPurchases,
}: MaterialsPageProps) {
  const [selectedMaterialId, setSelectedMaterialId] =
    useState(materials[0]?.id ?? '')

  const [addingMaterial, setAddingMaterial] = useState(false)
  const [editingMaterialId, setEditingMaterialId] =
    useState<string | null>(null)

  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [color, setColor] = useState('')

  const [technology, setTechnology] =
    useState<Material['technology']>('FDM')

  const [purchasePrice, setPurchasePrice] = useState('')
  const [purchaseQuantity, setPurchaseQuantity] =
    useState('1000')

  const [purchaseDate, setPurchaseDate] =
    useState(
      new Date().toISOString().slice(0, 10),
    )

  const selectedMaterial = materials.find(
    (material) => material.id === selectedMaterialId,
  )

  const selectedPurchases = purchases
    .filter(
      (purchase) =>
        purchase.materialId === selectedMaterialId,
    )
    .sort(
      (a, b) =>
        new Date(b.purchasedAt).getTime() -
        new Date(a.purchasedAt).getTime(),
    )

  const latestPurchase = selectedPurchases[0]

  function getLatestPurchase(materialId: string) {
    return purchases
      .filter(
        (purchase) =>
          purchase.materialId === materialId,
      )
      .sort(
        (a, b) =>
          new Date(b.purchasedAt).getTime() -
          new Date(a.purchasedAt).getTime(),
      )[0]
  }

  function handleAddMaterial(event: FormEvent) {
    event.preventDefault()

    if (!name.trim()) {
      return
    }

    const unit =
      technology === 'FDM'
        ? 'g'
        : 'ml'

    if (editingMaterialId) {
      setMaterials(
        materials.map((material) =>
          material.id === editingMaterialId
            ? {
                ...material,
                name: name.trim(),
                brand: brand.trim(),
                color: color.trim(),
                technology,
                unit,
              }
            : material,
        ),
      )
    } else {
      const newMaterial: Material = {
        id: crypto.randomUUID(),
        name: name.trim(),
        brand: brand.trim(),
        color: color.trim(),
        technology,
        unit,
      }

      setMaterials([
        ...materials,
        newMaterial,
      ])

      setSelectedMaterialId(newMaterial.id)
    }

    setName('')
    setBrand('')
    setColor('')
    setEditingMaterialId(null)
    setAddingMaterial(false)
  }

  function startEditingMaterial(material: Material) {
    setName(material.name)
    setBrand(material.brand)
    setColor(material.color)
    setTechnology(material.technology)

    setEditingMaterialId(material.id)
    setAddingMaterial(true)
  }

  function cancelMaterialForm() {
    setName('')
    setBrand('')
    setColor('')
    setEditingMaterialId(null)
    setAddingMaterial(false)
  }

  function handleAddPurchase(event: FormEvent) {
    event.preventDefault()

    if (!selectedMaterial) {
      return
    }

    const price = Number(purchasePrice)
    const quantity = Number(purchaseQuantity)

    if (price <= 0 || quantity <= 0) {
      return
    }

    const newPurchase: MaterialPurchase = {
      id: crypto.randomUUID(),
      materialId: selectedMaterial.id,
      price,
      quantity,
      purchasedAt: purchaseDate,
    }

    setPurchases([
      ...purchases,
      newPurchase,
    ])

    setPurchasePrice('')
    setPurchaseQuantity('1000')
  }

  function removeMaterial(materialId: string) {
    const confirmed = window.confirm(
      'Excluir este material e todo o histórico de compras?',
    )

    if (!confirmed) {
      return
    }

    const updatedMaterials =
      materials.filter(
        (material) =>
          material.id !== materialId,
      )

    setMaterials(updatedMaterials)

    setPurchases(
      purchases.filter(
        (purchase) =>
          purchase.materialId !== materialId,
      ),
    )

    setSelectedMaterialId(
      updatedMaterials[0]?.id ?? '',
    )
  }

  function removePurchase(purchaseId: string) {
    setPurchases(
      purchases.filter(
        (purchase) =>
          purchase.id !== purchaseId,
      ),
    )
  }

  return (
    <section className="materials-page">
      <div className="materials-heading">
        <div>
          <p>Materiais</p>

          <h1>Materiais e preços</h1>

          <span>
            Acompanhe quanto você paga por cada
            filamento ou resina.
          </span>
        </div>

        <button
          className="new-material-button"
          type="button"
          onClick={() => {
            setEditingMaterialId(null)
            setName('')
            setBrand('')
            setColor('')
            setAddingMaterial(true)
          }}
        >
          + Novo material
        </button>
      </div>

      <div className="materials-layout">
        <div className="materials-sidebar">
          {materials.map((material) => {
            const latest =
              getLatestPurchase(material.id)

            const normalizedPrice = latest
              ? latest.price /
                latest.quantity *
                1000
              : 0

            const normalizedUnit =
              material.unit === 'g'
                ? 'kg'
                : 'L'

            return (
              <button
                type="button"
                key={material.id}
                className={
                  selectedMaterialId === material.id
                    ? 'material-list-item active'
                    : 'material-list-item'
                }
                onClick={() => {
                  setSelectedMaterialId(material.id)
                  setAddingMaterial(false)
                }}
              >
                <div>
                  <strong>
                    {material.name}
                  </strong>

                  <span>
                    {material.brand || 'Sem marca'}
                    {material.color
                      ? ` · ${material.color}`
                      : ''}
                  </span>
                </div>

                <div className="material-last-price">
                  {latest ? (
                    <>
                      <strong>
                        {money.format(
                          normalizedPrice,
                        )}
                      </strong>

                      <span>
                        / {normalizedUnit}
                      </span>
                    </>
                  ) : (
                    <span>
                      Sem compras
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <div className="material-content">
          {addingMaterial ? (
            <form
              className="material-panel"
              onSubmit={handleAddMaterial}
            >
              <div className="panel-heading">
                <div>
                  <span>
                    {editingMaterialId
                      ? 'Editar material'
                      : 'Novo material'}
                  </span>

                  <h2>
                    {editingMaterialId
                      ? 'Editar material'
                      : 'Cadastrar material'}
                  </h2>
                </div>
              </div>

              <div className="form-grid">
                <div className="field">
                  <label htmlFor="newMaterialName">
                    Material
                  </label>

                  <input
                    id="newMaterialName"
                    value={name}
                    placeholder="Ex.: PLA Basic"
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                  />
                </div>

                <div className="field">
                  <label htmlFor="newMaterialBrand">
                    Marca
                  </label>

                  <input
                    id="newMaterialBrand"
                    value={brand}
                    placeholder="Ex.: 3D Fila"
                    onChange={(event) =>
                      setBrand(event.target.value)
                    }
                  />
                </div>

                <div className="field">
                  <label htmlFor="newMaterialColor">
                    Cor
                  </label>

                  <input
                    id="newMaterialColor"
                    value={color}
                    placeholder="Ex.: Preto"
                    onChange={(event) =>
                      setColor(event.target.value)
                    }
                  />
                </div>

                <div className="field">
                  <label htmlFor="newMaterialTechnology">
                    Tipo
                  </label>

                  <select
                    id="newMaterialTechnology"
                    value={technology}
                    onChange={(event) =>
                      setTechnology(
                        event.target
                          .value as Material['technology'],
                      )
                    }
                  >
                    <option value="FDM">
                      Filamento / FDM
                    </option>

                    <option value="RESIN">
                      Resina
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={cancelMaterialForm}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingMaterialId
                    ? 'Salvar alterações'
                    : 'Salvar material'}
                </button>
              </div>
            </form>
          ) : selectedMaterial ? (
            <>
              <section className="material-panel">
                <div className="panel-heading">
                  <div>
                    <span>
                      {selectedMaterial.technology === 'FDM'
                        ? 'Filamento'
                        : 'Resina'}
                    </span>

                    <h2>
                      {selectedMaterial.name}
                    </h2>

                    <p>
                      {selectedMaterial.brand ||
                        'Sem marca'}

                      {selectedMaterial.color
                        ? ` · ${selectedMaterial.color}`
                        : ''}
                    </p>
                  </div>

                  <div className="material-actions">
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() =>
                        startEditingMaterial(
                          selectedMaterial,
                        )
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="danger-button"
                      type="button"
                      onClick={() =>
                        removeMaterial(
                          selectedMaterial.id,
                        )
                      }
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                {latestPurchase ? (
                  <div className="price-highlight">
                    <span>
                      Último preço registrado
                    </span>

                    <strong>
                      {money.format(
                        latestPurchase.price /
                          latestPurchase.quantity *
                          1000,
                      )}
                    </strong>

                    <small>
                      por{' '}
                      {selectedMaterial.unit === 'g'
                        ? 'kg'
                        : 'litro'}
                    </small>
                  </div>
                ) : (
                  <div className="empty-price">
                    Nenhuma compra registrada.
                  </div>
                )}
              </section>

              <form
                className="material-panel"
                onSubmit={handleAddPurchase}
              >
                <div className="panel-heading">
                  <div>
                    <span>Compra</span>

                    <h2>
                      Registrar novo preço
                    </h2>
                  </div>
                </div>

                <div className="purchase-grid">
                  <div className="field">
                    <label htmlFor="purchasePrice">
                      Valor pago
                    </label>

                    <input
                      id="purchasePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="89.90"
                      value={purchasePrice}
                      onChange={(event) =>
                        setPurchasePrice(
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="purchaseQuantity">
                      Quantidade
                    </label>

                    <div className="input-unit">
                      <input
                        id="purchaseQuantity"
                        type="number"
                        min="1"
                        value={purchaseQuantity}
                        onChange={(event) =>
                          setPurchaseQuantity(
                            event.target.value,
                          )
                        }
                      />

                      <span>
                        {selectedMaterial.unit}
                      </span>
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="purchaseDate">
                      Data
                    </label>

                    <input
                      id="purchaseDate"
                      type="date"
                      value={purchaseDate}
                      onChange={(event) =>
                        setPurchaseDate(
                          event.target.value,
                        )
                      }
                    />
                  </div>
                </div>

                <button
                  className="primary-button"
                  type="submit"
                >
                  Registrar compra
                </button>
              </form>

              <section className="material-panel">
                <div className="panel-heading">
                  <div>
                    <span>Histórico</span>

                    <h2>
                      Histórico de preços
                    </h2>
                  </div>
                </div>

                {selectedPurchases.length === 0 ? (
                  <p className="empty-history">
                    Ainda não existem compras
                    registradas.
                  </p>
                ) : (
                  <div className="purchase-history">
                    {selectedPurchases.map(
                      (purchase) => {
                        const normalizedPrice =
                          purchase.price /
                          purchase.quantity *
                          1000

                        return (
                          <div
                            className="purchase-row"
                            key={purchase.id}
                          >
                            <div>
                              <strong>
                                {money.format(
                                  purchase.price,
                                )}
                              </strong>

                              <span>
                                {purchase.quantity}{' '}
                                {selectedMaterial.unit}
                              </span>
                            </div>

                            <div>
                              <strong>
                                {money.format(
                                  normalizedPrice,
                                )}
                              </strong>

                              <span>
                                /{' '}
                                {selectedMaterial.unit ===
                                'g'
                                  ? 'kg'
                                  : 'L'}
                              </span>
                            </div>

                            <div>
                              <strong>
                                {new Date(
                                  `${purchase.purchasedAt}T12:00:00`,
                                ).toLocaleDateString(
                                  'pt-BR',
                                )}
                              </strong>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removePurchase(
                                  purchase.id,
                                )
                              }
                            >
                              Excluir
                            </button>
                          </div>
                        )
                      },
                    )}
                  </div>
                )}
              </section>
            </>
          ) : (
            <div className="material-panel">
              Nenhum material cadastrado.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default MaterialsPage
