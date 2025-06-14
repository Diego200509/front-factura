import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import InvoiceList from './pages/InvoiceList';
import CreateInvoice from './pages/CreateInvoice';
import InvoiceDetail from './pages/InvoiceDetail';
import InvoiceFlatReport from './pages/InvoiceFlatReport'; // 👈 importa la nueva página

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<InvoiceList />} />
          <Route path="/create" element={<CreateInvoice />} />
          <Route path="/invoices/:id" element={<InvoiceDetail />} />
          <Route path="/report" element={<InvoiceFlatReport />} /> {/* 👈 nueva ruta */}
        </Routes>
      </div>
    </>
  );
}
