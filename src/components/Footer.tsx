
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-light mt-5">
      <div className="container py-4">
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <h5 className="fw-bold">TU-BOOK</h5>
            <p className="small mb-0 opacity-75">
              Catálogo de libros con favoritos y lectura de PDF, proyecto prueba
            </p>
          </div>

          <div className="col-6 col-md-4">
            <h6 className="text-uppercase small" style={{ color: "var(--color-green-light)" }}>
              Tecnología
            </h6>
            <ul className="list-unstyled small mb-0 opacity-75">
              <li>React + TypeScript</li>
              <li>Spring Boot + API Gateway</li>
              <li>Keycloak</li>
            </ul>
          </div>

          <div className="col-6 col-md-4">
            <h6 className="text-uppercase small" style={{ color: "var(--color-green-light)" }}>
              David Ortiz.
            </h6>
          </div>
        </div>

        

        <hr className="border-secondary my-4" />

        <p className="small text-center mb-0 opacity-75">
          © {year} TU-BOOK. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}