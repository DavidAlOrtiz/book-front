import { useNavigate } from "react-router-dom";
import type { Book } from "../types";

interface Props {
  book: Book;
  canFavorite: boolean;
  isFavorite: boolean;
  onToggleFavorite: (book: Book) => void;
}

const PLACEHOLDER = "/images/images (1).jfif";

export default function BookCard({ book, canFavorite, isFavorite, onToggleFavorite }: Props) {
  const navigate = useNavigate();
  const open = () => navigate(`/books/${book.id}`);

  return (
    <div
      className="card h-100 shadow-sm position-relative overflow-hidden"
      role="link"
      tabIndex={0}
      style={{ cursor: "pointer" }}
      onClick={open}
      onKeyDown={(e) => e.key === "Enter" && open()}
    >
      {canFavorite && (
        <button
          className={`btn btn-sm position-absolute top-0 end-0 m-2 shadow-sm ${
            isFavorite ? "btn-danger" : "btn-light"
          }`}
          style={{ zIndex: 1 }}
          aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(book);
          }}
        >
          {isFavorite ? "Quitar favorito" : "Favorito"}
        </button>
      )}

      
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ aspectRatio: "3 / 4", backgroundColor: "#e9eef1" }}
      >
        <img
          src={book.coverUrl || PLACEHOLDER}
          alt={book.title}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          onError={(e) => {
            
            if (!e.currentTarget.src.endsWith(PLACEHOLDER)) {
              e.currentTarget.src = PLACEHOLDER;
            }
          }}
        />
      </div>

      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between small text-muted mb-1">
          <span>{book.categoryName}</span>
          <span>{book.publishedYear}</span>
        </div>
        <h5 className="card-title">{book.title}</h5>
        <p className="card-subtitle text-muted mb-2">{book.authorName}</p>
        <p className="card-text small flex-grow-1">
          {book.description && book.description.length > 90
            ? `${book.description.slice(0, 90)}…`
            : book.description}
        </p>
        <div className="fw-bold fs-5">${book.price.toFixed(2)}</div>
      </div>
    </div>
  );
}