import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { booksApi } from "../api/books";
import { ApiError } from "../api/http";
import { useAuth } from "../auth/AuthContext";
import { useFavorites } from "../hooks/useFavorites";
import type { Book } from "../types";


const PLACEHOLDER = "/images/images (1).jfif";

export default function BookDetail() {
  const { id } = useParams();
  const { authenticated } = useAuth();
  const fav = useFavorites();

  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  useEffect(() => {
    setBook(null);
    setError(null);
    setNotFound(false);
    setPdfUrl(null);
    setPdfBlob(null);
    booksApi
      .getBook(Number(id))
      .then(setBook)
      .catch((e) => {
        if (e instanceof ApiError && e.status === 404) setNotFound(true);
        else setError(e instanceof Error ? e.message : "No se pudo cargar el libro");
      });
  }, [id]);

  
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const loadPdf = async (): Promise<Blob | null> => {
    if (!book) return null;
    if (pdfBlob) return pdfBlob;
    setLoadingPdf(true);
    setError(null);
    try {
      const blob = await booksApi.pdf(book.id);
      setPdfBlob(blob);
      return blob;
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar el PDF");
      return null;
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleView = async () => {
    if (pdfUrl) {
      setPdfUrl(null); 
      return;
    }
    const blob = await loadPdf();
    if (blob) setPdfUrl(URL.createObjectURL(blob));
  };

  const handleDownload = async () => {
    const blob = await loadPdf();
    if (!blob || !book) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${book.title}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container py-4">
      <Link to="/" className="btn btn-outline-dark btn-sm mb-3">← Volver al catálogo</Link>

      {notFound && <div className="alert alert-warning">Este libro no existe.</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!book && !error && !notFound && (
        <div className="text-center my-5"><div className="spinner-border" role="status" /></div>
      )}

      {book && (
        <>
          <div className="card shadow-sm">
            <div className="row g-0">
              <div className="col-12 col-md-5">
                <img
                  src={book.coverUrl || PLACEHOLDER}
                  alt={book.title}
                  className="img-fluid rounded-start w-100"
                  style={{ objectFit: "cover", maxHeight: 520 }}
                  onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
                />
              </div>
              <div className="col-12 col-md-7">
                <div className="card-body p-4">
                  <span className="badge bg-success mb-2">{book.categoryName}</span>
                  <h1 className="h2">{book.title}</h1>
                  <p className="text-muted mb-1">Autor: <strong>{book.authorName}</strong></p>
                  {book.publishedYear && <p className="text-muted">Publicado: {book.publishedYear}</p>}
                  <p className="mt-3">{book.description || "Sin descripción disponible."}</p>
                  <p className="fs-3 fw-bold">${book.price.toFixed(2)}</p>

                  <div className="d-flex flex-wrap gap-2">
                    {authenticated && (
                      <button
                        className={`btn ${fav.isFavorite(book.id) ? "btn-outline-primary" : "btn-outline-primary"}`}
                        onClick={() => fav.toggle(book)}
                      >
                        {fav.isFavorite(book.id) ? " X Quitar de favoritos" : "- Agregar a favoritos"}
                      </button>
                    )}

                    {book.hasPdf && (
                      <>
                        <button className="btn btn-primary" onClick={handleView} disabled={loadingPdf}>
                          {loadingPdf ? "Cargando..." : pdfUrl ? "Ocultar PDF" : "Ver PDF"}
                        </button>
                        <button className="btn btn-outline-dark" onClick={handleDownload} disabled={loadingPdf}>
                          Descargar PDF
                        </button>
                      </>
                    )}
                    
                    {!book.hasPdf && <span className="text-muted align-self-center">Sin PDF disponible</span>}
                  </div>

                  {fav.error && <div className="alert alert-warning mt-3 mb-0">{fav.error}</div>}
                </div>
              </div>
            </div>
          </div>

          {pdfUrl && (
            <div className="card shadow-sm mt-4">
              <iframe
                src={pdfUrl}
                title={`PDF de ${book.title}`}
                style={{ width: "100%", height: "80vh", border: 0 }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}