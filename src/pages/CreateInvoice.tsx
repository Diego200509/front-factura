import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/invoices';
import { useCustomers } from '../api/useCustomers';
import { useProducts } from '../api/useProducts';

interface InvoiceItemInput {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export default function CreateInvoice() {
  const navigate = useNavigate();

  // Obtener clientes y productos
  const { data: customers = [] } = useCustomers();
  const { data: products = [] } = useProducts();

  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [items, setItems] = useState<InvoiceItemInput[]>([
    { productName: '', quantity: 1, unitPrice: 0 },
  ]);

  const addItem = () => {
    setItems((c) => [...c, { productName: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleItemChange = (
    idx: number,
    key: keyof InvoiceItemInput,
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    let value: string | number = e.target.value;

    // Si cambia el producto, actualizar también el precio unitario
    if (key === 'productName') {
      const selectedProduct = products.find((p) => p.name === value);
      setItems((c) =>
        c.map((item, i) =>
          i === idx
            ? {
                ...item,
                productName: value as string,
                unitPrice: selectedProduct ? selectedProduct.price : 0,
              }
            : item
        )
      );
    } else {
      if (key === 'quantity' || key === 'unitPrice') {
        value = Number(value);
      }
      setItems((c) =>
        c.map((item, i) => (i === idx ? { ...item, [key]: value } : item))
      );
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await api.post<{ id: string }>('/invoices', {
      customerName,
      date,
      items,
    });
    navigate(`/invoices/${res.data.id}`);
  };

  return (
    <form onSubmit={submit} className="card">
      <h1>Crear factura</h1>

      <div className="form-group">
        <label>Cliente:</label>
        <select
          className="input"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        >
          <option value="">-- Selecciona un cliente --</option>
          {customers.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Fecha:</label>
        <input
          type="date"
          className="input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <h2>Items</h2>
        {items.map((it, i) => (
          <div
            key={i}
            style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}
          >
            <select
              className="input"
              value={it.productName}
              onChange={(e) => handleItemChange(i, 'productName', e)}
              style={{ flex: 2 }}
            >
              <option value="">-- Producto --</option>
              {products.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <label>Cant.:</label>
            <input
              type="number"
              className="input"
              value={it.quantity}
              onChange={(e) => handleItemChange(i, 'quantity', e)}
              style={{ width: '4rem' }}
            />

            <label>Precio:</label>
            <input
              type="number"
              className="input"
              value={it.unitPrice}
              onChange={(e) => handleItemChange(i, 'unitPrice', e)}
              style={{ width: '6rem' }}
            />
          </div>
        ))}
        <button type="button" className="button" onClick={addItem}>
          + Añadir ítem
        </button>
      </div>

      <button type="submit" className="button">
        Crear
      </button>
    </form>
  );
}
