import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useBooks } from "../hooks/useBooks";
import { useCategories } from "../hooks/useCategories";
import { useFavorites } from "../hooks/useFavorites";
import Hero from "../components/Hero";
import AdminPanel from "../components/AdminPanel";
import CategoryFilter from "../components/CategoryFilter";
import BookGrid from "../components/BookGrid";

type View = "catalog" | "favorites" | "admin";

export default function Home() {
  const { authenticated, isAdmin } = useAuth();

  const [view, setView] = useState<View>("catalog");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [title, setTitle] = useState<string | undefined>();

  const categories = useCategories();
  const { books, loading, error, hasMore, loadMore, reload } = useBooks(categoryId, title);
  const fav = useFavorites();

  const currentView: View =
    view === "admin" && isAdmin ? "admin"
      : view === "favorites" && authenticated ? "favorites"
        : "catalog";

  return (
    <>
      <Hero onSearch={(text) => setTitle(text || undefined)} />

      {authenticated ? (
        <div className="container mt-4">
          <ul className="nav nav-pills justify-content-center">
            <li className="nav-item">
              <button
                className={`nav-link ${currentView === "catalog" ? "active" : ""}`}
                onClick={() => setView("catalog")}
              >
                Catálogo
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${currentView === "favorites" ? "active" : ""}`}
                onClick={() => setView("favorites")}
              >
                Mis favoritos ({fav.favorites.length})
              </button>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <button
                  className={`nav-link ${currentView === "admin" ? "active" : ""}`}
                  onClick={() => setView("admin")}
                >
                  Administrar
                </button>
              </li>
            )}
          </ul>
        </div>
      ) : (<p></p>)}

      <main>
        {fav.error && (
          <div className="container mt-3">
            <div className="alert alert-warning">{fav.error}</div>
          </div>
        )}

        {currentView === "catalog" && (
          <>
            <CategoryFilter categories={categories} selected={categoryId} onSelect={setCategoryId} />
            <BookGrid
              books={books}
              loading={loading}
              error={error}
              hasMore={hasMore}
              onLoadMore={loadMore}
              canFavorite={authenticated}
              isFavorite={fav.isFavorite}
              onToggleFavorite={fav.toggle}
            />
          </>
        )}

        {currentView === "favorites" && (
          <div className="mt-4">
            <BookGrid
              books={fav.favorites}
              loading={false}
              error={null}
              hasMore={false}
              onLoadMore={() => {}}
              canFavorite
              isFavorite={fav.isFavorite}
              onToggleFavorite={fav.toggle}
            />
          </div>
        )}

        {currentView === "admin" && (
          <AdminPanel
            onChanged={() => {
              reload();
              fav.refresh();
            }}
          />
        )}
      </main>
    </>
  );
}