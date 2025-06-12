import { useState, useEffect } from "react";
import { useInvoices } from "../api/useInvoices";
import type { Invoice } from "../api/types";
import { useNavigate } from "react-router-dom";

export default function InvoiceList() {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [rawFilter, setRawFilter] = useState("");
  const [filter, setFilter] = useState("");
  useEffect(() => {
    const handle = setTimeout(() => {
      setFilter(rawFilter);
      setPage(1); 
    }, 300);
    return () => clearTimeout(handle);
  }, [rawFilter]);
  const { data: invoices = [], isLoading, error } = useInvoices(
    page,
    pageSize,
    filter
  );

  const navigate = useNavigate();

  if (isLoading) return <p>Cargando facturas…</p>;
  if (error) return <p className="text-red-600">Error: {error.message}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Facturas</h1>

      {/* Campo de búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={rawFilter}
          onChange={(e) => setRawFilter(e.target.value)}
          className="border p-2 w-full max-w-sm"
        />
      </div>

      {/* Tabla de resultados */}
      <table className="min-w-full table-auto border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Cliente</th>
            <th className="px-4 py-2 border">Fecha</th>
            <th className="px-4 py-2 border">Items</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv: Invoice) => (
            <tr
              key={inv.id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/invoices/${inv.id}`)}
            >
              <td className="px-4 py-2 border">{inv.id}</td>
              <td className="px-4 py-2 border">{inv.customerName}</td>
              <td className="px-4 py-2 border">
                {new Date(inv.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border">{inv.items.length}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="mt-4 flex items-center space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>Página {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
