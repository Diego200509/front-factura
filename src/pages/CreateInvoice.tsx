import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/invoices';

interface InvoiceItemInput {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export default function CreateInvoice() {
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [items, setItems] = useState<InvoiceItemInput[]>([
    { productName: '', quantity: 1, unitPrice: 0 },
  ]);
  const navigate = useNavigate();

  const addItem = () => {
    setItems(c => [...c, { productName: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleItem = (
    idx: number,
    key: keyof InvoiceItemInput,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const val = key === 'productName'
      ? e.target.value
      : +e.target.value;
    setItems(c =>
      c.map((it, i) =>
        i === idx ? { ...it, [key]: val } : it
      )
    );
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await api.post<{ id: string }>('/invoices', {
      customerName, date, items
    });
    navigate(`/invoices/${res.data.id}`);
  };

  return (
    <form onSubmit={submit} className="card">
      <h1>Crear factura</h1>

      <div className="form-group">
        <label>Cliente:</label>
        <input
          className="input"
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Fecha:</label>
        <input
          type="date"
          className="input"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <h2>Items</h2>
        {items.map((it, i) => (
          <div
            key={i}
            style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}
          >
            <input
              className="input"
              placeholder="Producto"
              value={it.productName}
              onChange={e => handleItem(i, 'productName', e)}
              style={{ flex: 2 }}
            />
            <label>Cantidad:</label>
            <input
              type="number"
              className="input"
              placeholder="Cant."
              value={it.quantity}
              onChange={e => handleItem(i, 'quantity', e)}
              style={{ width: '4rem' }}
            />
            <label>Precio Unitario:</label>
            <input
              type="number"
              className="input"
              placeholder="Precio"
              value={it.unitPrice}
              onChange={e => handleItem(i, 'unitPrice', e)}
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
