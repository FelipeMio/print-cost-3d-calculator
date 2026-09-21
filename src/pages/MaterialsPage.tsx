import { useState, type FormEvent } from 'react'
import type { Material } from '../data/materials'
import './MaterialsPage.css'

type MaterialsPageProps = {
  materials: Material[]
  setMaterials: (materials: Material[]) => void
}

function MaterialsPage({
  materials,
  setMaterials,
}: MaterialsPageProps) {
  const [name, setName] = useState('')
  const [technology, setTechnology] =
    useState<Material['technology']>('FDM')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('1000')

  const unit = technology === 'FDM' ? 'g' : 'ml'

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const numericPrice = Number(price)
    const numericQuantity = Number(quantity)

    if (
      !name.trim() ||
      numericPrice <= 0 ||
      numericQuantity <= 0
    ) {
      return
    }

    const newMaterial: Material = {
      id: crypto.randomUUID(),
      name: name.trim(),
      technology,
      price: numericPrice,
      quantity: numericQuantity,
      unit,
    }

    setMaterials([
      ...materials,
      newMaterial,
    ])

    setName('')
    setPrice('')
    setQuantity('1000')
  }

  function removeMaterial(id: string) {
    const updatedMaterials = materials.filter(
      (material) => material.id !== id,
    )

    setMaterials(updatedMaterials)
  }

  return (
    <section className="materials-page">
      <div className="materials-heading">
        <div>
          <p>Materiais</p>

          <h1>Seus materiais</h1>

          <span>
            Cadastre os filamentos e resinas que você utiliza.
          </span>
        </div>
      </div>

      <div className="materials-layout">
        <div className="materials-list">
          {materials.map((material) => {
            const unitCost =
              material.price / material.quantity

            return (
              <article
                className="material-card"
                key={material.id}
              >
                <div>
                  <span className="material-type">
                    {material.technology === 'FDM'
                      ? 'Filamento'
                      : 'Resina'}
                  </span>

                  <h2>{material.name}</h2>
                </div>

                <div className="material-info">
                  <div>
                    <span>Valor pago</span>
                    <strong>
                      {material.price.toLocaleString(
                        'pt-BR',
                        {
                          style: 'currency',
                          currency: 'BRL',
                        },
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Quantidade</span>
                    <strong>
                      {material.quantity} {material.unit}
                    </strong>
                  </div>

                  <div>
                    <span>Custo por {material.unit}</span>
                    <strong>
                      {unitCost.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 4,
                      })}
                    </strong>
                  </div>
                </div>

                <button
                  className="delete-material"
                  type="button"
                  onClick={() =>
                    removeMaterial(material.id)
                  }
                >
                  Excluir
                </button>
              </article>
            )
          })}
        </div>

        <form
          className="material-form"
          onSubmit={handleSubmit}
        >
          <h2>Adicionar material</h2>

          <div className="field">
            <label htmlFor="materialName">
              Nome
            </label>

            <input
              id="materialName"
              type="text"
              placeholder="Ex.: PLA 3D Fila Preto"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />
          </div>

          <div className="field">
            <label htmlFor="technology">
              Tipo
            </label>

            <select
              id="technology"
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

          <div className="field">
            <label htmlFor="materialPrice">
              Quanto você pagou?
            </label>

            <div className="price-input">
              <span>R$</span>

              <input
                id="materialPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="89,90"
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="materialQuantity">
              Quantidade da embalagem
            </label>

            <div className="input-unit">
              <input
                id="materialQuantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(event) =>
                  setQuantity(event.target.value)
                }
              />

              <span>{unit}</span>
            </div>
          </div>

          <button
            className="add-material-button"
            type="submit"
          >
            Adicionar material
          </button>
        </form>
      </div>
    </section>
  )
}

export default MaterialsPage
