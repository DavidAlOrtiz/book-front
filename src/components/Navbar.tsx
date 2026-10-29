import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { authenticated, isAdmin, username, login, register, logout } = useAuth();

  return (
    <nav className="navbar navbar-dark bg-navy">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold">TURIN-BOOK</Link>
        <div className="d-flex align-items-center gap-2">
          {authenticated ? (
            <>
              <span className="text-light small">
                {username} {isAdmin && <span className="badge bg-success ms-1">admin</span>}
              </span>
              <button className="btn btn-outline-light btn-sm" onClick={logout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-outline-light btn-sm" onClick={register}>
                Registrarse
              </button>
              <button className="btn btn-primary btn-sm" onClick={login}>
                Iniciar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}