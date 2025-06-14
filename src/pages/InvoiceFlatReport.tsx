import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/invoices';
import type { Invoice } from '../api/types';

export default function InvoiceList() {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [rawFilter, setRawFilter] = useState('');
  const [filter, setFilter] = useState('');
  useEffect(() => {
    const h = setTimeout(() => {
      setFilter(rawFilter);
      setPage(1);
    }, 300);
    return () => clearTimeout(h);
  }, [rawFilter]);

  // Petición con paginación y filtro
  const { data: invoices = [], isLoading, error } = useQuery<Invoice[], Error>({
    queryKey: ['invoices', page, pageSize, filter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(filter ? { customerName: filter } : {}),
      });
      const res = await api.get<Invoice[]>(`/invoices?${params}`);
      return res.data;
    },
    staleTime: 5000,
  });

  const navigate = useNavigate();

  if (isLoading) return <p>Cargando facturas…</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;

  return (
    <>
      <h1>Facturas (vista Maestro/Detalle)</h1>

      <div className="form-group">
        <label>Buscar cliente:</label>
        <input
          className="input"
          placeholder="Nombre del cliente…"
          value={rawFilter}
          onChange={(e) => setRawFilter(e.target.value)}
        />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Factura ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
          </tr>
        </thead>
        <tbody>
          {invoices.flatMap((inv) =>
            inv.items.map((item) => (
              <tr key={item.id}>
                <td onClick={() => navigate(`/invoices/${inv.id}`)} style={{ cursor: 'pointer' }}>{inv.id}</td>
                <td>{inv.customerName}</td>
                <td>{new Date(inv.date).toLocaleDateString()}</td>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{item.unitPrice}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <button
          className="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span>Página {page}</span>
        <button className="button" onClick={() => setPage((p) => p + 1)}>
          Siguiente
        </button>
      </div>
    </>
  );
}
