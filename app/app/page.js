"use client";

import { useState } from "react";

const MENU = [
  { id: 1, nombre: "Pancho Clásico", precio: 1500, esPancho: true },
  { id: 2, nombre: "Super Pancho", precio: 2200, esPancho: true },
  { id: 3, nombre: "Cheddar & Bacon", precio: 2800, esPancho: true },
  { id: 4, nombre: "Papas Fritas", precio: 1800, esPancho: false },
  { id: 5, nombre: "Gaseosa 500ml", precio: 1200, esPancho: false },
  { id: 6, nombre: "Cerveza Lata", precio: 1800, esPancho: false },
];

export default function Home() {
  // Estados de la Orden
  const [carrito, setCarrito] = useState({});
  const [modalidad, setModalidad] = useState("Take Away");
  const [mesa, setMesa] = useState("1");
  const [comensales, setComensales] = useState("2");
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [montoAbona, setMontoAbona] = useState("");

  // Control de Stock (Materias primas)
  const [stock, setStock] = useState({
    salchichas: 40,
    panes: 40,
    aderezo_g: 1200,
  });

  // Ventas acumuladas y Cierre de caja
  const [historialVentas, setHistorialVentas] = useState([]);
  const [modalCierre, setModalCierre] = useState(false);

  // Funciones del Carrito
  const agregarItem = (id) => {
    setCarrito((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const restarItem = (id) => {
    setCarrito((prev) => {
      const nuevo = { ...prev };
      if (nuevo[id] > 1) {
        nuevo[id] -= 1;
      } else {
        delete nuevo[id];
      }
      return nuevo;
    });
  };

  const cancelarOrden = () => {
    setCarrito({});
    setMontoAbona("");
  };

  // Cálculos contables en tiempo real
  const total = Object.entries(carrito).reduce((acc, [id, cant]) => {
    const item = MENU.find((p) => p.id === parseInt(id));
    return acc + (item ? item.precio * cant : 0);
  }, 0);

  const abonaNum = parseFloat(montoAbona) || 0;
  const vuelto = abonaNum - total;

  // Confirmación de cobro y deducción de stock
  const cobrarOrden = () => {
    if (total === 0) return alert("Agregá productos a la orden.");
    if (metodoPago === "Efectivo" && abonaNum < total) {
      return alert("El monto abonado es insuficiente.");
    }

    // Calcular panchos para descontar insumos
    let panchosVendidos = 0;
    Object.entries(carrito).forEach(([id, cant]) => {
      const item = MENU.find((p) => p.id === parseInt(id));
      if (item?.esPancho) panchosVendidos += cant;
    });

    setStock((prev) => ({
      salchichas: prev.salchichas - panchosVendidos,
      panes: prev.panes - panchosVendidos,
      aderezo_g: prev.aderezo_g - panchosVendidos * 30,
    }));

    setHistorialVentas((prev) => [
      ...prev,
      {
        total,
        modalidad,
        metodo: metodoPago,
        hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    alert(`✅ Cobro exitoso por $${total.toLocaleString()}`);
    cancelarOrden();
  };

  // Métricas del cierre
  const totalFacturado = historialVentas.reduce((acc, v) => acc + v.total, 0);
  const totalOrdenes = historialVentas.length;
  const ticketPromedio = totalOrdenes > 0 ? totalFacturado / totalOrdenes : 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <header className="bg-amber-500 text-slate-900 px-6 py-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🌭</span>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Panchería POS (Next.js)</h1>
            <p className="text-xs font-semibold text-amber-950 opacity-80">Terminal de Mostrador & Salón</p>
          </div>
        </div>
        <button
          onClick={() => setModalCierre(true)}
          className="bg-slate-900 text-white text-xs md:text-sm font-bold px-4 py-2 rounded-xl shadow hover:bg-slate-800 transition"
        >
          📊 Cierre de Caja
        </button>
      </header>

      {/* CUERPO PRINCIPAL */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {/* PANEL IZQUIERDO: STOCK Y CATÁLOGO */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* STOCK MONITOR */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Inventario en Vivo</h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className={`p-2 rounded-xl border ${stock.salchichas <= 10 ? "bg-red-50 border-red-300" : "bg-slate-50 border-slate-200"}`}>
                <div className="text-[10px] font-bold text-slate-500">Salchichas</div>
                <div className={`text-lg font-black ${stock.salchichas <= 10 ? "text-red-600" : "text-slate-800"}`}>{stock.salchichas} u.</div>
                {stock.salchichas <= 10 && <span className="text-[9px] font-bold bg-red-200 text-red-800 px-1 rounded">¡Crítico!</span>}
              </div>
              <div className={`p-2 rounded-xl border ${stock.panes <= 10 ? "bg-red-50 border-red-300" : "bg-slate-50 border-slate-200"}`}>
                <div className="text-[10px] font-bold text-slate-500">Panes</div>
                <div className={`text-lg font-black ${stock.panes <= 10 ? "text-red-600" : "text-slate-800"}`}>{stock.panes} u.</div>
                {stock.panes <= 10 && <span className="text-[9px] font-bold bg-red-200 text-red-800 px-1 rounded">¡Crítico!</span>}
              </div>
              <div className={`p-2 rounded-xl border ${stock.aderezo_g <= 300 ? "bg-red-50 border-red-300" : "bg-slate-50 border-slate-200"}`}>
                <div className="text-[10px] font-bold text-slate-500">Aderezos</div>
                <div className={`text-lg font-black ${stock.aderezo_g <= 300 ? "text-red-600" : "text-slate-800"}`}>{stock.aderezo_g} g</div>
                {stock.aderezo_g <= 300 && <span className="text-[9px] font-bold bg-red-200 text-red-800 px-1 rounded">¡Crítico!</span>}
              </div>
            </div>
          </section>

          {/* CATÁLOGO */}
          <section>
            <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3">Productos Disponibles</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MENU.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between hover:border-amber-400 transition shadow-sm">
                  <div>
                    <span className="text-xs font-black text-slate-800 block">{item.nombre}</span>
                    <span className="text-xs font-extrabold text-amber-600">${item.precio.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => agregarItem(item.id)}
                    className="mt-3 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-bold py-1.5 rounded-lg transition"
                  >
                    + Agregar
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* PANEL DERECHO: ORDEN Y COBRO */}
        <aside className="lg:col-span-5 bg-white rounded-2xl shadow-lg border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            {/* SWITCH SALÓN / TAKE AWAY */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4 text-xs font-bold">
              <button
                onClick={() => setModalidad("Take Away")}
                className={`flex-1 py-2 rounded-lg transition ${modalidad === "Take Away" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-600"}`}
              >
                🥡 Take Away
              </button>
              <button
                onClick={() => setModalidad("Salón")}
                className={`flex-1 py-2 rounded-lg transition ${modalidad === "Salón" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-600"}`}
              >
                🍽️ Salón / Mesa
              </button>
            </div>

            {modalidad === "Salón" && (
              <div className="grid grid-cols-2 gap-2 mb-4 bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs">
                <div>
                  <label className="block font-bold text-amber-900 mb-1">N° Mesa:</label>
                  <input
                    type="number"
                    value={mesa}
                    onChange={(e) => setMesa(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-lg px-2 py-1 font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-amber-900 mb-1">Comensales:</label>
                  <input
                    type="number"
                    value={comensales}
                    onChange={(e) => setComensales(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-lg px-2 py-1 font-bold text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* CARRITO */}
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Orden Actual</h3>
            <div className="divide-y divide-slate-100 max-h-52 overflow-y-auto mb-4 pr-1">
              {Object.keys(carrito).length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">No hay productos agregados.</p>
              ) : (
                Object.entries(carrito).map(([id, cant]) => {
                  const item = MENU.find((p) => p.id === parseInt(id));
                  return (
                    <div key={id} className="flex justify-between items-center py-2 text-xs">
                      <div>
                        <div className="font-bold text-slate-800">{item.nombre}</div>
                        <div className="text-[10px] text-slate-400">{cant} x ${item.precio.toLocaleString()} =${(item.precio * cant).toLocaleString()}</div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button onClick={() => restarItem(item.id)} className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 font-bold">-</button>
                        <span className="font-black px-1">{cant}</span>
                        <button onClick={() => agregarItem(item.id)} className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 font-bold">+</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* TOTAL Y COBRO */}
          <div className="border-t border-slate-200 pt-4 mt-auto">
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-sm font-bold text-slate-500 uppercase">Total</span>
              <span className="text-2xl font-black text-slate-900">${total.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-3 gap-1 mb-3 text-xs font-semibold">
              {["Efectivo", "Mercado Pago", "Transferencia"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMetodoPago(m)}
                  className={`py-1.5 rounded-lg border text-center transition ${metodoPago === m ? "border-amber-500 bg-amber-50 text-amber-900 font-bold" : "border-slate-200 bg-white text-slate-600"}`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-slate-600">Abona con ($):</span>
                <input
                  type="number"
                  placeholder="0"
                  value={montoAbona}
                  onChange={(e) => setMontoAbona(e.target.value)}
                  className="w-28 text-right bg-white border border-slate-300 rounded-lg px-2 py-1 font-bold text-slate-900"
                />
              </div>
              <div className="flex justify-between items-center text-xs font-bold pt-1 border-t border-slate-200">
                <span className="text-slate-500">Vuelto:</span>
                <span className={vuelto >= 0 ? "text-emerald-600 font-black" : "text-red-500 font-bold"}>
                  {total > 0 && abonaNum > 0 ? (vuelto >= 0 ? `$${vuelto.toLocaleString()}` : `Faltan $${Math.abs(vuelto).toLocaleString()}`) : "$0"}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={cancelarOrden} className="w-1/3 bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs hover:bg-slate-300 transition">
                Cancelar
              </button>
              <button onClick={cobrarOrden} className="w-2/3 bg-amber-500 text-slate-950 font-black py-3 rounded-xl text-sm hover:bg-amber-400 shadow-md transition">
                Confirmar y Cobrar
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* MODAL DE CIERRE DE CAJA */}
      {modalCierre && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 mb-1">📊 Cierre de Caja</h3>
            <p className="text-xs text-slate-500 mb-4">Métricas consolidadas de la jornada</p>
            <div className="space-y-2 text-xs border-y border-slate-100 py-3 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Facturado:</span>
                <span className="font-black text-slate-900 text-sm">${totalFacturado.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Órdenes Despachadas:</span>
                <span className="font-bold text-slate-900">{totalOrdenes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Ticket Promedio:</span>
                <span className="font-bold text-slate-900">${Math.round(ticketPromedio).toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => setModalCierre(false)}
              className="w-full bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-slate-800 transition"
            >
              Cerrar Resumen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
