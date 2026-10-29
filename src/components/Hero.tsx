interface Props {
  onSearch: (text: string) => void;
}

export default function Hero({ onSearch }: Props) {
  return (
    <header className="bg-navy text-light py-5">
      <div className="container text-center">
        <h1 className="display-5 fw-bold">Libros disponibles</h1>
        <p className="lead mb-4">Explora el catálogo por categoría o busca por título.</p>
        <form
          className="row justify-content-center g-2"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            onSearch(String(data.get("q") ?? "").trim());
          }}
        >
          <div className="col-12 col-md-6">
            <input name="q" className="form-control" placeholder="Buscar por título..." />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" type="submit">Buscar</button>
          </div>
        </form>
      </div>
    </header>
  );
}