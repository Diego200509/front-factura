import { useState, useEffect } from 'react';
import { useInvoices } from '../api/useInvoices';
import type { Invoice } from '../api/types';
import { useNavigate } from 'react-router-dom';

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

  const { data: invoices = [], isLoading, error } =
    useInvoices(page, pageSize, filter);

  const navigate = useNavigate();

  if (isLoading) return <p>Cargando facturas…</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;

  return (
    <>
      <h1>Facturas</h1>

      <div className="form-group">
        <label>Buscar cliente:</label>
        <input
          className="input"
          placeholder="Nombre del cliente…"
          value={rawFilter}
          onChange={e => setRawFilter(e.target.value)}
        />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv: Invoice) => (
            <tr
              key={inv.id}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/invoices/${inv.id}`)}
            >
              <td>{inv.id}</td>
              <td>{inv.customerName}</td>
              <td>{new Date(inv.date).toLocaleDateString()}</td>
              <td>{inv.items.length}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <button
          className="button"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span>Página {page}</span>
        <button
          className="button"
          onClick={() => setPage(p => p + 1)}
        >
          Siguiente
        </button>
      </div>
    </>
  );
}
