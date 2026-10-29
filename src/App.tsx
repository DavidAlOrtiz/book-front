import { Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import BookDetail from "./components/BookDetailModal";


export default function App() {
  const { ready } = useAuth();

  if (!ready) return <p className="p-4">Cargando sesión...</p>;

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="*" element={<p className="container py-4">Página no encontrada.</p>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}