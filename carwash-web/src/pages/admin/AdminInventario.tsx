import { useState } from 'react'
import { useInventario } from '../../context/InventarioContext'

export function AdminInventario() {
  const { productos, alertas, actualizarCantidad, agregarProducto } =
    useInventario()
  const [nombre, setNombre] = useState('')
  const [unidad, setUnidad] = useState('L')
  const [actual, setActual] = useState(0)
  const [minimo, setMinimo] = useState(0)

  async function agregar(e: React.FormEvent) {
    e.preventDefault()
    const n = nombre.trim()
    if (!n) return
    await agregarProducto({
      nombre: n,
      cantidadActual: Number(actual) || 0,
      cantidadMinima: Number(minimo) || 0,
      unidad: unidad.trim() || 'ud',
    })
    setNombre('')
    setActual(0)
    setMinimo(0)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Inventario (RF-06)
        </h1>
        <p className="text-slate-600">
          Stock y alertas por cantidad mínima.
        </p>
      </div>

      {alertas.length > 0 ? (
        <div
          className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950"
          role="alert"
        >
          <p className="font-semibold">Productos bajo mínimo</p>
          <ul className="mt-2 list-inside list-disc text-sm">
            {alertas.map((p) => (
              <li key={p.id}>
                {p.nombre}: {p.cantidadActual} {p.unidad}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form
        onSubmit={agregar}
        className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
      >
        <label className="text-sm sm:col-span-2">
          <span className="font-medium text-slate-700">Nombre</span>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Ej. Shampoo"
          />
        </label>
        <label className="text-sm">
          <span className="font-medium text-slate-700">Unidad</span>
          <input
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <span className="font-medium text-slate-700">Cantidad actual</span>
          <input
            type="number"
            min={0}
            value={actual}
            onChange={(e) => setActual(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <span className="font-medium text-slate-700">Mínimo alerta</span>
          <input
            type="number"
            min={0}
            value={minimo}
            onChange={(e) => setMinimo(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <div className="flex items-end sm:col-span-2 lg:col-span-4">
          <button
            type="submit"
            className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800"
          >
            Agregar producto
          </button>
        </div>
      </form>

      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
        {productos.map((p) => (
          <li
            key={p.id}
            className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-slate-800">{p.nombre}</p>
              <p className="text-sm text-slate-600">
                Actual: {p.cantidadActual} {p.unidad} · Mín: {p.cantidadMinima}{' '}
                {p.unidad}
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              Ajustar:
              <input
                type="number"
                min={0}
                defaultValue={p.cantidadActual}
                key={p.cantidadActual}
                onBlur={(e) =>
                  actualizarCantidad(p.id, Number(e.target.value) || 0)
                }
                className="w-24 rounded-lg border border-slate-300 px-2 py-1"
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
