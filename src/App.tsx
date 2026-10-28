import { useAuth } from "./auth/AuthContext";
import { useBooks } from "./hooks/useBooks";

export default function App() {
  const { ready, authenticated, isAdmin, username, login, logout } = useAuth();
  const { books, loading, error, hasMore, loadMore } = useBooks();

  if (!ready) return <p className="p-4">Cargando sesión...</p>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h1 className="h3">Books</h1>
        {authenticated ? (
          <button className="btn btn-outline-dark" onClick={logout}>
            {username} {isAdmin && "(admin)"} · Salir
          </button>
        ) : (
          <button className="btn btn-primary" onClick={login}>Iniciar sesión</button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="list-group mb-3">
        {books.map((b) => (
          <li key={b.id} className="list-group-item">
            {b.title} — {b.authorName} (${b.price})
          </li>
        ))}
      </ul>

      {hasMore && (
        <button className="btn btn-primary" disabled={loading} onClick={loadMore}>
          {loading ? "Cargando..." : "Cargar más"}
        </button>
      )}
    </div>
  );
}