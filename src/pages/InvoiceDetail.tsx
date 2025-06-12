import type { Invoice } from '../api/types';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/invoices';

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: invoice, isLoading, error } = useQuery<Invoice, Error>({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const res = await api.get<Invoice>(`/invoices/${id}`);
      return res.data;
    },
    enabled: Boolean(id), // sólo corre si id existe
  });

  if (isLoading) return <p>Cargando...</p>;
  if (error)     return <p>Error al cargar la factura</p>;
  if (!invoice)  return <p>Factura no encontrada</p>;

  return (
    <div className="p-4">
      <Link to="/" className="text-blue-500">
        &larr; Volver
      </Link>

      <h1 className="text-2xl font-bold mt-2">Factura {invoice.id}</h1>
      <p>Cliente: {invoice.customerName}</p>
      <p>Fecha: {new Date(invoice.date).toLocaleDateString()}</p>

      <h2 className="mt-4 font-semibold">Items</h2>
      <table className="min-w-full table-auto border mt-2">
        <thead>
          <tr>
            <th className="border px-2 py-1">Producto</th>
            <th className="border px-2 py-1">Cant.</th>
            <th className="border px-2 py-1">Precio</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((it) => (
            <tr key={it.id}>
              <td className="border px-2 py-1">{it.productName}</td>
              <td className="border px-2 py-1">{it.quantity}</td>
              <td className="border px-2 py-1">{it.unitPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
