import { useInvoices } from '../api/useInvoices';
import type { Invoice } from '../api/types';
import { useNavigate } from 'react-router-dom';

export default function InvoiceList() {
  const { data: invoices, isLoading, error } = useInvoices();
  const navigate = useNavigate();

  if (isLoading) return <p>Cargando facturas…</p>;
  if (error)      return <p>Error: {error.message}</p>;

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
          {invoices!.map((inv: Invoice) => (
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
    </div>
  );
}
