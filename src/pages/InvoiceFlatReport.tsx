import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/invoices';
import type { Invoice } from '../api/types';

export default function InvoiceList() {
  const [limit, setLimit] = useState(100); // valor inicial
  const [filter, setFilter] = useState('');
  const [rawFilter, setRawFilter] = useState('');
  const [readTime, setReadTime] = useState<number | null>(null);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const navigate = useNavigate();

  // input delay
  useEffect(() => {
    const h = setTimeout(() => {
      setFilter(rawFilter);
    }, 300);
    return () => clearTimeout(h);
  }, [rawFilter]);

  const fetchWithTiming = async (): Promise<Invoice[]> => {
    const params = new URLSearchParams({
      page: "1",
      limit: String(limit),
      ...(filter ? { customerName: filter } : {}),
    });

    const start = performance.now();
    const res = await api.get<Invoice[]>(`/invoices?${params}`);
    const end = performance.now();

    setReadTime(Math.round(end - start));
    return res.data;
  };

  const { data: invoices = [], isLoading, error } = useQuery<Invoice[], Error>({
    queryKey: ['invoices', limit, filter],
    queryFn: fetchWithTiming,
    staleTime: 5000,
  });

  const handleViewTimes = (inv: Invoice) => {
    setSelectedInvoice(inv);
  };

  const closeModal = () => {
    setSelectedInvoice(null);
  };

  return (
    <>
      <h1>Facturas (reporte plano)</h1>

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

      <div className="form-group">
        <label htmlFor="limit">Cantidad a traer:</label>
        <select
          id="limit"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value))}
          className="input"
        >
          {[100, 1000, 4000, 10000, 20000, 60000, 100000, 1000000].map((val) => (
            <option key={val} value={val}>
              {val.toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p>Cargando facturas…</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {error.message}</p>
      ) : (
        <>
          <p><strong>Tiempo de lectura total:</strong> {readTime} ms</p>

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
        </>
      )}

      {/* Modal */}
      {selectedInvoice && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Detalle de factura</h2>
            <div className="modal-body">
              <p><strong>Factura ID:</strong> {selectedInvoice.id}</p>
              <p><strong>Tiempo de escritura:</strong> {selectedInvoice.writeTimeMs ?? 'N/A'} ms</p>
              <p><strong>Tiempo de lectura total:</strong> {readTime ?? 'N/A'} ms</p>
            </div>
            <div className="modal-footer">
              <button className="button" onClick={closeModal}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
