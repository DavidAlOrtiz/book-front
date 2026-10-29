import type { Book } from "../types";
import BookCard from "./BookCard";

interface Props {
  books: Book[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
  canFavorite: boolean;
  isFavorite: (bookId: number) => boolean;
  onToggleFavorite: (book: Book) => void;
}

export default function BookGrid({
  books, loading, error, hasMore, onLoadMore,
  canFavorite, isFavorite, onToggleFavorite,
}: Props) {
  return (
    <section className="container pb-5">
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && books.length === 0 && (
        <p className="text-center text-muted">No se encontraron libros.</p>
      )}

      <div className="row g-4">
        {books.map((book) => (
          <div key={book.id} className="col-12 col-sm-6 col-lg-4">
            <BookCard
              book={book}
              canFavorite={canFavorite}
              isFavorite={isFavorite(book.id)}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border" role="status" />
        </div>
      )}

      {hasMore && !loading && (
        <div className="text-center mt-4">
          <button className="btn btn-primary px-4" onClick={onLoadMore}>
            Cargar más
          </button>
        </div>
      )}
    </section>
  );
}