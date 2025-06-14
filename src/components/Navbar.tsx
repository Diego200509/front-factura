import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Listado</Link></li>
        <li><Link to="/create">Crear Factura</Link></li>
        <li><Link to="/report">Reporte </Link></li> {/* 👈 nuevo enlace */}
      </ul>
    </nav>
  );
}
