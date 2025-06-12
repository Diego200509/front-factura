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
  const [customerName, setCustomerName] = useState<string>('');
  const [date, setDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [items, setItems] = useState<InvoiceItemInput[]>([
    { productName: '', quantity: 1, unitPrice: 0 },
  ]);
  const navigate = useNavigate();

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomerName(e.target.value);
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const addItem = () => {
    setItems((current) => [
      ...current,
      { productName: '', quantity: 1, unitPrice: 0 },
    ]);
  };

  const handleItemChange = (
    idx: number,
    key: keyof InvoiceItemInput,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      key === 'productName' ? e.target.value : +e.target.value;
    setItems((current) =>
      current.map((it, i) =>
        i === idx ? { ...it, [key]: value } : it
      )
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = { customerName, date, items };
    const res = await api.post<{ id: string }>('/invoices', payload);
    navigate(`/invoices/${res.data.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div>
        <label>Cliente:</label>
        <input
          type="text"
          value={customerName}
          onChange={handleNameChange}
          className="border p-1"
        />
      </div>

      <div>
        <label>Fecha:</label>
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          className="border p-1"
        />
      </div>

      <div>
        <h3>Items</h3>
        {items.map((it, i) => (
          <div key={i} className="flex space-x-2">
            <input
              placeholder="Producto"
              value={it.productName}
              onChange={(e) =>
                handleItemChange(i, 'productName', e)
              }
              className="border p-1 flex-1"
            />
            <input
              type="number"
              placeholder="Cant."
              value={it.quantity}
              onChange={(e) =>
                handleItemChange(i, 'quantity', e)
              }
              className="border p-1 w-20"
            />
            <input
              type="number"
              placeholder="Precio"
              value={it.unitPrice}
              onChange={(e) =>
                handleItemChange(i, 'unitPrice', e)
              }
              className="border p-1 w-20"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="mt-2 text-blue-500"
        >
          + Añadir ítem
        </button>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2"
      >
        Crear
      </button>
    </form>
  );
}
