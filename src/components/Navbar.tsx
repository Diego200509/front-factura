import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li><Link to="/">Listado</Link></li>
        <li><Link to="/create">Crear Factura</Link></li>
      </ul>
    </nav>
  );
}