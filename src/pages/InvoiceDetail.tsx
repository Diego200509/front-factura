import type { Invoice } from '../api/types';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/invoices';

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: invoice, isLoading, error } = useQuery<Invoice, Error>({
    queryKey: ['invoice', id],
    queryFn: async () => (await api.get<Invoice>(`/invoices/${id}`)).data,
    enabled: Boolean(id),
  });

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>Error al cargar</p>;
  if (!invoice) return <p>Factura no encontrada</p>;

  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  return (
    <div>
      <Link to="/">← Volver</Link>
      <h1>Factura {invoice.id}</h1>
      <p><strong>Cliente:</strong> {invoice.customerName}</p>
      <p><strong>Fecha:</strong> {new Date(invoice.date).toLocaleDateString()}</p>

      <h2>Items</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cant.</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((it) => (
            <tr key={it.id}>
              <td>{it.productName}</td>
              <td>{it.quantity}</td>
              <td>{it.unitPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Resumen alineado debajo de Cant. y Precio */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          marginTop: '1rem',
        }}
      >
        <div style={{ marginLeft: 'auto', width: '220px' }}>
          <p style={{ textAlign: 'right', marginBottom: '0.25rem' }}>
            <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
          </p>
          <p style={{ textAlign: 'right', marginBottom: '0.25rem' }}>
            <strong>IVA (15%):</strong> ${tax.toFixed(2)}
          </p>
          <p style={{ textAlign: 'right' }}>
            <strong>Total:</strong> ${total.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
