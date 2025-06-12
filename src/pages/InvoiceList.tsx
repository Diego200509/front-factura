import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/invoices';
import type { Invoice } from '../api/types';

export default function InvoiceList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const {
    data: invoices = [],
    isLoading,
    isError,
    error,
  } = useQuery<Invoice[], Error>({
    queryKey: ['invoices', page],
    queryFn: async () => {
      const res = await api.get<Invoice[]>(
        `/invoices?page=${page}&pageSize=${pageSize}`
      );
      return res.data;
    },
  });

  if (isLoading) return <p>Cargando facturas…</p>;
  if (isError)   return <p>Error: {error.message}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Facturas</h1>

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
      <div className="mt-4 flex items-center space-x-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>

        <span>
          Página <strong>{page}</strong>
        </span>

        <button
          onClick={() => {
            if (invoices.length === pageSize) {
              setPage((p) => p + 1);
            }
          }}
          disabled={invoices.length < pageSize}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
