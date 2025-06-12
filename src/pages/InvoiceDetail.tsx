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
  if (error)     return <p style={{ color: 'red' }}>Error al cargar</p>;
  if (!invoice)  return <p>Factura no encontrada</p>;

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
          {invoice.items.map(it => (
            <tr key={it.id}>
              <td>{it.productName}</td>
              <td>{it.quantity}</td>
              <td>{it.unitPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
