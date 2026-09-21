import { useState, type FormEvent } from 'react'

import type {
  Printer,
  PrinterTechnology,
} from '../data/printers'

import './PrintersPage.css'

type PrintersPageProps = {
  printers: Printer[]
  setPrinters: (printers: Printer[]) => void
}

function PrintersPage({
  printers,
  setPrinters,
}: PrintersPageProps) {
  const [name, setName] = useState('')
  const [technology, setTechnology] =
    useState<PrinterTechnology>('FDM')

  const [powerWatts, setPowerWatts] = useState('')
  const [wearCost, setWearCost] = useState('')
  const [failureRate, setFailureRate] = useState('5')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const power = Number(powerWatts)
    const wear = Number(wearCost)
    const failure = Number(failureRate)

    if (
      !name.trim() ||
      power <= 0 ||
      wear < 0 ||
      failure < 0
    ) {
      return
    }

    const newPrinter: Printer = {
      id: crypto.randomUUID(),
      name: name.trim(),
      technology,
      powerWatts: power,
      wearCostPerHour: wear,
      failureRate: failure,
    }

    setPrinters([
      ...printers,
      newPrinter,
    ])

    setName('')
    setPowerWatts('')
    setWearCost('')
    setFailureRate('5')
  }

  function removePrinter(id: string) {
    if (printers.length <= 1) {
      window.alert(
        'Cadastre outra impressora antes de excluir esta.',
      )
      return
    }

    const confirmed = window.confirm(
      'Excluir esta impressora?',
    )

    if (!confirmed) {
      return
    }

    setPrinters(
      printers.filter(
        (printer) => printer.id !== id,
      ),
    )
  }

  return (
    <section className="printers-page">
      <div className="printers-heading">
        <div>
          <p>Impressoras</p>

          <h1>Suas impressoras</h1>

          <span>
            Cadastre as máquinas usadas nos seus orçamentos.
          </span>
        </div>
      </div>

      <div className="printers-layout">
        <div className="printers-list">
          {printers.map((printer) => (
            <article
              className="printer-card"
              key={printer.id}
            >
              <div className="printer-card-heading">
                <div>
                  <span>
                    {printer.technology === 'FDM'
                      ? 'FDM'
                      : 'Resina'}
                  </span>

                  <h2>{printer.name}</h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removePrinter(printer.id)
                  }
                >
                  Excluir
                </button>
              </div>

              <div className="printer-specs">
                <div>
                  <span>Potência média</span>
                  <strong>
                    {printer.powerWatts} W
                  </strong>
                </div>

                <div>
                  <span>Desgaste</span>
                  <strong>
                    R$ {printer.wearCostPerHour.toFixed(2)}
                    /h
                  </strong>
                </div>

                <div>
                  <span>Reserva para falhas</span>
                  <strong>
                    {printer.failureRate}%
                  </strong>
                </div>
              </div>
            </article>
          ))}
        </div>

        <form
          className="printer-form"
          onSubmit={handleSubmit}
        >
          <h2>Adicionar impressora</h2>

          <div className="field">
            <label htmlFor="printerName">
              Nome
            </label>

            <input
              id="printerName"
              value={name}
              placeholder="Ex.: Bambu Lab P1S"
              onChange={(event) =>
                setName(event.target.value)
              }
            />
          </div>

          <div className="field">
            <label htmlFor="printerTechnology">
              Tecnologia
            </label>

            <select
              id="printerTechnology"
              value={technology}
              onChange={(event) =>
                setTechnology(
                  event.target
                    .value as PrinterTechnology,
                )
              }
            >
              <option value="FDM">
                FDM / Filamento
              </option>

              <option value="RESIN">
                Resina / MSLA
              </option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="printerPower">
              Potência média
            </label>

            <div className="input-unit">
              <input
                id="printerPower"
                type="number"
                min="1"
                placeholder="120"
                value={powerWatts}
                onChange={(event) =>
                  setPowerWatts(event.target.value)
                }
              />

              <span>W</span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="printerWear">
              Custo de desgaste por hora
            </label>

            <input
              id="printerWear"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.60"
              value={wearCost}
              onChange={(event) =>
                setWearCost(event.target.value)
              }
            />
          </div>

          <div className="field">
            <label htmlFor="printerFailure">
              Reserva para falhas
            </label>

            <div className="input-unit">
              <input
                id="printerFailure"
                type="number"
                min="0"
                step="0.1"
                value={failureRate}
                onChange={(event) =>
                  setFailureRate(event.target.value)
                }
              />

              <span>%</span>
            </div>
          </div>

          <button
            className="add-printer-button"
            type="submit"
          >
            Adicionar impressora
          </button>
        </form>
      </div>
    </section>
  )
}

export default PrintersPage
