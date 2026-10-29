import { useCallback, useEffect, useState } from "react";
import { booksApi } from "../api/books";
import { useAuthors } from "../hooks/useAuthors";
import { useCategories } from "../hooks/useCategories";
import type { Book, BookRequest } from "../types";
import BookForm from "./BookForm";

interface Props {
  onChanged: () => void;
}

export default function AdminPanel({ onChanged }: Props) {
  const categories = useCategories();
  const authors = useAuthors();

  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editing, setEditing] = useState<Book | "new" | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (p: number) => {
    try {
      console.log("call books info");
      const data = await booksApi.search({ page: p, size: 8 });
      setBooks(data.content);
      setPage(data.page);
      setTotalPages(data.totalPages);
      console.log("The books info was loaded sucessfully");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar libros");
    }
  }, []);

  useEffect(() => {
    load(0);
  }, [load]);

  const handleSubmit = async (data: BookRequest) => {
    setSaving(true);
    setError(null);
    try {
      if (editing === "new") await booksApi.createBook(data);
      else if (editing) await booksApi.updateBook(editing.id, data);
      setEditing(null);
      await load(page);
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (book: Book) => {
    if (!window.confirm(`¿Eliminar "${book.title}"?`)) return;
    try {
      await booksApi.deleteBook(book.id);
      
      await load(books.length === 1 && page > 0 ? page - 1 : page);
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar");
    }
  };

  return (
    <section className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">Administrar libros</h2>
        {!editing && (
          <button className="btn btn-primary" onClick={() => { setError(null); setEditing("new"); }}>
            + Nuevo libro
          </button>
        )}
      </div>

      {editing && (
        <BookForm
          key={editing === "new" ? "new" : editing.id}
          book={editing === "new" ? undefined : editing}
          categories={categories}
          authors={authors}
          saving={saving}
          error={error}
          onSubmit={handleSubmit}
          onCancel={() => { setEditing(null); setError(null); }}
        />
      )}

      {!editing && error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-hover align-middle bg-white">
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>PDF</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.authorName}</td>
                <td>{b.categoryName}</td>
                <td>${b.price.toFixed(2)}</td>
                <td>
                  {b.hasPdf
                    ? <span className="badge bg-success">Sí</span>
                    : <span className="badge bg-secondary">No</span>}
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-dark me-2" onClick={() => { setError(null); setEditing(b); }}>
                    Editar
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(b)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3">
          <button className="btn btn-outline-dark btn-sm" disabled={page === 0} onClick={() => load(page - 1)}>
            ← Anterior
          </button>
          <span className="small">Página {page + 1} de {totalPages}</span>
          <button className="btn btn-outline-dark btn-sm" disabled={page + 1 >= totalPages} onClick={() => load(page + 1)}>
            Siguiente →
          </button>
        </div>
      )}
    </section>
  );
}