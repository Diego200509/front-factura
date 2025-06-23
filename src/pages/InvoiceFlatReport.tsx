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
  const [readTimes, setReadTimes] = useState<Record<string, number>>({});

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedReadTime, setSelectedReadTime] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const h = setTimeout(() => {
      setFilter(rawFilter);
      setPage(1);
    }, 300);
    return () => clearTimeout(h);
  }, [rawFilter]);

  const fetchWithTiming = async (): Promise<Invoice[]> => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(filter ? { customerName: filter } : {}),
    });

    const start = performance.now();
    const res = await api.get<Invoice[]>(`/invoices?${params}`);
    const end = performance.now();

    const timePerInvoice = res.data.reduce((acc, inv) => {
      acc[inv.id] = Math.round(end - start);
      return acc;
    }, {} as Record<string, number>);

    setReadTimes(timePerInvoice);
    return res.data;
  };

  const { data: invoices = [], isLoading, error } = useQuery<Invoice[], Error>({
    queryKey: ['invoices', page, pageSize, filter],
    queryFn: fetchWithTiming,
    staleTime: 5000,
  });

  const handleViewTimes = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setSelectedReadTime(readTimes[inv.id] ?? null);
  };

  const closeModal = () => {
    setSelectedInvoice(null);
    setSelectedReadTime(null);
  };

  if (isLoading) return <p>Cargando facturas…</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;

  return (
    <>
      <h1>Facturas (vista Maestro/Detalle)</h1>

      <div className="form-group">
        <label htmlFor="buscar-cliente">Buscar cliente:</label>
        <input
          id="buscar-cliente"
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
            <th>Tiempos</th>
          </tr>
        </thead>
        <tbody>
          {invoices.flatMap((inv) =>
            inv.items.map((item, idx) => (
              <tr key={`${item.id}-${idx}`}>
                <td onClick={() => navigate(`/invoices/${inv.id}`)} style={{ cursor: 'pointer' }}>
                  {inv.id}
                </td>
                <td>{inv.customerName}</td>
                <td>{new Date(inv.date).toLocaleDateString()}</td>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{item.unitPrice}</td>
                <td>
                  {idx === 0 && (
                    <button className="button" onClick={() => handleViewTimes(inv)}>
                      Ver tiempos
                    </button>
                  )}
                </td>
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

      {/* Modal */}
      {selectedInvoice && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Tiempos de Factura</h2>
            <div className="modal-body">
              <p><strong>Factura ID:</strong> {selectedInvoice.id}</p>
              <p><strong>Tiempo de escritura:</strong> {selectedInvoice.writeTimeMs ?? 'N/A'} ms</p>
              <p><strong>Tiempo de lectura:</strong> {selectedReadTime ?? 'N/A'} ms</p>
            </div>
            <div className="modal-footer">
              <button className="button" onClick={closeModal}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Estilo embebido para el modal */}
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }
        .modal-content {
          background-color: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 90%;
        }
        .modal-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #111827;
        }
        .modal-body p {
          color: #111827;
          margin-bottom: 0.5rem;
        }
        .modal-footer {
          margin-top: 1rem;
          text-align: right;
        }
      `}</style>
    </>
  );
}
