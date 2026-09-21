# 🌭 Panchería Express POS - Sistema de Punto de Venta e Inventario

Prototipo funcional (MVP) de un sistema de punto de venta (POS) y gestión de inventario para locales gastronómicos de comida rápida. Diseñado con foco en agilidad operativa en mostrador, control de comensales en salón y trazabilidad de insumos críticos.

---

## 🚀 Demo en Vivo
> **Probar la aplicación web interactiva:** https://profound-salamander-027d51.netlify.app/

## 🛠️ Características Principales

- **Gestión de Modalidad:**
  - **Take Away:** Despacho rápido para mostrador.
  - **Salón:** Asignación dinámica de número de mesa y registro de comensales.
- **Catálogo y Cálculo Dinámico:**
  - Carrito de compras con actualización de subtotales y total general en tiempo real.
  - Soporte para cobro en Efectivo, Mercado Pago y Transferencia bancaria.
  - Cálculo instantáneo de vuelto y validación de importes faltantes.
- **Control de Inventario y Stock Crítico (BOM):**
  - Deducción automática de materias primas por producto vendido (1 pan, 1 salchicha y 30g de aderezo por cada pancho).
  - Sistema de alertas visuales en tiempo real cuando el inventario perfora el umbral crítico (≤ 10 unidades/raciones).
- **Métricas y Cierre de Caja:**
  - Reporte consolidado con total facturado, volumen de órdenes despachadas y ticket promedio diario.

---

## 🧱 Arquitectura y Tecnologías

El proyecto fue concebido bajo dos modalidades de implementación:

1. **Frontend Web UI (Nativo / React & Tailwind):**
   - Interfaz táctil y responsive optimizada para tablets de punto de venta y dispositivos móviles.
   - Manejo reactivo del estado de la orden y cálculos contables en el cliente.
2. **Backend & Persistencia (Python + SQLite):**
   - Manejo transaccional atómico (`commit` / `rollback`) para garantizar consistencia entre ventas e inventario.
   - Base de datos relacional ligera con consultas agregadas (`SUM`, `AVG`, `GROUP BY`) para cierres de caja.

---

## 📂 Estructura del Repositorio

```text
├── index.html         # Interfaz web del punto de venta (HTML5 + Tailwind CSS + JS)
├── db_manager.py      # Módulo backend con lógica de negocio, SQLite e inventario
├── requirements.txt   # Dependencias de entorno (en caso de despliegue en Python)
└── README.md          # Documentación del proyecto
