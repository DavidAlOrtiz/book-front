import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Author, Book, BookRequest, Category } from "../types";
import { fileToBase64, MAX_PDF_BYTES } from "../utils/file";

interface Props {
  book?: Book;
  categories: Category[];
  authors: Author[];
  saving: boolean;
  error: string | null;
  onSubmit: (data: BookRequest) => void;
  onCancel: () => void;
}

export default function BookForm({ book, categories, authors, saving, error, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    title: book?.title ?? "",
    description: book?.description ?? "",
    price: book ? String(book.price) : "",
    coverUrl: book?.coverUrl ?? "",
    publishedYear: book?.publishedYear ? String(book.publishedYear) : "",
    authorId: book ? String(book.authorId) : "",
    categoryId: book ? String(book.categoryId) : "",
  });

  const [pdfBase64, setPdfBase64] = useState<string | undefined>();
  const [pdfName, setPdfName] = useState("");
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [removePdf, setRemovePdf] = useState(false);

  const set = (field: keyof typeof form) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPdfError(null);

    if (!file) {
      setPdfBase64(undefined);
      setPdfName("");
      return;
    }
    if (file.type !== "application/pdf") {
      setPdfError("El archivo debe ser un PDF");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setPdfError("El PDF no puede pesar más de 10 MB");
      e.target.value = "";
      return;
    }

    setPdfBase64(await fileToBase64(file));
    setPdfName(`${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    setRemovePdf(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      coverUrl: form.coverUrl.trim(),
      publishedYear: form.publishedYear ? Number(form.publishedYear) : null,
      authorId: Number(form.authorId),
      categoryId: Number(form.categoryId),
      pdfBase64: removePdf ? "" : pdfBase64,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card card-body shadow-sm mb-4">
      <h5>{book ? "Editar libro" : "Nuevo libro"}</h5>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label">Título</label>
          <input className="form-control" required maxLength={255} value={form.title} onChange={set("title")} />
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label">Precio</label>
          <input className="form-control" type="number" step="0.01" min="0" required value={form.price} onChange={set("price")} />
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label">Año</label>
          <input className="form-control" type="number" min="0" max="2100" value={form.publishedYear} onChange={set("publishedYear")} />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Autor</label>
          <select className="form-select" required value={form.authorId} onChange={set("authorId")}>
            <option value="">Selecciona...</option>
            {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Categoría</label>
          <select className="form-select" required value={form.categoryId} onChange={set("categoryId")}>
            <option value="">Selecciona...</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="col-12">
          <label className="form-label">URL de portada</label>
          <input className="form-control" maxLength={255} value={form.coverUrl} onChange={set("coverUrl")} />
        </div>
        <div className="col-12">
          <label className="form-label">Descripción</label>
          <textarea className="form-control" rows={3} maxLength={2000} value={form.description} onChange={set("description")} />
        </div>

        <div className="col-12">
          <label className="form-label">PDF del libro (máx. 10 MB)</label>
          <input className="form-control" type="file" accept="application/pdf" onChange={handleFile} />
          {pdfError && <div className="text-danger small mt-1">{pdfError}</div>}
          {pdfName && <div className="text-muted small mt-1">Seleccionado: {pdfName}</div>}

          {book?.hasPdf && !pdfBase64 && (
            <div className="form-check mt-2">
              <input
                id="removePdf"
                className="form-check-input"
                type="checkbox"
                checked={removePdf}
                onChange={(e) => setRemovePdf(e.target.checked)}
              />
              <label htmlFor="removePdf" className="form-check-label">
                Este libro ya tiene PDF. Marca para eliminarlo (o sube otro para reemplazarlo).
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Guardando..." : "Guardar"}
        </button>
        <button className="btn btn-outline-dark" type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}